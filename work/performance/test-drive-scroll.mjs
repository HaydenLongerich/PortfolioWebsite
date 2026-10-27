import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('work/apex/dist/atmosphere.js','utf8');const code=source.slice(source.indexOf('let wheelFrame='),source.indexOf('if(!fine.matches||reduce.matches)return;'));
let now=0,id=0;const frames=new Map(),events={};const body={};const context={scrollY:0,innerHeight:700,performance:{now:()=>now},fine:{matches:true},reduce:{matches:false},stopFlight(){},getComputedStyle:()=>({overflowY:'visible'}),document:{body,documentElement:{scrollHeight:3000},addEventListener(){}},requestAnimationFrame:f=>{frames.set(++id,f);return id},cancelAnimationFrame:i=>frames.delete(i)};
context.window={addEventListener:(n,f)=>events[n]=f,scrollTo:({top})=>context.scrollY=top};vm.createContext(context);vm.runInContext(code,context);
let prevented=false;const wheel={target:body,deltaY:100,deltaX:0,deltaMode:0,preventDefault(){prevented=true}};
events.wheel(wheel);assert.equal(prevented,true);assert.equal(context.scrollY,0);for(let i=0;i<150&&frames.size;i++){now+=16.67;const pending=[...frames.values()];frames.clear();pending.forEach(f=>f(now))}assert.ok(Math.abs(context.scrollY-18)<.01);assert.equal(frames.size,0);
prevented=false;events.wheel({...wheel,ctrlKey:true});assert.equal(prevented,false);
events.wheel(wheel);events.pointerdown();assert.equal(frames.size,0);
context.reduce.matches=true;events.wheel(wheel);assert.ok(Math.abs(context.scrollY-36)<.01);assert.equal(frames.size,0);
const html=fs.readFileSync('work/apex/dist/index.html','utf8');assert.ok(!html.includes('Built to be')&&!html.includes('A CLOSER LOOK'));
const car=fs.readFileSync('work/apex/dist/experience.js','utf8');assert.ok(car.includes('entranceSeen=true')&&car.includes("duration:2400")&&car.includes("translate3d(0,0,0) rotate(0deg)"));
console.log('PASS: 18% wheel distance, eased settling, interruption, zoom passthrough, reduced motion, headings removed, one-time entrance configuration.');

