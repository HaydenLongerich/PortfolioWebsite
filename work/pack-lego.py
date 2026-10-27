from pathlib import Path
import zipfile,re,json
p=Path('work/ldraw');z=zipfile.ZipFile(p/'library.zip'); idx={n.lower().split('/',1)[-1]:n for n in z.namelist()}
s=(p/'mclaren.mpd').read_text(encoding='cp1252'); embedded={}; current=None
for line in s.splitlines():
 if line.startswith('0 FILE '):current=line[7:].strip().replace('\\','/').lower();embedded[current]=[]
 elif current:embedded[current].append(line)
found={};missing=set();queue=list(embedded);seen=set()
while queue:
 name=queue.pop()
 if name in seen:continue
 seen.add(name)
 if name in embedded:lines=embedded[name]
 else:
  key=next((x for x in ['parts/'+name,'p/'+name,name] if x in idx),None)
  if key is None:missing.add(name);continue
  lines=z.read(idx[key]).decode('cp1252').splitlines();found[name]=lines
 for line in lines:
  if line.startswith('1 '):
   parts=line.split(maxsplit=14)
   if len(parts)==15:queue.append(parts[14].strip().replace('\\','/').lower())
config=z.read(idx['ldconfig.ldr']).decode('cp1252');(p/'LDConfig.ldr').write_text(config,encoding='utf-8')
(p/'packed.mpd').write_text(s+'\n'+'\n'.join('0 FILE '+n+'\n'+'\n'.join(lines) for n,lines in found.items()),encoding='utf-8')
(p/'parts-info.json').write_text(json.dumps({n:lines[:12] for n,lines in {**embedded,**found}.items()}))
print('embedded',len(embedded),'library',len(found),'missing',missing)
for name in ['CAreadme.txt','CAlicense.txt','Readme.txt']:
 if name.lower() in idx:(p/name).write_bytes(z.read(idx[name.lower()]))
