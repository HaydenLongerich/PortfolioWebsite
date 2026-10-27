from pathlib import Path
p=Path('work/ldraw/packed.mpd');s=p.read_text(encoding='utf-8').replace('0 FILE s/','0 FILE parts/s/').replace('0 FILE 48/','0 FILE p/48/').replace('0 FILE 8/','0 FILE p/8/');p.write_text(s,encoding='utf-8')
p=Path('work/ldraw/convert.mjs');s=p.read_text();s='\n'.join(l for l in s.splitlines() if not l.startswith("process.on('beforeExit'"));p.write_text(s)
