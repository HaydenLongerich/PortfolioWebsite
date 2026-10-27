from pathlib import Path
p=Path('work/apex/dist/experience.js');s=p.read_text().replace("locked=!locked;e.currentTarget.setAttribute", "locked=!locked;if(locked)revealUniforms.uRevealStrength.value=1;e.currentTarget.setAttribute")
p.write_text(s)
