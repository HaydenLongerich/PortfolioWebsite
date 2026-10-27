from pathlib import Path
import re,urllib.request,concurrent.futures,json
r=Path('work/apex/dist');p=r/'tools.html';s=p.read_text(encoding='utf-8')
pattern=r'<section class="tool-group[^\"]*"[^>]*>.*?</section>'
groups=list(re.finditer(pattern,s,re.S));assert len(groups)==5
byname={re.search(r'aria-label="([^"]+)"',m.group()).group(1):m.group() for m in groups}
dev=byname['Developer tools'];git=re.search(r'<li><button[^>]*data-tool="Git".*?</li>',dev,re.S).group()
backend=byname['Backend & data'];backend=backend.replace('Backend & data','Backend &amp; Infrastructure').replace('<span>03</span></div>','<span>06</span></div>')
extra=[]
for name,key,description,color in [('Linux','linux','Another place I write and run code','#e8cb70'),('PostgreSQL','postgresql','A database for working with related data','#80b7e0')]:
 extra.append(f'<li><button type="button" class="tool-tile" data-tool="{name}" data-description="{description}" style="--tool-color:{color}" aria-haspopup="dialog" aria-controls="toolModal"><img class="tool-logo logo-{key}" src="assets/tool-icons/{key}.svg" width="36" height="36" alt="" loading="lazy" decoding="async"><span>{name}</span></button></li>')
backend=backend.replace('</ul>',git+''.join(extra)+'</ul>');s=s.replace(byname['Backend & data'],backend).replace(dev,'')
s=s.replace('<h2><span>V</span>AI & automation','<h2><span>IV</span>AI & automation').replace('<strong>24</strong>','<strong>23</strong>').replace('All <small>24</small>','All <small>23</small>').replace('24 tools · 5 categories','23 tools · 4 categories').replace('tooling.js?v=casual22','tooling.js?v=infra23').replace('pages.css?v=tooling20','pages.css?v=infra23');p.write_text(s,encoding='utf-8')
p=r/'tooling.js';s=p.read_text(encoding='utf-8');a=s.index('const usage=')+len('const usage=');b=s.index('\nconst tiles=',a);data=json.loads(s[a:b].strip().rstrip(';'))
for name in ['VS Code','IntelliJ IDEA','CLion']:del data[name]
data['Linux']=[['Working in Linux','Linux is one of the operating systems I’ve worked with']]
data['PostgreSQL']=[['Working with data','I use PostgreSQL to store related data and query it with SQL']]
s=s[:a]+json.dumps(data,ensure_ascii=False,indent=1)+';'+s[b:];p.write_text(s,encoding='utf-8')
def fetch(key):
 url=f'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/{key}/{key}-original.svg';data=urllib.request.urlopen(url,timeout=20).read();assert b'<svg' in data;(r/'assets/tool-icons'/(key+'.svg')).write_bytes(data);return key
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for key in pool.map(fetch,['linux','postgresql']):print(key,'icon saved')
