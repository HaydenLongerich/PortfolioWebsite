import * as THREE from 'three';
import {GLTFLoader} from './assets/GLTFLoader.js';
import {DRACOLoader} from './assets/DRACOLoader.js';
import {RoomEnvironment} from './assets/RoomEnvironment.js';
import {createInternals} from './internals.js';

const hero=document.querySelector('.hero'), host=document.querySelector('#carViewport');
const status=document.querySelector('#driveStatus'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointer={x:0,y:0}, smooth={x:0,y:0};
let renderer, model, bodyMaterial, active=true, locked=false, dragging=false, moved=false, lastX=0, orbit=0, mode='drive', explode=0, frame=0;
const pieces=[]; let guides; const labelItems=[]; let lastTime=0;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(5.4,2.5,-6.4);camera.lookAt(0,.65,0);
const pivot=new THREE.Group();scene.add(pivot);
const trail=Array.from({length:6},()=>new THREE.Vector3(-10,-10,0));
const revealPoint=new THREE.Vector2();let pointerInside=false,initializeTrail=true;
const revealUniforms={uRevealTrail:{value:trail},uRevealSize:{value:new THREE.Vector2(1,1)},uRevealStrength:{value:0},uAssembly:{value:0}};
const maskShader=`uniform vec3 uRevealTrail[6]; uniform vec2 uRevealSize; uniform float uRevealStrength; uniform float uAssembly;
 float smoothUnion(float a,float b){float h=clamp(.5+.5*(b-a)/.055,0.0,1.0);return mix(b,a,h)-.055*h*(1.0-h);}
 float cutaway(vec2 point){
 float distanceToEdge=10.0;
 for(int i=0;i<6;i++){
 vec2 delta=point-uRevealTrail[i].xy;
 float angle=atan(delta.y,delta.x);
 float radius=(.125-float(i)*.011)*uRevealStrength;
 radius*=1.0+.10*sin(angle*3.0)+.045*cos(angle*5.0);
 distanceToEdge=smoothUnion(distanceToEdge,length(delta)-radius);
 }
 return distanceToEdge;
 }
 `;
function addCutaway(material,internal=false){
 material.onBeforeCompile=shader=>{
 Object.assign(shader.uniforms,revealUniforms);shader.fragmentShader=maskShader+shader.fragmentShader;
 const condition=internal?'if(uAssembly<.5 && (uRevealStrength<.005 || cutaway(gl_FragCoord.xy/uRevealSize.y)>0.0)) discard;':'if(uAssembly<.5 && uRevealStrength>.005 && cutaway(gl_FragCoord.xy/uRevealSize.y)<0.0) discard;';
 shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n'+condition);
 };
 material.customProgramCacheKey=()=>internal?'cutaway-internal-v2':'cutaway-shell-v2';
}
function addAssembly(object,offset,start,end,label){
 const origin=object.position.clone();pieces.push({object,origin,offset,start,end});
 if(label){const el=document.createElement('span');el.className='assembly-label';el.textContent=label;host.append(el);labelItems.push({object,el})}
}
function groupParts(names,label,offset,start,end){
 const group=new THREE.Group();group.name=label;model.add(group);model.updateMatrixWorld(true);
 names.forEach(name=>{const object=model.getObjectByName(name);if(object)group.attach(object)});
 addAssembly(group,offset,start,end,label);return group;
}
try{
renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;host.append(renderer.domElement);
const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xffffff,0x575f45,2));
const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,5,4);scene.add(key);
const draco=new DRACOLoader();draco.setDecoderPath('./assets/');
new GLTFLoader().setDRACOLoader(draco).load('./assets/ferrari.glb',gltf=>{
 model=gltf.scene.children[0];pivot.add(model);pivot.scale.setScalar(1.13);
 bodyMaterial=new THREE.MeshPhysicalMaterial({color:'#c8d2b0',metalness:.85,roughness:.25,clearcoat:1,clearcoatRoughness:.08});
 model.getObjectByName('body').material=bodyMaterial;addCutaway(bodyMaterial);
 const interior=new THREE.MeshStandardMaterial({color:0x242a27,roughness:.84,metalness:.05});
 const metal=new THREE.MeshStandardMaterial({color:0x68716e,roughness:.32,metalness:.85});
 const carbon=new THREE.MeshStandardMaterial({color:0x30372f,roughness:.45,metalness:.35});
 const assign=(names,material)=>names.forEach(name=>model.getObjectByName(name)?.traverse(o=>{if(o.isMesh)o.material=material}));
 assign(['leather','carpet','interior_dark','interior_light','steering_leather','steering_centre'],interior);
 assign(['metal','brakes','steering_metal','steering_column'],metal);
 assign(['carbon_fibre_trim','carbon fibre','steering_carbon','blue'],carbon);
 const details=new THREE.MeshStandardMaterial({color:0x363a36,metalness:1,roughness:.3});
 ['rim_fl','rim_fr','rim_rl','rim_rr','trim'].forEach(n=>{const part=model.getObjectByName(n);if(part)part.material=details});
 model.getObjectByName('glass').material=new THREE.MeshPhysicalMaterial({color:0x23323b,metalness:.4,roughness:.06,transparent:true,opacity:.82});
 model.updateMatrixWorld(true);
 const shell=groupParts(['body','trim','lights_red','lights','leds','grills','chrome','yellow_trim','plastic_gray'], 'BODY + AERO',new THREE.Vector3(0,.75,0),.2,.85);
 const glazing=groupParts(['glass','wipers'],'GLASS',new THREE.Vector3(0,1.25,0),.4,1);
 const cutMaterials=new Set();
 [shell,glazing].forEach(group=>group.traverse(object=>{if(object.isMesh){
  object.material=Array.isArray(object.material)?object.material.map(m=>m.clone()):object.material.clone();
  (Array.isArray(object.material)?object.material:[object.material]).forEach(m=>{addCutaway(m);cutMaterials.add(m)});
  if(object.name==='body')bodyMaterial=object.material;
 }}));
 // Remove the stock model's solid engine-bay fillers in the same cutaway.
 ['interior_dark','interior_light','carbon_fibre_trim','carbon fibre','metal','brakes','blue'].forEach(name=>model.getObjectByName(name)?.traverse(object=>{if(object.isMesh){
  object.material=Array.isArray(object.material)?object.material.map(m=>m.clone()):object.material.clone();
  (Array.isArray(object.material)?object.material:[object.material]).forEach(m=>addCutaway(m));
 }}));
 const machinery=createInternals();model.add(machinery);
 const insideMaterials=new Set();machinery.traverse(object=>{if(object.isMesh)insideMaterials.add(object.material)});insideMaterials.forEach(m=>addCutaway(m,true));
 ['wheel_fl','wheel_fr','wheel_rl','wheel_rr'].forEach((name,i)=>{
 const wheel=model.getObjectByName(name);if(wheel)addAssembly(wheel,new THREE.Vector3(wheel.position.x<0?-.8:.8,0,0),0,.65,i===1?'WHEEL ASSEMBLY':null);
 });
 const guideGeometry=new THREE.BufferGeometry();const linePoints=[];
 pieces.forEach(p=>{linePoints.push(p.origin.x,p.origin.y,p.origin.z,p.origin.x+p.offset.x,p.origin.y+p.offset.y,p.origin.z+p.offset.z)});
 guideGeometry.setAttribute('position',new THREE.Float32BufferAttribute(linePoints,3));
 guides=new THREE.LineSegments(guideGeometry,new THREE.LineDashedMaterial({color:0x7a8661,transparent:true,opacity:0,dashSize:.045,gapSize:.04}));guides.computeLineDistances();model.add(guides);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(2.62,5.2),new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./assets/ferrari_ao.png'),transparent:true,opacity:.7,depthWrite:false,blending:THREE.MultiplyBlending,toneMapped:false,premultipliedAlpha:true}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;scene.add(shadow);
 hero.classList.add('car-loaded');status.textContent='MOVE TO REVEAL PARTS · DRAG TO ORBIT';host.dataset.ready='true';
 draco.dispose();
},undefined,()=>{status.textContent='3D unavailable — explore the photo collection below.';hero.classList.add('car-failed')});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);renderer.getDrawingBufferSize(revealUniforms.uRevealSize.value);camera.aspect=w/h;camera.position.set(w<600?6.7:5.4,w<600?3.5:2.5,w<600?-9.5:-6.4);camera.lookAt(0,.65,0);camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host);resize();
new IntersectionObserver(([entry])=>{active=entry.isIntersecting},{threshold:0}).observe(hero);
function render(time=0){frame=requestAnimationFrame(render);const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;if(!active||document.hidden)return;const ease=1-Math.exp(-dt*9);smooth.x+=(pointer.x-smooth.x)*ease;smooth.y+=(pointer.y-smooth.y)*ease;
 explode+=((mode==='exploded'?1:0)-explode)*(reduce?1:ease);
 if(!locked){
  const target=pointerInside&&mode!=='exploded'?1:0;
  revealUniforms.uRevealStrength.value+=(target-revealUniforms.uRevealStrength.value)*(1-Math.exp(-dt*12));
  if(pointerInside){
   if(initializeTrail){trail.forEach(p=>p.set(revealPoint.x,revealPoint.y,1));initializeTrail=false;}
   const follow=1-Math.exp(-dt*24);
   trail[0].x+=(revealPoint.x-trail[0].x)*follow;trail[0].y+=(revealPoint.y-trail[0].y)*follow;
   for(let i=1;i<trail.length;i++){trail[i].x+=(trail[i-1].x-trail[i].x)*follow;trail[i].y+=(trail[i-1].y-trail[i].y)*follow;}
  }
 }
 revealUniforms.uAssembly.value=explode>.01?1:0;
 if(model){
 pivot.rotation.y=orbit+(reduce?0:smooth.x*.28);pivot.rotation.x=reduce?0:smooth.y*.04;
 pivot.scale.setScalar(1.13-explode*.2);
 pieces.forEach(p=>{let progress=THREE.MathUtils.clamp((explode-p.start)/(p.end-p.start),0,1);progress=progress*progress*(3-2*progress);p.object.position.copy(p.origin).addScaledVector(p.offset,progress)});
 guides.material.opacity=explode*.4;
 pivot.updateMatrixWorld(true);
 labelItems.forEach(({object,el})=>{const point=new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());point.y+=.22;point.project(camera);el.style.left=`${(point.x*.5+.5)*host.clientWidth}px`;el.style.top=`${(-point.y*.5+.5)*host.clientHeight}px`;el.style.opacity=explode>.8?'1':'0'});
 }
 renderer.render(scene,camera);
}render();
}catch(e){hero.classList.add('car-failed');status.textContent='Explore the photo collection below.'}

