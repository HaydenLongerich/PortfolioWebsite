import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class Element {constructor(){this.listeners={};this.style={};this.dataset={};this.attrs={};this.clientWidth=1000;this.clientHeight=600;}addEventListener(n,f){this.listeners[n]=f}setAttribute(k,v){this.attrs[k]=String(v)}getBoundingClientRect(){return {left:0,top:0,width:1000,height:600}}querySelector(s){return s==='.car-cutaway'?overlay:s==='img'?inside:outside}querySelectorAll(){return []}emit(n,e={}){this.listeners[n]?.(e)}replaceWith(n){outside=n}replaceChildren(n){inside=n}hasPointerCapture(){return false}setPointerCapture(){}classList={add(){},remove(){}}}
const host=new Element(),overlay=new Element(),status=new Element(),lock=new Element(),reset=new Element(),slider=new Element(),buttons=['explore','interior','exterior'].map(layer=>{let b=new Element();b.dataset.layer=layer;return b});let outside=new Element(),inside=new Element(),frames=[];
const elements={'#carViewport':host,'#driveStatus':status,'#lockView':lock,'#resetView':reset,'#carRotation':slider};
vm.runInNewContext(fs.readFileSync('work/apex/dist/image-reveal.js','utf8'),{document:{querySelector:s=>elements[s],querySelectorAll:()=>buttons},matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>{frames.push(fn);return 1},ResizeObserver:class{observe(){}},IntersectionObserver:class{observe(){}},Image:class extends Element{decode(){return Promise.resolve()}},console});
function flush(){let pending=frames;frames=[];pending.forEach(f=>f());assert.equal(frames.length,0,'must not schedule idle animation')}
async function settle(){await new Promise(r=>setTimeout(r,5));flush()}
flush();assert.equal(host.dataset.ready,'true');
buttons[1].emit('click');flush();assert.equal(overlay.style.clipPath,'none');assert.equal(lock.disabled,true);
buttons[2].emit('click');flush();assert.match(overlay.style.clipPath,/circle\(0/);
buttons[0].emit('click');flush();host.emit('pointermove',{clientX:300,clientY:200,pointerType:'mouse'});flush();assert.match(overlay.style.clipPath,/polygon/);
lock.emit('click');flush();const pinned=overlay.style.clipPath;host.emit('pointermove',{clientX:800,clientY:400,pointerType:'mouse'});flush();assert.equal(overlay.style.clipPath,pinned);
host.emit('pointerdown',{button:0,clientX:300,clientY:200,pointerId:1});host.emit('pointermove',{clientX:370,clientY:200,pointerType:'mouse',pointerId:1});await settle();assert.match(outside.src,/exterior-10/);assert.match(inside.src,/interior-10/);host.emit('pointerup');
slider.value='36';slider.emit('input');await settle();assert.match(outside.src,/exterior-36/);
buttons[1].emit('click');flush();host.emit('keydown',{key:'ArrowRight',preventDefault(){}});await settle();assert.match(outside.src,/exterior-37/);assert.equal(overlay.style.clipPath,'none');
reset.emit('click');await settle();assert.equal(slider.value,0);assert.equal(lock.attrs['aria-pressed'],'false');assert.match(overlay.style.clipPath,/circle\(0/);
host.emit('keydown',{key:'ArrowRight',shiftKey:true,preventDefault(){}});flush();assert.match(overlay.style.clipPath,/polygon/);
console.log('PASS: controls bind immediately; layer buttons, hover, lock, drag, slider, keyboard, matching image pairs, reset; no idle loop.');
