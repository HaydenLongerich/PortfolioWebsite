import urllib.request,pathlib
p=pathlib.Path('work/ldraw')
for name,url in [('complete.zip','https://library.ldraw.org/library/updates/complete.zip'),('LDrawLoader.js','https://raw.githubusercontent.com/mrdoob/three.js/r180/examples/jsm/loaders/LDrawLoader.js')]:
 try:
  urllib.request.urlretrieve(url,p/name); print(name,(p/name).stat().st_size,flush=True)
 except Exception as e: print(e,flush=True)
