from pathlib import Path
s=Path('work/performance/render-angle.mjs').read_text()
a=s.index('const light=');b=s.index('let minX=',a)
s=s[:a]+'''// Offline studio rig: large warm key, cool fill, top strip and rim. No runtime lights.
const key=new T.Vector3(3,6,-4).normalize(),fill=new T.Vector3(-5,2,-2).normalize(),rim=new T.Vector3(-2,4,6).normalize();
const tone=value=>{const v=Math.max(0,value*.95);const a=Math.min(1,(v*(2.51*v+.03))/(v*(2.43*v+.59)+.14));return Math.round(255*(a<=.0031308?12.92*a:1.055*Math.pow(a,1/2.4)-.055))};
const projected=data.meshes.map(m=>{const p=read(m.position),n=read(m.normal),out=new Float32Array(p.length),colors=new Float32Array(p.length),material=data.materials[m.material],base=new T.Color(material.color),rough=material.roughness??.3,metal=material.metalness??0;
 for(let i=0;i<p.length;i+=3){const world=new T.Vector3().fromArray(p,i).applyMatrix4(model),v=new T.Vector3().fromArray(p,i).applyMatrix4(projection);out[i]=(v.x*.5+.5)*W;out[i+1]=(-v.y*.5+.5)*H;out[i+2]=v.z;
 const normal=new T.Vector3().fromArray(n,i).applyNormalMatrix(normalMatrix),view=camera.position.clone().sub(world).normalize();
 const diffuse=.16+.95*Math.max(0,normal.dot(key))+.38*Math.max(0,normal.dot(fill))+.32*Math.max(0,normal.dot(rim));
 const half=key.clone().add(view).normalize(),halfRim=rim.clone().add(view).normalize();
 const shine=(Math.pow(Math.max(0,normal.dot(half)),rough>.7?12:65)*.7+Math.pow(Math.max(0,normal.dot(halfRim)),35)*.38)*(rough>.7?.08:1);
 const fresnel=Math.pow(1-Math.max(0,normal.dot(view)),5)*.12;
 const tint=[base.r,base.g,base.b];for(let k=0;k<3;k++)colors[i+k]=tone(tint[k]*diffuse+(shine+fresnel)*((1-metal)*.6+metal*tint[k]));
 }return {p:out,colors,index:read(m.index),layer:m.layer,opacity:material.opacity??1}}).sort((a,b)=>b.opacity-a.opacity);
''' + s[b:]
s=s.replace('const {p,shade,index,color}=mesh','const {p,colors,index,opacity}=mesh')
a=s.index('const l=u*shade');b=s.index('pixels[at*4+3]=255;',a)+len('pixels[at*4+3]=255;')
s=s[:a]+'''for(let k=0;k<3;k++){const color=u*colors[a+k]+v*colors[b+k]+w*colors[c+k];pixels[at*4+k]=color*opacity+pixels[at*4+k]*(1-opacity);}pixels[at*4+3]=Math.round(255*(opacity+(pixels[at*4+3]/255)*(1-opacity)));'''+s[b:]
s=s.replace("'work/performance/spin-'+mode", "'work/performance/studio-'+mode")
Path('work/performance/render-studio.mjs').write_text(s)
s=Path('work/performance/build-spin.py').read_text().replace("assets/spin'","assets/studio'").replace('render-angle.mjs','render-studio.mjs').replace("spin-'+mode","studio-'+mode")
Path('work/performance/build-studio.py').write_text(s)
