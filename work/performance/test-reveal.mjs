import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class Element {constructor(){this.listeners={};this.style={};this.dataset={};this.attrs={};this.clientWidth=1000;this.clientHeight=600;}addEventListener(n,f){this.listeners[n]=f}setAttribute(k,v){this.attrs[k]=v}getBoundingClientRect(){return {left:0,top:0,width:1000,height:600}}querySelector(){return overlay}querySelectorAll(){return []}emit(n,e={}){this.listeners[n]?.(e)}}
const host=new Element(),overlay=new Element(),status=new Element(),lock=new Element(),reset=new Element(),buttons=['explore','interior','exterior'].map(layer=>{let b=new Element();b.dataset.layer=layer;return b});let frames=[];
const elements={'#carViewport':host,'#driveStatus':status,'#lockView':lock,'#resetView':reset};
vm.runInNewContext(fs.readFileSync('work/apex/dist/image-reveal.js','utf8'),{document:{querySelector:s=>elements[s],querySelectorAll:()=>buttons},matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>{frames.push(fn);return 1},ResizeObserver:class{observe(){}},console});
function flush(){let pending=frames;frames=[];pending.forEach(f=>f());assert.equal(frames.length,0,'must not schedule idle animation')}
flush();assert.match(overlay.style.clipPath,/circle\(0/);
host.emit('pointermove',{clientX:300,clientY:200,pointerType:'mouse'});flush();assert.match(overlay.style.clipPath,/polygon/);
lock.emit('click');flush();const pinned=overlay.style.clipPath;host.emit('pointermove',{clientX:800,clientY:400,pointerType:'mouse'});flush();assert.equal(overlay.style.clipPath,pinned);
buttons[1].emit('click');flush();assert.equal(overlay.style.clipPath,'none');assert.equal(lock.disabled,true);
buttons[2].emit('click');flush();assert.match(overlay.style.clipPath,/circle\(0/);
reset.emit('click');flush();assert.equal(lock.disabled,false);assert.equal(lock.attrs['aria-pressed'],'false');
host.emit('keydown',{key:'ArrowRight',preventDefault(){}});flush();assert.match(overlay.style.clipPath,/polygon/);
host.emit('pointerleave');flush();assert.match(overlay.style.clipPath,/circle\(0/);
assert.ok(!fs.readFileSync('work/apex/dist/navigation.js','utf8').includes("'wheel'"));console.log('PASS: hover, lock, modes, reset, keyboard, leave, no idle loop, native wheel');

