var X0 = 0,
	Xk = 2;
var H1 = 0.5,
	H2 = 0.25;

var _GPREC = 4;

function Fx0(x)
{
	return 1/(x*x*x*x + 16);
}
function _roundPrec(num)
{
	return Number(num.toFixed(_GPREC));
}
function makeTable(fx, x0, xk, step)
{
	var cfx, nowx = x0, table = [];

	for (var i = 0; i < 100 && nowx <= xk; i++) {
		cfx = fx(_roundPrec(nowx));
		table.push([_roundPrec(nowx), _roundPrec(cfx)]);
		nowx += step;
	};
	return table;
}
function printTable(table)
{
	var result = "", columns = table.length +1, cline, heads = "ixyz", rows = table[0].length +1;
	function rline(str){return result+=str+"\r\n";}
	function ctab(str){return cline+=str+"\t";}
	cline = ""; ctab("i");
	for (var i = 1; i < columns; i++) {
		ctab(i);
	};
	rline(cline);
	for (var i = 1; i < rows; i++) {
		cline = ""; ctab(heads[i]);
		for (var j = 1; j < columns; j++) {
			ctab(table[j-1][i-1]);
		};
		rline(cline);
	};
	
	return result;
}
function printMatrix(table)
{
	var result = "", columns = table[0].length, cline, rows = table.length;
	function rline(str){return result+=str+"\r\n";}
	function ctab(str){return cline+=str+"\t";}
	for (var i = 0; i < rows; i++) {
		cline = "";
		for (var j = 0; j < columns; j++) {
			ctab(table[i][j]);
		};
		rline(cline);
	};
	
	return result;
}
function printsum(a){
	var result = "";
	for (var i = 0; i < a.length; i++) {
		result +=((i>0||a[i]<0)?(a[i]<0?"":" + "):"")+a[i];
	};
	return result;
}
function mapSubArray(a)// take y only
{
	return a[1];
}
function map(a, func)
{
	if(typeof(func) !== "function")
		throw new Error("func not function");
	var result = [];
	for (var i = 0; i < a.length; i++) {
		result.push(func(a[i]));
	};

	return result;
}
function IntegrateByRectangle(table, tableStep)
{
	var precision = 1,
		result = 0.0;
	tableStep = _roundPrec(tableStep);
	for (var i = 0; i < table.length; i++) {
		result += table[i][1];
	};
	result = _roundPrec(result);
	
	result = _roundPrec(result * tableStep);
	console.log("Srectangle = (" + printsum(map(table, mapSubArray)) + ") * "+tableStep+" = "+result);
	return [precision, result];
}
function IntegrateByTrapeze(table, tableStep)
{
	var precision = 2,
		midSum = 0.0,
		result = 0.0;
	tableStep = _roundPrec(tableStep);
	for (var i = 1; i < table.length-1; i++) {
		midSum += table[i][1];
	};
	midSum = _roundPrec(midSum);
	result = _roundPrec((tableStep*0.5)*(table[0][1] + 2*midSum + table[table.length-1][1]));
	console.log("Strapeze = "+tableStep+"/2 * ("+table[0][1]+" + 2*("+ midSum + ") + "+table[table.length-1][1]+") = "+result);
	return [precision, result];
}
function IntegrateBySimpson(table, tableStep)
{
	var precision = 4,
		midEven = 0.0,
		midOdd = 0.0,
		result = 0.0;
	tableStep = _roundPrec(tableStep);
	for (var i = 1; i < table.length-1; i++) {
		if(i%2===0)
			midEven += table[i][1];
		else 
			midOdd += table[i][1];
	};
	midEven = _roundPrec(midEven);
	midOdd = _roundPrec(midOdd);
// console.log(printTable(table))
	result = _roundPrec((tableStep/3)*(table[0][1] + (4*midOdd) + (2*midEven) + table[table.length-1][1]));
	console.log("Ssimps = "+tableStep+"/3 * ("+table[0][1]+" + 4*("+ midOdd + ")"+" + 2*("+ midEven + ") + "+table[table.length-1][1]+") = "+result);
	return [precision, result];
}
function calcDeterm(A) {
    var s, k = A.length;
    var det = 0;
    if (A.length == 1) { //bottom case of the recursive function 
        return A[0][0];
    }
    if (A.length == 2) {       
        det =  A[0][0] * A[1][1] - A[1][0] * A [0][1];
        return det;
    }
    for (var i = 0; i < k; i++) {
        //creates smaller matrix- values not in same row, column
        var smaller = new Array(A.length - 1);
        for (h = 0; h < smaller.length; h++) {
            smaller[h] = new Array(A.length - 1);
        }
        for (a = 1; a < A.length; a++) {
            for (b = 0; b < A.length; b++) {
                if (b < i) {
                    smaller[a - 1][b] = A[a][b];
                } else if (b > i) {
                    smaller[a - 1][b - 1] = A[a][b];
                }
            }
        }
        if (i % 2 == 0) {
            s = 1;
        } else {
            s = -1;
        }
        det += s * A[0][i] * (calcDeterm(smaller));
    }
    return (det);
}
function RungeMatrix(Num, aZ, aH, Prec)
{
	// нельзя сравнивать с разными степенями точности
	var M = [];
	for (var i = 0; i < Num; i++) {
		M[i] = [aZ[i]];
		for (var q = Prec, j = 0; j < Num-1; q++, j++) {
			M[i].push(_roundPrec(Math.pow(aH[i], q)));
		};
	};
	return M;
}
function RungeCalc(z1,z2, h1,h2, Prec)
{
	var runge = _roundPrec(z1 + ((z1-z2)/(Math.pow(h2/h1, Prec)-1)));
	console.log("Zpp = z1 + (z1-z2)/R^p-1 = " + z1 +" + ("+z1+" - "+z2+")/("+h2+"/"+h1+")^"+Prec+"-1 = " + runge);
	return runge;
}
function calc()
{
	var table_h1 = makeTable(Fx0, X0, Xk, H1),
		table_h2 = makeTable(Fx0, X0, Xk, H2);

	console.log("table_h1: \n"+printTable(table_h1));
	console.log("table_h2: \n"+printTable(table_h2));

	var rect_h1 = IntegrateByRectangle(table_h1, H1),
		rect_h2 = IntegrateByRectangle(table_h2, H2);
	var trapeze_h1 = IntegrateByTrapeze(table_h1, H1),
		trapeze_h2 = IntegrateByTrapeze(table_h2, H2);
	var simps_h1 = IntegrateBySimpson(table_h1, H1),
		simps_h2 = IntegrateBySimpson(table_h2, H2);


	var zpp1 = RungeCalc(rect_h1[1], rect_h2[1], H1, H2, rect_h1[0]),
		zpp2 = RungeCalc(trapeze_h1[1], trapeze_h2[1], H1, H2, trapeze_h1[0]),
		zpp3 = RungeCalc(simps_h1[1], simps_h2[1], H1, H2, simps_h1[0]);

	// console.log(rect_h1, rect_h2);
	// console.log(trapeze_h1, trapeze_h2);
	// console.log(simps_h2, simps_h2);
}
calc();
// IntegrateBySimpson(makeTable(function(x){return Math.sin(x);}, 0, Math.PI/2, Math.PI/8), Math.PI/8);
// IntegrateBySimpson(makeTable(function(x){return Math.sin(x);}, 0, Math.PI/2, Math.PI/16), Math.PI/16);
// var rch = RungeMatrix(3, [.987158, .996785, .9991967], [Math.PI/8,Math.PI/16,Math.PI/32])
// 	, rzn = RungeMatrix(3, [1, 1, 1], [Math.PI/8,Math.PI/16,Math.PI/32]);
// console.log(calcDeterm(rch), calcDeterm(rzn));
// calcDeterm(rch)/calcDeterm(rzn);