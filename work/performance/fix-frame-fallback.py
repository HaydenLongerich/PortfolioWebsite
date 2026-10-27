from pathlib import Path
p=Path('work/apex/dist/image-reveal.js');s=p.read_text(encoding='utf-8')
s=s.replace("function display(){const phase=wrap(position),base=Math.floor(phase),next=(base+1)%count,mix=phase-base;ensure(base);ensure(next);\n if(!cache.has(base)){if(!failed.has(base))setLoading(true);return}","""function display(){const phase=wrap(position),wanted=Math.floor(phase);let base=wanted,next=(base+1)%count,mix=phase-base;ensure(base);ensure(next);
 const exact=cache.has(base);if(!exact){if(!cache.size){if(!failed.has(base))setLoading(true);return}base=[...cache.keys()].sort((a,b)=>Math.abs(((a-phase+108)%72)-36)-Math.abs(((b-phase+108)%72)-36))[0];next=(base+1)%count;mix=0}
""")
s=s.replace("ready=true;host.dataset.ready='true';setLoading(false);host.classList.remove('load-error');retry.hidden=true;", "ready=true;host.dataset.ready='true';setLoading(!exact&&!failed.has(wanted));if(!failed.has(wanted)){host.classList.remove('load-error');retry.hidden=true}")
p.write_text(s,encoding='utf-8')
