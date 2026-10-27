from pathlib import Path
r=Path('work/apex/dist')
p=r/'index.html';s=p.read_text(encoding='utf-8').replace("yes, that's my actual room.","yes, that's my actual wall.");p.write_text(s,encoding='utf-8')
for p in r.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('pages.css?v=racing11','pages.css?v=black12');p.write_text(s,encoding='utf-8')
