from pathlib import Path
import re
root=Path('work/apex/dist')
for number,name in enumerate(['work','about','tools','contact'],1):
 p=root/(name+'.html');s=p.read_text(encoding='utf-8')
 a=s.index('<main>');b=s.index('<footer>',a)
 s=s[:a]+f'<main><section id="{name}" class="section development"><p class="eyebrow">0{number} / {name.upper()}</p><h1>{name.title()}</h1><p class="development-message">This section is under development.</p></section>'+s[b:]
 s=re.sub(r'<title>.*?</title>',f'<title>{name.title()} — Hayden Longerich</title>',s)
 s=re.sub(r'<meta name="description" content="[^"]*">',f'<meta name="description" content="Hayden Longerich — {name.title()}. This section is under development.">',s)
 p.write_text(s,encoding='utf-8')
p=root/'index.html';s=p.read_text(encoding='utf-8');s=s.replace('<div class="model-stage"', '<p class="room-caption">Proof that I love building things.<br><span>yes, that\'s my actual room.</span></p><div class="model-stage"',1);p.write_text(s,encoding='utf-8')
for p in root.glob('*.html'):
 s=p.read_text(encoding='utf-8');s=re.sub(r'pages.css\?v=[^"\s]+','pages.css?v=racing11',s);p.write_text(s,encoding='utf-8')
