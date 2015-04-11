function MxV(m,v)
{
  return [
    Number((m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]).toFixed(4)),
    Number((m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]).toFixed(4)),
    Number((m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]).toFixed(4))
  ];
}
function MxM(m,v)
{
  return [
  	[
	    Number((m[0][0]*v[0][0] + m[0][1]*v[1][0] + m[0][2]*v[2][0]).toFixed(4)),
	    Number((m[0][0]*v[0][1] + m[0][1]*v[1][1] + m[0][2]*v[2][1]).toFixed(4)),
	    Number((m[0][0]*v[0][2] + m[0][1]*v[1][2] + m[0][2]*v[2][2]).toFixed(4))
    ],
    [
	    Number((m[1][0]*v[0][0] + m[1][1]*v[1][0] + m[1][2]*v[2][0]).toFixed(4)),
	    Number((m[1][0]*v[0][1] + m[1][1]*v[1][1] + m[1][2]*v[2][1]).toFixed(4)),
	    Number((m[1][0]*v[0][2] + m[1][1]*v[1][2] + m[1][2]*v[2][2]).toFixed(4))
    ],
    [
	    Number((m[2][0]*v[0][0] + m[2][1]*v[1][0] + m[2][2]*v[2][0]).toFixed(4)),
	    Number((m[2][0]*v[0][1] + m[2][1]*v[1][1] + m[2][2]*v[2][1]).toFixed(4)),
	    Number((m[2][0]*v[0][2] + m[2][1]*v[1][2] + m[2][2]*v[2][2]).toFixed(4))
    ],
  ];
}
var CONST_CELL = { a13: 10, a23: 11, a12: 12};
function MaxCell(m)
{
	if(Math.abs(m[0][1]) > Math.abs(m[0][2]) && Math.abs(m[0][1]) > Math.abs(m[1][2]))
		return CONST_CELL.a12;
	if(Math.abs(m[0][2]) > Math.abs(m[0][1]) && Math.abs(m[0][2]) > Math.abs(m[1][2]))
		return CONST_CELL.a13;
	if(Math.abs(m[1][2]) > Math.abs(m[0][1]) && Math.abs(m[1][2]) > Math.abs(m[0][2]))
		return CONST_CELL.a23;
}
function getMS(cellId, cosF, sinF)
{
	switch(cellId)
	{
		case CONST_CELL.a23: return [ [1, 0, 0], [0, cosF, -sinF], [0, sinF, cosF] ];
		case CONST_CELL.a13: return [ [cosF, 0, -sinF], [0, 1, 0], [sinF, 0, cosF] ];
		case CONST_CELL.a12: return [ [cosF, -sinF, 0], [sinF, cosF, 0], [0, 0, 1] ];
		default:
			throw new Error("unknown cellId");
		break;
	}
}
function getF(cellId, m)
{
	var a = .0, b = .0, c = .0;
	switch(cellId)
	{
		case CONST_CELL.a23: a = m[1][2]; b = m[1][1]; c = m[2][2]; break;
		case CONST_CELL.a13: a = m[0][2]; b = m[0][0]; c = m[2][2]; break;
		case CONST_CELL.a12: a = m[0][1]; b = m[0][0]; c = m[1][1]; break;
		default:
			throw new Error("unknown cellId");
		break;
	}
	console.log("a: " + a.toFixed(4) +" b: " + b.toFixed(4)+ " c: " + c.toFixed(4));

	console.log("for atan: " + ((2*a)/(b-c)).toFixed(4));
	return (Math.atan((2*a)/(b-c))) * 0.5;
}
function transpose(m)
{
	return [
		[m[0][0], m[1][0], m[2][0]],
		[m[0][1], m[1][1], m[2][1]],
		[m[0][2], m[1][2], m[2][2]]
	];
}
function calcE(m)
{
	return Math.sqrt(m[0][1]*m[0][1] + m[0][2]*m[0][2] + m[1][2]*m[1][2]);
}
function printM(v)
{
  return "\t" + v[0][0].toFixed(4) + ", " + v[0][1].toFixed(4) + ", " + v[0][2].toFixed(4)
  + "\n\t" + v[1][0].toFixed(4) + ", " + v[1][1].toFixed(4) + ", " + v[1][2].toFixed(4)
  + "\n\t" + v[2][0].toFixed(4) + ", " + v[2][1].toFixed(4) + ", " + v[2][2].toFixed(4);
}
function iterate(A)
{
	var ECHK = 0.01, cmax = 0, CA = A, S, St, Fi, cosFi, sinFi, STxA, CE = 0;
	console.log("A0: " + printM(A));

	for (var i = 1; i <= 10; i++) {
		console.log("\t\niteration: "+i);
		cmax = MaxCell(CA);
		console.log("max a:" + (cmax===CONST_CELL.a12?"12":(cmax===CONST_CELL.a13?"13":"23")) 
			+ " " + (cmax===CONST_CELL.a12?CA[0][1]:(cmax===CONST_CELL.a13?CA[0][2]:CA[1][2])));
		Fi = Number(getF(cmax, CA).toFixed(4));
		cosFi = Number(Math.cos(Fi).toFixed(4));
		sinFi = Number(Math.sin(Fi).toFixed(4));
		console.log("Fi:"+Fi+" sinFi:"+sinFi+" cosFi:"+cosFi);
		S = getMS(cmax, cosFi, sinFi);
		St = transpose(S);

		STxA = MxM(St, CA);
		CA = MxM(STxA, S);
		CE = calcE(CA);

		console.log("A"+i+": " + printM(CA));
		console.log("E: "+CE.toFixed(4));
		if(CE < ECHK)
			break;
	};
}

// iterate( [ [-7, -5, -9], [-5, 5, 2], [-9, 2, 9] ] );
iterate( [ [2, 8, 7], [8, 2, 7], [7, 7, -8] ] );
