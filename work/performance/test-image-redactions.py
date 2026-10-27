from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
import json,unittest
ROOT=Path(__file__).resolve().parents[2]
class RedactionTests(unittest.TestCase):
 def test_only_approved_regions_changed(self):
  private=ROOT/'work/apex/private/media-originals'
  records=json.loads((private/'redactions.json').read_text())
  self.assertEqual(len(records),6)
  for record in records:
   with Image.open(private/record['source']) as original,Image.open(ROOT/'work/apex/dist'/record['public']) as public:
    original=original.convert('RGB');public=public.convert('RGB');self.assertEqual(original.size,public.size)
    difference=ImageChops.difference(original,public)
    allowed=Image.new('L',original.size,0);draw=ImageDraw.Draw(allowed)
    for x1,y1,x2,y2 in record['boxes']:
     self.assertIsNotNone(difference.crop((x1,y1,x2,y2)).getbbox(),record['public'])
     draw.rectangle((x1,y1,x2-1,y2-1),fill=255)
    outside=Image.composite(difference,Image.new('RGB',original.size),ImageChops.invert(allowed))
    self.assertIsNone(outside.getbbox(),record['public'])
if __name__=='__main__':unittest.main(verbosity=2)
