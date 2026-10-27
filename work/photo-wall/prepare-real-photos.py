from pathlib import Path
from PIL import Image,ImageOps
import json,base64,io,re
root=Path(__file__).resolve().parents[2]/'work/apex/dist'
source=Path(__file__).resolve().parent/'src'
out=root/'assets/life-photos'
items=json.loads(re.search(r'PHOTO_ITEMS = (\[.*?\])\s*\.map',(source/'photos.js').read_text(encoding='utf-8'),re.S).group(1))
meta={}
for item in items:
 name=item['file'];path=out/name if name.startswith('life-') else root/'assets/projects'/name
 im=ImageOps.exif_transpose(Image.open(path)).convert('RGB');w,h=im.size;stem=Path(name).stem;sources=[]
 for width in [480,960,1600]:
  if width>=w:continue
  small=im.copy();small.thumbnail((width,round(h*width/w)),Image.Resampling.LANCZOS)
  target=f'{stem}-{width}.webp';small.save(out/target,'WEBP',quality=93,method=5);sources.append(f'assets/life-photos/{target} {small.width}w')
 tiny=im.copy();tiny.thumbnail((24,24));buf=io.BytesIO();tiny.save(buf,'WEBP',quality=35)
 src=path.relative_to(root).as_posix()
 meta[name]={'width':w,'height':h,'src':src,'srcSet':', '.join(sources+[f'{src} {w}w']),'thumbnail':sources[min(1,len(sources)-1)].split(' ')[0] if sources else src,'placeholder':'data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()}
(source/'image-meta.json').write_text(json.dumps(meta),encoding='utf-8')
(out/'SOURCES.txt').write_text('User-supplied real photographs. Selected sunset photos removed. Truck unit numbers blurred using precise pixel edits. Responsive copies and placeholders use the redacted image. No generative editing. Private originals are not part of the release.\n',encoding='utf-8')
print('Prepared',len(items),'photos from current approved local sources')
