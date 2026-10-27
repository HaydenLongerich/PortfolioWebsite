from pathlib import Path
import sys,unittest,re,json,hashlib,zipfile,io
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from PIL import Image,PngImagePlugin
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'work'))
import runpy
FILES=runpy.run_path(str(ROOT/'work/package-dark.py'))['FILES']
from release_privacy import strip_image_metadata
OUT=ROOT/'outputs/cloudflare-pages'
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tags=[];self.in_script=False;self.inline=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append((tag,a))
  if tag=='script' and not a.get('src'):self.inline=True
class ReleaseTests(unittest.TestCase):
 def test_exact_manifest_and_zip(self):
  actual={p.relative_to(OUT).as_posix() for p in OUT.rglob('*') if p.is_file()}
  self.assertEqual(actual,set(FILES));self.assertLess(len(actual),1000)
  with zipfile.ZipFile(ROOT/'outputs/cloudflare-pages.zip') as z:self.assertEqual(set(z.namelist()),actual)
  for name in actual:
   self.assertFalse(any(part.startswith('.') for part in Path(name).parts));self.assertNotRegex(name,r'(?i)(resume|private|server\.py|\.map$|\.env|node_modules|SOURCES\.txt|README)')
   self.assertLessEqual((OUT/name).stat().st_size,25*1024**2)
 def test_no_secret_patterns_or_private_paths(self):
  pattern=r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|sk_live_[A-Za-z0-9]{16,}|C:[/\\]Users[/\\]|AppData[/\\]Local'
  for p in OUT.rglob('*'):
   if p.suffix in ('.html','.js','.json','.css','.svg'):self.assertNotRegex(p.read_text(encoding='utf-8',errors='replace'),pattern,msg=str(p))
 def test_headers(self):
  h=(OUT/'_headers').read_text(encoding='utf-8');self.assertIn("script-src 'self';",h);self.assertNotIn("'unsafe-eval'",h);self.assertNotIn("script-src 'self' 'unsafe-inline'",h)
  for directive in ["connect-src 'self'","frame-ancestors 'none'","object-src 'none'","base-uri 'none'","form-action 'none'","X-Content-Type-Options: nosniff","Referrer-Policy: no-referrer","Cross-Origin-Resource-Policy: same-origin"]:self.assertIn(directive,h)
 def test_document_resources_and_contact_fallback(self):
  for p in OUT.glob('*.html'):
   parser=Parser();parser.feed(p.read_text(encoding='utf-8'));self.assertFalse(parser.inline,p.name)
   for tag,a in parser.tags:
    self.assertFalse(any(k.startswith('on') for k in a),p.name)
    if a.get('target')=='_blank':self.assertTrue({'noopener','noreferrer'}.issubset(a.get('rel','').split()))
    for key in ('src','poster','href'):
     value=a.get(key,'')
     if not value or value.startswith(('#','mailto:','data:')):continue
     url=urlsplit(value)
     if url.scheme or url.netloc:
      self.assertEqual(tag,'a',f'External subresource: {p.name} {value}');self.assertEqual(url.scheme,'https');continue
     target=OUT/(unquote(url.path.lstrip('/')) or 'index.html')
     self.assertTrue(target.is_file(),f'Missing resource: {p.name} {value}')
  text=(OUT/'contact.html').read_text(encoding='utf-8');self.assertIn('method="post"',text);self.assertIn('id="contactFields" disabled',text)
  self.assertIn('fields.disabled=false',(OUT/'contact.js').read_text(encoding='utf-8'))
 def test_no_active_svg_or_external_css(self):
  for p in OUT.rglob('*.svg'):
   s=p.read_text(encoding='utf-8');self.assertNotRegex(s,r'(?i)<script|<foreignObject|\son[a-z]+\s*=|(?:href|src)=["\'](?:https?:|javascript:)')
  for p in OUT.glob('*.css'):self.assertNotRegex(p.read_text(encoding='utf-8'),r'url\(["\']?https?://')
 def test_metadata_and_pixels(self):
  manifest=json.loads((ROOT/'outputs/release-manifest.json').read_text(encoding='utf-8'))
  for p in OUT.rglob('*'):
   if p.suffix.lower() in ('.png','.jpg','.jpeg','.webp'):
    with Image.open(p) as im:
     self.assertFalse(im.getexif(),str(p));self.assertFalse(any(k.lower() in ('exif','xmp','xml:com.adobe.xmp','comment','description','author','date:create','date:modify') for k in im.info),str(p))
  for name in manifest['metadata_stripped']:
   with Image.open(ROOT/'work/apex/dist'/name) as src,Image.open(OUT/name) as dst:self.assertEqual(src.convert('RGBA').tobytes(),dst.convert('RGBA').tobytes(),name)
 def test_metadata_removal_handles_private_text(self):
  im=Image.new('RGB',(2,2),'red');meta=PngImagePlugin.PngInfo();meta.add_text('Description','Private location');buf=io.BytesIO();im.save(buf,format='PNG',pnginfo=meta)
  clean=strip_image_metadata(buf.getvalue(),'.png')
  with Image.open(io.BytesIO(clean)) as restored:self.assertNotIn('Description',restored.info);self.assertEqual(restored.tobytes(),im.tobytes())
 def test_owner_confirmed_demo_screenshots_are_included(self):
  for name in ['advisory-4.jpg','advisory-5.jpg','invest-5.jpg']+[f'invest-{i}-redacted.png' for i in [3,4,6,7,8]]:
   self.assertTrue((OUT/'assets/projects'/name).is_file(),name)
   self.assertIn(name,(OUT/'projects.js').read_text(encoding='utf-8'))
 def test_removed_sunsets_and_unredacted_screenshots_cannot_ship(self):
  names=[p.relative_to(OUT).as_posix() for p in OUT.rglob('*') if p.is_file()]
  self.assertFalse(any(Path(n).name.startswith(('life-02','life-03')) for n in names))
  for i in [3,4,6,7,8]:self.assertNotIn(f'assets/projects/invest-{i}.jpg',names)
 def test_release_hashes(self):
  manifest=json.loads((ROOT/'outputs/release-manifest.json').read_text(encoding='utf-8'))
  for name,digest in manifest['sha256'].items():self.assertEqual(hashlib.sha256((OUT/name).read_bytes()).hexdigest(),digest)
if __name__=='__main__':unittest.main(verbosity=2)
