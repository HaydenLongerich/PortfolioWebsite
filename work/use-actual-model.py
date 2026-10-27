from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text();s=s.replace('const car=createLegoCar();','const car=await createLegoCar();').replace("car.shell.traverse(o=>{if(o.isMesh)addCutaway(o.material)});car.core.traverse(o=>{if(o.isMesh)addCutaway(o.material,true)});","car.shell.traverse(o=>{if(o.isMesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>addCutaway(m))});")
p.write_text(s)
p=Path('work/apex/dist/index.html');s=p.read_text(encoding='utf-8').replace('McLAREN P1 / TECHNIC STUDY','McLAREN P1 / LEGO® TECHNIC').replace('Interactive Technic-inspired McLaren P1.','Interactive LEGO Technic McLaren P1.')
a=s.index('<p class="model-credit">');b=s.index('</p>',a)+4
s=s[:a]+'''<p class="model-credit">McLaren P1 digital build by <a href="https://www.eurobricks.com/forum/forums/topic/199596-42172-mclaren-p1-mods-and-improvements/page/4/" target="_blank" rel="noopener">Jens Brühl / jb70</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> · <a href="assets/LDRAW-CREDITS.txt" target="_blank" rel="noopener">LDraw parts & adaptation credits</a>. An independent interactive adaptation of <a href="https://www.lego.com/en-ca/product/mclaren-p1-42172" target="_blank" rel="noopener">set 42172</a>.</p>'''+s[b:]
p.write_text(s,encoding='utf-8')
