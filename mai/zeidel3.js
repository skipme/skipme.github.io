var Zeidel3 = {
	x1: null, x2: null, x3: null,// funcs
	zeidelIteration: function(vec)
	{
		var vec_result = [];
		vec_result[0] = Number( this.x1(vec[1], vec[2]).toFixed(6));
		vec_result[1] = Number( this.x2(vec_result[0], vec[2]).toFixed(6));
		vec_result[2] = Number( this.x3(vec_result[0], vec_result[1]).toFixed(6));

		return vec_result;
	},
	subVec: function(vecA, vecB)
	{
		return [
			Number((vecA[0] - vecB[0]).toFixed(6)),
			Number((vecA[1] - vecB[1]).toFixed(6)),
			Number((vecA[2] - vecB[2]).toFixed(6))
		];
	},
	N_V: function(v)
	{
	  var Max = Number.MIN_VALUE;
	  for (var i = 0; i < v.length; i++) {
	    if(Max < Math.abs(v[i]))
	      Max = Math.abs(v[i]);
	  };
	  return Max;
	},
	calc_E: function(vecN, CNorm, BNorm)
	{
		return (CNorm/(1-BNorm)) * this.N_V(vecN);
	},
	calc(a,b,c,d,e,f,g,h)
	{
		var startVector = [d/a, f/c, h/g];
		this.x1 = function(x2,x3){return (d + (-b)*x2 + (-c)*x3)/a;}
		this.x2 = function(x1,x3){return (f + (-b)*x1 + (-e)*x3)/c;}
		this.x3 = function(x1,x2){return (h + (-c)*x1 + (-e)*x2)/g;}

		var BNorm = this.N_V([
			(-b)/a+(-c)/a, 
			(-b)/c+(-e)/c, 
			(-c)/g+(-e)/g
		]);
		var CNorm = this.N_V([
			(-b)/a+(-c)/a, 
			(-e)/c
		]);
		if(BNorm >= 1)
			throw new Error("method not available for this equations");
		var Enow = Number.MAX_VALUE, vecNow, vec = startVector;
		var str_out = "";
		for (var i = 1; i < 500 && Enow > 0.0001; i++) {
			str_out += "\r\niteration: " + i;
			vecNow = this.zeidelIteration(vec);

			var vecN = this.subVec(vecNow, vec);
			Enow = this.calc_E(vecN, CNorm, BNorm);
			str_out += "\r\nError: " + Enow.toFixed(4);
			str_out += "\r\n\t";
			vec = vecNow;
		};
		// check:
		var check1 = a*vec[0] + b*vec[1] + c*vec[2];
		var check2 = b*vec[0] + c*vec[1] + e*vec[2];
		var check3 = c*vec[0] + e*vec[1] + g*vec[2];
		console.log("zeidel check: "+Enow+//JSON.stringify(arguments)+
			(check1-d<0.001?"OK":"ERROR "+check1+", "+d)+" "+
			(check2-f<0.001?"OK":"ERROR "+check2+", "+f)+" "+
			(check3-h<0.001?"OK":"ERROR "+check3+", "+h));

		 console.log(str_out);

		return [
			Number(vec[0].toFixed(4)),
			Number(vec[1].toFixed(4)),
			Number(vec[2].toFixed(4)),
			];
	}
};