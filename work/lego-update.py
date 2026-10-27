from pathlib import Path
import re
p=Path('work/apex/dist')
s=(p/'experience.js').read_text(encoding='utf-8')
mask=s[s.index('const trail='):s.index('function addAssembly')]
head="""import * as THREE from 'three';
import {RoomEnvironment} from './assets/RoomEnvironment.js';
import {createLegoCar} from './lego-car.js';
const hero=document.querySelector('.hero'),host=document.querySelector('#carViewport'),status=document.querySelector('#driveStatus');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointer={x:0,y:0},smooth={x:0,y:0};let locked=false,dragging=false,pointerInside=false,orbit=0,lastX=0,active=true,lastTime=0;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100),pivot=new THREE.Group();scene.add(pivot);
"""
mask=mask.replace('let pointerInside=false,initializeTrail=true;', 'let initializeTrail=true;')
body="""
try {
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;host.append(renderer.domElement);
const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xdce6ff,0x27201a,2));const key=new THREE.DirectionalLight(0xffedcf,3.2);key.position.set(4,7,-3);scene.add(key);const rim=new THREE.DirectionalLight(0xa2c5ff,2);rim.position.set(-4,3,4);scene.add(rim);
const car=createLegoCar();pivot.add(car.root);car.shell.traverse(o=>{if(o.isMesh)addCutaway(o.material)});car.core.traverse(o=>{if(o.isMesh)addCutaway(o.material,true)});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);renderer.getDrawingBufferSize(revealUniforms.uRevealSize.value);camera.aspect=w/h;const mobile=innerWidth<700;camera.position.set(mobile?6:5.2,mobile?4.4:3.4,mobile?-8.5:-6.6);camera.lookAt(0,.6,0);camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host);resize();new IntersectionObserver(([e])=>active=e.isIntersecting).observe(hero);
hero.classList.add('car-loaded');host.dataset.ready='true';status.textContent='MOVE TO REVEAL THE BUILD · DRAG TO ROTATE';
function render(time=0){requestAnimationFrame(render);const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;if(!active||document.hidden)return;const ease=1-Math.exp(-dt*10);smooth.x+=(pointer.x-smooth.x)*ease;smooth.y+=(pointer.y-smooth.y)*ease;
 if(!locked){revealUniforms.uRevealStrength.value+=((pointerInside?1:0)-revealUniforms.uRevealStrength.value)*(1-Math.exp(-dt*12));if(pointerInside){if(initializeTrail){trail.forEach(p=>p.set(revealPoint.x,revealPoint.y,1));initializeTrail=false}const follow=1-Math.exp(-dt*24);trail[0].x+=(revealPoint.x-trail[0].x)*follow;trail[0].y+=(revealPoint.y-trail[0].y)*follow;for(let i=1;i<trail.length;i++){trail[i].x+=(trail[i-1].x-trail[i].x)*follow;trail[i].y+=(trail[i-1].y-trail[i].y)*follow}}}
 pivot.rotation.y=orbit+(reduce?0:smooth.x*.14);pivot.rotation.x=reduce?0:smooth.y*.025;renderer.render(scene,camera);
}render();
}catch(error){console.error(error);hero.classList.add('car-failed');status.textContent='3D preview unavailable in this browser.'}
function move(e){const r=host.getBoundingClientRect();pointerInside=true;if(!locked){revealPoint.set((e.clientX-r.left)/r.height,(r.bottom-e.clientY)/r.height);pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=(e.clientY-r.top)/r.height*2-1}if(dragging){orbit+=(e.clientX-lastX)*.008;lastX=e.clientX}}
host.addEventListener('pointermove',move);host.addEventListener('pointerleave',()=>{pointerInside=false;initializeTrail=true;pointer.x=pointer.y=0});
host.addEventListener('pointerdown',e=>{move(e);dragging=true;lastX=e.clientX;host.setPointerCapture(e.pointerId)});const end=e=>{dragging=false;if(e.pointerType==='touch')pointerInside=false};host.addEventListener('pointerup',end);host.addEventListener('pointercancel',end);
host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();orbit+=e.key==='ArrowRight'?.25:-.25}else if(e.key==='Home'){orbit=0;pointer.x=pointer.y=0}});
document.querySelector('#lockView').onclick=e=>{locked=!locked;e.currentTarget.setAttribute('aria-pressed',locked);e.currentTarget.textContent=locked?'UNLOCK REVEAL ↗':'LOCK REVEAL ↗'};
document.querySelector('#resetView').onclick=()=>{orbit=0;pointer.x=pointer.y=0;locked=false;document.querySelector('#lockView').setAttribute('aria-pressed','false');document.querySelector('#lockView').textContent='LOCK REVEAL ↗';revealUniforms.uRevealStrength.value=0;pointerInside=false};
"""
(p/'experience.js').write_text(head+mask+body,encoding='utf-8')
h=(p/'index.html').read_text(encoding='utf-8')
a=h.index('<div class="paint-controls"');b=h.index('<div class="hero-foot"')
h=h[:a]+'''<div class="hero-hint"><span class="model-label">McLAREN P1 / TECHNIC STUDY</span><p id="driveStatus" aria-live="polite">PREPARING THE BUILD</p><div class="reveal-actions"><button id="lockView" aria-pressed="false">LOCK REVEAL ↗</button><button id="resetView">RESET VIEW ↺</button></div></div>'''+h[b:]
h=h.replace('Interactive Ferrari 458. Move your cursor to explore, drag to rotate, or use left and right arrow keys.','Interactive Technic-inspired McLaren P1. Move to reveal the chassis, drag to rotate, or use the arrow keys.').replace('PREPARING YOUR DRIVE...','ASSEMBLING THE DETAILS...')
h=re.sub(r'<p class="model-credit">.*?</p>','<p class="model-credit">Custom interactive study inspired by the <a href="https://www.lego.com/en-ca/product/mclaren-p1-42172" target="_blank" rel="noopener">LEGO® Technic McLaren P1™</a>. Simplified procedural geometry, not an official LEGO digital model.</p>',h)
h=h.replace('<link rel="stylesheet" href="portfolio.css">','<link rel="stylesheet" href="portfolio.css"><link rel="stylesheet" href="dark.css">')
(p/'index.html').write_text(h,encoding='utf-8')
