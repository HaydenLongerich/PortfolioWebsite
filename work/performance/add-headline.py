from pathlib import Path
r=Path('work/apex/dist');p=r/'index.html';s=p.read_text(encoding='utf-8');old='<div class="landing-content"><h1>'
assert old in s
s=s.replace(old,'<div class="landing-content"><p class="hero-summary">Software Engineer <span aria-hidden="true">|</span> Windsor &amp; Toronto</p><h1>',1).replace('pages.css?v=actions17','pages.css?v=headline18');p.write_text(s,encoding='utf-8')
