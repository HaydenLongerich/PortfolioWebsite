"""Local QA server for the exact Cloudflare release and its security headers."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
import sys
ROOT=Path(__file__).resolve().parent.parent/'outputs/cloudflare-pages'
HEADERS=[]
for line in (ROOT/'_headers').read_text().splitlines():
    if line.startswith('  ') and not line.strip().startswith('!'):
        name,value=line.strip().split(':',1);HEADERS.append((name,value.strip()))
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        for name,value in HEADERS:self.send_header(name,value)
        super().end_headers()
    def translate_path(self,path):
        target=Path(super().translate_path(path))
        if not target.exists() and not target.suffix and target.with_suffix('.html').is_file():return str(target.with_suffix('.html'))
        return str(target)
    def list_directory(self,path):self.send_error(403,'Directory listing disabled')
    def do_GET(self):
        if self.path.split('?')[0].endswith('/_headers'):
            self.send_error(404);return
        super().do_GET()
if __name__=='__main__':
    port=int(sys.argv[1]) if len(sys.argv)>1 else 8767
    print(f'Security-header preview: http://127.0.0.1:{port}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',port),partial(Handler,directory=str(ROOT))).serve_forever()
