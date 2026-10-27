from pathlib import Path
s=Path('work/performance/render-stills.mjs').read_text().replace('const W=2400,H=1500','const W=1200,H=750')
s=s.replace('model.premultiply(new T.Matrix4().makeRotationY(Math.PI));','const angle=Number(process.argv[2]||0);model.premultiply(new T.Matrix4().makeRotationY(Math.PI+angle*2*Math.PI/72));')
s=s.replace('const fit=Math.min(W*.90/(maxX-minX),H*.84/(maxY-minY))','const fit=1.04')
s=s.replace("'work/performance/car-'+mode+'.rgba'","'work/performance/spin-'+mode+'.rgba'")
Path('work/performance/render-angle.mjs').write_text(s)
