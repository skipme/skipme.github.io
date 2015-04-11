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
// 1 нелинейная функция системы - приравняли к x1 
function Fi1(x1, x2)
{
	//return Math.sqrt(9 - 4*x2*x2);
	//return Math.sqrt((9 - x1*x1)/4);
	//return -.1378*((x1*x1)/9 + (4*x2*x2)/9  - 1)+x1;
	// return -.2222*((x1*x1)/9 + (4*x2*x2)/9  - 1)+x1;

	return -.2222*((x1*x1)/9 + (4*x2*x2)/9  - 1)+x2;// к x2
}
function Dfx1X1(x1)
{
	//return 1 - .0306*x1;
	// return 1-.0494*x1;

	return -.0494*x1;// к x2
}
function Dfx1X2(x2)
{
	//return -.1225*x2;
	// return -.1975*x2;

	return 1-.1975*x2;// к x2
}

// 2 нелинейная функция системы - приравняли к x2 
function Fi2(x1,x2)
{
	//return (3*x2-Math.exp(x1));
	// return (x1+Math.exp(x1))/3;
	 // return -.4239*(3*x2-Math.exp(x1)-x1)+x2;

	 return .22*(3*x2-Math.exp(x1)-x1)+x1;// к x1
}
function Dfx2X1(x1)
{
	// return (1+Math.exp(x1))/3;
	// return .4239+.4239*Math.exp(x1);

	return .78-.22*Math.exp(x1);// к x1
}
function Dfx2X2(x2)
{
	// return 0;
	//return -0.2717;

	return .66;
}

function MakeYakobi(x1,x2)
{
	return [
		[Dfx1X1(x1), Dfx1X2(x2)],
		[Dfx2X1(x1), Dfx2X2(x2)],
	];
}
function printYa(v)
{
  return "\t" + v[0][0].toFixed(4) + ", " + v[0][1].toFixed(4)
  + "\n\t" + v[1][0].toFixed(4) + ", " + v[1][1].toFixed(4);
}
function iterate(x10, x20)
{
	var x1 = x10, x2 = x20, nowX1, nowX2, ECHK = 0.001;
	for (var i = 1; i <= 100; i++) {
		var Yak = MakeYakobi(x1,x2);
		var YaN = N_M(Yak);
		console.info("iteration: "+i+': Yakobi\t\n', printYa(Yak) + "\n\tNorm: "+YaN.toFixed(4));
		
		if(YaN>1)
			console.error("Норма матрицы Якоби "+YaN.toFixed(4)+" > 1, необходимо проверить сходимость");
		var nowX2 = Fi1(x1,x2);
		var nowX1 = Fi2(x1,x2);

		console.info("\tx1 = "+nowX1.toFixed(4), ", x2 = "+nowX2.toFixed(4));

		var ev = [nowX1-x1, nowX2-x2];//вектор невязки
		var CE = N_V(ev);// его норма, ошибка
		console.log("\tE"+i+" = "+CE.toFixed(4));
		if(CE < ECHK)
			break;
		x1 = nowX1;
		x2 = nowX2;
	};
	// при проверке в исходные уравнения подставляем найденные корни, должен выйти 0
	var out1 = f1(x1,x2), out2 = f2(x1,x2);
	console.warn('checking: '+((Math.abs(out1)<(ECHK*2)&&Math.abs(out2)<(ECHK*2))?"OK":"ОШИБКА")+', f1:'+out1.toFixed(6), "f2:"+out2.toFixed(6));
	console.log('\n')
}

iterate(1.2, 1.4);// Решить методом итераций - арг-ты: x0, y0
function N_V(v)
{
  var Max = Number.MIN_VALUE;
  for (var i = 0; i < v.length; i++) {
    if(Max < Math.abs(v[i]))
      Max = Math.abs(v[i]);
  };
  return Max;
}
function N_M(m)
{
  var vec = [];
  for (var i = 0; i < m.length; i++) {
  	var cw = 0;
  	for (var j = 0; j < m[i].length; j++) {
  		cw += m[i][j];
  	};
  	vec.push(cw);
  };
  return N_V(vec);
}