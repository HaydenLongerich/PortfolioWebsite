from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8');s=s.replace(" const machinery=createInternals();model.add(machinery);",''' // Remove the stock model's solid engine-bay fillers in the same cutaway.
 ['interior_dark','interior_light','carbon_fibre_trim','carbon fibre','metal','brakes','blue'].forEach(name=>model.getObjectByName(name)?.traverse(object=>{if(object.isMesh){
  object.material=Array.isArray(object.material)?object.material.map(m=>m.clone()):object.material.clone();
  (Array.isArray(object.material)?object.material:[object.material]).forEach(m=>addCutaway(m));
 }}));
 const machinery=createInternals();model.add(machinery);''');p.write_text(s,encoding='utf-8')
