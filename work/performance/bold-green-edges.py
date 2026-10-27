from pathlib import Path
r=Path('work/apex/dist');p=r/'edge-effects.js';s=p.read_text(encoding='utf-8')
s=s.replace("rect.setAttribute('x','1');rect.setAttribute('y','1');rect.setAttribute('width',String(Math.max(0,width-2)));rect.setAttribute('height',String(Math.max(0,height-2)));rect.setAttribute('rx',String(Math.max(0,Math.min(radius,Math.min(width,height)/2)-1)));", "rect.setAttribute('x','-2');rect.setAttribute('y','-2');rect.setAttribute('width',String(width+4));rect.setAttribute('height',String(height+4));rect.setAttribute('rx',String(Math.max(0,Math.min(radius,Math.min(width,height)/2)-2)));")
s=s.replace("nodes.add(node);const css=", "nodes.add(node);node.style.setProperty('--edge-phase',`${-(nodes.size%13)*.19}s`);const css=")
p.write_text(s,encoding='utf-8')
for p in r.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('edge-effects.css?v=edges31','edge-effects.css?v=bold32').replace('edge-effects.js?v=edges31','edge-effects.js?v=bold32');p.write_text(s,encoding='utf-8')
