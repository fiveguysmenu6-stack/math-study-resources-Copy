/* Math Study Resources: theme, menu, directory search, iframe sizing, quick calculator. No external requests. */
(function(){
"use strict";
var root=document.documentElement;
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
/* theme */
function applyTheme(t){if(t==="light"||t==="dark")root.setAttribute("data-theme",t);else root.removeAttribute("data-theme");}
function current(){var t=root.getAttribute("data-theme");if(t)return t;return window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
var tb=document.getElementById("themeBtn");
if(tb){var upd=function(){var d=current()==="dark";tb.setAttribute("aria-pressed",d?"true":"false");tb.setAttribute("aria-label",d?"Switch to light mode":"Switch to dark mode");tb.querySelector(".i-sun").style.display=d?"":"none";tb.querySelector(".i-moon").style.display=d?"none":""};
 upd();tb.addEventListener("click",function(){var n=current()==="dark"?"light":"dark";applyTheme(n);store("msr-theme",n);upd()});
 if(window.matchMedia)matchMedia("(prefers-color-scheme: dark)").addEventListener&&matchMedia("(prefers-color-scheme: dark)").addEventListener("change",upd)}
/* mobile menu */
var mb=document.getElementById("menuBtn"),nav=document.getElementById("mainNav");
if(mb&&nav){mb.addEventListener("click",function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o?"true":"false")});
 document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){nav.classList.remove("open");mb.setAttribute("aria-expanded","false");mb.focus()}})}
/* iframe auto height */
var frames=document.querySelectorAll("iframe[data-embed]");
if(frames.length){addEventListener("message",function(e){var d=e.data;if(!d||typeof d.mvh!=="number")return;for(var i=0;i<frames.length;i++){if(frames[i].contentWindow===e.source){frames[i].style.height=Math.max(320,Math.min(d.mvh,6000))+"px"}}})}
/* directory search + filter */
var q=document.getElementById("q"),list=document.getElementById("dirList");
if(q&&list){var cards=[].slice.call(list.querySelectorAll("[data-name]")),chips=[].slice.call(document.querySelectorAll("[data-cat]")),cnt=document.getElementById("dirCount"),empty=document.getElementById("dirEmpty"),cat="all";
 function norm(s){return s.toLowerCase().replace(/[^a-z0-9 ]+/g," ")}
 function run(){var t=norm(q.value).split(/\s+/).filter(Boolean),n=0;
  cards.forEach(function(c){var h=norm(c.getAttribute("data-name")+" "+c.getAttribute("data-kw")),ok=(cat==="all"||c.getAttribute("data-c")===cat)&&t.every(function(w){return h.indexOf(w)>-1});c.hidden=!ok;if(ok)n++});
  cnt.textContent=n+(n===1?" calculator":" calculators");empty.hidden=n!==0}
 q.addEventListener("input",run);
 chips.forEach(function(b){b.addEventListener("click",function(){cat=b.getAttribute("data-cat");chips.forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});run()})});
 var m=/[?&]q=([^&]*)/.exec(location.search);if(m){try{q.value=decodeURIComponent(m[1].replace(/\+/g," "))}catch(e){}}
 function fromHash(){var hh=(location.hash||"").slice(1);if(hh&&chips.some(function(b){return b.getAttribute("data-cat")===hh})){cat=hh;chips.forEach(function(x){x.setAttribute("aria-pressed",x.getAttribute("data-cat")===hh?"true":"false")});run()}}
 fromHash();addEventListener("hashchange",fromHash);
 run()}
/* hero quick calc */
var qi=document.getElementById("qcIn"),qo=document.getElementById("qcOut");
if(qi&&qo&&window.MVCalc){var deg=true,dm=document.getElementById("qcDeg");
 function go(){var s=qi.value.trim();qo.classList.remove("err");if(!s){qo.textContent="";return}
  try{var v=MVCalc.evaluate(s,deg,0);qo.textContent="= "+MVCalc.fmt(v)}catch(e){qo.textContent=(e&&e.mv)?e.message:"Check the expression";qo.classList.add("err")}}
 qi.addEventListener("input",go);
 if(dm)dm.addEventListener("change",function(){deg=dm.value==="deg";go()});
 [].forEach.call(document.querySelectorAll("[data-ex]"),function(b){b.addEventListener("click",function(){qi.value=b.getAttribute("data-ex");go();qi.focus()})});
 go()}
})();
