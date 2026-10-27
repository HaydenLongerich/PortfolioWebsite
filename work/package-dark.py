from pathlib import Path
import hashlib,json,shutil,tempfile,zipfile
from release_privacy import strip_image_metadata
ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'work/apex/dist'
OUTPUTS=ROOT/'outputs'
FILES=['index.html','work.html','about.html','tools.html','photos.html','contact.html','error.css','gallery-navigation.css','404.html','_headers','robots.txt','sitemap.xml','contact.css','contact.js','app.js','navigation.js','edge-effects.js','edge-effects.css','palette.css','tooling.js','music.js','ui-sounds.js','audio-controls.css','atmosphere.js','experience.js','burnout-smoke.js','lego-car.js','experience.css','portfolio.css','dark.css','centered.css','pages.css','career.css','page-transitions.css','page-transitions.js','projects.css','projects.js','project-scroll.js','project-entry.js','photo-wall.js','photo-wall.css']
FILES+=['assets/'+name for name in ['mclaren-realtime.json','mclaren-realtime.bin.gz','three.module.js','three.core.js','THREE-LICENSE.txt','background-music.mp3','LDRAW-CREDITS.txt','lego-wall.png']]
# Closed release list: no work files, original archives, private PDFs, source maps or stale exports.
for directory,extensions in [('tool-icons',{'.svg','.png','.webp'}),('fonts',{'.woff2','.txt'}),('projects',{'.jpg','.jpeg','.png','.webp'}),('company-logos',{'.svg','.png','.webp'}),('life-photos',{'.jpg','.jpeg','.png','.webp'})]:
    FILES += [p.relative_to(SRC).as_posix() for p in sorted((SRC/'assets'/directory).iterdir()) if p.is_file() and p.suffix.lower() in extensions and not p.name.startswith('.')]
PRIVATE_MEDIA=['invest-3.jpg','invest-4.jpg','invest-6.jpg','invest-7.jpg','invest-8.jpg'] # Unredacted source copies stay private.
REMOVED_PHOTO_PREFIXES=('life-02','life-03')
FILES=sorted(name for name in set(FILES) if Path(name).name not in PRIVATE_MEDIA and not Path(name).name.startswith(REMOVED_PHOTO_PREFIXES))

def build():
    OUTPUTS.mkdir(exist_ok=True)
    stripped=[]
    with tempfile.TemporaryDirectory(prefix='portfolio-release-',dir=OUTPUTS) as tmp:
        stage=Path(tmp)
        for name in FILES:
            source=SRC/name
            if not source.is_file() or source.is_symlink() or not source.resolve().is_relative_to(SRC.resolve()):raise ValueError('Invalid release input: '+name)
            data=source.read_bytes();clean=strip_image_metadata(data,source.suffix)
            if clean!=data:stripped.append(name)
            if len(clean)>25*1024**2:raise ValueError('Exceeds Cloudflare file limit: '+name)
            target=stage/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(clean)
        # Only replace the two exact, generated release directories. Never traverse symlinks.
        for folder in ['cloudflare-pages','hayden-portfolio-dark']:
            target=OUTPUTS/folder
            if target.is_symlink() or target.resolve().parent!=OUTPUTS.resolve():raise ValueError('Unsafe output path')
            if target.exists():shutil.rmtree(target)
            shutil.copytree(stage,target)
        for filename in ['cloudflare-pages.zip','hayden-portfolio-dark.zip']:
            with zipfile.ZipFile(OUTPUTS/filename,'w',zipfile.ZIP_DEFLATED) as archive:
                for name in FILES:archive.write(stage/name,name)
        report={'file_count':len(FILES),'largest_file_bytes':max((stage/name).stat().st_size for name in FILES),'metadata_stripped':stripped,'sha256':{name:hashlib.sha256((stage/name).read_bytes()).hexdigest() for name in FILES}}
        (OUTPUTS/'release-manifest.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print(f'Packaged {len(FILES)} allowlisted files; stripped metadata from {len(stripped)} images')
    print('Upload only: '+str(OUTPUTS/'cloudflare-pages.zip'))

if __name__=='__main__':build()
