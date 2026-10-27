(() => {
'use strict';
const START=40,KEY='portfolio-audio-v1';
let saved=null;
try{saved=JSON.parse(sessionStorage.getItem(KEY)||'null')}catch{}
const audio=new Audio('assets/background-music.mp3');
let volume=Number.isFinite(saved?.volume)?Math.max(0,Math.min(1,saved.volume)):.25;
audio.preload='auto';audio.volume=volume;audio.loop=false;audio.hidden=true;audio.setAttribute('aria-hidden','true');document.body.append(audio);
let muted=!!saved?.muted,positioned=false,blocked=false,failed=false,target=START,leaving=false;
audio.muted=muted;
const button=document.createElement('button');button.type='button';button.className='music-toggle';button.innerHTML='<span class="music-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="music-tooltip" aria-hidden="true"></span>';document.body.append(button);
const tip=button.querySelector('.music-tooltip');
const volumeButton=document.createElement('button');volumeButton.type='button';volumeButton.className='music-volume-toggle';volumeButton.setAttribute('aria-label','Adjust music volume');volumeButton.setAttribute('aria-expanded','false');volumeButton.setAttribute('aria-controls','musicVolumePanel');volumeButton.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';document.body.append(volumeButton);
const panel=document.createElement('div');panel.id='musicVolumePanel';panel.className='music-volume-panel';panel.hidden=true;panel.innerHTML='<div class="music-volume-heading"><label for="musicVolume">Music volume</label><output for="musicVolume"></output></div><input id="musicVolume" type="range" min="0" max="100" step="1" aria-label="Music volume">';document.body.append(panel);
const slider=panel.querySelector('input'),readout=panel.querySelector('output');
function updateVolume(){const percent=Math.round(volume*100);slider.value=String(percent);slider.setAttribute('aria-valuetext',percent+' percent');slider.style.setProperty('--volume',percent+'%');readout.textContent=percent+'%'}
function closeVolume(){panel.hidden=true;volumeButton.setAttribute('aria-expanded','false')}
volumeButton.addEventListener('click',()=>{panel.hidden=!panel.hidden;volumeButton.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)slider.focus()});
slider.addEventListener('input',()=>{volume=Number(slider.value)/100;audio.volume=volume;updateVolume();save();update()});
document.addEventListener('click',e=>{if(!panel.contains(e.target)&&!volumeButton.contains(e.target))closeVolume()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){closeVolume();volumeButton.focus()}});
updateVolume();
function update(){const sounding=positioned&&!audio.paused&&!audio.muted&&!audio.ended&&volume>0;button.classList.toggle('is-playing',sounding);button.classList.toggle('is-muted',muted);button.setAttribute('aria-pressed',String(!muted));const label=muted?'Unmute site audio':blocked?'Play site audio':'Mute site audio';button.setAttribute('aria-label',label);button.title=label;tip.textContent=muted?'Sound off':blocked?'Click to enable sound':'Sound on'}
function save(){if(!positioned)return;try{sessionStorage.setItem(KEY,JSON.stringify({position:audio.currentTime,muted,volume,playing:!audio.paused&&!audio.ended&&!muted,at:Date.now()}))}catch{}}
async function play(){if(muted||!positioned||failed||leaving)return;try{await audio.play();blocked=false}catch{blocked=true}update()}
function seek(position){positioned=false;target=position;audio.currentTime=target;if(!audio.seeking&&Math.abs(audio.currentTime-target)<.1){positioned=true;play()}update()}
function restore(){
 if(!Number.isFinite(audio.duration)||audio.duration<=START){fail();return}
 let resume=START;
 if(saved&&Number.isFinite(saved.position)&&saved.position>=START&&Number.isFinite(saved.at)){
  const elapsed=saved.playing?Math.max(0,(Date.now()-saved.at)/1000):0;
  resume=START+((saved.position-START+elapsed)%(audio.duration-START));
 }
 seek(resume);saved=null;
}
audio.addEventListener('loadedmetadata',restore);
audio.addEventListener('seeked',()=>{if(positioned||Math.abs(audio.currentTime-target)>.5)return;positioned=true;play();update()});
audio.addEventListener('ended',()=>seek(START));
for(const event of ['play','pause','volumechange'])audio.addEventListener(event,update);
function fail(){failed=true;button.classList.remove('is-playing');tip.textContent='Music unavailable';button.setAttribute('aria-label',muted?'Unmute site audio':'Mute site audio')}
audio.addEventListener('error',fail);
button.addEventListener('click',()=>{if(blocked&&!muted){play();return}muted=!muted;audio.muted=muted;save();document.dispatchEvent(new CustomEvent('portfolio-sound-change',{detail:{muted}}));if(!muted)play();update()});
function unlock(e){if(e.target.closest?.('.music-toggle')||muted||!audio.paused)return;play()}
document.addEventListener('click',unlock);document.addEventListener('keydown',e=>{if(e.key!=='Tab'&&!e.repeat)unlock(e)});
// Capture the final playhead at document exit, including native links and reloads.
addEventListener('pagehide',()=>{save();leaving=true;audio.pause()});
addEventListener('pageshow',e=>{if(e.persisted){leaving=false;try{saved=JSON.parse(sessionStorage.getItem(KEY)||'null')}catch{}muted=!!saved?.muted;volume=Number.isFinite(saved?.volume)?Math.max(0,Math.min(1,saved.volume)):volume;audio.volume=volume;updateVolume();audio.muted=muted;document.dispatchEvent(new CustomEvent('portfolio-sound-change',{detail:{muted}}));restore()}});
document.addEventListener('visibilitychange',()=>{button.classList.toggle('is-hidden-tab',document.hidden);if(document.hidden)save()});
setInterval(()=>{if(!leaving)save()},1000);
update();audio.load();
})();
