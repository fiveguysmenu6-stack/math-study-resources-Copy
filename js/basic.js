/* Basic calculator. Uses MVCalc (js/calc.js): own parser, no eval. */
(function(){
"use strict";
var root=document.getElementById("bc");if(!root||!window.MVCalc)return;
var exprEl=document.getElementById("bcExpr"),resEl=document.getElementById("bcRes"),memEl=document.getElementById("bcMem"),histEl=document.getElementById("bcHist");
var expr="",ans=0,justEq=false,mem=0,hasMem=false,hist=[];
try{hist=JSON.parse(localStorage.getItem("msr-basic-hist")||"[]")}catch(e){hist=[]}
if(!Array.isArray(hist))hist=[];
function save(){try{localStorage.setItem("msr-basic-hist",JSON.stringify(hist.slice(0,30)))}catch(e){}}
function disp(s){return s.replace(/\*/g,"×").replace(/\//g,"÷").replace(/-/g,"−")}
function norm(s){return s.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-")}
function preview(){
  resEl.classList.remove("err");
  if(!expr){resEl.textContent="0";return}
  try{var v=MVCalc.evaluate(norm(expr),true,ans);resEl.textContent=MVCalc.fmt(v)}
  catch(e){resEl.textContent=resEl.textContent||"0"}
}
function render(){exprEl.textContent=disp(expr);memEl.textContent=hasMem?"M":"";}
function put(t){
  if(justEq){ if(/^[0-9.(]$/.test(t)){expr="";} justEq=false; }
  if(t==="."){var m=/[0-9.]*$/.exec(expr)[0];if(m.indexOf(".")>-1)return}
  if(/^[*\/+\-]$/.test(t)&&/[*\/+\-]$/.test(expr)){ if(t==="-"&&/[*\/]$/.test(expr)){expr+=t}else{expr=expr.replace(/[*\/+\-]+$/,t)} render();preview();return}
  if(/^[*\/+]$/.test(t)&&!expr){return}
  expr+=t;render();preview();
}
function equals(){
  if(!expr)return;
  var open=(expr.match(/\(/g)||[]).length-(expr.match(/\)/g)||[]).length,e=expr;
  while(open-->0)e+=")";
  try{var v=MVCalc.evaluate(norm(e),true,ans),s=MVCalc.fmt(v);
    var raw=String(parseFloat(v.toPrecision(12)));hist.unshift({e:disp(e),r:s,x:raw});hist=hist.slice(0,30);save();
    ans=v;expr=raw;justEq=true;exprEl.textContent=disp(e)+" =";resEl.textContent=s;resEl.classList.remove("err");memEl.textContent=hasMem?"M":"";drawHist()}
  catch(err){resEl.textContent=(err&&err.mv)?err.message:"Error";resEl.classList.add("err")}
}
function curVal(){ if(justEq)return ans; if(!expr)return 0; try{return MVCalc.evaluate(norm(expr),true,ans)}catch(e){return null} }
function act(k){
  if(k==="AC"){expr="";justEq=false;render();preview();resEl.textContent="0";return}
  if(k==="DEL"){if(justEq){expr="";justEq=false}else expr=expr.slice(0,-1);render();preview();if(!expr)resEl.textContent="0";return}
  if(k==="="){equals();return}
  if(k==="NEG"){ if(justEq){justEq=false} var m=/(-?[0-9.]+)$/.exec(expr); if(m){var n=m[1];expr=expr.slice(0,expr.length-n.length)+(n[0]==="-"?n.slice(1):"-"+n)} else expr+="-"; render();preview();return}
  if(k==="MC"){mem=0;hasMem=false;render();return}
  if(k==="MR"){ if(hasMem){ if(justEq){expr="";justEq=false} expr+=MVCalc.fmt(mem);render();preview()} return}
  if(k==="M+"||k==="M-"){var v=curVal();if(v===null||!isFinite(v))return;mem=(k==="M+")?mem+v:mem-v;mem=+mem.toPrecision(14);hasMem=true;render();return}
  if(k==="%"){ if(/[0-9)]$/.test(expr)){justEq=false;expr+="%";render();preview()} return}
  put(k);
}
root.addEventListener("click",function(e){var b=e.target.closest("button[data-k]");if(!b)return;act(b.getAttribute("data-k"))});
document.addEventListener("keydown",function(e){
  var t=e.target;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  var k=e.key;
  if(/^[0-9]$/.test(k)||k==="."||k==="("||k===")"){put(k);e.preventDefault()}
  else if(k==="+"||k==="-"||k==="*"||k==="/"){put(k);e.preventDefault()}
  else if(k==="x"||k==="X"){put("*");e.preventDefault()}
  else if(k==="%"){act("%");e.preventDefault()}
  else if(k==="Enter"||k==="="){if(t&&t.tagName==="BUTTON"&&k==="Enter")return;equals();e.preventDefault()}
  else if(k==="Backspace"){act("DEL");e.preventDefault()}
  else if(k==="Escape"||k==="Delete"){act("AC");e.preventDefault()}
});
function drawHist(){
  histEl.innerHTML="";
  if(!hist.length){var p=document.createElement("li");p.className="none";p.textContent="No calculations yet.";histEl.appendChild(p);return}
  hist.forEach(function(h){var li=document.createElement("li"),b=document.createElement("button");b.type="button";b.textContent=h.e+" = "+h.r;b.title="Use this result";
    b.addEventListener("click",function(){expr=h.x||h.r;justEq=false;render();preview()});li.appendChild(b);histEl.appendChild(li)});
}
document.getElementById("bcClear").addEventListener("click",function(){hist=[];save();drawHist()});
drawHist();render();
})();
