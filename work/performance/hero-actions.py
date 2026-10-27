from pathlib import Path
import re
r=Path('work/apex/dist');p=r/'index.html';s=p.read_text(encoding='utf-8')
old='<a class="primary" href="work.html">Explore my work <span>↗</span></a>'
new='<a class="primary" href="about.html">Explore my projects <span>↗</span></a><a class="resume-button experience-button" href="work.html">Experience <span>↗</span></a>'
assert old in s
s=s.replace(old,new)
p.write_text(s,encoding='utf-8')
for p in r.glob('*.html'):
 s=p.read_text(encoding='utf-8');s=re.sub(r'pages.css\?v=[^"\s]+','pages.css?v=actions17',s);p.write_text(s,encoding='utf-8')
