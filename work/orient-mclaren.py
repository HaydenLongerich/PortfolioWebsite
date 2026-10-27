from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text().replace('orbit=0,lastX','orbit=Math.PI,lastX').replace('orbit=0;pointer.x','orbit=Math.PI;pointer.x');p.write_text(s)
