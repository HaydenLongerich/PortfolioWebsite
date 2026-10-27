import urllib.request,pathlib
p=pathlib.Path('work/ldraw')
u='https://codeload.github.com/pybricks/ldraw/zip/refs/heads/master'
try:
 urllib.request.urlretrieve(u,p/'library.zip');print('Downloaded', (p/'library.zip').stat().st_size,flush=True)
except Exception as e: print(e)
