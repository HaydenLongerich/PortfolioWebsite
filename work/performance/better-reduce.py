from pathlib import Path
s=Path('work/performance/optimize.mjs').read_text();at=s.index('const chunks=[]');s=s[:at]+'''after=0;
for(const b of buckets.values()){
 const [idx]=S.simplifyWithAttributes(new Uint32Array(b.i),new Float32Array(b.p),3,new Float32Array(b.n),3,[.1,.1,.1],null,Math.floor(b.i.length*.25/3)*3,.005,['Permissive']);
 const map=new Map(),p=[],n=[],i=[];for(const v of idx){if(!map.has(v)){map.set(v,p.length/3);p.push(...b.p.slice(v*3,v*3+3));n.push(...b.n.slice(v*3,v*3+3))}i.push(map.get(v))}b.p=p;b.n=n;b.i=i;after+=i.length/3;
}
'''+s[at:];s=s.replace('mclaren-fast','mclaren-realtime');Path('work/performance/optimize-realtime.mjs').write_text(s)
