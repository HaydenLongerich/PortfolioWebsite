from pathlib import Path
import re
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8')
s=s.replace("renderer.shadowMap.enabled=false;host.append(renderer.domElement);","renderer.shadowMap.enabled=false;renderer.domElement.style.visibility='hidden';host.append(renderer.domElement);")
s=s.replace("function tick(time){frame=0;if(!active||document.hidden||!ready)return;const elapsed=", "function tick(time){frame=0;if(!active||document.hidden||!ready)return;if(!entranceSeen&&!reduced.matches)return;if(reduced.matches&&!entranceSeen)entranceSeen=true;const elapsed=")
s=s.replace("restY=pivot.position.y;hero.classList.add('drive-in');wake();", "restY=pivot.position.y;driveEntrance(0);hero.classList.add('drive-in');wake();")
s=s.replace('renderer.render(scene,camera);dirty=false;',"renderer.render(scene,camera);if(renderer.domElement.style.visibility!=='visible')renderer.domElement.style.visibility='visible';dirty=false;")
assert "style.visibility='hidden';host.append" in s
assert "if(!entranceSeen&&!reduced.matches)return" in s
p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/index.html');s=p.read_text(encoding='utf-8');s=re.sub(r'experience.js\?v=[^"\s]+','experience.js?v=entrance28',s);p.write_text(s,encoding='utf-8')
