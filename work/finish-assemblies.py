from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8')
s=s.replace("const raycaster=new THREE.Raycaster(); const groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0); const groundHit=new THREE.Vector3(); ",'')
s=s.replace("float curve=2.65 + .35*sin(a*3.0-t) + .21*cos(a*2.0+t*.7);","float curve=2.45 + .52*sin(a*3.0-t) + .31*cos(a*2.0+t*.7);")
s=s.replace("float band=abs(r-curve-.22*sin(flow*2.0));","float band=abs(r-curve-.3*sin(flow*2.0));")
s=s.replace("float ribbon=1.0-smoothstep(.10,.29,band);","float ribbon=1.0-smoothstep(.14,.20,band);")
s=s.replace(" const details=new",''' const interior=new THREE.MeshStandardMaterial({color:0x242a27,roughness:.84,metalness:.05});
 const metal=new THREE.MeshStandardMaterial({color:0x68716e,roughness:.32,metalness:.85});
 const carbon=new THREE.MeshStandardMaterial({color:0x30372f,roughness:.45,metalness:.35});
 const assign=(names,material)=>names.forEach(name=>model.getObjectByName(name)?.traverse(o=>{if(o.isMesh)o.material=material}));
 assign(['leather','carpet','interior_dark','interior_light','steering_leather','steering_centre'],interior);
 assign(['metal','brakes','steering_metal','steering_column'],metal);
 assign(['carbon_fibre_trim','carbon fibre','steering_carbon','blue'],carbon);
 const details=new''')
s=s.replace(" lens=new THREE.Vector2(-9999,-9999)"," lens=new THREE.Vector2(-9999,-9999)")
p.write_text(s,encoding='utf-8')
