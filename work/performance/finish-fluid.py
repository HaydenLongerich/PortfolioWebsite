from pathlib import Path
p=Path('work/apex/dist/pages.css');s=p.read_text(encoding='utf-8')+'\n.landing-content{animation:none}\n';p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/experience.js');s=p.read_text(encoding='utf-8');s=s.replace('inside=true;wake()}','if(!inside)uniforms.uTail.value.set(px*camera.aspect,1-py);inside=true;wake()}');p.write_text(s,encoding='utf-8')
p=Path('work/package-dark.py');s=p.read_text().replace("'navigation.js'","'navigation.js','atmosphere.js'");p.write_text(s)
