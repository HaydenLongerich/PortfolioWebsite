from pathlib import Path
import re
r=Path('work/apex/dist')
for p in r.glob('*.html'):
 s=p.read_text(encoding='utf-8');s=re.sub(r'edge-effects.css\?v=[^"\s]+','edge-effects.css?v=palette34',s);s=re.sub(r'edge-effects.js\?v=[^"\s]+','edge-effects.js?v=palette34',s)
 s=s.replace('</head>','<link rel="preload" href="assets/fonts/mona-sans.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="palette.css?v=palette34"></head>');p.write_text(s,encoding='utf-8')
p=r/'portfolio.css';s=p.read_text(encoding='utf-8');s=re.sub(r"@import url\('[^']*'\);",'',s);p.write_text(s,encoding='utf-8')
p=r/'experience.js';s=p.read_text(encoding='utf-8').replace('vec3(1.,.63,.22)','vec3(.72,.85,.43)');p.write_text(s,encoding='utf-8')
p=r/'index.html';s=p.read_text(encoding='utf-8');s=re.sub(r'experience.js\?v=[^"\s]+','experience.js?v=palette34',s);p.write_text(s,encoding='utf-8')
p=Path('work/package-dark.py');s=p.read_text().replace("'edge-effects.css'","'edge-effects.css','palette.css'");s=s.replace('for name in files:(dst/name).parent.mkdir',"files += [str(p.relative_to(src)).replace('\\\\','/') for p in sorted((src/'assets/fonts').glob('*'))]\nfor name in files:(dst/name).parent.mkdir");p.write_text(s)
