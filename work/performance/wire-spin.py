from pathlib import Path
import re
root=Path('work/apex/dist')
p=root/'navigation.js';s=p.read_text().replace("if(document.querySelector('#carViewport'))import('./image-reveal.js');",'');p.write_text(s)
p=root/'index.html';s=p.read_text().replace('assets/car-exterior.webp','assets/spin/exterior-00.webp').replace('assets/car-interior.webp','assets/spin/interior-00.webp');s=s.replace('width="1440" height="900"','width="960" height="600"');s=s.replace('Use arrow keys when focused to explore.','Drag horizontally or use left and right arrows to rotate. Shift and arrow keys move the reveal.');s=s.replace('<div class="reveal-actions">','<label class="rotation-control" for="carRotation"><span>ROTATE 360°</span><input id="carRotation" type="range" min="0" max="71" value="0" aria-label="Car rotation" aria-valuetext="0 degrees"></label><div class="reveal-actions">');s=s.replace('</body>','<script src="image-reveal.js?v=spin3" defer></script></body>');p.write_text(s)
for p in root.glob('*.html'):
 s=p.read_text().replace('pages.css?v=stills2','pages.css?v=spin3').replace('navigation.js?v=stills2','navigation.js?v=spin3');p.write_text(s)
