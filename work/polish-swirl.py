from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8');s=s.replace('model, wire, bodyMaterial','model, bodyMaterial').replace('const pieces=[], wirePieces=[];','const pieces=[]; let floorSwirl, guides; const swirlPointer=new THREE.Vector2(); const raycaster=new THREE.Raycaster(); const groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0); const groundHit=new THREE.Vector3(); const labelItems=[]; let lastTime=0;')
a=s.index('let lensRadius=');b=s.index('try{',a);s=s[:a]+'''const swirlUniforms={uTime:{value:0},uPointer:{value:swirlPointer},uNight:{value:0},uStrength:{value:1}};
function makeSwirl(){
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:swirlUniforms,
 vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
 fragmentShader:`varying vec2 vUv; uniform float uTime; uniform vec2 uPointer; uniform float uNight; uniform float uStrength;
 void main(){
 vec2 p=(vUv-.5)*12.0-uPointer*.3;
 p.y*=.72;
 float r=length(p);float a=atan(p.y,p.x);float t=uTime*.32;
 float curve=2.65 + .35*sin(a*3.0-t) + .21*cos(a*2.0+t*.7);
 float flow=a + r*.75-t;
 float band=abs(r-curve-.22*sin(flow*2.0));
 float ribbon=1.0-smoothstep(.10,.29,band);
 float gap=smoothstep(-.8,.35,sin(a*2.0+t*.75));
 float inner=1.0-smoothstep(.025,.065,abs(r-(1.8+.22*sin(a*3.0+t))));
 float outer=1.0-smoothstep(.015,.045,abs(r-(3.45+.26*cos(a*3.0-t*.7))));
 float tail=1.0-smoothstep(.035,.13,abs(r-(2.95+.4*sin(a*2.0+t*.6))));
 float alpha=(ribbon*(.28+.55*gap)+inner*.2+outer*.15+tail*.28)*uStrength;
 alpha*=1.0-smoothstep(4.3,5.1,r);
 vec3 color=mix(vec3(.59,.70,.23),vec3(.78,.96,.05),uNight);
 color=mix(color,vec3(.84,.97,.14),gap*.7);
 gl_FragColor=vec4(color,alpha);
 }`});
 floorSwirl=new THREE.Mesh(new THREE.PlaneGeometry(12,12),material);floorSwirl.rotation.x=-Math.PI/2;floorSwirl.position.y=.005;scene.add(floorSwirl);
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
''' +s[b:]
s=s.replace('const draco=new DRACOLoader();','makeSwirl();\nconst draco=new DRACOLoader();')
a=s.index(' bodyMaterial.onBeforeCompile=');b=s.index(' const details=',a);s=s[:a]+s[b:]
a=s.index(' model.traverse(o=>');b=s.index(' const shadow=',a)
s=s[:a]+''' model.updateMatrixWorld(true);
 groupParts(['body','trim','lights_red','lights','leds','grills','chrome','yellow_trim','plastic_gray'], 'BODY + AERO',new THREE.Vector3(0,.75,0),.2,.85);
 groupParts(['glass','wipers'],'GLASS',new THREE.Vector3(0,1.25,0),.4,1);
 ['wheel_fl','wheel_fr','wheel_rl','wheel_rr'].forEach((name,i)=>{
 const wheel=model.getObjectByName(name);if(wheel)addAssembly(wheel,new THREE.Vector3(wheel.position.x<0?-.8:.8,0,0),0,.65,i===1?'WHEEL ASSEMBLY':null);
 });
 const guideGeometry=new THREE.BufferGeometry();const linePoints=[];
 pieces.forEach(p=>{linePoints.push(p.origin.x,p.origin.y,p.origin.z,p.origin.x+p.offset.x,p.origin.y+p.offset.y,p.origin.z+p.offset.z)});
 guideGeometry.setAttribute('position',new THREE.Float32BufferAttribute(linePoints,3));
 guides=new THREE.LineSegments(guideGeometry,new THREE.LineDashedMaterial({color:0x7a8661,transparent:true,opacity:0,dashSize:.045,gapSize:.04}));guides.computeLineDistances();model.add(guides);
''' +s[b:]
a=s.index('function render(){');b=s.index('}render();',a)
s=s[:a]+'''function render(time=0){frame=requestAnimationFrame(render);const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;if(!active||document.hidden)return;const ease=1-Math.exp(-dt*9);smooth.x+=(pointer.x-smooth.x)*ease;smooth.y+=(pointer.y-smooth.y)*ease;
 explode+=((mode==='exploded'?1:0)-explode)*(reduce?1:ease);
 if(!reduce&&!locked)swirlUniforms.uTime.value+=dt;
 swirlUniforms.uNight.value+=(Number(mode==='night')-swirlUniforms.uNight.value)*ease;
 swirlUniforms.uStrength.value=1-explode*.75;
 swirlPointer.lerp(new THREE.Vector2(smooth.x*3,smooth.y*3),ease);
 if(model){
 pivot.rotation.y=orbit+(reduce?0:smooth.x*.28);pivot.rotation.x=reduce?0:smooth.y*.04;
 pivot.scale.setScalar(1.13-explode*.2);
 pieces.forEach(p=>{let progress=THREE.MathUtils.clamp((explode-p.start)/(p.end-p.start),0,1);progress=progress*progress*(3-2*progress);p.object.position.copy(p.origin).addScaledVector(p.offset,progress)});
 guides.material.opacity=explode*.4;
 pivot.updateMatrixWorld(true);
 labelItems.forEach(({object,el})=>{const point=new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());point.y+=.22;point.project(camera);el.style.left=`${(point.x*.5+.5)*host.clientWidth}px`;el.style.top=`${(-point.y*.5+.5)*host.clientHeight}px`;el.style.opacity=explode>.8?'1':'0'});
 }
 renderer.render(scene,camera);
''' +s[b:]
s=s.replace("mode=b.dataset.view;lens.set(-9999,-9999);", "mode=b.dataset.view;hero.classList.toggle('is-exploded',mode==='exploded');")
s=s.replace("xray:'TECHNICAL VIEW · DRAG TO EXPLORE',",'').replace('EXPLODED VIEW · EVERY DETAIL, REVEALED','ASSEMBLY VIEW · DRAG TO EXPLORE')
s=s.replace("lens.set((e.clientX-r.left)*(renderer?.getPixelRatio()||1),(r.bottom-e.clientY)*(renderer?.getPixelRatio()||1));",'')
s=s.replace("document.querySelector('#orbitReadout').textContent=`${Math.round(orbit*180/Math.PI)%360}�`", "document.querySelector('#orbitReadout').textContent=`${Math.round(orbit*180/Math.PI)%360}°`")
p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/index.html');s=p.read_text(encoding='utf-8');s=s.replace('<button data-view="xray" aria-pressed="false">02 / X-RAY</button>','').replace('03 / EXPLODED','02 / EXPLODED').replace('04 / AFTER HOURS','03 / AFTER HOURS');p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/experience.css');s=p.read_text(encoding='utf-8');s+='''
.assembly-label{position:absolute;pointer-events:none;z-index:3;transform:translate(-50%,-50%);font-size:8px;letter-spacing:1.4px;white-space:nowrap;background:#f2f1e9ed;border:1px solid #828c6a50;padding:6px 9px;border-radius:2px;opacity:0;transition:opacity .25s;box-shadow:0 2px 8px #20221e08}.hero:after{display:none}.hero:before{opacity:.35}.drive-cursor{width:12px;height:12px;margin:-6px;background:#afc572;border:0;mix-blend-mode:multiply}.drive-cursor span{display:none}.hero.is-exploded .hero-word{opacity:.4}@media(max-width:700px){.assembly-label{font-size:6px;padding:4px;letter-spacing:.6px}.view-controls{gap:24px}}
''';p.write_text(s,encoding='utf-8')
