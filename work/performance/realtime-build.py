from pathlib import Path
s=Path('work/performance/optimize.mjs').read_text(encoding='utf-8');a=s.index('const [small]=');b=s.index(';',a)
s=s[:a]+"const [small]=S.simplifySloppy(idx,pos,3,null,Math.max(12,Math.floor(idx.length*.055/3)*3),.08)"+s[b:];s=s.replace('mclaren-fast','mclaren-realtime');Path('work/performance/optimize-realtime.mjs').write_text(s,encoding='utf-8')
