import urllib.request,re,pathlib,json
root=pathlib.Path('work/apex/dist/assets')
for slug,name in [('cortex-yv9awn','cortex'),('alt-f4-invest','altf4')]:
 try:
  req=urllib.request.Request('https://devpost.com/software/'+slug,headers={'User-Agent':'Mozilla/5.0'})
  h=urllib.request.urlopen(req).read().decode()
  pathlib.Path('work/'+name+'-source.html').write_text(h,encoding='utf-8')
  urls=re.findall(r'https://d112y698adiu2z\.cloudfront\.net/photos/production/[^\s"<>]+',h)
  urls=list(dict.fromkeys(u.replace('&amp;','&') for u in urls))
  print(name,urls[:8])
 except Exception as e:print(name,str(e))
