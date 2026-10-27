from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
r=Path('work/apex/dist')
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for k in ['src','href']:
   if k in a:self.links.append(a[k])
for name in ['index','work','about','tools','contact']:
 s=(r/(name+'.html')).read_text(encoding='utf-8');p=Page();p.feed(s);assert len(p.ids)==len(set(p.ids));assert '>longerich<span>' in s
 for link in p.links:
  u=urlsplit(link)
  if u.scheme:continue
  target=r/unquote(u.path) if u.path else r/(name+'.html');assert target.exists(),(name,link)
  if u.fragment and target.suffix=='.html':
   q=Page();q.feed(target.read_text(encoding='utf-8'));assert u.fragment in q.ids
s=(r/'index.html').read_text(encoding='utf-8');assert '<span>Longerich</span>' in s and 'Résumé' not in s and 'id="carFlip"' in s
js=(r/'experience.js').read_text(encoding='utf-8');assert 'targetPitch=Math.max' not in js;assert 'down.pitch+dy*.008' in js;assert 'pivot.position.y=centerY' in js
assert 'uTail' in js and 'revealEdge' in js
assert '2600' in (r/'atmosphere.js').read_text(encoding='utf-8')
print('PASS: five-page links, unique IDs, all text annotations, unbounded pitch, centered pivot, reveal shader hooks and scroll duration')
