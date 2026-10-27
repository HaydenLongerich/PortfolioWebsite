from pathlib import Path
root=Path('work/apex/dist')
for p in root.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('>HL<span>','>longerich<span>').replace('<span>Longerich.</span>','<span>Longerich</span>').replace('Résumé','Resume')
 s=s.replace('pages.css?v=realtime5','pages.css?v=fluid6').replace('navigation.js?v=studio4','navigation.js?v=fluid6').replace('experience.js?v=realtime5','experience.js?v=fluid6')
 s=s.replace('</body>','<script src="atmosphere.js?v=fluid6" defer></script></body>')
 if p.name=='index.html':
  s=s.replace('<div class="model-intro">','<div class="model-stage" aria-hidden="true"><div class="stage-grid"></div><div class="stage-orbit orbit-a"></div><div class="stage-orbit orbit-b"></div><div class="stage-glow"></div><span class="stage-caption">EVERY ANGLE. EVERY DETAIL.</span></div><div class="model-intro">')
  s=s.replace('<div class="reveal-actions">','<label class="rotation-control" for="carFlip"><span>FLIP 360°</span><input id="carFlip" type="range" min="0" max="360" step="0.1" value="0" aria-label="Flip car upside down"></label><div class="reveal-actions">')
 p.write_text(s,encoding='utf-8')
p=root/'experience.js';s=p.read_text(encoding='utf-8')
s=s.replace("retry=host.querySelector('.car-retry');","retry=host.querySelector('.car-retry'),flip=document.querySelector('#carFlip');")
s=s.replace('targetPitch=Math.max(-.5,Math.min(.65,down.pitch+dy*.003))','targetPitch=down.pitch+dy*.008')
s=s.replace('if(Math.abs(dx)>5||down.drag)','if(Math.abs(dx)>5||(e.pointerType!==\'touch\'&&Math.abs(dy)>5)||down.drag)')
s=s.replace("targetPitch=Math.max(-.5,Math.min(.65,targetPitch+(e.key==='ArrowUp'?-.08:.08)))","targetPitch+=(e.key==='ArrowUp'?-.12:.12)")
s=s.replace('function suspend(){',"flip.oninput=()=>{velocity=0;targetPitch=Number(flip.value)*Math.PI/180;wake()};\nfunction suspend(){")
s=s.replace('car=await createLegoCar();pivot.add(car.root);','car=await createLegoCar();pivot.add(car.root);const centerY=new T.Box3().setFromObject(car.root).getCenter(new T.Vector3()).y;car.root.position.y-=centerY;pivot.position.y=centerY;')
s=s.replace("slider.value=String(((orbit-Math.PI)*180/Math.PI%360+360)%360);","slider.value=String(((orbit-Math.PI)*180/Math.PI%360+360)%360);if(document.activeElement!==flip)flip.value=String((pitch*180/Math.PI%360+360)%360);")
s=s.replace('uStrength:{value:0}', 'uTail:{value:new T.Vector2(.5,.5)},uFlow:{value:0},uStrength:{value:0}')
a=s.index('function mask(material)');b=s.index('function hint()',a)
s=s[:a]+'''function mask(material){material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,uniforms);shader.fragmentShader='uniform vec2 uPoint;uniform vec2 uTail;uniform vec2 uSize;uniform float uStrength;uniform float uFlow;float revealEdge=1.;\\n'+shader.fragmentShader;
shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
if(uStrength>.001){vec2 p=gl_FragCoord.xy/uSize.y;vec2 d=p-uPoint;float a=atan(d.y,d.x);float radius=.17*uStrength*(1.+.10*sin(a*3.+uFlow)+.05*cos(a*5.-uFlow));float head=length(d)-radius;float tail=length(p-uTail)-radius*.72;float h=clamp(.5+.5*(tail-head)/.06,0.,1.);revealEdge=mix(tail,head,h)-.06*h*(1.-h);if(revealEdge<0.)discard;}`);
shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`#include <opaque_fragment>
if(uStrength>.01){float rim=1.-smoothstep(.001,.009,revealEdge);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(1.,.63,.22),rim*.48);}`);
};material.customProgramCacheKey=()=> 'fluid-reveal-6';}
''' +s[b:]
s=s.replace('uniforms.uPoint.value.set(sx*camera.aspect,1-sy);','uniforms.uPoint.value.set(sx*camera.aspect,1-sy);uniforms.uTail.value.lerp(uniforms.uPoint.value,reduced.matches?1:1-Math.exp(-10*dt));uniforms.uFlow.value=sx*3+sy*2;')
s=s.replace('Math.abs(py-sy)>.001','Math.abs(py-sy)+uniforms.uTail.value.distanceTo(uniforms.uPoint.value)>.001')
p.write_text(s,encoding='utf-8')
