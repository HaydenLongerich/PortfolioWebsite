import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('work/apex/dist/tooling.js','utf8'),start=source.indexOf('const usage=')+12,end=source.indexOf('\nconst tiles=',start);const entries=vm.runInNewContext('('+source.slice(start,end).trim().replace(/;$/,'')+')');const names=JSON.parse(fs.readFileSync('work/performance/tooling-tile-names.json','utf8'));
for(const name of names){assert.ok(entries[name]?.length,`Usage missing for ${name}`);for(const item of entries[name])assert.ok(item.length===2&&item.every(v=>typeof v==='string'&&v.length>0))}
console.log('Verified every tool has populated usage cards, including Codex.');
