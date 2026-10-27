from pathlib import Path
p=Path('work/apex/dist/image-reveal.js');s=p.read_text(encoding='utf-8');a=s.index('function display(){');b=s.index(' const pair=cache.get(base)',a)
s=s[:a]+'''function display(){const phase=wrap(position),wanted=Math.floor(phase);let base=wanted,next=(base+1)%count,mix=phase-base;ensure(base);ensure(next);
 const exact=cache.has(base);if(!exact){if(!cache.size){if(!failed.has(base))setLoading(true);return}base=[...cache.keys()].sort((a,b)=>Math.abs(((a-phase+108)%72)-36)-Math.abs(((b-phase+108)%72)-36))[0];next=(base+1)%count;mix=0}
'''+s[b:];p.write_text(s,encoding='utf-8')
