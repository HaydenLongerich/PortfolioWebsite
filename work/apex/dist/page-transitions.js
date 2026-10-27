(() => {
'use strict';
const routes={'index.html':['00','Home'],'work.html':['01','Experience'],'about.html':['02','Projects'],'tools.html':['03','Tooling'],'photos.html':['04','Photos'],'contact.html':['05','Contact']};
const key='portfolio-page-transition',motion=matchMedia('(prefers-reduced-motion: reduce)');
const file=url=>{const name=url.pathname.split('/').pop()||'index.html';return name.includes('.')?name:name+'.html'};
let arriving=null,overlay=null,busy=false,timer=0;
try{const saved=JSON.parse(sessionStorage.getItem(key)||'null');sessionStorage.removeItem(key);if(saved&&file(new URL(saved.path,location.origin))===file(new URL(location.href))&&Date.now()-saved.at<12000&&!motion.matches){arriving=saved;document.documentElement.classList.add('page-arriving')}}catch{}
function clear(){clearTimeout(timer);busy=false;overlay?.classList.remove('is-active','is-leaving','is-entering');document.documentElement.classList.remove('page-arriving');}
function stage(route,from){
 if(!overlay){overlay=document.createElement('div');overlay.className='page-transition';overlay.setAttribute('aria-hidden','true');overlay.innerHTML='<div class="transition-shutters">'+Array.from({length:5},(_,i)=>'<div class="transition-shutter" style="--i:'+i+'"></div>').join('')+'</div><div class="transition-grid"></div><div class="transition-index"></div><div class="transition-center"><div class="transition-route"><span class="transition-from"></span><i></i><span class="transition-to"></span></div><div class="transition-title"></div></div><div class="transition-scan"></div><div class="transition-meta"><span>HAYDEN LONGERICH / PORTFOLIO</span><span class="transition-section"></span></div>';document.body.append(overlay)}
 overlay.querySelector('.transition-title').textContent=route[1];overlay.querySelector('.transition-index').textContent=route[0];overlay.querySelector('.transition-from').textContent=from;overlay.querySelector('.transition-to').textContent=route[1];overlay.querySelector('.transition-section').textContent='SECTION / '+route[0];return overlay;
}
function ready(){
 if(arriving){stage(routes[file(new URL(location.href))]||['00','Home'],arriving.from).classList.add('is-active','is-entering');document.documentElement.classList.remove('page-arriving');timer=setTimeout(clear,1050)}
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname===location.pathname||!routes[file(url)]||motion.matches)return;
  event.preventDefault();if(busy)return;clear();document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());busy=true;const from=routes[file(new URL(location.href))]?.[1]||'Home';stage(routes[file(url)],from).classList.add('is-active','is-leaving');
  timer=setTimeout(()=>{try{sessionStorage.setItem(key,JSON.stringify({path:url.pathname,from,at:Date.now()}))}catch{}location.assign(url.href);timer=setTimeout(clear,2500)},820);
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
addEventListener('pageshow',event=>{if(event.persisted)clear()});
motion.addEventListener('change',()=>{if(motion.matches)document.documentElement.classList.remove('page-arriving')});
})();
