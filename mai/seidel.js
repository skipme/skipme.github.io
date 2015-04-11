function x1(x2, x3, x4)
{
	return (-.4444)*x2 + .1667*x3 - 0.2222*x4 - 4.6667;
}
function x2(x1, x3, x4)
{
	return .4667*x1 + .3333*x3 + 0.1333*x4 - .3333;
}
function x3(x1, x2, x4)
{
	//return .3077*x1 + 0*x2 + .4615*x4 - 2.9231;
	return .3077*x1 + 0*x2 - .3077*x4 - 2.9231;
}
function x4(x1, x2, x3)
{
	return .2581*x1 + .2581*x2 + 0.1935*x3 + 8.4839;
}

function zeidelIteration(vec)
{
	var vec_result = [];
	vec_result[0] = Number(x1(vec[1], vec[2], vec[3]).toFixed(4));
	vec_result[1] = Number(x2(vec_result[0], vec[2], vec[3]).toFixed(4));
	vec_result[2] = Number(x3(vec_result[0], vec_result[1], vec[3]).toFixed(4));
	vec_result[3] = Number(x4(vec_result[0], vec_result[1], vec_result[2]).toFixed(4));

	return vec_result;
}
function subVec(vecA, vecB)
{
	return [
		Number((vecA[0] - vecB[0]).toFixed(4)),
		Number((vecA[1] - vecB[1]).toFixed(4)),
		Number((vecA[2] - vecB[2]).toFixed(4)),
		Number((vecA[3] - vecB[3]).toFixed(4))
	];
}
function N_V(v)
{
  var Max = Number.MIN_VALUE;
  for (var i = 0; i < v.length; i++) {
    if(Max < Math.abs(v[i]))
      Max = Math.abs(v[i]);
  };
  return Max;
}
function calc_E(vecN, CNorm, BNorm)
{
	return (CNorm/(1-BNorm)) * N_V(vecN);
}
function printVX(v)
{
  return "x1=" + v[0] + ", x2=" + v[1] + ", x3=" + v[2] + ", x4=" + v[3];
}
function printV(v)
{
  return "" + v[0] + ", " + v[1] + ", " + v[2]+ ", " + v[3];
}
function Zeidel(startVector, CNorm, BNorm)
{
	var str_out = "";
	var Enow = Number.MAX_VALUE, vecNow, vec = startVector;

	for (var i = 1; i < 500 && Enow > 0.01; i++) {
		str_out += "\r\niteration: " + i;
		vecNow = zeidelIteration(vec);

		var vecN = subVec(vecNow, vec);
		Enow = calc_E(vecN, CNorm, BNorm);

		str_out += "\r\n" + printVX(vecNow);
		str_out += "\r\nX"+i+"-X"+(i-1)+"[" + printV(vecN) + "]";
		str_out += "\r\nError: " + Enow.toFixed(4);
		vec = vecNow;
		str_out += "\r\n\t";
	};
	console.log(str_out)
}

Zeidel([-4.6667, -.3333, -2.9231, 8.4839], 0.4999, 0.9333);
