from pathlib import Path
s=Path('work/performance/optimize.mjs').read_text();start=s.index('const [small]=S.simplifyWithAttributes');end=s.index(';',start);s=s[:start]+'const small=idx'+s[end:];s=s.replace("dir+'mclaren-fast", "'work/performance/mclaren-still");Path('work/performance/bake-still-model.mjs').write_text(s)
p=Path('work/performance/render-stills.mjs');s=p.read_text().replace("dir+'mclaren-fast", "'work/performance/mclaren-still");p.write_text(s)
