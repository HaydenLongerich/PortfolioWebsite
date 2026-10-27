from pathlib import Path
import json,zipfile
p=Path('work/ldraw'); info=json.loads((p/'parts-info.json').read_text());credits=['Interactive McLaren P1 — asset credits','', 'Digital reconstruction of LEGO Technic set 42172 by Jens Brühl (jb70).','Source: https://bricksafe.com/files/jb70/42172-pimp-up-my-mclaren/omr/42172%20-%20McLaren%20P1.mpd','Source announcement: https://www.eurobricks.com/forum/forums/topic/199596-42172-mclaren-p1-mods-and-improvements/page/4/','Model license: Creative Commons Attribution 4.0 https://creativecommons.org/licenses/by/4.0/','', 'Adaptation: converted into instanced browser geometry, normalized scale and orientation, and added cursor-controlled body-panel cutaway.','This is an independent fan adaptation, not an official LEGO digital model. LEGO and McLaren marks belong to their respective owners.','', 'LDraw part authors and original licenses (retained per part):','']
for name,lines in sorted(info.items()):
 if not name.endswith('.dat'):continue
 credits.append(name)
 credits.extend(l for l in lines if l.startswith(('0 Author:', '0 !LICENSE')))
 credits.append('')
Path('work/apex/dist/assets/LDRAW-CREDITS.txt').write_text('\n'.join(credits),encoding='utf-8')
