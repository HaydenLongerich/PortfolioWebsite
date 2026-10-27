from pathlib import Path
import urllib.request,concurrent.futures
r=Path('work/apex/dist/assets/fonts');r.mkdir(exist_ok=True)
items=[('mona-sans.woff2','https://raw.githubusercontent.com/github/mona-sans/main/fonts/webfonts/variable/MonaSansVF%5Bwdth%2Cwght%2Copsz%2Cital%5D.woff2'),('OFL.txt','https://raw.githubusercontent.com/github/mona-sans/main/OFL.txt')]
def get(item):
 name,url=item;data=urllib.request.urlopen(url,timeout=30).read();(r/name).write_bytes(data);return name,len(data)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for result in pool.map(get,items):print(*result)
