import * as T from 'three';

// Digital reconstruction by Jens Brühl (jb70), CC BY 4.0.
// LDraw parts retain their original Creative Commons attribution; see asset credits.
export async function createLegoCar(){
 const [data,response]=await Promise.all([fetch('./assets/mclaren-p1.json').then(r=>{if(!r.ok)throw Error('Model metadata unavailable');return r.json()}),fetch('./assets/mclaren-p1.bin.gz')]);
 if(!response.ok)throw Error('Model geometry unavailable');
 const buffer=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 const types={Float32Array,Uint32Array,Uint16Array,Int16Array,Uint8Array};
 function attribute(spec,size){return new T.BufferAttribute(new types[spec.type](buffer,spec.offset,spec.length),size)}
 const geometries=data.geometries.map(g=>{const geo=new T.BufferGeometry();geo.setAttribute('position',attribute(g.position,3));geo.setAttribute('normal',attribute(g.normal,3));if(g.index)geo.setIndex(attribute(g.index,1));g.groups.forEach(x=>geo.addGroup(x.start,x.count,x.materialIndex));return geo});
 const materials=data.materials.map(m=>new T.MeshStandardMaterial({name:m.name,color:m.color,roughness:Math.max(.25,m.roughness??.3),metalness:Math.min(.18,m.metalness??0),transparent:m.opacity<1,opacity:m.opacity,side:T.DoubleSide}));
 const root=new T.Group(),shell=new T.Group(),core=new T.Group(),fixed=new T.Group();root.add(shell,core,fixed);
 const buckets=new Map();
 for(const part of data.instances){
  if(part.matrix[12]>400)continue; // Separate display plaque and luggage accessory, outside the vehicle.
  const exterior=/panel|mudguard|windscreen|tyre|wheel rim|sticker|slope|wedge|tile|hose|flexible axle/i.test(part.description);
  const layer=exterior?'shell':'core',key=part.g+':'+JSON.stringify(part.m)+':'+layer;
  if(!buckets.has(key))buckets.set(key,{g:part.g,m:part.m,layer,items:[]});buckets.get(key).items.push(part);
 }
 const cloneCache=new Map();function getMat(id,layer){const key=id+layer;if(!cloneCache.has(key))cloneCache.set(key,materials[id].clone());return cloneCache.get(key)}
 for(const b of buckets.values()){
  const m=Array.isArray(b.m)?b.m.map(id=>getMat(id,b.layer)):getMat(b.m,b.layer);
  const mesh=new T.InstancedMesh(geometries[b.g],m,b.items.length);b.items.forEach((item,i)=>mesh.setMatrixAt(i,new T.Matrix4().fromArray(item.matrix)));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();(b.layer==='shell'?shell:core).add(mesh);
 }
 root.rotation.x=Math.PI;root.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
 const scale=5.6/Math.max(size.x,size.z);root.scale.setScalar(scale);root.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
 return {root,shell,core,fixed};
}

