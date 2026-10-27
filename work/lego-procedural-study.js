import * as T from 'three';
import {mergeGeometries} from './assets/BufferGeometryUtils.js';

// A procedural Technic-inspired P1 study, not an official LEGO CAD asset.
export function createLegoCar(){
 const root=new T.Group(),shell=new T.Group(),core=new T.Group(),fixed=new T.Group();root.add(shell,core,fixed);
 const materials={};
 function mat(name,color,group=core,roughness=.32){const key=name+group.uuid;if(!materials[key])materials[key]=new T.MeshStandardMaterial({color,roughness,metalness:.04});return materials[key]}
 const black=mat('beam',0x24272b),gray=mat('gear',0x8e949b),blue=mat('pin',0x1469b9),red=mat('axle',0xd83d27),yellow=mat('bush',0xf7c53b),orange=mat('seat',0xf8a509);
 const shellOrange=mat('papaya',0xff9300,shell,.24),shellBlack=mat('panel',0x171a1e,shell),glass=mat('glass',0x242d34,shell,.2),rubber=mat('tire',0x111215,fixed,.8),rim=mat('rim',0x35383b,fixed,.3);
 function mesh(g,m,p=[0,0,0],r=[0,0,0],group=core){const o=new T.Mesh(g,m);o.position.set(...p);o.rotation.set(...r);group.add(o);return o}
 function box(w,h,d,p,m=black,group=core,r=[0,0,0]){return mesh(new T.BoxGeometry(w,h,d),m,p,r,group)}
 function cylinder(radius,length,p,m=gray,axis='y',group=core){return mesh(new T.CylinderGeometry(radius,radius,length,16),m,p,axis==='x'?[0,0,Math.PI/2]:axis==='z'?[Math.PI/2,0,0]:[0,0,0],group)}
 function rod(a,b,r=.027,m=black,group=core){const av=new T.Vector3(...a),bv=new T.Vector3(...b),o=mesh(new T.CylinderGeometry(r,r,av.distanceTo(bv),12),m,av.clone().add(bv).multiplyScalar(.5).toArray(),[0,0,0],group);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return o}
 const beamCache=new Map();
 function beam(n,p,rot=[0,0,0],m=black,group=core){let g=beamCache.get(n);if(!g){const s=new T.Shape(),a=(n-1)*.13/2,r=.067;s.moveTo(-a,-r);s.lineTo(a,-r);s.absarc(a,0,r,-Math.PI/2,Math.PI/2,false);s.lineTo(-a,r);s.absarc(-a,0,r,Math.PI/2,Math.PI*1.5,false);for(let i=0;i<n;i++){const h=new T.Path();h.absarc(-a+i*.13,0,.039,0,Math.PI*2,true);s.holes.push(h)}g=new T.ExtrudeGeometry(s,{depth:.075,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.004,bevelThickness:.004,curveSegments:8});g.translate(0,0,-.0375);beamCache.set(n,g)}return mesh(g,m,p,rot,group)}
 function pin(x,y,z,axis='x',color=blue){cylinder(.035,.13,[x,y,z],color,axis);cylinder(.045,.017,[x+(axis==='x'?.065:0),y+(axis==='y'?.065:0),z+(axis==='z'?.065:0)],color,axis)}
 // Continuous longitudinal chassis, braced crossmembers and pinned side rails.
 for(const side of [-1,1]){
  for(const x of [.37,.77])for(const z of [-1.24,.57])beam(15,[side*x,.29,z],[0,Math.PI/2,0]);
  for(const z of [-1.3,.55])beam(15,[side*.82,.61,z],[0,Math.PI/2,0]);
  for(let z=-2.05;z<2.05;z+=.26){pin(side*.82,.61,z);if(Math.round(z*100)%3===0)pin(side*.77,.29,z,'x',red)}
  for(const z of [-1.6,-.65,.35,1.5])beam(4,[side*.78,.45,z],[0,0,Math.PI/2]);
  rod([side*.8,.25,-1.1],[side*.8,.65,-.2],.033);rod([side*.8,.65,.25],[side*.8,.25,1],.033);
 }
 for(let z=-2.05;z<2.16;z+=.39){beam(13,[0,.25,z],[Math.PI/2,0,0]);for(const x of [-.65,0,.65])pin(x,.29,z,'y')}
 // Front and rear suspension, springs and hubs.
 for(const z of [-1.43,1.43])for(const s of [-1,1]){
  rod([s*.45,.32,z-.23],[s*.98,.45,z],.035,gray);rod([s*.45,.32,z+.23],[s*.98,.45,z],.035,gray);
  rod([s*.5,.66,z-.18],[s*.98,.5,z],.026,black);rod([s*.5,.66,z+.18],[s*.98,.5,z],.026,black);
  cylinder(.095,.3,[s*.63,.5,z],red);for(let i=0;i<8;i++){const t=mesh(new T.TorusGeometry(.09,.012,6,16),yellow,[s*.63,.36+i*.036,z],[Math.PI/2,0,0]);}
  cylinder(.18,.1,[s*.99,.45,z],gray,'x');pin(s*1.04,.45,z,'x',red);
 }
 // Transmission and central prop shaft, a stack of visibly toothed gears.
 rod([0,.39,-1.55],[0,.39,1.9],.037,gray);
 function gear(x,y,z,r,m=gray){cylinder(r,.07,[x,y,z],m,'x');for(let i=0;i<16;i++){const a=i*Math.PI/8;box(.075,.035,r*.22,[x,y+Math.sin(a)*r,z+Math.cos(a)*r],m,core,[a,0,0])}cylinder(r*.28,.095,[x,y,z],yellow,'x')}
 for(let i=0;i<6;i++)gear((i-2.5)*.12,.48,.65,.12+(i%3)*.025,i%2?gray:orange);
 // Mid-mounted V8, eight piston caps, orange engine cover and exhaust tubing.
 box(.58,.16,.9,[0,.56,1.24],gray);
 for(const s of [-1,1])for(let i=0;i<4;i++){
  const z=.89+i*.23;cylinder(.079,.19,[s*.2,.74,z],gray);cylinder(.057,.025,[s*.2,.85,z],yellow);
  rod([s*.31,.68,z],[s*.5,.7,z+.08],.035,gray);rod([s*.5,.7,z+.08],[s*.56,.5,1.9],.03,gray);
 }
 for(const s of [-1,1]){box(.18,.07,.85,[s*.22,.89,1.23],orange);beam(7,[s*.48,.91,1.25],[0,Math.PI/2,0]);}
 gear(0,.59,1.9,.16,gray);
 // Bucket seats, steering wheel, dashboard, cockpit cage.
 for(const s of [-1,1]){
  box(.38,.07,.43,[s*.34,.38,-.12],orange);box(.37,.53,.09,[s*.34,.65,.13],orange,core,[-.2,0,0]);
  for(const x of [-.17,.17]){rod([s*.34+x,.4,-.3],[s*.34+x,.93,.2],.04,black)}
  beam(7,[s*.71,.67,-.08],[0,Math.PI/2,0]);
 }
 beam(11,[0,.79,-.59]);rod([-.34,.48,-.43],[-.34,.8,-.66],.035,gray);
 mesh(new T.TorusGeometry(.13,.025,8,24),black,[-.34,.83,-.65],[.7,0,0]);
 box(.75,.1,.2,[0,.73,-.66],black);
 // Four wheels remain solid while bodywork reveals the frame.
 for(const s of [-1,1])for(const z of [-1.43,1.43]){
  mesh(new T.TorusGeometry(.35,.115,16,40),rubber,[s*1.01,.46,z],[0,Math.PI/2,0],fixed);
  cylinder(.285,.22,[s*1.01,.46,z],rim,'x',fixed);cylinder(.228,.235,[s*1.01,.46,z],mat('inset',0x101216,fixed),'x',fixed);
  for(let i=0;i<10;i++){const a=i*Math.PI/5;rod([s*1.135,.46+Math.sin(a)*.07,z+Math.cos(a)*.07],[s*1.135,.46+Math.sin(a+.15)*.26,z+Math.cos(a+.15)*.26],.018,rim,fixed)}
  cylinder(.07,.25,[s*1.01,.46,z],rim,'x',fixed);
  for(let i=0;i<40;i++){const a=i*Math.PI/20;box(.205,.012,.027,[s*1.01,.46+Math.sin(a)*.462,z+Math.cos(a)*.462],rubber,fixed,[a,0,0])}
 }
 // Sculpted, separate orange Technic body panels with visible seams.
 function panel(points,thickness,p,rot=[0,0,0],m=shellOrange){const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSize:.025,bevelThickness:.015,bevelSegments:2,steps:1});return mesh(g,m,p,rot,shell)}
 // Hood: paired tapered panels running from nose up to the windshield.
 for(const s of [-1,1]){
  panel([[0,0],[.36,0],[.53,.65],[.36,1.12],[0,1.12]],.05,[s*.035,.57,-2.15],[-Math.PI/2,0,s<0?Math.PI:0]);
 }
 // Reset mirrored hood as explicit rotated slabs, keeping length towards rear.
 shell.children.slice(-2).forEach(o=>shell.remove(o));
 for(const s of [-1,1]){
  const hood=panel([[0,0],[s*.36,0],[s*.53,.65],[s*.36,1.04],[0,1.04]],.055,[s*.025,.58,-2.15],[Math.PI/2,0,0]);hood.rotation.x=Math.PI/2-.12;
 }
 // Fenders: open wheel arches, actual curved panel bands.
 function arch(s,z){const shape=new T.Shape();const cy=.46;const r=.515,ri=.465;shape.absarc(z,cy,r,0,Math.PI,false);shape.lineTo(z-ri,cy);shape.absarc(z,cy,ri,Math.PI,0,true);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSize:.018,bevelThickness:.015,bevelSegments:2,steps:1,curveSegments:20});const obj=mesh(geo,shellOrange,[s*.83,0,0],[0,-Math.PI/2,0],shell);if(s<0)obj.position.x=-1;}
 for(const s of [-1,1])for(const z of [-1.43,1.43])arch(s,z);
 for(const s of [-1,1]){
  // Lower sills and angular door skin with deep black air-intake recess.
  box(.17,.12,1.9,[s*.88,.28,0],shellBlack,shell);
  panel([[-.65,0],[.6,0],[.78,.21],[.51,.48],[-.3,.43],[-.67,.13]],.055,[s*.89,.35,0],[0,Math.PI/2,0]);
  panel([[-.3,0],[.5,.1],[.39,.32],[-.28,.24]],.04,[s*.93,.62,.08],[0,Math.PI/2,0],shellBlack);
  beam(9,[s*.87,.37,.02],[0,Math.PI/2,0],shellBlack,shell);
  // Orange rear quarter deck, split into several molded plates.
  for(let i=0;i<3;i++)box(.25,.065,.8,[s*(.5+i*.125),.81,1.3],shellOrange,shell,[0,0,s*-.07]);
  // Windshield pillars and sculpted roof.
  rod([s*.67,.74,-.87],[s*.52,1.22,-.2],.048,shellBlack,shell);
  rod([s*.52,1.22,-.2],[s*.5,1.23,.5],.05,shellBlack,shell);
  rod([s*.5,1.23,.5],[s*.7,.81,1],.055,shellBlack,shell);
  rod([s*.63,.83,-.54],[s*.96,.85,-.62],.028,shellBlack,shell);box(.17,.08,.19,[s*1,.86,-.65],shellOrange,shell);
 }
 for(let i=0;i<4;i++)box(.235,.075,.76,[-.367+i*.245,1.24,.18],shellBlack,shell,[.03,0,0]);
 beam(9,[0,.75,-.87],[0,0,0],shellBlack,shell);
 // Rear engine cover, slotted louvers, spoiler and central exhaust.
 for(const s of [-1,1])box(.28,.055,1.08,[s*.22,.98,1.21],shellOrange,shell,[.13,0,0]);
 for(let i=0;i<6;i++)box(.48,.035,.045,[0,1.02,1+i*.1],shellBlack,shell);
 box(1.77,.09,.18,[0,.39,2.04],shellBlack,shell);box(1.68,.13,.16,[0,.67,2.04],shellOrange,shell);
 for(const s of [-1,1]){box(.07,.25,.08,[s*.55,.86,1.94],shellBlack,shell);box(.09,.2,.18,[s*.9,1.03,1.94],shellBlack,shell)}
 box(1.9,.07,.27,[0,1.03,1.94],shellBlack,shell);cylinder(.087,.15,[0,.55,2.15],shellBlack,'z',shell);
 // Front splitter, dark intakes, McLaren-shaped light traces.
 box(1.8,.045,.32,[0,.25,-2.04],shellBlack,shell);box(.6,.13,.16,[0,.4,-2.09],shellOrange,shell);
 const white=mat('light',0xe9eeed,shell);white.emissive.set(0x9cafb5);white.emissiveIntensity=.45;
 const tail=mat('tail',0xef3420,shell);tail.emissive.set(0xc51f0c);tail.emissiveIntensity=.5;
 for(const s of [-1,1]){
  box(.39,.15,.12,[s*.62,.4,-2.08],shellBlack,shell);
  rod([s*.44,.59,-2.1],[s*.67,.62,-2.02],.023,white,shell);rod([s*.67,.62,-2.02],[s*.83,.74,-1.82],.023,white,shell);
  rod([s*.25,.75,2.13],[s*.76,.75,2.13],.018,tail,shell);
  for(const z of [-1.95,-.65,.6,1.98])cylinder(.026,.015,[s*.8,.84,z],shellBlack,'y',shell);
 }
 // Merge by material to keep the many small parts efficient on mobile.
 function batch(group){group.updateMatrixWorld(true);const buckets=new Map();for(const o of [...group.children]){if(!o.isMesh)continue;const g=o.geometry.clone().applyMatrix4(o.matrix);if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));const k=o.material.uuid;if(!buckets.has(k))buckets.set(k,{m:o.material,g:[]});buckets.get(k).g.push(g);group.remove(o)}for(const {m,g} of buckets.values()){const geometry=mergeGeometries(g,false);group.add(new T.Mesh(geometry,m));g.forEach(x=>x.dispose())}}
 batch(shell);batch(core);batch(fixed);
 root.rotation.y=0; // Nose points toward the front-left of the introductory view.
 return {root,shell,core,fixed};
}

