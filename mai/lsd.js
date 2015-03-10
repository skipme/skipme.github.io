// (c) Vitaliy Burdenkov (cerriun[at]gmail.com), 2015 
var A = [
  [-7.,-5.,-9.],
  [-5.,5.,2.],
  [-9.,2.,9.],
];
var Xz = [1.0,1.0,1.0];

function MxV(m,v)
{
  return [
    (m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]).toFixed(4),
    (m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]).toFixed(4),
    (m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]).toFixed(4)
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
  // var absA = [];
  // v.forEach(function(e){ absA.push( Math.abs(e));});
  // return Math.max.apply(this, absA);
}

function calc_Yn(Xk, XkN)
{
 return [
   (Xk[0]/XkN).toFixed(4), 
   (Xk[1]/XkN).toFixed(4), 
   (Xk[2]/XkN).toFixed(4)
 ];
}
function calc_Xk(Yn)
{
  return MxV(A, Yn);
}
function printV(v)
{
  return "" + v[0] + ", " + v[1] + ", " + v[2];
}

function Do(eOnly)
{
  var strOut = "";
  function strLog(msg)
  {
    strOut += msg + "\n";
  }
  var Xk = Xz;
  var Yn;
  var prevNXk = 0;
  var EPS=Math.PI;
  //while(true)
  for(var i=0;(EPS>0.01 && i < 1000);i++)
  {
    prevNXk = N_V(Xk);
    Yn = calc_Yn(Xk, prevNXk);
    Xk = calc_Xk(Yn);
    if(!eOnly)
    {
      strLog("Yn("+i+") = " + "("+printV(Yn)+")");
      strLog("Xk("+(i+1)+") = " + "("+printV(Xk)+")" + " N("+N_V(Xk)+")");
    }
    //if(EPS === Math.PI)
    //{
    //  EPS = prevNXk;
    //}else{
       prevEPS = EPS;
       EPS = Math.abs(N_V(Xk) - prevNXk);
    //}
    strLog("E("+(i+1)+") = |"+ N_V(Xk) +" - "+ prevNXk.toFixed(4) +"| = "+ EPS.toFixed(4));
    if(!eOnly)
      strLog("\n");
  }
  return strOut;
}
//N_V([1,-22,-3])

function parseM(str)
{
  var M = [];
  var arL = str.trim().split("\n");
  if(arL.length !== 3)
    throw new Error("Количество строк не равно 3");
  for (var i = 0; i < 3; i++) {
    var L = [];
    var arC = arL[i].trim().split(" ");
    if(arC.length !== 3)
      throw new Error("Количество ячеек в строке №"+ (i+1) +" не равно 3");
    for (var j = 0; j < arC.length; j++) { 
      L[j] = filterFloat(arC[j].replace(/,/g,'.'));
      if(isNaN(L[j]))
      {  
        throw new Error("Ячейка в строке №"+ (i+1) +": '"+arC[j]+"', введена неверно");
      }
    };

    M.push(L);
  };
  return A = M;
}

var filterFloat = function (value) {
    if(/^-?([0-9]+(\.)?(\.+[0-9]+)?)$/
      .test(value))
      return Number(value);
  return NaN;
}



var eMIn = document.getElementById("MIn");
var eTO = document.getElementById("TOut");
var eBtn = document.getElementById("btn");
var echbxEonly = document.getElementById("chbxEonly");
function uiBtn()
{
  try{
    parseM(eMIn.value);
  }catch(e){
    console.error(e);
    eTO.value = "\nОШИБКА===> " + e.message;
    eBtn.value ="Решить - ошибка";
    return;
  }

  eTO.value = "\n===>\n" + Do(echbxEonly.checked);
  eBtn.value ="Решить - ок";
}

