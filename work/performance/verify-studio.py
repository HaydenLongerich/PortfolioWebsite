from pathlib import Path
from PIL import Image
import urllib.request
root=Path('work/apex/dist/assets/studio')
for i in range(72):
 for layer in ['exterior','interior']:
  p=root/f'{layer}-{i:02}.webp'
  with Image.open(p) as im:assert im.size==(960,600);im.verify()
print('Verified all 144 images; 72 complete matched angle pairs')
for i in [0,18,36,54,71]:
 for layer in ['exterior','interior']:
  url=f'http://127.0.0.1:8765/assets/studio/{layer}-{i:02}.webp'
  with urllib.request.urlopen(url) as r:assert r.status==200
print('Representative frames and wraparound served HTTP 200')
print('Total frame library:',sum(p.stat().st_size for p in root.glob('*.webp')),'bytes; loaded on demand')
