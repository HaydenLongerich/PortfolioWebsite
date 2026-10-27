(() => {

'use strict';

const host=document.querySelector('#carViewport');if(!host)return;

const overlay=host.querySelector('.car-cutaway'),status=document.querySelector('#driveStatus'),lock=document.querySelector('#lockView'),slider=document.querySelector('#carRotation'),loader=host.querySelector('.car-loader'),retry=host.querySelector('.car-retry');

const count=72,wrap=n=>(n%count+count)%count,reduced=matchMedia('(prefers-reduced-motion: reduce)'),cache=new Map(),pending=new Map(),failed=new Set();

const cacheLimit=matchMedia('(pointer: coarse)').matches?6:12;

let position=0,target=0,velocity=0,lastTime=0,frame=0,active=false,ready=false,down=null,mode='explore',locked=false,visible=false,rect=null;

let x=.5,y=.5,tx=.5,ty=.5,shown=-1,nextShown=-1,loadingTimer=0,maskDirty=true,lastMask='',lastMotion=0,loadError=false;

const initial=[host.querySelector(':scope > .car-still'),overlay.querySelector('img')];

function setLoading(value){if(!value){clearTimeout(loadingTimer);loadingTimer=0;host.classList.remove('is-loading');host.setAttribute('aria-busy','false');return}if(loadingTimer)return;loadingTimer=setTimeout(()=>{host.classList.add('is-loading');host.setAttribute('aria-busy','true')},ready?180:0)}

function hint(){status.textContent=mode==='interior'?'CHASSIS EXPOSED · DRAG TO ROTATE':mode==='exterior'?'EXTERIOR · DRAG TO ROTATE':'MOVE TO REVEAL · DRAG TO ROTATE'}

function wake(){if(!frame&&active&&!document.hidden){lastTime=performance.now();frame=requestAnimationFrame(tick)}}

function trim(){const keep=new Set([shown,nextShown,Math.floor(wrap(position)),Math.ceil(wrap(position))%count]);for(const key of cache.keys()){if(cache.size<=cacheLimit)break;if(!keep.has(key))cache.delete(key)}}

function ensure(index){index=wrap(index);if(cache.has(index)||pending.has(index)||failed.has(index)||pending.size>=2)return;

 const promise=Promise.all(['exterior','interior'].map(async layer=>{const image=new Image();image.className='car-still';image.alt=layer==='exterior'?'Yellow LEGO Technic McLaren P1':'';image.width=960;image.height=600;image.decoding='async';image.draggable=false;image.src=`assets/studio/${layer}-${String(index).padStart(2,'0')}.webp`;await image.decode();return image}));

 pending.set(index,promise);promise.then(pair=>{pending.delete(index);cache.set(index,pair);trim();wake()}).catch(()=>{pending.delete(index);failed.add(index);loadError=true;setLoading(false);host.classList.add('load-error');retry.hidden=false;status.textContent='An angle could not load. Retry to continue.';wake()});

}

function display(){const phase=wrap(position),wanted=Math.floor(phase);let base=wanted,next=(base+1)%count,mix=phase-base;ensure(base);ensure(next);
 const exact=cache.has(base);if(!exact){if(!cache.size){if(!failed.has(base))setLoading(true);return}base=[...cache.keys()].sort((a,b)=>Math.abs(((a-phase+108)%72)-36)-Math.abs(((b-phase+108)%72)-36))[0];next=(base+1)%count;mix=0}
 const pair=cache.get(base),nextPair=cache.get(next);if(shown!==base||nextShown!==(nextPair?next:-1)){

  // Both layers switch as a pair; no mismatched cutaway while decoding.

  initial[0].remove();if(shown>=0)host.querySelectorAll(':scope > .car-still').forEach(img=>img.remove());

  pair[0].style.opacity='1';pair[1].style.opacity='1';host.insertBefore(pair[0],overlay);overlay.replaceChildren(pair[1]);

  if(nextPair){host.insertBefore(nextPair[0],overlay);overlay.append(nextPair[1]);}

  shown=base;nextShown=nextPair?next:-1;

 }

 if(nextPair){nextPair[0].style.opacity=String(mix);nextPair[1].style.opacity=String(mix)}

 ready=true;host.dataset.ready='true';setLoading(!exact&&!failed.has(wanted));if(!failed.has(wanted)){if(loadError){hint();loadError=false}host.classList.remove('load-error');retry.hidden=true}

 slider.value=String(phase);slider.setAttribute('aria-valuetext',`${Math.round(phase*5)} degrees`);

 if(pending.size===0){const direction=velocity<0||target<position?-1:1;ensure(wrap(base+direction*2))}trim();

}

function mask(){if(!maskDirty)return;maskDirty=false;let shape;

 if(mode==='interior')shape='none';else if(mode==='exterior'||!visible)shape='circle(0% at 50% 50%)';else{

  const w=host.clientWidth,h=host.clientHeight,r=Math.min(w*.22,h*.28,160),points=[];

  for(let i=0;i<48;i++){const a=i*Math.PI*2/48,phase=reduced.matches?0:x*2+y,radius=r*(1+.09*Math.sin(3*a+phase)+.055*Math.cos(5*a-phase));points.push(`${(x*w+Math.cos(a)*radius).toFixed(1)}px ${(y*h+Math.sin(a)*radius).toFixed(1)}px`)}shape=`polygon(${points.join(',')})`;

 }if(shape!==lastMask){overlay.style.clipPath=shape;lastMask=shape}

}

function tick(now){frame=0;if(!active||document.hidden)return;const dt=Math.min((now-lastTime)/1000,.04)||1/60;lastTime=now;

 if(!down&&!reduced.matches&&Math.abs(velocity)>.02){target+=velocity*dt;velocity*=Math.exp(-5.8*dt)}else if(!down)velocity=0;

 position+= (target-position)*(reduced.matches?1:1-Math.exp(-18*dt));if(Math.abs(target-position)<.001)position=target;

 if(!locked&&(Math.abs(tx-x)+Math.abs(ty-y)>.0002)){const ease=reduced.matches?1:1-Math.exp(-24*dt);x+=(tx-x)*ease;y+=(ty-y)*ease;maskDirty=true}

 display();mask();

 if(Math.abs(target-position)>.001||!down&&Math.abs(velocity)>.02||!locked&&(Math.abs(tx-x)+Math.abs(ty-y)>.0002))frame=requestAnimationFrame(tick);

}

function locate(e){if(locked||mode!=='explore')return;rect??=host.getBoundingClientRect();tx=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));ty=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));visible=true;maskDirty=true;wake()}

