from pathlib import Path
for p in Path('work/apex/dist').glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('music.js?v=music9','music.js?v=music10');p.write_text(s,encoding='utf-8')
