from pathlib import Path
r=Path('work/apex/dist/assets/tool-icons')
for name,color in [('claude','#d7a486'),('excel','#62c893')]:
 p=r/(name+'.svg');s=p.read_text();s=s.replace('<svg ',f'<svg fill="{color}" ',1);p.write_text(s)
p=Path('work/package-dark.py');s=p.read_text().replace("'navigation.js'","'navigation.js','tooling.js'");s=s.replace('for name in files:(dst/name).parent.mkdir',"files += [str(p.relative_to(src)).replace('\\\\','/') for p in sorted((src/'assets/tool-icons').glob('*'))]\nfor name in files:(dst/name).parent.mkdir");p.write_text(s)
