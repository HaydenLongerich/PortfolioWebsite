from pathlib import Path
s=Path('work/ldraw/mclaren.mpd').read_text(encoding='cp1252');main=s.split('0 FILE ')[1];print(main[-6000:])
import json,collections
j=json.loads(Path('work/apex/dist/assets/mclaren-p1.json').read_text()); far=[x for x in j['instances'] if x['matrix'][12]>350];print('far',len(far));print(collections.Counter((x['part'],x['description']) for x in far).most_common(12))
