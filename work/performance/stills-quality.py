from pathlib import Path
p=Path('work/performance/render-stills.mjs');s=p.read_text();s=s.replace("const W=1440,H=900", "const W=2400,H=1500")
s=s.replace("const projected=data.meshes.map", "const projected=data.meshes.map")
p.write_text(s)
