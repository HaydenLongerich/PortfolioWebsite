from pathlib import Path
for p in Path('work/apex/dist').glob('*'):
 if p.suffix not in ['.html','.css','.js','.txt']:continue
 s=p.read_bytes().decode('utf-8',errors='surrogateescape')
 s=''.join(bytes([ord(c)-0xdc00]).decode('cp1252',errors='replace') if 0xdc80<=ord(c)<=0xdcff else c for c in s)
 p.write_text(s,encoding='utf-8')
