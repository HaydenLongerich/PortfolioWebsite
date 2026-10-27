from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text().replace('mobile?6.7:4.2,mobile?4.4:2.7,mobile?-8.5:-4.4','mobile?6.7:5,mobile?4.4:3,mobile?-8.5:-5.2');p.write_text(s)
p=Path('work/apex/dist/index.html');s=p.read_text(encoding='utf8').replace('experience.js?v=centered','experience.js?v=centered2');p.write_text(s,encoding='utf8')
