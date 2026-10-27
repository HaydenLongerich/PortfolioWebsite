from pathlib import Path
import re
root=Path('work/apex/dist')
for p in root.glob('*.html'):
 s=p.read_text();s=re.sub(r'<script type="importmap">.*?</script>','',s);s=s.replace('pages.css"','pages.css?v=stills2"').replace('navigation.js"','navigation.js?v=stills2"');p.write_text(s)
p=Path('work/package-dark.py');s=p.read_text().replace("'experience.js','lego-car.js',","'image-reveal.js',").replace("'three.module.js','three.core.js','THREE-LICENSE.txt','mclaren-fast.json','mclaren-fast.bin.gz',","'car-exterior.webp','car-interior.webp',");p.write_text(s)
p=root/'README.txt';p.write_text('''HAYDEN LONGERICH / PERSONAL PORTFOLIO
Serve this directory with a static web server:
  python -m http.server 8765 --bind 127.0.0.1
Open http://127.0.0.1:8765/

Index: title photograph and interactive McLaren image cutaway.
Separate pages: work.html, about.html, tools.html, contact.html.
Resume: assets/Hayden-Longerich-Resume.pdf.

The car is two aligned WebP stills, rendered offline from the original LEGO
geometry. No 3D geometry, Three.js or WebGL is loaded by the website.
Hover or tap to reveal the chassis. Arrow keys move the reveal when focused.
Explore, Full chassis, Exterior, Lock reveal and Reset controls are available.
The image view replaces free 3D rotation. Rendering only updates on interaction.
Scrolling is browser-native, with smooth anchor links respecting reduced motion.

Original model: Jens Bruehl / jb70, CC BY 4.0. See footer and
assets/LDRAW-CREDITS.txt for model and individual parts attribution.
''')
