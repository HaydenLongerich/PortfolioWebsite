from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text().replace('PerspectiveCamera(34','PerspectiveCamera(30').replace('mobile?6.7:4.8,mobile?4.4:2.8,mobile?-8.5:-4.8','mobile?6.7:4.2,mobile?4.4:2.7,mobile?-8.5:-4.4');p.write_text(s)
p=Path('work/apex/dist/index.html');s=p.read_text(encoding='utf8').replace('src="experience.js"','src="experience.js?v=centered"');p.write_text(s,encoding='utf8')
p=Path('work/package-dark.py');s=p.read_text().replace("'dark.css','README.txt'","'dark.css','centered.css','README.txt'").replace("'LDRAW-CREDITS.txt']","'LDRAW-CREDITS.txt','lego-wall.png','Hayden-Longerich-Resume.pdf']");p.write_text(s)
