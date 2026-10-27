from pathlib import Path
import re
root=Path('work/apex/dist');p=root/'tools.html';s=p.read_text(encoding='utf-8')
s=s.replace('The tools I use to build software, shape interfaces, and automate the repetitive stuff.','The various tools I use when building cool things')
s=re.sub(r'<div class="tooling-detail".*?</div>','',s,flags=re.S)
s=re.sub(r'<div class="tooling-tally">.*?</div></div>','<div class="tooling-tally"><strong>24</strong><p>Tools and<br>counting</p></div>',s,count=1,flags=re.S)
start=s.index('<section class="tool-group group-workflow" data-tool-group="workflow" aria-label="AI & automation">');end=s.index('</section>',start);group=s[start:end]
group=group.replace('<h2><span>V</span>AI & automation</h2><span>03</span>','<h2><span>V</span>AI & automation</h2><span>04</span>')
codex='<li><button type="button" class="tool-tile" data-tool="Codex" data-description="Building and refining this personal portfolio." style="--tool-color:#e1eee5" aria-pressed="false"><svg class="tool-logo codex-mark" viewBox="0 0 40 40" aria-hidden="true"><rect x="3" y="5" width="34" height="30" rx="8"/><path d="m11 14 6 6-6 6m11 0h7"/></svg><span>Codex</span></button></li>'
group=group.replace('<ul class="tool-cells">','<ul class="tool-cells">'+codex,1);s=s[:start]+group+s[end:]
s=s.replace('All <small>23</small>','All <small>24</small>').replace('23 tools · 5 categories','24 tools · 5 categories')
s=re.sub(r'aria-pressed="false"(?=>\s*<(?:img|span|svg))','aria-haspopup="dialog" aria-controls="toolModal"',s)
# Apply the same dialog semantics to every tile, including the currently-selected state.
s=re.sub(r'(<button[^>]*class="tool-tile"[^>]*?) aria-pressed="(?:true|false)"',r'\1 aria-haspopup="dialog" aria-controls="toolModal"',s)
dialog='''<dialog id="toolModal" class="tool-dialog" aria-labelledby="toolModalTitle" aria-describedby="toolModalSummary"><button type="button" class="tool-dialog-close" aria-label="Close tool details">✕</button><div class="tool-dialog-heading"><div id="toolModalIcon" class="tool-dialog-icon" aria-hidden="true"></div><div><p class="eyebrow">IN MY TOOLKIT</p><h2 id="toolModalTitle"></h2></div></div><p id="toolModalSummary" class="tool-dialog-summary"></p><div class="tool-use-label">WHERE I’VE USED IT</div><ul id="toolModalUses" class="tool-usage-list"></ul><p class="tool-dialog-hint">Esc to close</p></dialog>'''
s=s.replace('<dialog id="modal">',dialog+'<dialog id="modal">',1)
s=s.replace('tooling.js?v=tooling19','tooling.js?v=tooling20').replace('pages.css?v=tooling19','pages.css?v=tooling20');p.write_text(s,encoding='utf-8')
