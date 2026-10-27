from pathlib import Path
from html.parser import HTMLParser
import json,re
root=Path('work/apex/dist');p=root/'tools.html';s=p.read_text(encoding='utf-8').replace('<p>Tools and<br>counting</p>','<p>Tools and <br>counting</p>');p.write_text(s,encoding='utf-8')
class Read(HTMLParser):
 def __init__(self):super().__init__();self.names=[];self.ids=[];self.count=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if 'data-tool' in a:
   self.names.append(a['data-tool']);assert a.get('aria-haspopup')=='dialog';assert a.get('aria-controls')=='toolModal'
p=Read();p.feed(s);assert len(p.names)==24==len(set(p.names));assert p.names.index('Codex')+1==p.names.index('Claude');assert 'tooling-detail' not in s
assert 'The various tools I use when building cool things' in s
assert len(p.ids)==len(set(p.ids));assert all(i in p.ids for i in ['toolModal','toolModalTitle','toolModalSummary','toolModalUses'])
Path('work/performance/tooling-tile-names.json').write_text(json.dumps(p.names))
f=Path('work/performance/tooling-evidence.json');data=json.loads(f.read_text());data['additional_confirmed_usage']={'Codex':'Explicitly requested by user; used throughout this portfolio build.'};f.write_text(json.dumps(data,indent=2))
print('Verified 24 unique dialog controls, Codex order, modal accessibility IDs and all requested copy changes.')
