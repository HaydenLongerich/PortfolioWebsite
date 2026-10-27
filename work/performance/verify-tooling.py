from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import xml.etree.ElementTree as ET,urllib.request
root=Path('work/apex/dist')
class Page(HTMLParser):
 def __init__(self):super().__init__();self.tools=[];self.groups=[];self.paths=[];self.ids=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'data-tool' in a:self.tools.append(a['data-tool'])
  if 'data-tool-group' in a:self.groups.append(a['data-tool-group'])
  if 'id' in a:self.ids.append(a['id'])
  for k in ['href','src']:
   if k in a:self.paths.append(a[k])
p=Page();p.feed((root/'tools.html').read_text(encoding='utf-8'))
assert len(p.tools)==23 and len(set(p.tools))==23
assert len(p.groups)==5 and len(p.ids)==len(set(p.ids))
for url in p.paths:
 u=urlsplit(url)
 if not u.scheme and u.path:assert (root/unquote(u.path)).exists(),url
for icon in (root/'assets/tool-icons').glob('*.svg'):ET.parse(icon)
print('Validated 23 unique tools, 5 categories, all local links and SVG assets.')
try:
 with urllib.request.urlopen('https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/LICENSE',timeout=15) as r:(root/'assets/tool-icons/DEVICON-LICENSE.txt').write_bytes(r.read())
 print('Devicon license saved.')
except Exception as e:print('License fetch:',e)
for path in ['tools.html','tooling.js','assets/tool-icons/python.svg']:
 try:
  with urllib.request.urlopen('http://127.0.0.1:8765/'+path,timeout=5) as r:print(path,r.status)
 except Exception as e:print('Local preview:',e)
