(() => {
'use strict';
const KEY='portfolio-audio-v1',controls='button,a[href],[role="button"],input[type="submit"],input[type="button"],select';
let context=null,muted=false,lastHover=0,lastClick=0;
try{muted=!!JSON.parse(sessionStorage.getItem(KEY)||'null')?.muted}catch{}
document.addEventListener('portfolio-sound-change',e=>{muted=!!e.detail.muted});
function unlock(){
 if(muted)return;
 try{context??=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{})}catch{}
}
function control(node){const el=node?.closest?.(controls);return el&&!el.disabled&&el.getAttribute('aria-disabled')!=='true'?el:null}
function tone(kind){
 if(muted||!context||context.state!=='running'||document.hidden)return;
 const now=context.currentTime,click=kind==='click',duration=click ? .09 : .055;
 const oscillator=context.createOscillator(),gain=context.createGain();
 oscillator.type='sine';oscillator.frequency.setValueAtTime(click?620:1150,now);oscillator.frequency.exponentialRampToValueAtTime(click?330:1450,now+duration);
 gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(click ? .075 : .032,now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
 oscillator.connect(gain);gain.connect(context.destination);oscillator.start(now);oscillator.stop(now+duration+.01);
 oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};
}
document.addEventListener('pointerdown',unlock,{capture:true,passive:true});
document.addEventListener('keydown',e=>{if(!e.repeat)unlock()},{capture:true});
document.addEventListener('pointerover',e=>{
 if(e.pointerType==='touch')return;
 const el=control(e.target);if(!el||el.contains(e.relatedTarget))return;
 const now=performance.now();if(now-lastHover<100)return;lastHover=now;unlock();tone('hover');
});
document.addEventListener('focusin',e=>{if(control(e.target)&&e.target.matches(':focus-visible'))tone('hover')});
document.addEventListener('click',e=>{
 if(!control(e.target))return;
 unlock();const now=performance.now();if(now-lastClick<65)return;lastClick=now;tone('click');
});
})();
