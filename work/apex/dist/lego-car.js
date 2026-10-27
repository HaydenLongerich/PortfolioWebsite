import * as T from './assets/three.module.js';
// Adapted from Jens Brühl / jb70's CC BY 4.0 build; see assets/LDRAW-CREDITS.txt.
export async function createLegoCar(){
 const [data,response]=await Promise.all([fetch('./assets/mclaren-realtime.json').then(r=>{if(!r.ok)throw Error('Model metadata unavailable');return r.json()}),fetch('./assets/mclaren-realtime.bin.gz')]);
 if(!response.ok)throw Error('Model geometry unavailable');
 const buffer=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 const types={Float32Array,Uint32Array};
 const root=new T.Group(),shell=new T.Group(),core=new T.Group();root.add(shell,core);
 for(const item of data.meshes){
  const geometry=new T.BufferGeometry();
  for(const key of ['position','normal','index']){const s=item[key],a=new T.BufferAttribute(new types[s.type](buffer,s.offset,s.length),key==='index'?1:3);if(key==='index')geometry.setIndex(a);else geometry.setAttribute(key,a)}
  geometry.computeBoundingSphere();
  const m=data.materials[item.material];
  const material=new T.MeshPhongMaterial({name:m.name,color:m.color,specular:0x555555,shininess:45,transparent:m.opacity<1,opacity:m.opacity,side:T.DoubleSide,forceSinglePass:true});
  (item.layer==='shell'?shell:core).add(new T.Mesh(geometry,material));
 }
 root.rotation.x=Math.PI;root.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
 const scale=5.6/Math.max(size.x,size.z);root.scale.setScalar(scale);root.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
 return {root,shell,core};
}

