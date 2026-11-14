(function(){
"use strict";
/* Mathvelo scientific calculator: local, offline, no eval. */
var FN={sin:1,cos:1,tan:1,asin:1,acos:1,atan:1,ln:1,log:1,sqrt:1,abs:1,exp:1,fact:1};
function Parser(src,deg,ans){this.s=src;this.i=0;this.deg=deg;this.ans=ans}
var P=Parser.prototype;
function fail(m){var e=new Error(m||"Syntax error");e.mv=1;throw e}
P.ws=function(){while(this.i<this.s.length&&/\s/.test(this.s[this.i]))this.i++};
P.peek=function(){this.ws();return this.s[this.i]};
P.expr=function(){var v=this.term();for(;;){var c=this.peek();if(c==="+"){this.i++;v+=this.term()}else if(c==="-"){this.i++;v-=this.term()}else return v}};
P.term=function(){var v=this.unary();for(;;){var c=this.peek();
  if(c==="*"){this.i++;v*=this.unary()}
  else if(c==="/"){this.i++;var d=this.unary();if(d===0)fail("Math error");v/=d}
  else if(c&&(/[0-9.(πe]/.test(c)||/[a-zA-Z]/.test(c))&&c!=="E"){v*=this.unary()}   /* implicit multiplication */
  else return v}};
P.unary=function(){var c=this.peek();if(c==="-"){this.i++;return-this.unary()}if(c==="+"){this.i++;return this.unary()}return this.power()};
P.power=function(){var b=this.post();if(this.peek()==="^"){this.i++;var e=this.unary();var r=Math.pow(b,e);if(!isFinite(r)||isNaN(r))fail("Math error");return r}return b};
P.post=function(){var v=this.atom();for(;;){var c=this.peek();
  if(c==="!"){this.i++;v=fact(v)}else if(c==="%"){this.i++;v=v/100}else return v}};
function fact(n){if(n<0||Math.floor(n)!==n||n>170)fail("Math error");var r=1;for(var k=2;k<=n;k++)r*=k;return r}
P.atom=function(){
  var c=this.peek(),m;
  if(c==="("){this.i++;var v=this.expr();if(this.peek()!==")")fail("Missing )");this.i++;return v}
  var rest=this.s.slice(this.i);
  if((m=/^(\d+\.?\d*|\.\d+)(?:[eE]([+-]?\d+))?/.exec(rest))){
    var hasE=m[2]!==undefined;this.i+=m[0].length;return parseFloat(m[0])}
  if((m=/^[a-zA-Z]+/.exec(rest))){
    var w=m[0].toLowerCase();
    if(w.indexOf("ans")===0){this.i+=3;return this.ans}
    var name=null;for(var k in FN)if(w.indexOf(k)===0&&(!name||k.length>name.length))name=k;
    if(name){this.i+=name.length;if(this.peek()!=="(")fail("Missing (");this.i++;var a=this.expr();if(this.peek()!==")")fail("Missing )");this.i++;return this.fn(name,a)}
    if(w.indexOf("pi")===0){this.i+=2;return Math.PI}
    if(w[0]==="e"){this.i+=1;return Math.E}
    fail("Unknown "+m[0]);
  }
  if(c==="π"){this.i++;return Math.PI}
  fail(c===undefined?"Incomplete":"Syntax error");
};
P.fn=function(n,a){
  var r,D=Math.PI/180;
  switch(n){
    case"sin":r=Math.sin(this.deg?a*D:a);break;
    case"cos":r=Math.cos(this.deg?a*D:a);break;
    case"tan":var cc=Math.cos(this.deg?a*D:a);if(Math.abs(cc)<1e-14)fail("Math error");r=Math.tan(this.deg?a*D:a);break;
    case"asin":if(a<-1||a>1)fail("Math error");r=Math.asin(a);if(this.deg)r/=D;break;
    case"acos":if(a<-1||a>1)fail("Math error");r=Math.acos(a);if(this.deg)r/=D;break;
    case"atan":r=Math.atan(a);if(this.deg)r/=D;break;
    case"ln":if(a<=0)fail("Math error");r=Math.log(a);break;
    case"log":if(a<=0)fail("Math error");r=Math.log10(a);break;
    case"sqrt":if(a<0)fail("Math error");r=Math.sqrt(a);break;
    case"abs":r=Math.abs(a);break;
    case"exp":r=Math.exp(a);break;
    case"fact":r=fact(a);break;
  }
  if(!isFinite(r)||isNaN(r))fail("Math error");
  if(/^(sin|cos|tan)$/.test(n)&&Math.abs(r)<1e-15)r=0;
  return r;
};
function clean(s){return String(s).replace(/×/g,"*").replace(/÷/g,"/").replace(/[−–]/g,"-").replace(/√/g,"sqrt").replace(/ /g," ")}
function evaluate(src,deg,ans){
  var s=clean(src);if(!s.trim())return null;
  var p=new Parser(s,deg,ans);var v=p.expr();p.ws();
  if(p.i<s.length)fail(s[p.i]===")"?"Extra )":"Syntax error");
  if(!isFinite(v)||isNaN(v))fail("Math error");
  return v;
}
function fmt(v){
  if(v===0)return"0";
  var a=Math.abs(v);
  if(a>=1e12||a<1e-9){var t=v.toExponential(9).replace(/\.?0+e/,"e");return t.replace("e+","×10^").replace("e","×10^")}
  var r=parseFloat(v.toPrecision(12));
  return String(r);
}
window.MVCalc={evaluate:evaluate,fmt:fmt};

/* ---------- UI ---------- */
var root=document.getElementById("calc");if(!root)return;
var inp=document.getElementById("cIn"),out=document.getElementById("cOut"),hist=document.getElementById("cHist"),mode=document.getElementById("cMode");
var deg=true,ans=0,H=[];
try{var sv=JSON.parse(localStorage.getItem("mv_calc")||"{}");if(sv.deg===false)deg=false;if(typeof sv.ans==="number")ans=sv.ans;if(Array.isArray(sv.h))H=sv.h.slice(0,6)}catch(e){}
function save(){try{localStorage.setItem("mv_calc",JSON.stringify({deg:deg,ans:ans,h:H}))}catch(e){}}
function paintMode(){mode.textContent=deg?"DEG":"RAD";mode.setAttribute("aria-pressed",String(deg))}
function paintHist(){hist.innerHTML=H.map(function(h,i){return'<button type="button" class="ch" data-i="'+i+'"><span>'+h[0].replace(/</g,"&lt;")+'</span><b>= '+h[1]+'</b></button>'}).join("")}
function live(){
  var s=inp.value;out.classList.remove("err");
  if(!s.trim()){out.textContent="0";return}
  try{var v=evaluate(s,deg,ans);out.textContent=v===null?"0":fmt(v)}
  catch(e){out.textContent=/Syntax|Incomplete|Missing/.test(e.message)?"…":(e.mv?e.message:"Error");out.classList.toggle("err",e.message==="Math error")}
}
function ins(t){
  var a=inp.selectionStart==null?inp.value.length:inp.selectionStart,b=inp.selectionEnd==null?a:inp.selectionEnd;
  inp.value=inp.value.slice(0,a)+t+inp.value.slice(b);
  var p=a+t.length;inp.focus({preventScroll:true});inp.setSelectionRange(p,p);live();
}
function del(){
  var a=inp.selectionStart,b=inp.selectionEnd;
  if(a!==b){ins("");return}
  if(a>0){inp.value=inp.value.slice(0,a-1)+inp.value.slice(a);inp.setSelectionRange(a-1,a-1)}
  inp.focus({preventScroll:true});live();
}
function equals(){
  var s=inp.value;if(!s.trim())return;
  try{var v=evaluate(s,deg,ans);var f=fmt(v);ans=v;H.unshift([s,f]);H=H.slice(0,6);save();paintHist();out.textContent=f;out.classList.remove("err");inp.value=f.indexOf("×10")>-1?String(v):f;live()}
  catch(e){out.textContent=e.mv?e.message:"Error";out.classList.add("err")}
}
root.addEventListener("click",function(e){
  var b=e.target.closest("[data-k]");
  if(b){
    var k=b.dataset.k;
    if(k==="AC"){inp.value="";live();inp.focus({preventScroll:true})}
    else if(k==="DEL")del();
    else if(k==="=")equals();
    else if(k==="MODE"){deg=!deg;paintMode();save();live()}
    else ins(k);
    return;
  }
  var h=e.target.closest(".ch");if(h){var r=H[+h.dataset.i];if(r){inp.value=r[0];live();inp.focus({preventScroll:true})}}
  if(e.target.id==="cClr"){H=[];save();paintHist()}
});
inp.addEventListener("input",live);
inp.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();equals()}else if(e.key==="Escape"){inp.value="";live()}});
paintMode();paintHist();live();
})();
