import urllib.request,pathlib
u='https://bricksafe.com/files/jb70/42172-pimp-up-my-mclaren/omr/42172%20-%20McLaren%20P1.mpd'
p=pathlib.Path('work/ldraw');p.mkdir(exist_ok=True)
r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read();(p/'mclaren.mpd').write_bytes(r);print(len(r));print(r[:1800].decode(errors='replace'))
