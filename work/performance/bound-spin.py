from pathlib import Path
p=Path('work/apex/dist/image-reveal.js');s=p.read_text().replace('try{const pair=await load(angle);','try{if(pending.size>=3){await Promise.race(pending.values()).catch(()=>{});if(ticket!==request)return}const pair=await load(angle);');p.write_text(s)
