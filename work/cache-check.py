import json
x=json.load(open('work/ldraw/cache-debug.json'));done=set()
def walk(n,path):
 if n in path:print('CYCLE',path[path.index(n):]+[n]);return
 if n in done:return
 done.add(n)
 for k in x.get(n,{}).get('sub',[]) or []:walk(k.lower(),path+[n])
for n in x:walk(n,[])
print('missing',done-set(x))
print('empty entries',[(k,v) for k,v in x.items() if not v])
