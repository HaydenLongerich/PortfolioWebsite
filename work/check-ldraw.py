from pathlib import Path
s=Path('work/ldraw/packed.mpd').read_text(encoding='utf8'); files={};name=''
for l in s.splitlines():
 if l.startswith('0 FILE '):name=l[7:].lower();files[name]=[]
 elif l.startswith('1 '):
  a=l.split(maxsplit=14)
  if len(a)==15:files[name].append(a[14].lower().replace('\\','/'))
done=set()
def visit(n,path):
 if n in path:print('CYCLE',path[path.index(n):]+[n]);return
 if n in done:return
 done.add(n)
 for k in files.get(n,[]):visit(k,path+[n])
visit('main.ldr',[])
print('Visited',len(done),'Files',len(files),'missing',done-set(files))
