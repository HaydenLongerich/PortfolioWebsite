from pathlib import Path
p=Path('work/package-dark.py');s=p.read_text().replace("assets/spin'","assets/studio'");p.write_text(s)
p=Path('work/apex/dist/image-reveal.js');s=p.read_text(encoding='utf-8').replace('lastMotion=0;','lastMotion=0,loadError=false;').replace("failed.add(index);setLoading(false);", "failed.add(index);loadError=true;setLoading(false);").replace("if(!failed.has(wanted)){host.classList.remove('load-error');retry.hidden=true}","if(!failed.has(wanted)){if(loadError){hint();loadError=false}host.classList.remove('load-error');retry.hidden=true}");p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/README.txt');s=p.read_text(encoding='utf-8');s=s.replace('bounded to ten pairs.','bounded to twelve pairs on desktop and six on touch devices.');s+='''
STUDIO UPDATE
Damped drag rotation with exponential release friction and adjacent-angle
interpolation. A single requestAnimationFrame scheduler handles updates and
stops at rest, offscreen, or when the tab is hidden. Pointer events only update
targets; the reveal mask is evaluated once per animation frame. At most two
image pairs decode concurrently. Images are reused in a bounded cache.
A delayed loading overlay avoids spinner flashes during ordinary rotation;
failed angles expose a Retry control. Native vertical touch scrolling remains.
Reduced-motion mode disables momentum and easing.

Studio frames bake warm key lighting, cool fill, rim highlights, material
roughness, metallic highlights, filmic tone mapping (exposure 0.95), transparent
parts, and supersampled edges. These are LEGO plastic materials; no invented
carbon-fiber texture. No live shadows, raycasting, WebGL or React/useFrame.
60 FPS is a performance target, not a measured or universal device guarantee.
''';p.write_text(s,encoding='utf-8')
s=Path('work/performance/verify-spin.py').read_text().replace('assets/spin','assets/studio');Path('work/performance/verify-studio.py').write_text(s)
