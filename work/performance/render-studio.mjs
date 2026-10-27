import fs from 'node:fs';
import zlib from 'node:zlib';
import * as T from '../apex/dist/assets/three.module.js';
const dir='work/apex/dist/assets/',data=JSON.parse(fs.readFileSync('work/performance/mclaren-still.json')),raw=zlib.gunzipSync(fs.readFileSync('work/performance/mclaren-still.bin.gz'));
const W=1200,H=750,types={Float32Array,Uint32Array};
const read=s=>new types[s.type](raw.buffer,raw.byteOffset+s.offset,s.length);
const bounds=new T.Box3();for(const m of data.meshes){const p=read(m.position);for(let i=0;i<p.length;i+=3)bounds.expandByPoint(new T.Vector3(p[i],-p[i+1],-p[i+2]));}
const center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3()),scale=5.6/Math.max(size.x,size.z);
const model=new T.Matrix4().compose(new T.Vector3(-center.x*scale,-bounds.min.y*scale,-center.z*scale),new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI),new T.Vector3(scale,scale,scale));
const angle=Number(process.argv[2]||0);model.premultiply(new T.Matrix4().makeRotationY(Math.PI+angle*2*Math.PI/72));
const normalMatrix=new T.Matrix3().getNormalMatrix(model),camera=new T.PerspectiveCamera(30,W/H,.1,100);camera.position.set(5,3.7,-6);camera.lookAt(0,.6,0);camera.updateMatrixWorld();
const projection=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).multiply(model);
// Offline studio rig: large warm key, cool fill, top strip and rim. No runtime lights.
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
let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;for(const m of projected)for(let i=0;i<m.p.length;i+=3){minX=Math.min(minX,m.p[i]);maxX=Math.max(maxX,m.p[i]);minY=Math.min(minY,m.p[i+1]);maxY=Math.max(maxY,m.p[i+1]);}const fit=1.04;for(const m of projected)for(let i=0;i<m.p.length;i+=3){m.p[i]=(m.p[i]-(minX+maxX)/2)*fit+W/2;m.p[i+1]=(m.p[i+1]-(minY+maxY)/2)*fit+H/2;}
for(const mode of ['exterior','interior']){
 const pixels=new Uint8Array(W*H*4),depth=new Float32Array(W*H).fill(Infinity);
 for(const mesh of projected){if(mode==='interior'&&mesh.layer==='shell')continue;const {p,colors,index,opacity}=mesh;
  for(let t=0;t<index.length;t+=3){const ia=index[t],ib=index[t+1],ic=index[t+2],a=ia*3,b=ib*3,c=ic*3;
   const ax=p[a],ay=p[a+1],bx=p[b],by=p[b+1],cx=p[c],cy=p[c+1],den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);if(Math.abs(den)<.001)continue;
   const x0=Math.max(0,Math.floor(Math.min(ax,bx,cx))),x1=Math.min(W-1,Math.ceil(Math.max(ax,bx,cx))),y0=Math.max(0,Math.floor(Math.min(ay,by,cy))),y1=Math.min(H-1,Math.ceil(Math.max(ay,by,cy)));
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const u=((by-cy)*(x+.5-cx)+(cx-bx)*(y+.5-cy))/den,v=((cy-ay)*(x+.5-cx)+(ax-cx)*(y+.5-cy))/den,w=1-u-v;if(u<0||v<0||w<0)continue;const z=u*p[a+2]+v*p[b+2]+w*p[c+2],at=y*W+x;if(z>=depth[at])continue;depth[at]=z;for(let k=0;k<3;k++){const color=u*colors[a+k]+v*colors[b+k]+w*colors[c+k];pixels[at*4+k]=color*opacity+pixels[at*4+k]*(1-opacity);}pixels[at*4+3]=Math.round(255*(opacity+(pixels[at*4+3]/255)*(1-opacity)));}
  }
 }
 fs.writeFileSync('work/performance/studio-'+mode+'.rgba',pixels);console.log('Rendered',mode,W,H);
}
