from pathlib import Path
from PIL import Image
import subprocess
out=Path('work/apex/dist/assets/spin');out.mkdir(exist_ok=True)
for i in range(72):
 subprocess.run(['node','work/performance/render-angle.mjs',str(i)],check=True,stdout=subprocess.DEVNULL)
 for mode in ['exterior','interior']:
  Image.frombytes('RGBA',(1200,750),Path('work/performance/spin-'+mode+'.rgba').read_bytes()).resize((960,600),Image.Resampling.LANCZOS).save(out/f'{mode}-{i:02}.webp',quality=83,method=4)
 print(f'{i+1}/72 angles ready',flush=True)
