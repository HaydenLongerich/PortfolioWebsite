from pathlib import Path
import re
root=Path('work/apex/dist');s=(root/'index.html').read_text()
s=s.replace('href="#home"','href="index.html"')
for name in ['work','about','tools','contact']:s=s.replace('href="#'+name+'"','href="'+name+'.html"')
s=s.replace('<link rel="stylesheet" href="centered.css">','<link rel="stylesheet" href="centered.css"><link rel="stylesheet" href="pages.css">')
s=s.replace('<script type="module" src="experience.js?v=centered2"></script>','<script src="navigation.js" defer></script>')
s=s.replace('<div class="header-links">','<button class="menu-toggle" aria-expanded="false" aria-controls="page-menu">Menu +</button><div class="header-links">')
s=s.replace('<nav class="side-nav" aria-label="Sections">','<nav id="page-menu" class="side-nav" aria-label="Pages">')
s=s.replace('<div class="reveal-actions">','<div class="view-presets" aria-label="Car views"><button data-angle="3.14159">Three-quarter</button><button data-angle="1.5708">Side</button><button data-angle="0">Rear</button></div><div class="reveal-actions">')
sections={name:re.search(r'<section id="'+name+r'".*?</section>',s,re.S).group() for name in ['work','about','tools','contact']}
head=s[:s.index('<main>')];footer=s[s.index('<footer>'):]
for name,section in sections.items():
 page=head.replace('<body>','<body class="inner-page">').replace('<title>Hayden Longerich — Selected work</title>',f'<title>{name.title()} — Hayden Longerich</title>')
 page=page.replace('href="#mclaren"','href="index.html#mclaren"').replace(' class="active"','')
 page=page.replace(f'href="{name}.html"',f'href="{name}.html" class="active" aria-current="page"')
 if name=='about':section=section.replace('Move over the car and its surface opens up.', '<a href="index.html#mclaren">Explore the McLaren</a> and its surface opens up.')
 if name=='work':
  section=section.replace('<div class="projects">','<div class="project-filters" aria-label="Filter projects"><button data-filter="all" aria-pressed="true">All work <small>02</small></button><button data-filter="cortex" aria-pressed="false">AI & collaboration</button><button data-filter="invest" aria-pressed="false">Education & fintech</button></div><div class="projects">')
  section=section.replace('<article class="project">','<article class="project" data-project="cortex">',1)
  section=section.replace('<article class="project">','<article class="project" data-project="invest">',1)
 (root/(name+'.html')).write_text(page+'<main>'+section+footer)
for section in sections.values():s=s.replace(section,'')
s=s.replace('<body>','<body class="index-page">')
(root/'index.html').write_text(s)
p=root/'app.js';a=p.read_text();a=a[:a.index('const nav=')];p.write_text(a)
