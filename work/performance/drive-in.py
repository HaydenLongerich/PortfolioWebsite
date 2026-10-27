from pathlib import Path
import re
root=Path('work/apex/dist')
p=root/'index.html';s=p.read_text(encoding='utf-8');s=re.sub(r'<div class="model-intro">.*?</div>','',s,flags=re.S);p.write_text(s,encoding='utf-8')
p=root/'atmosphere.js';s=p.read_text(encoding='utf-8');at=s.index('if(!fine.matches||reduce.matches)return;')
s=s[:at]+'''// Slow physical wheel scrolling without blocking touch, zoom or nested scroll areas.
let wheelFrame=0,wheelTarget=scrollY,wheelLast=0;
function cancelWheel(){cancelAnimationFrame(wheelFrame);wheelFrame=0;wheelTarget=scrollY}
function easeWheel(now){wheelFrame=0;const dt=Math.min(40,now-wheelLast)||16;wheelLast=now;const gap=wheelTarget-scrollY;if(Math.abs(gap)<.3){window.scrollTo({top:wheelTarget,behavior:'instant'});return}window.scrollTo({top:scrollY+gap*(1-Math.exp(-dt/155)),behavior:'instant'});wheelFrame=requestAnimationFrame(easeWheel)}
function nestedScroll(target){for(let el=target;el&&el!==document.body;el=el.parentElement){if(el.matches?.('dialog,input,textarea,select,[contenteditable="true"]'))return true;const css=getComputedStyle(el);if(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+2)return true}return false}
window.addEventListener('wheel',e=>{if(!fine.matches||e.ctrlKey||e.metaKey||e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||nestedScroll(e.target))return;e.preventDefault();stopFlight();const unit=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1,delta=e.deltaY*unit*.18,limit=document.documentElement.scrollHeight-innerHeight;if(!wheelFrame)wheelTarget=scrollY;wheelTarget=Math.max(0,Math.min(limit,Math.max(scrollY-innerHeight*.45,Math.min(scrollY+innerHeight*.45,wheelTarget+delta))));if(reduce.matches){window.scrollTo({top:wheelTarget,behavior:'instant'});return}if(!wheelFrame){wheelLast=performance.now();wheelFrame=requestAnimationFrame(easeWheel)}},{passive:false});
for(const event of ['touchstart','pointerdown','keydown'])window.addEventListener(event,cancelWheel,{passive:true});window.addEventListener('resize',cancelWheel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelWheel()});
''' +s[at:];p.write_text(s,encoding='utf-8')
p=root/'experience.js';s=p.read_text(encoding='utf-8');at=s.index('function hint()');s=s[:at]+'''let entranceSeen=false,entranceVisible=false,entranceAnimation;
function finishEntrance(){if(entranceAnimation){entranceAnimation.finish();entranceAnimation=null}hero.classList.remove('drive-in')}
function enterStudio(){if(!ready||!entranceVisible||entranceSeen)return;entranceSeen=true;if(reduced.matches)return;
 renderer.render(scene,camera);hero.classList.add('drive-in');
 entranceAnimation=renderer.domElement.animate([
 {transform:'translate3d(-115%,20px,0) rotate(-3deg)',opacity:0,offset:0},
 {transform:'translate3d(-80%,12px,0) rotate(-2deg)',opacity:1,offset:.16},
 {transform:'translate3d(3%,0,0) rotate(.5deg)',opacity:1,offset:.78},
 {transform:'translate3d(0,0,0) rotate(0deg)',opacity:1,offset:1}
 ],{duration:2400,easing:'cubic-bezier(.2,.7,.15,1)',fill:'none'});
 entranceAnimation.onfinish=()=>{entranceAnimation=null;hero.classList.remove('drive-in')};
}
new IntersectionObserver(([e])=>{entranceVisible=e.isIntersecting;if(entranceVisible)enterStudio()},{threshold:.45}).observe(host);
host.addEventListener('pointerdown',finishEntrance);host.addEventListener('keydown',finishEntrance);
document.querySelectorAll('.hero-hint button,.hero-hint input').forEach(el=>el.addEventListener('pointerdown',finishEntrance));
''' +s[at:];s=s.replace('setMode(mode);wake();','setMode(mode);wake();enterStudio();');s=s.replace("reduced.addEventListener('change',()=>{velocity=0;wake()})","reduced.addEventListener('change',()=>{velocity=0;if(reduced.matches)finishEntrance();wake()})");p.write_text(s,encoding='utf-8')
for p in root.glob('*.html'):
 s=p.read_text(encoding='utf-8').replace('?v=fluid6','?v=drive7');p.write_text(s,encoding='utf-8')
