from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8');s=s.replace("import {RoomEnvironment} from './assets/RoomEnvironment.js';", "import {RoomEnvironment} from './assets/RoomEnvironment.js';\nimport {createInternals} from './internals.js';")
a=s.index('const trail=');b=s.index('function addAssembly',a)
s=s[:a]+'''const trail=Array.from({length:6},()=>new THREE.Vector3(-10,-10,0));
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
 shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\\n'+condition);
 };
 material.customProgramCacheKey=()=>internal?'cutaway-internal-v2':'cutaway-shell-v2';
}
''' +s[b:]
s=s.replace('addSurfaceReveal(bodyMaterial)','addCutaway(bodyMaterial)')
s=s.replace(" groupParts(['body','trim','lights_red','lights','leds','grills','chrome','yellow_trim','plastic_gray'],", " const shell=groupParts(['body','trim','lights_red','lights','leds','grills','chrome','yellow_trim','plastic_gray'],")
s=s.replace(" groupParts(['glass','wipers'],'GLASS'", " const glazing=groupParts(['glass','wipers'],'GLASS'")
needle=" ['wheel_fl','wheel_fr','wheel_rl','wheel_rr'].forEach((name,i)=>{"
insert=''' const cutMaterials=new Set();
 [shell,glazing].forEach(group=>group.traverse(object=>{if(object.isMesh){
  object.material=Array.isArray(object.material)?object.material.map(m=>m.clone()):object.material.clone();
  (Array.isArray(object.material)?object.material:[object.material]).forEach(m=>{addCutaway(m);cutMaterials.add(m)});
  if(object.name==='body')bodyMaterial=object.material;
 }}));
 const machinery=createInternals();model.add(machinery);
 const insideMaterials=new Set();machinery.traverse(object=>{if(object.isMesh)insideMaterials.add(object.material)});insideMaterials.forEach(m=>addCutaway(m,true));
'''
s=s.replace(needle,insert+needle)
a=s.index(' if(!locked){\n if(!reduce)');b=s.index(' if(model){',a)
s=s[:a]+''' if(!locked){
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
''' +s[b:]
s=s.replace('pointerInside=false;if(!locked){','pointerInside=false;initializeTrail=true;if(!locked){')
s=s.replace('MOVE TO REVEAL · DRAG TO ORBIT','MOVE TO REVEAL PARTS · DRAG TO ORBIT')
p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/index.html');s=p.read_text(encoding='utf-8');s=s.replace('Interactive materials and presentation adapted for APEX.','Interactive presentation adapted for APEX. Engine, cooling and suspension geometry are illustrative, not manufacturer CAD.');p.write_text(s,encoding='utf-8')
