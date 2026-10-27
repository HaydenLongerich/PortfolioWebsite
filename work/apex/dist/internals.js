import * as THREE from 'three';

// Illustrative mechanical internals, not a manufacturer CAD model.
export function createInternals(){
 const group=new THREE.Group();group.name='Mechanical internals';
 const steel=new THREE.MeshStandardMaterial({color:0x89918f,metalness:.8,roughness:.38});
 const dark=new THREE.MeshStandardMaterial({color:0x252d2f,metalness:.55,roughness:.5});
 const red=new THREE.MeshStandardMaterial({color:0x9b2525,metalness:.45,roughness:.4});
 const gold=new THREE.MeshStandardMaterial({color:0xb79143,metalness:.7,roughness:.35});
 const rubber=new THREE.MeshStandardMaterial({color:0x161c1c,roughness:.85});
 const bronze=new THREE.MeshStandardMaterial({color:0x93704d,metalness:.75,roughness:.4});
 function mesh(geometry,material,x,y,z){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);group.add(m);return m}
 function box(w,h,d,x,y,z,mat=dark){return mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z)}
 function pipe(points,r=.025,mat=steel){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,24,r,8,false),mat,0,0,0)}
 function cylinder(r,h,x,y,z,mat=steel){return mesh(new THREE.CylinderGeometry(r,r,h,20),mat,x,y,z)}
 // Ladder rails and crossmembers keep the assembly visually connected.
 [-.56,.56].forEach(x=>box(.085,.11,3.15,x,.29,.05));
 [-1.25,-.3,.45,1.4].forEach(z=>box(1.18,.09,.08,0,.29,z));
 box(1.02,.055,1.5,0,.31,-.4);
 // Rear-mid V8: block, two cylinder banks, ribbed cam covers and intake.
 box(.67,.29,.77,0,.5,.88,steel);
 [-1,1].forEach(side=>{
  const bank=box(.27,.17,.78,side*.25,.69,.88,red);bank.rotation.z=-side*.18;
  for(let i=0;i<8;i++)box(.27,.018,.025,side*.25,.79,.55+i*.095,steel);
  for(let i=0;i<4;i++){
   cylinder(.07,.09,side*.12,.8,.59+i*.19,dark);
   pipe([[side*.1,.83,.59+i*.19],[side*.03,.9,.59+i*.19],[0,.87,.59+i*.19]],.038,steel);
   pipe([[side*.36,.57,.59+i*.19],[side*.5,.47,.65+i*.16],[side*.48,.38,1.38]],.025,bronze);
  }
  pipe([[side*.48,.38,1.35],[side*.48,.36,1.7],[side*.22,.36,1.93]],.045,steel);
 });
 box(.21,.12,.8,0,.87,.88,dark);
 for(let i=0;i<6;i++)box(.215,.013,.025,0,.938,.58+i*.12,steel);
 box(.32,.24,.4,0,.44,1.48,steel);
 [-.3,.3].forEach(x=>{const muffler=cylinder(.105,.42,x,.34,1.65,steel);muffler.rotation.x=Math.PI/2});
 // Front radiator, coolant lines, battery and steering rack.
 box(.96,.35,.09,0,.49,-1.53,dark);
 for(let i=0;i<20;i++)box(.032,.33,.024,-.45+i*.047,.49,-1.59,steel);
 pipe([[-.43,.5,-1.5],[-.58,.36,-1.1],[-.58,.35,.2],[-.42,.5,.65]],.027,rubber);
 box(.27,.22,.32,-.32,.46,-1.05,dark);
 cylinder(.023,.025,-.39,.585,-1.05,red);cylinder(.023,.025,-.25,.585,-1.05,steel);
 pipe([[-.65,.36,-1.15],[0,.36,-1.15],[.65,.36,-1.15]],.03,steel);
 // Intact suspension at each wheel: wishbones, damper and helical spring.
 for(const x of [-.73,.73])for(const z of [-1.15,1.49]){
  const side=Math.sign(x);
  pipe([[side*.4,.3,z-.2],[x,.36,z],[side*.4,.3,z+.2]],.025,steel);
  pipe([[side*.4,.52,z-.16],[x,.4,z],[side*.4,.52,z+.16]],.018,dark);
  cylinder(.032,.32,side*.62,.49,z,gold);
  const helix=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*14;helix.push([side*.62+Math.cos(a)*.056,.35+i/90*.28,z+Math.sin(a)*.056])}
  pipe(helix,.009,gold);
 }
 return group;
}
