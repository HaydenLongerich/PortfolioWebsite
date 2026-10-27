from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8')
s=s.replace('let floorSwirl, guides; const swirlPointer=new THREE.Vector2();','let guides;')
a=s.index('const swirlUniforms=');b=s.index('function addAssembly',a)
s=s[:a]+'''const trail=Array.from({length:12},()=>new THREE.Vector3(-10,-10,0));
const revealPoint=new THREE.Vector2();let pointerInside=false,trailTimer=0;
const revealUniforms={uRevealTime:{value:0},uRevealTrail:{value:trail},uRevealSize:{value:new THREE.Vector2(1,1)},uRevealStrength:{value:1}};
function addSurfaceReveal(material){
 material.onBeforeCompile=shader=>{
 Object.assign(shader.uniforms,revealUniforms);
 shader.vertexShader='varying vec3 vRevealPosition;\\n'+shader.vertexShader;
 shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\\n vRevealPosition=position;');
 shader.fragmentShader=`uniform float uRevealTime; uniform vec3 uRevealTrail[12]; uniform vec2 uRevealSize; uniform float uRevealStrength; varying vec3 vRevealPosition;
 float liquidMask(vec2 point){
 float field=0.0;
 for(int i=0;i<12;i++){
 vec3 samplePoint=uRevealTrail[i];
 vec2 delta=point-samplePoint.xy;
 float a=atan(delta.y,delta.x);
 float age=1.0-samplePoint.z;
 float radius=(i==0?.105:.063)*samplePoint.z;
 radius*=1.0+.24*sin(a*3.0+uRevealTime*1.6+age*4.0)+.1*sin(a*5.0-uRevealTime);
 delta+=vec2(sin(age*8.0+uRevealTime),cos(age*7.0-uRevealTime))*.022*age;
 field+=radius*radius/(dot(delta,delta)+.00008);
 }
 return smoothstep(.9,1.1,field)*uRevealStrength;
 }
 `+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float reveal=liquidMask(gl_FragCoord.xy/uRevealSize.y);
 vec3 p=vRevealPosition;
 float flow=sin(p.x*5.5+p.z*3.0+sin(p.y*6.0+p.x*2.5)*1.4);
 float stripe=smoothstep(.28,.42,flow);
 vec3 revealedPaint=mix(vec3(.018,.026,.013),vec3(.72,.94,.015),stripe);
 diffuseColor.rgb=mix(diffuseColor.rgb,revealedPaint,reveal);
 `);
 shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\\n roughnessFactor=mix(roughnessFactor,.2,reveal);');
 };
}
''' +s[b:]
s=s.replace('makeSwirl();\n','').replace("model.getObjectByName('body').material=bodyMaterial;","model.getObjectByName('body').material=bodyMaterial;addSurfaceReveal(bodyMaterial);")
s=s.replace('renderer.setSize(w,h);camera.aspect','renderer.setSize(w,h);renderer.getDrawingBufferSize(revealUniforms.uRevealSize.value);camera.aspect')
a=s.index(' if(!reduce&&!locked)swirlUniforms.');b=s.index(' if(model){',a)
s=s[:a]+''' if(!locked){
 if(!reduce)revealUniforms.uRevealTime.value+=dt;
 trail.forEach(p=>p.z=Math.max(0,p.z-dt*1.3));
 trailTimer+=dt;
 if(pointerInside&&trailTimer>.035){for(let i=trail.length-1;i>0;i--)trail[i].copy(trail[i-1]);trail[0].set(revealPoint.x,revealPoint.y,1);trailTimer=0;}
 }
 revealUniforms.uRevealStrength.value=1-explode;
''' +s[b:]
s=s.replace('function move(e){const r=host.getBoundingClientRect();if(!locked){','function move(e){const r=host.getBoundingClientRect();pointerInside=true;if(!locked){revealPoint.set((e.clientX-r.left)/r.height,(r.bottom-e.clientY)/r.height);')
s=s.replace("host.addEventListener('pointerleave',()=>{if(!locked){", "host.addEventListener('pointerleave',()=>{pointerInside=false;if(!locked){")
s=s.replace("host.addEventListener('pointerdown',e=>{dragging=true;", "host.addEventListener('pointerdown',e=>{move(e);dragging=true;")
s=s.replace("function end(){dragging=false;", "function end(e){if(e?.pointerType==='touch')pointerInside=false;dragging=false;")
s=s.replace('MOVE TO EXPLORE · DRAG TO ORBIT','MOVE TO REVEAL · DRAG TO ORBIT')
p.write_text(s,encoding='utf-8')
