import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
let audio,button;const listeners={},local=new Map(),session=new Map();const storage=m=>({getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)});
class AudioMock{constructor(){audio=this;this.events={};this.paused=true;this.currentTime=0;this.duration=240;this.ended=false;this.muted=false}addEventListener(k,f){(this.events[k]??=[]).push(f)}emit(k){this.events[k]?.forEach(f=>f())}load(){}pause(){this.paused=true;this.emit('pause')}async play(){this.paused=false;this.emit('play')}}
const tip={};const element={classList:{toggle(){},remove(){}},setAttribute(k,v){this[k]=v},querySelector:()=>tip,addEventListener:(k,f)=>listeners[k]=f};
vm.runInNewContext(fs.readFileSync('work/apex/dist/music.js','utf8'),{Audio:AudioMock,localStorage:storage(local),sessionStorage:storage(session),document:{createElement:()=>button=element,body:{append(){}},addEventListener(){}},window:{addEventListener(){}}});
audio.emit('loadedmetadata');assert.equal(audio.currentTime,40);assert.equal(audio.paused,true);audio.emit('seeked');await Promise.resolve();assert.equal(audio.paused,false);
listeners.click();assert.equal(audio.muted,true);listeners.click();await Promise.resolve();assert.equal(audio.muted,false);
audio.currentTime=240;audio.paused=true;audio.emit('ended');assert.equal(audio.currentTime,40);assert.equal(audio.paused,true);audio.emit('seeked');await Promise.resolve();assert.equal(audio.paused,false);
console.log('PASS: waits for seek completion before first playback and every loop; starts at 40s; mute/unmute works.');
