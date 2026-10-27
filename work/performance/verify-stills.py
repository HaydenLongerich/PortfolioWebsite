from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,gzip,struct,urllib.request
root=Path('work/apex/dist')
class Check(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[];self.sections=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='section':self.sections.append(a.get('id'))
  for name in ['href','src']:
   if name in a:self.links.append(a[name])
for page in ['index','work','about','tools','contact']:
 p=Check();p.feed((root/(page+'.html')).read_text());assert len(p.ids)==len(set(p.ids))
 for link in p.links:
  u=urlsplit(link)
  if u.scheme:continue
  target=root/unquote(u.path) if u.path else root/(page+'.html')
  assert target.exists(),(page,link)
  if u.fragment and target.suffix=='.html':
   c=Check();c.feed(target.read_text());assert u.fragment in c.ids,(page,link)
 assert p.sections==(['home','mclaren'] if page=='index' else [page]),(page,p.sections)
 print(page,': links and section structure valid')
for path in ['','work.html','about.html','tools.html','contact.html','assets/car-exterior.webp','assets/car-interior.webp','image-reveal.js','assets/Hayden-Longerich-Resume.pdf']:
 try:
  with urllib.request.urlopen('http://127.0.0.1:8765/'+path,timeout=5) as r:print(path or 'index',r.status)
 except Exception as e:print('HTTP CHECK:',e)
