from pathlib import Path
import re
root=Path('work/apex/dist')
labels={'Index':'Home','Work':'Experience','About':'Projects','Tools':'Tooling'}
for p in root.glob('*.html'):
 s=p.read_text(encoding='utf-8')
 def menu_update(match):
  nav=match.group(0)
  nav=re.sub(r'<a\b[^>]*>\s*↳\s*<span>Explore</span>\s*</a>','',nav)
  for old,new in labels.items():nav=nav.replace('<span>'+old+'</span>','<span>'+new+'</span>')
  return nav
 s=re.sub(r'<nav id="page-menu".*?</nav>',menu_update,s,flags=re.S)
 if p.name in ['work.html','about.html','tools.html']:
  old={'work.html':'Work','about.html':'About','tools.html':'Tools'}[p.name];new=labels[old]
  s=s.replace('<title>'+old+' —','<title>'+new+' —').replace('— '+old+'. This section','— '+new+'. This section').replace('<h1>'+old+'</h1>','<h1>'+new+'</h1>').replace('/ '+old.upper()+'</p>','/ '+new.upper()+'</p>')
 s=re.sub(r'app.js\?v=[^"\s]+','app.js?v=nav15',s)
 s=re.sub(r'pages.css\?v=[^"\s]+','pages.css?v=nav15',s)
 p.write_text(s,encoding='utf-8')
p=root/'app.js';s=p.read_text(encoding='utf-8');s=s.replace('<p>Portfolio sections are under development.</p>', '<p>I love building things, from LEGO models to software. I’m curious about how things work and enjoy turning ideas into something you can explore.</p><p>I’ve worked on <strong>Cortex</strong>, a shared-context AI workspace for teams, and <strong>altF4 invest</strong>, an investing education and simulation platform.</p>');p.write_text(s,encoding='utf-8')
p=root/'pages.css';s=p.read_text(encoding='utf-8')+'\n.side-nav a span{width:auto;min-width:78px}.side-nav a{white-space:nowrap}\n';p.write_text(s,encoding='utf-8')
