from pathlib import Path
p=Path('work/performance/optimize-realtime.mjs');s=p.read_text();at=s.index('const chunks=[]');s=s[:at]+'''after=0;
for(const b of buckets.values()){
 const [idx]=S.simplifySloppy(new Uint32Array(b.i),new Float32Array(b.p),3,null,Math.floor(b.i.length*.18/3)*3,.025);
 const map=new Map(),p=[],n=[],i=[];for(const v of idx){if(!map.has(v)){map.set(v,p.length/3);p.push(...b.p.slice(v*3,v*3+3));n.push(...b.n.slice(v*3,v*3+3))}i.push(map.get(v))}b.p=p;b.n=n;b.i=i;after+=i.length/3;
}
'''+s[at:];p.write_text(s)
