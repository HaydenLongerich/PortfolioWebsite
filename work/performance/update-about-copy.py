from pathlib import Path
import re
root=Path('work/apex/dist')
p=root/'app.js';s=p.read_text(encoding='utf-8')
about="""<p>Hey I'm Hayden, A Software Engineer studying at the University of Windsor. I love building things, from LEGO models to software. I’m curious about how things work and enjoy turning ideas into reality and figuring out ways to improve efficiency.</p><p>I’ve worked on projects like Cortex, a shared-context AI workspace for teams, and altF4 invest, an investing education and simulation platform, LEGO collection databases and many more.</p><p>Feel free to reach out for a chat!</p>"""
pattern=r'(overview:`<p class="eyebrow">PORTFOLIO</p><h2>Hayden Longerich</h2>).*?(<div class="modal-links">)'
s,count=re.subn(pattern,lambda m:m.group(1)+about+m.group(2),s,count=1,flags=re.S)
assert count==1
p.write_text(s,encoding='utf-8')
for p in root.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('app.js?v=nav15','app.js?v=about16');p.write_text(s,encoding='utf-8')
