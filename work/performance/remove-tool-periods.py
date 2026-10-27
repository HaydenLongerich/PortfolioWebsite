from pathlib import Path
p=Path('work/apex/dist/tooling.js');s=p.read_text(encoding='utf-8')
# Remove prose-ending periods while preserving punctuation inside tool names.
s=s.replace("summary.textContent=tile.dataset.description;","summary.textContent=tile.dataset.description.replace(/\\.+$/,'');")
s=s.replace('paragraph.textContent=text;','paragraph.textContent=text.replace(/\\.+$/,\'\');')
p.write_text(s,encoding='utf-8')
p=Path('work/apex/dist/tools.html');s=p.read_text(encoding='utf-8').replace('tooling.js?v=tooling20','tooling.js?v=tooling21');p.write_text(s,encoding='utf-8')
