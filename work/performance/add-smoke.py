from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8');s=s.replace("import {createLegoCar}","import {createBurnoutSmoke} from './burnout-smoke.js?v=burnout14';\nimport {createLegoCar}",1)
s=s.replace('const uniforms={','const smoke=createBurnoutSmoke(scene);\nconst uniforms={',1)
s=s.replace('if(entranceRunning)driveEntrance(dt);renderer.render(scene,camera);dirty=false;',"if(entranceRunning)driveEntrance(dt);const smokeActive=smoke.update(dt,pivot,entranceRunning&&entranceTime<1.15&&!reduced.matches,restY,renderer.domElement.height);renderer.render(scene,camera);dirty=false;")
s=s.replace('if((moving||dirty||entranceRunning)&&!frame)','if((moving||dirty||entranceRunning||smokeActive)&&!frame)')
s=s.replace('if(reduced.matches)finishEntrance();wake()','if(reduced.matches){finishEntrance();smoke.clear()}wake()')
p.write_text(s,encoding='utf-8')
for p in Path('work/apex/dist').glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('experience.js?v=cinema13','experience.js?v=burnout14');p.write_text(s,encoding='utf-8')
p=Path('work/package-dark.py');s=p.read_text().replace("'experience.js'","'experience.js','burnout-smoke.js'");p.write_text(s)