function move(e){const r=host.getBoundingClientRect();pointerInside=true;if(!locked){revealPoint.set((e.clientX-r.left)/r.height,(r.bottom-e.clientY)/r.height);pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=(e.clientY-r.top)/r.height*2-1;hero.style.setProperty('--mx',`${pointer.x*18}px`);hero.style.setProperty('--my',`${pointer.y*12}px`)}if(dragging){orbit+=(e.clientX-lastX)*.008;moved=true;lastX=e.clientX}document.querySelector('#orbitReadout').textContent=`${Math.round(orbit*180/Math.PI)%360}°`}
host.addEventListener('pointermove',move);host.addEventListener('pointerleave',()=>{pointerInside=false;initializeTrail=true;if(!locked){pointer.x=pointer.y=0} });
host.addEventListener('pointerdown',e=>{move(e);dragging=true;moved=false;lastX=e.clientX;host.setPointerCapture(e.pointerId);host.classList.add('dragging')});
function end(e){if(e?.pointerType==='touch')pointerInside=false;dragging=false;host.classList.remove('dragging')}
host.addEventListener('pointerup',end);host.addEventListener('pointercancel',end);
host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();orbit+=e.key==='ArrowRight'?.25:-.25;document.querySelector('#orbitReadout').textContent=`${Math.round(orbit*180/Math.PI)%360}°`}else if(e.key==='Home'){orbit=0;pointer.x=pointer.y=0}});
document.querySelector('#lockView').onclick=e=>{locked=!locked;e.currentTarget.setAttribute('aria-pressed',locked);e.currentTarget.textContent=locked?'UNLOCK VIEW ↗':'LOCK VIEW ↗';status.textContent=locked?'VIEW LOCKED · DRAG TO ORBIT':'MOVE TO REVEAL PARTS · DRAG TO ORBIT'};
document.querySelectorAll('[data-paint]').forEach(b=>b.onclick=()=>{bodyMaterial?.color.set(b.dataset.paint);document.querySelectorAll('[data-paint]').forEach(n=>n.setAttribute('aria-pressed',n===b));document.querySelector('#paintName').textContent=b.getAttribute('aria-label')});
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{mode=b.dataset.view;hero.classList.toggle('is-exploded',mode==='exploded');document.querySelectorAll('[data-view]').forEach(n=>n.setAttribute('aria-pressed',n===b));hero.classList.toggle('night',mode==='night');if(renderer)renderer.toneMappingExposure=mode==='night'?.8:1.3;status.textContent={drive:'MOVE TO REVEAL PARTS · DRAG TO ORBIT',exploded:'ASSEMBLY VIEW · DRAG TO EXPLORE',night:'AFTER HOURS · DRAG TO ORBIT'}[mode]});
const cursor=document.createElement('div');cursor.className='drive-cursor';cursor.innerHTML='<span>EXPLORE</span>';document.body.append(cursor);
if(!reduce&&matchMedia('(pointer:fine)').matches){document.addEventListener('pointermove',e=>{cursor.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`;cursor.classList.toggle('visible',!!e.target.closest('#carViewport,.image-button,.split-card'));cursor.querySelector('span').textContent=e.target.closest('#carViewport')?(dragging?'ORBIT':'EXPLORE'):'VIEW ↗'});
 document.querySelectorAll('.split-card,.image-button').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1100px) rotateX(${-y*5}deg) rotateY(${x*6}deg)`;card.style.setProperty('--shine',`${(x+.5)*100}%`)});card.addEventListener('pointerleave',()=>card.style.transform='')});
 document.querySelectorAll('.round,.car-controls button,.save,.pill').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.25}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
 const sections=[...document.querySelectorAll('.intro h2,.intro-foot,.section-title,.track h2,.track-grid,.event,.club h2')];sections.forEach(e=>e.classList.add('motion-reveal'));new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('revealed')}),{threshold:.13}).observe(document.querySelector('.intro h2'));
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('revealed')}),{threshold:.13});sections.forEach(e=>observer.observe(e));
 let ticking=false;window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const progress=Math.min(1,scrollY/hero.offsetHeight);hero.style.setProperty('--scroll',progress);document.querySelector('.hero-word').style.transform=`translate3d(${progress*-90}px,${progress*130}px,0)`;document.querySelector('.signature').style.transform=`rotate(${-8+progress*12}deg)`;ticking=false})},{passive:true});
}