host.addEventListener('pointerenter',()=>{rect=host.getBoundingClientRect()});

host.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary)return;rect=host.getBoundingClientRect();velocity=0;target=position;down={x:e.clientX,y:e.clientY,target,pointer:e.pointerId,lastX:e.clientX,lastAt:performance.now(),dragged:false};locate(e)});

host.addEventListener('pointermove',e=>{if(down&&e.pointerId===down.pointer){const dx=e.clientX-down.x,dy=e.clientY-down.y;

 if(!down.dragged&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8&&e.pointerType==='touch'){down=null;velocity=0;return}

 if(Math.abs(dx)>5||down.dragged){down.dragged=true;host.classList.add('dragging');if(!host.hasPointerCapture(e.pointerId))host.setPointerCapture(e.pointerId);

 const now=performance.now(),dt=Math.max(.008,(now-down.lastAt)/1000),sensitivity=host.clientWidth<600?5:7;

 const sample=(e.clientX-down.lastX)/sensitivity/dt;velocity=velocity*.65+Math.max(-45,Math.min(45,sample))*.35;target=down.target+dx/sensitivity;down.lastX=e.clientX;down.lastAt=now;lastMotion=now;wake();}

 }if(e.pointerType!=='touch'||down)locate(e)});

function end(e){if(!down)return;if(e?.type==='pointercancel'||performance.now()-lastMotion>100||reduced.matches)velocity=0;down=null;host.classList.remove('dragging');wake()}

for(const event of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(event,end);

host.addEventListener('pointerleave',()=>{if(!locked&&!down){visible=false;maskDirty=true;wake()}});

function aim(value){velocity=0;target=position+((wrap(value)-wrap(position)+count*1.5)%count-count/2);wake()}

host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){aim(0);return}if(!e.shiftKey&&['ArrowLeft','ArrowRight'].includes(e.key)){velocity=0;target+=e.key==='ArrowRight'?1:-1;wake();return}if(mode!=='explore')setMode('explore');tx=Math.max(.05,Math.min(.95,tx+(e.key==='ArrowRight'?.04:e.key==='ArrowLeft'?-.04:0)));ty=Math.max(.05,Math.min(.95,ty+(e.key==='ArrowDown'?.04:e.key==='ArrowUp'?-.04:0)));visible=true;maskDirty=true;wake()});

function setMode(value){mode=value;locked=false;lock.setAttribute('aria-pressed','false');lock.textContent='LOCK REVEAL ↗';lock.disabled=value!=='explore';document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layer===value)));hint();maskDirty=true;wake()}

document.querySelectorAll('[data-layer]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.layer)));

lock.addEventListener('click',()=>{locked=!locked;visible=true;lock.setAttribute('aria-pressed',String(locked));lock.textContent=locked?'UNLOCK REVEAL ↗':'LOCK REVEAL ↗';maskDirty=true;wake()});

document.querySelector('#resetView').addEventListener('click',()=>{tx=ty=x=y=.5;visible=false;setMode('explore');aim(0)});

slider.addEventListener('input',()=>aim(Number(slider.value)));

retry.addEventListener('click',()=>{failed.clear();host.classList.remove('load-error');retry.hidden=true;wake()});

new ResizeObserver(()=>{rect=null;maskDirty=true;wake()}).observe(host);

window.addEventListener('scroll',()=>{rect=null},{passive:true});

function suspend(){cancelAnimationFrame(frame);frame=0;velocity=0;target=position;down=null;host.classList.remove('dragging');setLoading(false)}

document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else wake()});

reduced.addEventListener('change',()=>{velocity=0;wake()});

new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active){setLoading(!ready);wake()}else suspend()},{rootMargin:'100px'}).observe(host);

hint();

})();

