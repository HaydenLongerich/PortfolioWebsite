from pathlib import Path
root=Path('work/apex/dist')
for p in root.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('pages.css?v=clean8','pages.css?v=music9');s=s.replace('</body>','<script src="music.js?v=music9" defer></script></body>');p.write_text(s,encoding='utf-8')
p=Path('work/package-dark.py');s=p.read_text().replace("'navigation.js'","'navigation.js','music.js'").replace("'LDRAW-CREDITS.txt'","'background-music.mp3','LDRAW-CREDITS.txt'");p.write_text(s)
