from pathlib import Path
p=Path('work/ldraw/convert.mjs');s=p.read_text();s=s.replace("const model=await new Promise", "process.on('beforeExit',()=>{const c=loader.partsCache;console.log('pending',Object.keys(c._cache).length);fs.writeFile('work/ldraw/cache-debug.json',JSON.stringify(Object.fromEntries(Object.entries(c.parseCache._cache).map(([k,v])=>[k,{type:v.type,file:v.fileName,sub:v.subobjects?.map(s=>s.fileName)}]))))});\nconst model=await new Promise")
p.write_text(s)
