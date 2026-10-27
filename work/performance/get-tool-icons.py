from pathlib import Path
import urllib.request,concurrent.futures,json
out=Path('work/apex/dist/assets/tool-icons');out.mkdir(exist_ok=True)
icons={
'java':'java/java-original.svg','python':'python/python-original.svg','c':'c/c-original.svg','cpp':'cplusplus/cplusplus-original.svg','typescript':'typescript/typescript-original.svg','javascript':'javascript/javascript-original.svg',
'react':'react/react-original.svg','nextjs':'nextjs/nextjs-original.svg','tailwind':'tailwindcss/tailwindcss-original.svg','html':'html5/html5-original.svg','css':'css3/css3-original.svg',
'nodejs':'nodejs/nodejs-original.svg','supabase':'supabase/supabase-original.svg','git':'git/git-original.svg','vscode':'vscode/vscode-original.svg','intellij':'intellij/intellij-original.svg','clion':'clion/clion-original.svg'}
def fetch(item):
 name,path=item;url='https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/'+path
 try:
  data=urllib.request.urlopen(url,timeout=25).read();assert b'<svg' in data;(out/(name+'.svg')).write_bytes(data);return name,'ok'
 except Exception as e:return name,str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for result in pool.map(fetch,icons.items()):print(*result)
for name,url in [('claude','https://cdn.jsdelivr.net/npm/simple-icons@15.0.0/icons/claude.svg'),('excel','https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/microsoftexcel.svg')]:
 try:
  data=urllib.request.urlopen(url,timeout=25).read();assert b'<svg' in data;(out/(name+'.svg')).write_bytes(data);print(name,'ok')
 except Exception as e:print(name,str(e))
(out/'SOURCES.txt').write_text('Devicon v2.16.0 tool marks: https://github.com/devicons/devicon (MIT).\nClaude: Simple Icons v15.0.0. Excel: Simple Icons v11.0.0. https://simpleicons.org (CC0).\nBrand marks belong to their respective owners.\n',encoding='utf-8')
