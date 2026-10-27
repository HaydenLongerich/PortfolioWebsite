import * as T from './assets/three.module.js';
import {createBurnoutSmoke} from './burnout-smoke.js?v=burnout14';
import {createLegoCar} from './lego-car.js?v=realtime5';
const host=document.querySelector('#carViewport'),hero=host.closest('.hero'),status=document.querySelector('#driveStatus'),lock=document.querySelector('#lockView'),retry=host.querySelector('.car-retry');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,car,ready=false,active=true,frame=0,last=0,rect,down=null,velocity=0,orbit=Math.PI,target=Math.PI,pitch=0,targetPitch=0,inside=false,locked=false,frozen=false,savedReveal=null,mode='explore',dirty=true;
let dpr=Math.min(devicePixelRatio,1.25),average=16.67,samples=0,cooldown=0,px=.5,py=.5,sx=.5,sy=.5;
const scene=new T.Scene(),pivot=new T.Group(),camera=new T.PerspectiveCamera(30,1,.1,100);scene.add(pivot);
const smoke=createBurnoutSmoke(scene);
const uniforms={uPoint:{value:new T.Vector2(.5,.5)},uSize:{value:new T.Vector2(1,1)},uTail:{value:new T.Vector2(.5,.5)},uFlow:{value:0},uStrength:{value:0}};
function mask(material){material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,uniforms);shader.fragmentShader='uniform vec2 uPoint;uniform vec2 uTail;uniform vec2 uSize;uniform float uStrength;uniform float uFlow;float revealEdge=1.;\n'+shader.fragmentShader;
shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
if(uStrength>.001){vec2 p=gl_FragCoord.xy/uSize.y;vec2 d=p-uPoint;float a=atan(d.y,d.x);float radius=.17*uStrength*(1.+.10*sin(a*3.+uFlow)+.05*cos(a*5.-uFlow));float head=length(d)-radius;float tail=length(p-uTail)-radius*.72;float h=clamp(.5+.5*(tail-head)/.06,0.,1.);revealEdge=mix(tail,head,h)-.06*h*(1.-h);if(revealEdge<0.)discard;}`);
shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`#include <opaque_fragment>
if(uStrength>.01){float rim=1.-smoothstep(.001,.009,revealEdge);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.82,1.,0.),rim*.48);}`);
};material.customProgramCacheKey=()=> 'fluid-reveal-6';}
let entranceSeen=false,entranceVisible=false,entranceTime=0,entranceRunning=false,restY=0;
const driveDirection=new T.Vector3();
function finishEntrance(){if(!entranceRunning)return;entranceRunning=false;pivot.position.set(0,restY,0);pivot.scale.setScalar(1);pivot.rotation.set(pitch,orbit,0);uniforms.uStrength.value=0;hero.classList.remove('drive-in');wake()}
function enterStudio(){if(!ready||!entranceVisible||entranceSeen)return;entranceSeen=true;if(reduced.matches)return;
 entranceTime=0;entranceRunning=true;restY=pivot.position.y;driveEntrance(0);hero.classList.add('drive-in');wake();
}
function driveEntrance(dt){entranceTime=Math.min(1.5,entranceTime+dt);const t=entranceTime/1.5;
 const arrival=1-Math.pow(1-Math.min(1,t/.72),3),turn=Math.max(0,Math.min(1,(t-.32)/.68)),settle=turn*turn*(3-2*turn);
 driveDirection.set(1,0,0).applyQuaternion(camera.quaternion);pivot.position.copy(driveDirection).multiplyScalar(-9*(1-arrival));pivot.position.y+=restY;
 pivot.scale.setScalar(.72+.28*arrival);pivot.rotation.set(pitch,orbit+.95*(1-settle),-.035*Math.sin(t*Math.PI));
 // A brief mechanical cutaway resolves into the fully interactive bodywork.
 const reveal=Math.max(0,Math.sin(Math.PI*Math.max(0,Math.min(1,(t-.50)/.45))));uniforms.uStrength.value=reveal*.9;uniforms.uPoint.value.set((.25+.5*settle)*camera.aspect,.51);uniforms.uTail.value.copy(uniforms.uPoint.value);
 if(t>=1)finishEntrance();
}
new IntersectionObserver(([e])=>{entranceVisible=e.isIntersecting;if(entranceVisible)enterStudio()},{threshold:.45}).observe(host);
host.addEventListener('pointerdown',e=>{if(e.button===0)finishEntrance()});host.addEventListener('keydown',finishEntrance);
document.querySelectorAll('.hero-hint button,.hero-hint input').forEach(el=>el.addEventListener('pointerdown',finishEntrance));
function hint(){if(mode==='explore'&&(locked||frozen)){status.textContent=locked?'REVEAL LOCKED · CLICK CAR TO RESUME':'REVEAL FROZEN · LOCK TO KEEP · CLICK CAR TO RESUME';return}status.textContent=mode==='interior'?'CHASSIS EXPOSED · DRAG TO ROTATE':mode==='exterior'?'EXTERIOR · DRAG TO ROTATE':'MOVE TO REVEAL · RIGHT-CLICK TO FREEZE · DRAG TO ROTATE'}
function wake(){dirty=true;if(ready&&active&&!document.hidden&&!frame){last=performance.now();frame=requestAnimationFrame(tick)}}
function resize(){if(!renderer)return;const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setPixelRatio(Math.min(dpr,Math.sqrt(1000000/(w*h))));renderer.setSize(w,h);renderer.getDrawingBufferSize(uniforms.uSize.value);camera.aspect=w/h;const distance=Math.max(1,1.35/camera.aspect);camera.position.set(5*distance,3.5*distance,-6*distance);camera.lookAt(0,.7,0);camera.updateProjectionMatrix();rect=null;wake()}
function tick(time){frame=0;if(!active||document.hidden||!ready)return;if(!entranceSeen&&!reduced.matches)return;if(reduced.matches&&!entranceSeen)entranceSeen=true;const elapsed=time-last,dt=Math.min(elapsed/1000,.04)||1/60;last=time;
 if(!down&&!reduced.matches&&Math.abs(velocity)>.001){target+=velocity*dt;velocity*=Math.exp(-5.8*dt)}else if(!down)velocity=0;
 const ease=reduced.matches?1:1-Math.exp(-18*dt);orbit+=(target-orbit)*ease;pitch+=(targetPitch-pitch)*ease;
 const holding=mode==='explore'&&(locked||frozen),desired=holding?uniforms.uStrength.value:mode==='explore'&&inside?1:0;
 if(!holding){sx+=(px-sx)*ease;sy+=(py-sy)*ease;uniforms.uStrength.value+=(desired-uniforms.uStrength.value)*ease;uniforms.uPoint.value.set(sx*camera.aspect,1-sy);uniforms.uTail.value.lerp(uniforms.uPoint.value,reduced.matches?1:1-Math.exp(-10*dt));uniforms.uFlow.value=sx*3+sy*2;if(mode==='explore'&&inside&&uniforms.uStrength.value>.01)savedReveal=captureReveal()}
 pivot.rotation.set(pitch,orbit,0);
 const moving=Math.abs(target-orbit)+Math.abs(targetPitch-pitch)+Math.abs(desired-uniforms.uStrength.value)+(holding?0:Math.abs(px-sx)+Math.abs(py-sy)+uniforms.uTail.value.distanceTo(uniforms.uPoint.value))>.001||!down&&Math.abs(velocity)>.001;
 if(entranceRunning)driveEntrance(dt);const smokeActive=smoke.update(dt,pivot,entranceRunning&&entranceTime<1.15&&!reduced.matches,restY,renderer.domElement.height);renderer.render(scene,camera);if(renderer.domElement.style.visibility!=='visible')renderer.domElement.style.visibility='visible';dirty=false;
 // Sample only consecutive active frames; idle gaps must not trigger quality drops.
 if(elapsed>3&&elapsed<80){average=average*.94+elapsed*.06;samples++;if(samples>=45&&time>cooldown){let next=dpr;if(average>19.5)next=Math.max(.65,dpr-.15);else if(average<15.5&&samples>180)next=Math.min(1.25,devicePixelRatio,dpr+.05);if(next!==dpr){dpr=next;cooldown=time+2000;samples=0;resize()}host.dataset.frameMs=average.toFixed(1);host.dataset.triangles=String(renderer.info.render.triangles);host.dataset.drawCalls=String(renderer.info.render.calls)}}
 if((moving||dirty||entranceRunning||smokeActive)&&!frame)frame=requestAnimationFrame(tick);
}
function locate(e){if(locked||frozen)return;rect??=host.getBoundingClientRect();px=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));py=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));if(!inside)uniforms.uTail.value.set(px*camera.aspect,1-py);inside=true;wake()}
host.addEventListener('pointerenter',()=>rect=host.getBoundingClientRect());
host.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary)return;rect=host.getBoundingClientRect();velocity=0;down={x:e.clientX,y:e.clientY,target,pitch:targetPitch,lastX:e.clientX,time:performance.now(),id:e.pointerId,drag:false};locate(e)});
host.addEventListener('pointermove',e=>{if(down&&e.pointerId===down.id){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(!down.drag&&e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){down=null;return}if(Math.abs(dx)>5||(e.pointerType!=='touch'&&Math.abs(dy)>5)||down.drag){down.drag=true;host.classList.add('dragging');if(!host.hasPointerCapture(e.pointerId))host.setPointerCapture(e.pointerId);const now=performance.now(),dt=Math.max(.008,(now-down.time)/1000);velocity=.65*velocity+.35*Math.max(-3,Math.min(3,(e.clientX-down.lastX)*.008/dt));target=down.target+dx*.008;if(e.pointerType!=='touch')targetPitch=down.pitch+dy*.008;down.lastX=e.clientX;down.time=now;wake()}}if(e.pointerType!=='touch'||down)locate(e)});
function end(e){if(!down)return;if(e.type==='pointerup'&&!down.drag&&(locked||frozen))resumeReveal(e);if(e.type==='pointercancel'||performance.now()-down.time>100||reduced.matches)velocity=0;down=null;host.classList.remove('dragging');wake()}
for(const type of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(type,end);
host.addEventListener('pointerleave',()=>{if(!down){inside=false;wake()}});
function setMode(value){mode=value;locked=false;frozen=false;lock.disabled=mode!=='explore';lock.setAttribute('aria-pressed','false');lock.textContent='LOCK REVEAL';if(car)car.shell.visible=mode!=='interior';document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layer===mode)));hint();wake()}
document.querySelectorAll('[data-layer]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.layer)));
function captureReveal(){return {x:uniforms.uPoint.value.x,y:uniforms.uPoint.value.y,tx:uniforms.uTail.value.x,ty:uniforms.uTail.value.y,strength:uniforms.uStrength.value,flow:uniforms.uFlow.value}}
function holdReveal(permanent){const snapshot=(frozen||locked||inside)?captureReveal():savedReveal||captureReveal();if(entranceRunning)finishEntrance();uniforms.uPoint.value.set(snapshot.x,snapshot.y);uniforms.uTail.value.set(snapshot.tx,snapshot.ty);uniforms.uStrength.value=snapshot.strength>.01?snapshot.strength:1;uniforms.uFlow.value=snapshot.flow;px=sx=snapshot.x/camera.aspect;py=sy=1-snapshot.y;savedReveal=captureReveal();locked=permanent;frozen=!permanent;lock.setAttribute('aria-pressed',String(locked));lock.textContent=locked?'UNLOCK REVEAL':'LOCK REVEAL';hint();wake()}
function resumeReveal(e){locked=false;frozen=false;lock.setAttribute('aria-pressed','false');lock.textContent='LOCK REVEAL';if(e){rect=host.getBoundingClientRect();locate(e)}hint();wake()}
host.addEventListener('contextmenu',e=>{e.preventDefault();if(!ready||mode!=='explore')return;if(locked||frozen)resumeReveal(e);else holdReveal(false)});
lock.onclick=()=>{if(locked)resumeReveal();else holdReveal(true)};
document.querySelector('#resetView').onclick=()=>{target=Math.PI;targetPitch=0;velocity=0;inside=false;savedReveal=null;setMode('explore')};

host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();velocity=0;if(e.key==='Home'){target=Math.PI;targetPitch=0}else if(e.key==='ArrowLeft')target-=.12;else if(e.key==='ArrowRight')target+=.12;else targetPitch+=(e.key==='ArrowUp'?-.12:.12);wake()});

function suspend(){cancelAnimationFrame(frame);frame=0;velocity=0;down=null;host.classList.remove('dragging')}
new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active)wake();else suspend()}).observe(host);
document.addEventListener('visibilitychange',()=>document.hidden?suspend():wake());window.addEventListener('scroll',()=>rect=null,{passive:true});new ResizeObserver(resize).observe(host);reduced.addEventListener('change',()=>{velocity=0;if(reduced.matches){finishEntrance();smoke.clear()}wake()});
async function start(){host.classList.add('is-loading');host.setAttribute('aria-busy','true');retry.hidden=true;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setClearColor(0,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.shadowMap.enabled=false;renderer.domElement.style.visibility='hidden';host.append(renderer.domElement);
 scene.add(new T.HemisphereLight(0xdce6ff,0x27201a,1.5));const key=new T.DirectionalLight(0xffedcf,2.1);key.position.set(4,7,-3);scene.add(key);const rim=new T.DirectionalLight(0xa2c5ff,1.3);rim.position.set(-4,3,4);scene.add(rim);
 car=await createLegoCar();pivot.add(car.root);const centerY=new T.Box3().setFromObject(car.root).getCenter(new T.Vector3()).y;car.root.position.y-=centerY;pivot.position.y=centerY;car.shell.traverse(o=>{if(o.isMesh)mask(o.material)});resize();smoke.points.visible=true;if(renderer.compileAsync)await renderer.compileAsync(scene,camera);smoke.points.visible=false;ready=true;hero.classList.add('car-loaded');host.dataset.ready='true';host.classList.remove('is-loading');host.setAttribute('aria-busy','false');setMode(mode);wake();enterStudio();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;suspend();status.textContent='Graphics context interrupted. Retry to reload.';retry.hidden=false});
 }catch(error){console.error(error);renderer?.dispose();renderer?.domElement.remove();host.classList.remove('is-loading');host.setAttribute('aria-busy','false');status.textContent='3D preview could not load. Retry to continue.';retry.hidden=false}}
retry.onclick=()=>location.reload();const loaderObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){loaderObserver.disconnect();start()}},{rootMargin:'250px'});loaderObserver.observe(host);
