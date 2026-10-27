from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8');a=s.index('let entranceSeen=');b=s.index('new IntersectionObserver',a)
s=s[:a]+'''let entranceSeen=false,entranceVisible=false,entranceTime=0,entranceRunning=false,restY=0;
const driveDirection=new T.Vector3();
function finishEntrance(){if(!entranceRunning)return;entranceRunning=false;pivot.position.set(0,restY,0);pivot.scale.setScalar(1);pivot.rotation.set(pitch,orbit,0);uniforms.uStrength.value=0;hero.classList.remove('drive-in');wake()}
function enterStudio(){if(!ready||!entranceVisible||entranceSeen)return;entranceSeen=true;if(reduced.matches)return;
 entranceTime=0;entranceRunning=true;restY=pivot.position.y;hero.classList.add('drive-in');wake();
}
function driveEntrance(dt){entranceTime=Math.min(1.5,entranceTime+dt);const t=entranceTime/1.5;
 const arrival=1-Math.pow(1-Math.min(1,t/.72),3),turn=Math.max(0,Math.min(1,(t-.32)/.68)),settle=turn*turn*(3-2*turn);
 driveDirection.set(1,0,0).applyQuaternion(camera.quaternion);pivot.position.copy(driveDirection).multiplyScalar(-9*(1-arrival));pivot.position.y+=restY;
 pivot.scale.setScalar(.72+.28*arrival);pivot.rotation.set(pitch,orbit+.95*(1-settle),-.035*Math.sin(t*Math.PI));
 // A brief mechanical cutaway resolves into the fully interactive bodywork.
 const reveal=Math.max(0,Math.sin(Math.PI*Math.max(0,Math.min(1,(t-.50)/.45))));uniforms.uStrength.value=reveal*.9;uniforms.uPoint.value.set((.25+.5*settle)*camera.aspect,.51);uniforms.uTail.value.copy(uniforms.uPoint.value);
 if(t>=1)finishEntrance();
}
''' +s[b:]
s=s.replace('renderer.render(scene,camera);dirty=false;', 'if(entranceRunning)driveEntrance(dt);renderer.render(scene,camera);dirty=false;')
s=s.replace('if((moving||dirty)&&!frame)', 'if((moving||dirty||entranceRunning)&&!frame)')
p.write_text(s,encoding='utf-8')
for p in Path('work/apex/dist').glob('*.html'):
 s=p.read_text(encoding='utf-8');import re
 s=re.sub(r'experience.js\?v=[^"\s]+','experience.js?v=cinema13',s);s=re.sub(r'pages.css\?v=[^"\s]+','pages.css?v=cinema13',s);p.write_text(s,encoding='utf-8')
