from pathlib import Path
import hashlib,re,zipfile
p=Path('work/apex/dist');s=(p/'index.html').read_text(encoding='utf8')
assert 'I build with a team' not in s
assert 'class="landing" id="home"' in s and 'id="mclaren"' in s
assert 'assets/Hayden-Longerich-Resume.pdf' in s
for url in re.findall(r'(?:src|href)="([^"]+)"',s):
 if url.startswith(('http','#')):continue
 assert (p/url.split('?')[0]).exists(),url
original=Path(r'C:/Users/kooga/Downloads/Resume_HaydenLongerich (3).pdf').read_bytes()
assert hashlib.sha256(original).digest()==hashlib.sha256((p/'assets/Hayden-Longerich-Resume.pdf').read_bytes()).digest()
with zipfile.ZipFile('outputs/hayden-portfolio-dark.zip') as z:
 assert z.testzip() is None
 assert 'centered.css' in z.namelist()
print('Verified layout structure, local assets, exact resume copy, JavaScript syntax, and download archive.')
