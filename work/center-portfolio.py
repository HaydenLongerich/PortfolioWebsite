from pathlib import Path
import shutil
p=Path('work/apex/dist')
shutil.copy2(r'C:/Users/kooga/AppData/Local/Temp/codex-clipboard-c3acc11e-4789-4710-a90a-c94a76cf9d14.png',p/'assets/lego-wall.png')
shutil.copy2(r'C:/Users/kooga/Downloads/Resume_HaydenLongerich (3).pdf',p/'assets/Hayden-Longerich-Resume.pdf')
s=(p/'index.html').read_text(encoding='utf-8')
a=s.index('<main><section');b=s.index('<section id="work"',a)
old=s[a:b];car=old[old.index('<div id="carViewport"'):old.index('<div class="hero-foot"')]
s=s[:a]+'''<main><section class="landing" id="home"><img class="landing-photo" src="assets/lego-wall.png" alt="An illuminated collection of LEGO supercars, with a Titanic model below"><div class="landing-shade"></div><div class="landing-content"><h1>Hayden<br><span>Longerich.</span></h1><div class="landing-actions"><a class="primary" href="#work">Explore my work <span>↗</span></a><a class="resume-button" href="assets/Hayden-Longerich-Resume.pdf" target="_blank" rel="noopener">Résumé <span>↗</span></a></div></div><a class="landing-scroll" href="#mclaren"><span>SCROLL TO EXPLORE</span><b>↓</b></a></section><section class="hero model-section" id="mclaren"><div class="model-intro"><p class="eyebrow">A CLOSER LOOK</p><h2>Built to be <em>explored.</em></h2></div>'''+car+'''<a class="model-next" href="#work">Next: selected work ↓</a></section>'''+s[b:]
s=s.replace('<a class="identity" href="#home">hayden longerich<span>Independent thinking. Shared ambition.</span></a>','<a class="identity" href="#home" aria-label="Hayden Longerich home">HL<span>© 2026</span></a>')
s=s.replace('<a href="#work">01 <span>Work</span></a>','<a href="#mclaren">↳ <span>Explore</span></a><a href="#work">01 <span>Work</span></a>')
s=s.replace('<link rel="stylesheet" href="dark.css">','<link rel="stylesheet" href="dark.css"><link rel="stylesheet" href="centered.css">')
(p/'index.html').write_text(s,encoding='utf-8')
