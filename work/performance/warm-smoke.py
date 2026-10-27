from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8').replace('resize();if(renderer.compileAsync)await renderer.compileAsync(scene,camera);ready=true;','resize();smoke.points.visible=true;if(renderer.compileAsync)await renderer.compileAsync(scene,camera);smoke.points.visible=false;ready=true;');p.write_text(s,encoding='utf-8')
