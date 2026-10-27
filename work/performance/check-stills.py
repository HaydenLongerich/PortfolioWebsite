from pathlib import Path
p=Path('work/performance/verify.py');s=p.read_text();a=s.index('data=json.loads');b=s.index('for path in',a);s=s[:a]+s[b:];s=s.replace("'assets/mclaren-fast.json'","'assets/car-exterior.webp','assets/car-interior.webp','image-reveal.js'");Path('work/performance/verify-stills.py').write_text(s)
