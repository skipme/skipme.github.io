var AX = [-.9, 0, .9, 1.8, 2.7, 3.6];
var AY = [-1.2689, 0, 1.2689, 2.6541, 4.4856, 9.9138];

// var AX = [-2,-1,0,1,2];
// var AY = [3,4,2,1,1];

var Gauss = {
	gauss: function(A) {
	    var n = A.length;
	    console.log(this.printM(A));
	    for (var i=0; i<n; i++) {//by rows
	        // Search for maximum in this column
	        // var maxEl = Math.abs(A[i][i]);
	        // var maxRow = i;
	        // for(var k=i+1; k<n; k++) {
	        //     if (Math.abs(A[k][i]) > maxEl) {
	        //         maxEl = Math.abs(A[k][i]);
	        //         maxRow = k;
	        //     }
	        // }

	        // // Swap maximum row with current row (column by column)
	        // for (var k=i; k<n+1; k++) {
	        //     var tmp = A[maxRow][k];
	        //     A[maxRow][k] = A[i][k];
	        //     A[i][k] = tmp;
	        // }

	        // Make all rows below this one 0 in current column
	        for (k=i+1; k<n; k++) {
	            var c = -A[k][i]/A[i][i];
	            // console.log("row: "+k+" column:"+i+" coeff: "+c);
	            for(var j=i; j<n+1; j++) {
	                if (i==j) {
	                    A[k][j] = 0;
	                } else {
	                    A[k][j] += c * A[i][j];
	                }
	            }
	            // console.log("after: \n"+this.printM(A));
	        }
	        
	    }
		// console.log("triangular: \n"+this.printM(A));
	    // Solve equation Ax=b for an upper triangular matrix A
	    var x= new Array(n);
	    // for (var i=n-1; i>-1; i--) {
	    //     x[i] = A[i][n]/A[i][i];
	    //     for (var k=i-1; k>-1; k--) {
	    //         A[k][n] -= A[k][i] * x[i];
	    //     }
	    // }
	    for (var i = 0; i < n; i++) {
	    	var mnk = A[i][i];
	    	for (var j = 0; j < A[i].length; j++) {
	    		A[i][j] = A[i][j] / mnk;
	    	};
	    };
	    // console.log("diagonal: \n"+this.printM(A));
	    for (var i=n-1; i>0; i--) {
	        // Make all rows above this one 0 in current column
	        for (k=i-1; k>=0; k--) {
	            var c = -A[k][i]/A[i][i];
	            // console.log("row: "+k+" column:"+i+" coeff: "+c);
	            for(var j=A[k].length-1; j>=i; j--) {
	                if (i==j) {
	                    A[k][j] = 0;
	                } else {
	                    A[k][j] += c * A[i][j];
	                }
	            }
	            // console.log("after: \n"+this.printM(A));
	        }
	        
	    }
	    // console.log("afterall: \n"+this.printM(A));
	    var x = [];
	    for (var i = 0; i < n; i++) {
	    	x.push(A[i][n]);
	    };
	    return x;
	},
	// printM: function(v)
	// {
	//   return "\t" + v[0][0].toFixed(4) + ", " + v[0][1].toFixed(4) + ", " + v[0][2].toFixed(4)+ ", " + v[0][3].toFixed(4)+ ", " + v[0][4].toFixed(4)
	//   + "\n\t" + v[1][0].toFixed(4) + ", " + v[1][1].toFixed(4) + ", " + v[1][2].toFixed(4)+ ", " + v[1][3].toFixed(4)+ ", " + v[1][4].toFixed(4)
	//   + "\n\t" + v[2][0].toFixed(4) + ", " + v[2][1].toFixed(4) + ", " + v[2][2].toFixed(4)+ ", " + v[2][3].toFixed(4)+ ", " + v[2][4].toFixed(4)
	//    + "\n\t" + v[3][0].toFixed(4) + ", " + v[3][1].toFixed(4) + ", " + v[3][2].toFixed(4)+ ", " + v[3][3].toFixed(4)+ ", " + v[3][4].toFixed(4);
	// },
	printM: function(v)
	{
		if(v.length === 3)
		{
		  return "\t" + v[0][0].toFixed(4) + ", " + v[0][1].toFixed(4) + ", " + v[0][2].toFixed(4)+ ", " + v[0][3].toFixed(4)
		  + "\n\t" + v[1][0].toFixed(4) + ", " + v[1][1].toFixed(4) + ", " + v[1][2].toFixed(4)+ ", " + v[1][3].toFixed(4)
		  + "\n\t" + v[2][0].toFixed(4) + ", " + v[2][1].toFixed(4) + ", " + v[2][2].toFixed(4)+ ", " + v[2][3].toFixed(4);
		}else{
			 return "\t" + v[0][0].toFixed(4) + ", " + v[0][1].toFixed(4) + ", " + v[0][2].toFixed(4)
		  + "\n\t" + v[1][0].toFixed(4) + ", " + v[1][1].toFixed(4) + ", " + v[1][2].toFixed(4);
		}
	},
	calc: function(a,b,c,d,e,f,g,h)
	{
		return this.gauss([[a,b,c,d],[b,c,e,f],[c,e,g,h]]);
	},
	calcp1: function(sx2, sx, sxy, n, sy)
	{
		return this.gauss([[sx2,sx,sxy],[sx,n,sy]]);
	}
};
function sum(a)
{
	var result = 0.0;
	for (var i = 0; i < a.length; i++) {
		result += a[i];
	};
	return Number(result.toFixed(4));
}
function xnone(x,y)
{
	return x;
}
function xpow2(x,y)
{
	return x*x;
}
function xpow3(x,y)
{
	return x*x*x;
}
function xpow4(x,y)
{
	return x*x*x*x;
}
function xmuly(x,y)
{
	return x*y;
}
function xpow2y(x,y)
{
	return x*x*y;
}
function map(aX, aY, func)
{
	if(typeof(func) !== "function")
		throw new Error("func not function");
	var result = [];
	for (var i = 0; i < aX.length; i++) {
		result.push(Number(func(aX[i], aY[i], i).toFixed(4)));
	};

	return result;
}
// function printV(v)
// {
// 	var result= "";
// 	for (var i = 0; i < v.length; i++) {
// 		result += (i===0?"":",") + v[i];
// 	};
//   	return result;
// }
function calc()
{
	var strout = "";
	function strline(l){strout+=l+"\t\r\n";}
	function printsum(a){var result = "";
	for (var i = 0; i < a.length; i++) {
		result +=((i>0||a[i]<0)?(a[i]<0?"":" + "):"")+a[i].toFixed(4);
	};return result;}

	var xi = Number(sum(AX).toFixed(4));//sum(map(AX, AY, xnone));
	var xi2 = sum(map(AX, AY, xpow2));
	var xi3 = sum(map(AX, AY, xpow3));
	var xi4 = sum(map(AX, AY, xpow4));
	var yi = Number(sum(AY).toFixed(4));
	var xiyi = sum(map(AX, AY, xmuly));
	var xi2yi = sum(map(AX, AY, xpow2y));

	strline("\u03A3(Xi)       = "+printsum(AX)+"= "+xi);
	strline("\u03A3(Xi^2)     = "+printsum(map(AX, AY, xpow2))+" = "+xi2);
	strline("\u03A3(Xi^3)     = "+printsum(map(AX, AY, xpow3))+" = "+xi3);
	strline("\u03A3(Xi^4)     = "+printsum(map(AX, AY, xpow4))+" = "+xi4);
	strline("\u03A3(Yi)       = "+printsum(AY)+" = "+yi);
	strline("\u03A3(Xi * Yi)  = "+printsum(map(AX, AY, xmuly))+" = "+xiyi);
	strline("\u03A3(Xi^2 * Yi)= "+printsum(map(AX, AY, xpow2y))+" = "+xi2yi);
	strline("\tP2 System:");
	strline("a*"+xi4+" + b*"+xi3+" + c*"+xi2+" = "+xi2yi);
	strline("a*"+xi3+" + b*"+xi2+" + c*"+xi+" = "+xiyi);
	strline("a*"+xi2+" + b*"+xi+" + c*"+(AX.length)+" = "+yi);
	strline("\tP1 System:");
	strline("b*"+xi2+" + c*"+xi+" = "+xiyi);
	strline("b*"+xi+" + c*"+(AX.length)+" = "+yi);
	strline("");
	var abc = Gauss.calc(xi4, xi3, xi2, xi2yi, xi, xiyi, (AX.length), yi);
	var bc = Gauss.calcp1(xi2, xi, xiyi, (AX.length), yi);
	strline("ANSWER:");
	strline("P2: "+abc[0].toFixed(4)+"x^2"+(abc[1]>0?" + ":" ")+abc[1].toFixed(4)+"x"+(abc[2]>0?" + ":" ")+abc[2].toFixed(4)+" = 0");
	strline("P1: "+bc[0].toFixed(4)+"x"+(bc[1]>0?" + ":" ")+bc[1].toFixed(4)+" = 0");
	
	function p1(x,y,indx)
	{
		// var p = (Number(bc[0].toFixed(4))*x+Number(bc[1].toFixed(4)))-y;
		// return p*p;

		var p = Number(bc[0].toFixed(4))*x+Number(bc[1].toFixed(4));
		return Math.pow(p-AY[indx], 2);
	}
	function p2(x,y,indx)
	{
		// var p = (Number(abc[0].toFixed(4))*x*x+Number(abc[1].toFixed(4))*x+Number(abc[2].toFixed(4)))-y;
		// return p*p;

		var p = Number(abc[0].toFixed(4))*x*x+Number(abc[1].toFixed(4))*x+Number(abc[2].toFixed(4));
		return Math.pow(p-AY[indx], 2);
	}
	strline("S2= "+printsum(map(AX, AY, p2))+"= "+sum(map(AX, AY, p2)));
	strline("S1= "+printsum(map(AX, AY, p1))+"= "+sum(map(AX, AY, p1)));
	console.log(strout);
}
calc();
// console.log(Zeidel3.calc(34,0,10,21,0,-7,5,11));
// console.log(Gauss.gauss([
// 	[-1,-3,-4,0,-3],
// 	[3,7,-8,3,30],
// 	[1,-6,2,5,-90],
// 	[-8,-4,-1,-1,12]
// 	]));


// var AY = [-1.2689, 0, 1.2689, 2.6541, 4.4856, 9.9138];
// console.log(["$"].concat(AY))