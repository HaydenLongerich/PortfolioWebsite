from pathlib import Path
import re
r=Path('work/apex/dist')
p=r/'app.js';s=p.read_text(encoding='utf-8');s=re.sub(r'overview:`.*?`};', 'overview:`<p class="eyebrow">PORTFOLIO</p><h2>Hayden Longerich</h2><p>Portfolio sections are under development.</p><div class="modal-links"><a href="assets/Hayden-Longerich-Resume.pdf" target="_blank" rel="noopener">Resume ↗</a><a href="https://github.com/HaydenLongerich" target="_blank" rel="noopener">GitHub ↗</a><a href="https://www.linkedin.com/in/hayden-longerich/" target="_blank" rel="noopener">LinkedIn ↗</a></div>`};',s,flags=re.S);p.write_text(s,encoding='utf-8')
for p in r.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('src="app.js"','src="app.js?v=racing11"');p.write_text(s,encoding='utf-8')
for name in ['work','about','tools','contact']:
 s=(r/(name+'.html')).read_text(encoding='utf-8');section=re.search(r'<main>(.*?)<footer>',s,re.S).group(1)
 assert 'This section is under development.' in section
 assert 'data-dialog' not in section and 'project-art' not in section
s=(r/'index.html').read_text(encoding='utf-8');assert "Proof that I love building things.<br><span>yes, that's my actual room." in s
print('Verified all four placeholders and room caption.')
