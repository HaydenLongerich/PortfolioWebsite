from pathlib import Path
p=Path('work/apex/dist/image-reveal.js');s=p.read_text(encoding='utf-8').replace("if(!cache.has(base)){setLoading(true);return}","if(!cache.has(base)){if(!failed.has(base))setLoading(true);return}");s=s.replace('||Math.abs(velocity)>.02||!locked','||!down&&Math.abs(velocity)>.02||!locked');p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/index.html');s=p.read_text(encoding='utf-8').replace('assets/spin/','assets/studio/').replace('max="71" value="0"','max="71.99" step="0.01" value="0"');s=s.replace('<div class="car-cutaway"', '<div class="car-loader" role="status"><span class="car-spinner" aria-hidden="true"></span><span>PREPARING THE STUDIO</span></div><button class="car-retry" type="button" hidden>Retry loading ↻</button><div class="car-cutaway"');p.write_text(s,encoding='utf-8')
for p in Path('work/apex/dist').glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('?v=spin3','?v=studio4');p.write_text(s,encoding='utf-8')
