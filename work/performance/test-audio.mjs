import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../apex/dist/music.js',import.meta.url),'utf8');
function page(storage,now=100000){
 const handlers={},docHandlers={};let audio;const elements=[];
 class Element{constructor(){this.events={};this.children={};this.style={setProperty(){}};this.classList={toggle(){},remove(){}};this.attributes={}}setAttribute(k,v){this.attributes[k]=v}addEventListener(k,f){this.events[k]=f}querySelector(key){return this.children[key]??=new Element()}contains(){return false}focus(){}}
 class Audio extends Element{constructor(){super();audio=this;this.currentTime=0;this.duration=200;this.paused=true;this.seeking=true;this.ended=false}load(){}play(){this.paused=false;return Promise.resolve()}pause(){this.paused=true}}
 vm.runInNewContext(source,{Audio,Date:{now:()=>now},sessionStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v},document:{body:{append(){}},createElement:()=>{const el=new Element();elements.push(el);return el},addEventListener:(k,f)=>docHandlers[k]=f,dispatchEvent(){}},addEventListener:(k,f)=>handlers[k]=f,setInterval(){},CustomEvent:class{}});
 return {audio,button:elements.find(el=>el.className==='music-toggle'),slider:elements.find(el=>el.className==='music-volume-panel').querySelector('input'),volumeButton:elements.find(el=>el.className==='music-volume-toggle'),panel:elements.find(el=>el.className==='music-volume-panel'),handlers,ready(){audio.events.loadedmetadata();audio.seeking=false;audio.events.seeked()}};
}
test('new visitors start at 40 seconds, navigation resumes the actual playhead',()=>{
 const storage={};const first=page(storage);first.ready();assert.equal(first.audio.currentTime,40);assert.equal(first.audio.volume,.25);
 first.audio.currentTime=73.4;first.handlers.pagehide();assert.equal(first.audio.paused,true);
 const next=page(storage,100350);next.ready();assert.equal(next.audio.currentTime,73.75);assert.equal(next.audio.paused,false);
});
test('mute survives navigation without advancing the muted playhead',()=>{
 const storage={};const first=page(storage);first.ready();first.audio.currentTime=85;first.button.events.click();first.handlers.pagehide();
 const next=page(storage,104000);next.ready();assert.equal(next.audio.muted,true);assert.equal(next.audio.currentTime,85);assert.equal(next.audio.paused,true);
});
test('track end and back-forward cache restore continue correctly',()=>{
 const storage={'portfolio-audio-v1':JSON.stringify({position:199,playing:true,at:100000,muted:false})};
 const next=page(storage,103000);next.ready();assert.equal(next.audio.currentTime,42);
 next.handlers.pagehide();next.handlers.pageshow({persisted:true});assert.equal(next.audio.paused,false);
 next.audio.events.ended();next.audio.events.seeked();assert.equal(next.audio.currentTime,40);
});
test('corrupt saved state falls back safely',()=>{const next=page({'portfolio-audio-v1':'not json'});next.ready();assert.equal(next.audio.currentTime,40)});

test('back navigation uses the latest page playhead instead of the cached one',()=>{
 const storage={};const first=page(storage);first.ready();first.audio.currentTime=55;first.handlers.pagehide();
 storage['portfolio-audio-v1']=JSON.stringify({position:91,playing:true,at:100000,muted:false});
 first.handlers.pageshow({persisted:true});assert.equal(first.audio.currentTime,91);
});

test('music volume persists across navigation, including zero',()=>{
 const storage={};const first=page(storage);first.ready();first.slider.value='62';first.slider.events.input();assert.equal(first.audio.volume,.62);first.handlers.pagehide();
 const next=page(storage);next.ready();assert.equal(next.audio.volume,.62);assert.equal(next.slider.value,'62');
 next.slider.value='0';next.slider.events.input();next.handlers.pagehide();const silent=page(storage);silent.ready();assert.equal(silent.audio.volume,0);assert.equal(silent.audio.muted,false);
});
test('volume toggle opens and closes the slider panel',()=>{const current=page({});assert.equal(current.panel.hidden,true);current.volumeButton.events.click();assert.equal(current.panel.hidden,false);assert.equal(current.volumeButton.attributes['aria-expanded'],'true');current.volumeButton.events.click();assert.equal(current.panel.hidden,true)});
