from pathlib import Path
p=Path('work/package-dark.py');s=p.read_text().replace("'car-exterior.webp','car-interior.webp',",'');s=s.replace('for name in files:shutil.copy2',"files += [str(p.relative_to(src)).replace('\\\\','/') for p in sorted((src/'assets/spin').glob('*.webp'))]\nfor name in files:(dst/name).parent.mkdir(parents=True,exist_ok=True)\nfor name in files:shutil.copy2");p.write_text(s)
p=Path('work/apex/dist/README.txt');s=p.read_text();a=s.index('The car is');b=s.index('Original model:');s=s[:a]+'''The car uses 72 matched exterior/chassis image pairs rendered offline from
LEGO geometry. No Three.js, WebGL or 3D geometry loads in the browser.
Drag horizontally or use the slider to rotate 360 degrees. Hover/tap to reveal
internal parts; Full chassis and Exterior switch the entire layer.
Left/right arrows rotate; Shift + arrows moves the reveal; Home resets angle.
Lock reveal pins the cutaway, and Reset restores the initial state.
Controls initialize directly with the page, before rotation assets load.
Only nearby frames load; the decoded image cache is bounded to ten pairs.
Scrolling is browser-native and vertical touch gestures remain available.

'''+s[b:];p.write_text(s)
