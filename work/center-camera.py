from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text().replace('mobile?6.7:6.5,mobile?4.4:3.5,mobile?-8.5:-6.2','mobile?6.7:4.8,mobile?4.4:2.8,mobile?-8.5:-4.8');p.write_text(s)
