(() => {
'use strict';
const host=document.querySelector('#carViewport');if(!host)return;
const overlay=host.querySelector('.car-cutaway'),status=document.querySelector('#driveStatus'),lock=document.querySelector('#lockView'),slider=document.querySelector('#carRotation');
let x=.5,y=.5,paint=0,locked=false,mode='explore',visible=false,angle=0,shown=0,request=0,down=null,dragged=false;
const count=72,cache=new Map(),pending=new Map(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const wrap=n=>(Math.round(n)%count+count)%count;
function draw(){paint=0;if(mode==='interior'){overlay.style.clipPath='none';return}if(mode==='exterior'||!visible){overlay.style.clipPath='circle(0% at 50% 50%)';return}
 const w=host.clientWidth,h=host.clientHeight,r=Math.min(w*.22,h*.28,160),points=[];
 for(let i=0;i<56;i++){const a=i*Math.PI*2/56,phase=reduced.matches?0:x*2+y,radius=r*(1+.09*Math.sin(3*a+phase)+.055*Math.cos(5*a-phase));points.push(`${(x*w+Math.cos(a)*radius).toFixed(1)}px ${(y*h+Math.sin(a)*radius).toFixed(1)}px`)}overlay.style.clipPath=`polygon(${points.join(',')})`;
}
function schedule(){if(!paint)paint=requestAnimationFrame(draw)}
function hint(){status.textContent=mode==='interior'?'CHASSIS EXPOSED · DRAG TO ROTATE':mode==='exterior'?'EXTERIOR · DRAG TO ROTATE':'MOVE TO REVEAL · DRAG TO ROTATE'}
function trim(){while(cache.size>10){const key=[...cache.keys()].find(k=>k!==shown&&k!==angle);if(key===undefined)break;cache.delete(key)}}
function load(i,priority='high'){i=wrap(i);if(cache.has(i)){const pair=cache.get(i);cache.delete(i);cache.set(i,pair);return Promise.resolve(pair)}if(pending.has(i))return pending.get(i);
 const promise=Promise.all(['exterior','interior'].map(async layer=>{const img=new Image();img.className='car-still';img.alt=layer==='exterior'?'Yellow LEGO Technic McLaren P1':'';img.width=960;img.height=600;img.decoding='async';img.fetchPriority=priority;img.draggable=false;img.src=`assets/spin/${layer}-${String(i).padStart(2,'0')}.webp`;await img.decode();return img})).then(pair=>{cache.set(i,pair);pending.delete(i);trim();return pair}).catch(error=>{pending.delete(i);throw error});pending.set(i,promise);return promise;
}
function neighbors(){if(pending.size>2)return;for(const i of [angle-1,angle+1])load(wrap(i),'low').catch(()=>{})}
async function rotate(value){angle=wrap(value);slider.value=angle;slider.setAttribute('aria-valuetext',`${angle*5} degrees`);const ticket=++request;
 try{if(pending.size>=3){await Promise.race(pending.values()).catch(()=>{});if(ticket!==request)return}const pair=await load(angle);if(ticket!==request)return;host.querySelector(':scope > .car-still').replaceWith(pair[0]);overlay.replaceChildren(pair[1]);shown=angle;hint();neighbors()}catch{if(ticket===request)status.textContent='This angle could not load. Drag again to retry.'}
}
function locate(e){if(locked||mode!=='explore')return;const r=host.getBoundingClientRect();x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));visible=true;schedule()}
host.addEventListener('pointerdown',e=>{if(e.button!==0)return;down={x:e.clientX,y:e.clientY,angle,pointer:e.pointerId};dragged=false;locate(e)});
host.addEventListener('pointermove',e=>{if(down){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(!dragged&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8&&e.pointerType==='touch'){down=null;return}if(Math.abs(dx)>5){dragged=true;host.classList.add('dragging');if(!host.hasPointerCapture(e.pointerId))host.setPointerCapture(e.pointerId);const next=wrap(down.angle+dx/7);if(next!==angle)rotate(next)}}if(e.pointerType!=='touch'||down)locate(e)});
function end(){down=null;host.classList.remove('dragging')}
host.addEventListener('pointerup',end);host.addEventListener('pointercancel',end);host.addEventListener('lostpointercapture',end);
host.addEventListener('pointerleave',()=>{if(!locked&&!down){visible=false;schedule()}});
host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){rotate(0);return}if(!e.shiftKey&&['ArrowLeft','ArrowRight'].includes(e.key)){rotate(angle+(e.key==='ArrowRight'?1:-1));return}if(mode!=='explore')setMode('explore');x=Math.max(.05,Math.min(.95,x+(e.key==='ArrowRight'?.04:e.key==='ArrowLeft'?-.04:0)));y=Math.max(.05,Math.min(.95,y+(e.key==='ArrowDown'?.04:e.key==='ArrowUp'?-.04:0)));visible=true;schedule()});
function setMode(value){mode=value;locked=false;lock.setAttribute('aria-pressed','false');lock.textContent='LOCK REVEAL ↗';lock.disabled=value!=='explore';document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layer===value)));hint();schedule()}
document.querySelectorAll('[data-layer]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.layer)));
lock.addEventListener('click',()=>{locked=!locked;visible=true;lock.setAttribute('aria-pressed',String(locked));lock.textContent=locked?'UNLOCK REVEAL ↗':'LOCK REVEAL ↗';schedule()});
document.querySelector('#resetView').addEventListener('click',()=>{x=y=.5;visible=false;setMode('explore');rotate(0)});
slider.addEventListener('input',()=>rotate(Number(slider.value)));
new ResizeObserver(schedule).observe(host);host.dataset.ready='true';hint();schedule();
// Bind controls synchronously. Rotation frames load only near the viewport.
const initial=[host.querySelector(':scope > .car-still'),overlay.querySelector('img')];cache.set(0,initial);
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){neighbors();observer.disconnect()}},{rootMargin:'150px'});observer.observe(host);
})();
