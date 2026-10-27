from pathlib import Path
import re
root=Path('work/apex/dist')
for p in root.glob('*.html'):
 s=p.read_text(encoding='utf-8')
 s=re.sub(r'<p class="model-credit">.*?</p>','',s,flags=re.S)
 s=re.sub(r'<span class="stage-caption">.*?</span>','',s,flags=re.S)
 s=re.sub(r'<label class="rotation-control"[^>]*>.*?</label>','',s,flags=re.S)
 s=re.sub(r'<a class="model-next"[^>]*>.*?</a>','',s,flags=re.S)
 s=s.replace('?v=drive7','?v=clean8')
 p.write_text(s,encoding='utf-8')
p=root/'experience.js';s=p.read_text(encoding='utf-8')
s=s.replace("slider=document.querySelector('#carRotation'),",'').replace(",flip=document.querySelector('#carFlip')",'')
s=re.sub(r"slider.value=String\(\(\(orbit-Math.PI\).*?;if\(document.activeElement!==flip\)flip.value=.*?;",'',s)
s=re.sub(r'^slider.oninput=.*?;\s*$','',s,flags=re.M)
s=re.sub(r'^flip.oninput=.*?;\s*$','',s,flags=re.M)
p.write_text(s,encoding='utf-8')
assert not re.search(r'\b(slider|flip)\b',s),'Remaining removed control references'
for name in ['index','work','about','tools','contact']:
 s=(root/(name+'.html')).read_text(encoding='utf-8')
 assert all(x not in s for x in ['model-credit','stage-caption','rotation-control','model-next'])
print('Removed all five annotated items; no dangling slider references.')
