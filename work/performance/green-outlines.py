from pathlib import Path
r=Path('work/apex/dist')
for p in r.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('</head>','<link rel="stylesheet" href="edge-effects.css?v=edges31"></head>').replace('</body>','<script src="edge-effects.js?v=edges31" defer></script></body>');p.write_text(s,encoding='utf-8')
p=Path('work/package-dark.py');s=p.read_text().replace("'navigation.js'","'navigation.js','edge-effects.js','edge-effects.css'");p.write_text(s)
