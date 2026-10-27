from pathlib import Path
import zipfile,re,json,urllib.request,concurrent.futures
p=Path('work/ldraw');cache=p/'extra';cache.mkdir(exist_ok=True);z=zipfile.ZipFile(p/'latest.zip');idx={n.lower().split('/',1)[-1]:n for n in z.namelist()}
s=(p/'mclaren.mpd').read_text(encoding='cp1252');embedded={};current=None
for line in s.splitlines():
 if line.startswith('0 FILE '):current=line[7:].strip().replace('\\','/').lower();embedded[current]=[]
 elif current:embedded[current].append(line)
found={};missing=set();queue=set(embedded);seen=set()
def fetch(name):
 file=cache/name.replace('/','_')
 if file.exists():return name,file.read_text(encoding='utf-8').splitlines()
 paths=['parts/'+name,'p/'+name] if not name.startswith(('48/','8/')) else ['p/'+name]
 for prefix in ['official','unofficial']:
  for path in paths:
   try:
    u='https://library.ldraw.org/library/'+prefix+'/'+path
    raw=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=15).read().decode('utf-8')
    if not raw.startswith('0 '):continue
    file.write_text(raw,encoding='utf-8');return name,raw.splitlines()
   except Exception:pass
 # Printed surfaces can retain original geometry even without decals.
 base=re.sub(r'p[a-z0-9]+(?=\.dat)','',name)
 if base!=name:
  key='parts/'+base
  if key in idx:return name,['0 '+name,'0 !LDRAW_ORG Part','1 16 0 0 0 1 0 0 0 1 0 0 0 1 '+base]
 return name,None
while queue:
 batch=queue-seen;queue=set();seen.update(batch);unresolved=[];resolved={}
 for name in batch:
  if name in embedded:resolved[name]=embedded[name];continue
  key=next((x for x in ['parts/'+name,'p/'+name,name] if x in idx),None)
  if key:resolved[name]=z.read(idx[key]).decode('cp1252').splitlines()
  else:unresolved.append(name)
 if unresolved:
  print('Fetching',len(unresolved),'parts',flush=True)
  with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
   for name,lines in pool.map(fetch,unresolved):
    if lines:resolved[name]=lines
    else:missing.add(name)
 for name,lines in resolved.items():
  if name not in embedded:found[name]=lines
  for line in lines:
   if line.startswith('1 '):
    parts=line.split(maxsplit=14)
    if len(parts)==15:queue.add(parts[14].strip().replace('\\','/').lower())
(p/'packed.mpd').write_text(s+'\n'+'\n'.join('0 FILE '+n+'\n'+'\n'.join(lines) for n,lines in found.items()),encoding='utf-8')
(p/'parts-info.json').write_text(json.dumps({n:lines[:12] for n,lines in {**embedded,**found}.items()}))
print('embedded',len(embedded),'library',len(found),'missing',missing,flush=True)

