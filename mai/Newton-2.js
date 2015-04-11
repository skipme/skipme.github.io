// 1 нелинейная функция системы
function f1(x1,x2)
{
	return ((x1*x1)/9)+((x2*x2)/(9/4))-1;
	// return x1-2*x2*x2+1;
}
// 2 нелинейная функция системы
function f2(x1,x2)
{
	return 3*x2-Math.exp(x1)-x1;
	// return -(x1*x1)+2*x2-1;
}
// 1 нелинейная функция системы - приравняли к x2 - для таблицы по x1, точки, для графика
function fx1(x1)
{
	//return Math.sqrt(9 - 4*x1*x1);
	//return Math.sqrt(9 - x1*x1);
	return Math.sqrt((9 - x1*x1) / 4);
}
// 2 нелинейная функция системы - приравняли к x2 - для таблицы по x1, точки, для графика
function fx2(x1)
{
	return (x1+Math.exp(x1))/3;
}
// 1 нелинейная функция системы df/dx
function Dfx1X1(x1)
{
	return (2*x1)/9;
	// return 1;
}
// 1 нелинейная функция системы df/dy
function Dfx1X2(x2)
{
	return (8*x2)/9;
	// return -4*x2;
}
// 2 нелинейная функция системы df/dx
function Dfx2X1(x1)
{
	return -Math.exp(x1)-1;
	// return -2*x1;
}
// 2 нелинейная функция системы df/dy
function Dfx2X2(x2)
{
	return 3;
	// return 2;
}
//--------------------------------------------------
function MakeYakobi(x1,x2)
{
	return [
		[Dfx1X1(x1), Dfx1X2(x2)],
		[Dfx2X1(x1), Dfx2X2(x2)],
	];
}

// дельта y
function calc_xD2(x1,x2)
{
	var a = Dfx1X1(x1), 
		b = Dfx1X2(x2), 
		c = f1(x1,x2),
		d = Dfx2X1(x1),
		e = Dfx2X2(x2),
		f = f2(x1,x2);

	console.log("\tsys:\n\t", a.toFixed(4) + "\u0394x1 + "+b.toFixed(4)+"\u0394x2 + "+c.toFixed(4)+"=0\n\t", 
		d.toFixed(4) + "\u0394x1 + "+e.toFixed(4)+"\u0394x2 + "+f.toFixed(4)+"=0");
	console.log("\n\t norm F:\n\t", Math.max(Math.abs(c),Math.abs(f)).toFixed(4));
	return ((d*c/a)-f)/(-(d*b/a)+e);
}
// дельта x
function calc_xD1(x1,x2,xD2)
{
	var a = Dfx1X1(x1), 
		b = Dfx1X2(x2), 
		c = f1(x1,x2);

	return (-1*b*xD2-c) / a;
}
function printYa(v)
{
  return "\t" + v[0][0].toFixed(4) + ", " + v[0][1].toFixed(4)
  + "\n\t" + v[1][0].toFixed(4) + ", " + v[1][1].toFixed(4);
}
function iterate(x10, x20)
{
	var x1 = x10, x2 = x20, nowX1, nowX2, ECHK = 0.01;
	for (var i = 1; i <= 50; i++) {
		console.info("iteration: "+i+': Yakobi\t\n', printYa(MakeYakobi(x1,x2)));
		var determ = calcDeterm(MakeYakobi(x1,x2));
		if(Math.abs(determ)<0.1)
			console.error("Определитель матрицы Якоби близок к нулю, необходимо проверить сходимость");
		console.log("\t(!=0)Yakobi determ ", determ.toFixed(4));
		
		var DX2 = calc_xD2(x1, x2);
		var DX1 = calc_xD1(x1, x2, DX2);
		nowX1 = DX1+x1;
		nowX2 = DX2+x2;

		console.log("\t\u0394x1 = "+DX1.toFixed(4), ", \u0394x2 = "+DX2.toFixed(4));
		console.info("\tx1 = "+nowX1.toFixed(4), ", x2 = "+nowX2.toFixed(4));

		x1 = nowX1;
		x2 = nowX2;
		if(Math.abs(DX1) < ECHK && Math.abs(DX2) < ECHK
			&& Math.max(Math.abs(f1(x1,x2)), Math.abs(f2(x1,x2))) < ECHK)
			break;
	};
	// при проверке в исходные уравнения подставляем найденные корни, должен выйти 0
	var out1 = f1(x1,x2), out2 = f2(x1,x2);
	console.warn('checking: '+((Math.abs(out1)<0.001&&Math.abs(out2)<0.001)?"OK":"ОШИБКА")+', f1:'+out1.toFixed(6), "f2:"+out2.toFixed(6));
	console.log('\n')
}

// iterate(.95, .95);
iterate(1, 1);// Решить методом Ньютона - арг-ты: x0, y0

//------------------------------------------------------------------------------
function printTableFx2(fx1,fx2, start,stop, delta)
{
	if(stop < start)
	{
		var tstart = start;
		start = stop;
		stop = tstart;
	}
	console.log("x1\tf1x2\tf2x2");
	for (var i = start; i <= stop; i+=delta) {
		console.log(i.toFixed(2) +"\t"+fx1(i).toFixed(2) +"\t"+fx2(i).toFixed(2));
	};
}
printTableFx2(fx1,fx2, -2, 2, .5);
// определитель
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
/*
1. По графику выбрать окрестности корня
2. Вписать уравнения, в т.ч. после дифференцирования
*/