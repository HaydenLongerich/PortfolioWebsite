import fs from 'node:fs';
import zlib from 'node:zlib';
import {MeshoptSimplifier as S} from './node_modules/meshoptimizer/index.js';
import * as T from '../apex/dist/assets/three.module.js';
await S.ready;
const dir='work/apex/dist/assets/',data=JSON.parse(fs.readFileSync(dir+'mclaren-p1.json')),raw=zlib.gunzipSync(fs.readFileSync(dir+'mclaren-p1.bin.gz'));
const types={Float32Array,Uint32Array,Uint16Array};
const read=s=>new types[s.type](raw.buffer,raw.byteOffset+s.offset,s.length);
const cache=new Map(),buckets=new Map();let before=0,after=0;
for(const part of data.instances){
 if(part.matrix[12]>400)continue;
 const layer=/panel|mudguard|windscreen|tyre|wheel rim|sticker|slope|wedge|tile|hose|flexible axle/i.test(part.description)?'shell':'core';
 const g=data.geometries[part.g],p=read(g.position),n=read(g.normal),source=g.index?read(g.index):Uint32Array.from({length:p.length/3},(_,i)=>i);
 const groups=Array.isArray(part.m)?g.groups:[{start:0,count:source.length,materialIndex:0}];
 const matrix=new T.Matrix4().fromArray(part.matrix),normal=new T.Matrix3().getNormalMatrix(matrix),flip=matrix.determinant()<0;
 for(const group of groups){
  const id=part.g+':'+group.start+':'+group.count;
  if(!cache.has(id)){
   const positions=[],normals=[],indices=[],map=new Map();
   for(const v of source.slice(group.start,group.start+group.count)){
    const key=[p[v*3],p[v*3+1],p[v*3+2],n[v*3],n[v*3+1],n[v*3+2]].map(x=>Math.round(x*10000)).join(',');
    if(!map.has(key)){map.set(key,positions.length/3);positions.push(...p.slice(v*3,v*3+3));normals.push(...n.slice(v*3,v*3+3));}indices.push(map.get(key));
   }
   const pos=new Float32Array(positions),norm=new Float32Array(normals),idx=new Uint32Array(indices);
   const small=idx;
   cache.set(id,{pos,norm,idx:small,before:idx.length});
  }
  const s=cache.get(id),material=Array.isArray(part.m)?part.m[group.materialIndex]:part.m,key=layer+':'+material;
  if(!buckets.has(key))buckets.set(key,{layer,material,p:[],n:[],i:[]});const b=buckets.get(key),remap=new Map();
  for(let j=0;j<s.idx.length;j+=3){const tri=[];for(const v of s.idx.slice(j,j+3)){if(!remap.has(v)){remap.set(v,b.p.length/3);const point=new T.Vector3().fromArray(s.pos,v*3).applyMatrix4(matrix),norm=new T.Vector3().fromArray(s.norm,v*3).applyNormalMatrix(normal);b.p.push(...[point.x,point.y,point.z].map(v=>Math.round(v*100)/100));b.n.push(...[norm.x,norm.y,norm.z].map(v=>Math.round(v*100)/100));}tri.push(remap.get(v));}if(flip)[tri[1],tri[2]]=[tri[2],tri[1]];b.i.push(...tri);}
  before+=s.before/3;after+=s.idx.length/3;
 }
}
const chunks=[];let offset=0;function append(a){const result={offset,length:a.length,type:a.constructor.name};const bytes=Buffer.from(a.buffer);chunks.push(bytes);offset+=bytes.length;return result;}
const meshes=[...buckets.values()].filter(b=>b.i.length).map(b=>({layer:b.layer,material:b.material,position:append(new Float32Array(b.p)),normal:append(new Float32Array(b.n)),index:append(new Uint32Array(b.i))}));
fs.writeFileSync('work/performance/mclaren-still.json',JSON.stringify({materials:data.materials,meshes}));fs.writeFileSync('work/performance/mclaren-still.bin.gz',zlib.gzipSync(Buffer.concat(chunks),{level:9}));
console.log(JSON.stringify({before,after,drawCalls:meshes.length,bytes:fs.statSync('work/performance/mclaren-still.bin.gz').size}));


