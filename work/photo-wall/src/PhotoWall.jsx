import React,{useRef,useState,useEffect,useMemo,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,useSpring,useTransform,useReducedMotion} from 'framer-motion';
import {PHOTO_ITEMS} from './photos.js';
import {clamp,makeGlobe,projectGlobe} from './wall-geometry.js';
import Lightbox from './Lightbox.jsx';

function GlobePhoto({photo,yaw,pitch,radius,zoom,onOpen,cardFactor=1}) {
 const [loaded,setLoaded]=useState(false),reduced=useReducedMotion();
 const projected=useTransform(()=>projectGlobe(photo.point,yaw.get(),pitch.get(),radius));
 const x=useTransform(()=>projected.get().x*zoom.get()),y=useTransform(()=>projected.get().y*zoom.get());
 const depth=useTransform(()=>projected.get().scale*zoom.get());
 const opacity=useTransform(projected,p=>p.opacity);
 const zIndex=useTransform(projected,p=>Math.round((p.z+1)*1000));
 return <motion.div className="pw-globe-photo" style={{x,y,scale:depth,opacity,zIndex,width:photo.tileWidth*cardFactor,height:photo.tileHeight*cardFactor,marginLeft:-photo.tileWidth*cardFactor/2,marginTop:-photo.tileHeight*cardFactor/2}}>
   <motion.button type="button" data-photo-id={photo.id} className="pw-card group absolute text-left" style={{inset:0,width:'100%',height:'100%'}} aria-label={`Open photo: ${photo.title}`} whileHover={reduced?undefined:{scale:1.05,y:-6}} whileFocus={reduced?undefined:{scale:1.03}} transition={{type:'spring',stiffness:320,damping:28}} onClick={event=>{if(event.detail===0)onOpen(photo.id);}}>
    <span className="pw-image-stage absolute inset-0 overflow-hidden" style={{backgroundImage:`url(${photo.placeholder})`}}><img src={photo.thumbnail||photo.src} srcSet={photo.srcSet} sizes="(max-width:700px) 240px, 420px" alt={photo.alt} loading="lazy" decoding="async" draggable="false" onLoad={()=>setLoaded(true)} style={{opacity:loaded?1:0}}/></span>
    <span className="pw-card-count absolute">{String(photo.number).padStart(2,'0')}</span>
    <span className="pw-caption absolute inset-x-0 bottom-0 flex items-end justify-between gap-3">{photo.showCaption && <span><strong className="block text-white">{photo.title}</strong><span className="block mt-1 text-xs">{photo.collection}{photo.date&&` · ${photo.date}`}</span></span>}</span>
   </motion.button>
 </motion.div>;
}

export function PhotoGlobe({photos=PHOTO_ITEMS}) {
 const viewport=useRef(null),down=useRef(null),pointers=useRef(new Map()),pinch=useRef(null);
 const [active,setActive]=useState(null),[dragging,setDragging]=useState(false),[size,setSize]=useState({width:1200,height:850}),[zoomLabel,setZoomLabel]=useState(100);
 const reduced=useReducedMotion(),tiles=useMemo(()=>makeGlobe(photos),[photos]);
 const yaw=useSpring(-25,{stiffness:85,damping:24,mass:1.1});
 const pitch=useSpring(-12,{stiffness:100,damping:26});
 const zoom=useSpring(1,{stiffness:250,damping:32});
 const target=useRef({yaw:-25,pitch:-12,zoom:1});
 const radius=Math.min(size.width*(size.width<700?.33:.31),size.height*.32,380);
 const center={x:size.width*.5,y:size.height*.5};
 const setAngles=useCallback((a,b,instant=false)=>{
  target.current.yaw=a;target.current.pitch=b;
  const method=instant||reduced?'jump':'set';yaw[method](a);pitch[method](target.current.pitch);
 },[reduced]);
 const setZoom=useCallback(value=>{value=clamp(value,.5,2.5);target.current.zoom=value;zoom[reduced?'jump':'set'](value);setZoomLabel(Math.round(value*100));},[reduced]);
 const reset=()=>{setAngles(-25,-12);setZoom(1);};
 useEffect(()=>{
  const element=viewport.current;
  const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(element);
  function wheel(event){event.preventDefault();const unit=event.deltaMode===1?16:event.deltaMode===2?element.clientHeight:1;const dy=clamp(event.deltaY*unit,-200,200),dx=clamp(event.deltaX*unit,-200,200);setAngles(target.current.yaw+dx*.24,target.current.pitch+dy*.24);}
  element.addEventListener('wheel',wheel,{passive:false});
  return()=>{observer.disconnect();element.removeEventListener('wheel',wheel);};
 },[setAngles]);
 function pointerDown(event){
  if(event.button!==0)return;event.preventDefault();viewport.current.setPointerCapture(event.pointerId);pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(pointers.current.size===1){down.current={x:event.clientX,y:event.clientY,yaw:yaw.get(),pitch:pitch.get(),lastX:event.clientX,lastY:event.clientY,time:performance.now(),vx:0,vy:0,moved:false,id:event.target.closest('[data-photo-id]')?.dataset.photoId};target.current.yaw=yaw.get();target.current.pitch=pitch.get();}
  else{down.current.moved=true;const[a,b]=[...pointers.current.values()];pinch.current={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:target.current.zoom};}
  setDragging(true);
 }
 function pointerMove(event){
  if(!pointers.current.has(event.pointerId))return;pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(pointers.current.size>1&&pinch.current){const[a,b]=[...pointers.current.values()];setZoom(pinch.current.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.current.distance);return;}
  const d=down.current;if(!d)return;const now=performance.now(),dt=Math.max(8,now-d.time),dx=event.clientX-d.x,dy=event.clientY-d.y;if(Math.hypot(dx,dy)>6)d.moved=true;
  d.vx=(event.clientX-d.lastX)/dt;d.vy=(event.clientY-d.lastY)/dt;d.time=now;d.lastX=event.clientX;d.lastY=event.clientY;setAngles(d.yaw+dx*.23,d.pitch-dy*.23);
 }
 function pointerEnd(event){
  pointers.current.delete(event.pointerId);
  if(pointers.current.size){const p=[...pointers.current.values()][0];down.current={...down.current,x:p.x,y:p.y,yaw:target.current.yaw,pitch:target.current.pitch,moved:true,vx:0,vy:0};pinch.current=null;return;}
  const d=down.current;down.current=null;pinch.current=null;setDragging(false);if(!d||event.type==='pointercancel')return;
  if(!d.moved&&d.id){setActive(d.id);return;}
  if(d.moved&&!reduced&&performance.now()-d.time<100)setAngles(target.current.yaw+clamp(d.vx,-2,2)*24,target.current.pitch-clamp(d.vy,-2,2)*24);
 }
 return <section className="pw-shell pw-globe-shell relative isolate overflow-hidden bg-[#0a0a0a] text-white" aria-labelledby="photos-title">
  <div ref={viewport} className={`pw-viewport absolute inset-0 ${dragging?'is-dragging':''}`} tabIndex="0" aria-label="Photo globe — scroll or drag in any direction to rotate on the X and Y axes, arrow keys to rotate" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onKeyDown={event=>{
   if(event.target!==event.currentTarget)return;const keys={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]};if(keys[event.key]){event.preventDefault();const[a,b]=keys[event.key];setAngles(target.current.yaw+a,target.current.pitch+b);}if(event.key==='0')reset();
  }}>
   <motion.div className="pw-globe-stage" style={{left:center.x,top:center.y}} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:reduced?0:.8}}>
    <motion.div className="pw-sphere-lines" aria-hidden="true" style={{width:radius*2,height:radius*2,marginLeft:-radius,marginTop:-radius,rotateY:yaw,rotateX:pitch,scale:zoom}}>
     {[0,30,60,90,120,150].map(angle=><i key={`meridian-${angle}`} className="pw-meridian" style={{transform:`rotateY(${angle}deg)`}}/>)}
     {[-60,-30,0,30,60].map(angle=>{const radians=angle*Math.PI/180,diameter=Math.cos(radians)*radius*2;return <i key={`latitude-${angle}`} className="pw-latitude" style={{width:diameter,height:diameter,marginLeft:-diameter/2,marginTop:-diameter/2,transform:`translateY(${Math.sin(radians)*radius}px) rotateX(90deg)`}}/>;})}
    </motion.div>
    {tiles.map(photo=><GlobePhoto key={photo.id} photo={photo} yaw={yaw} pitch={pitch} radius={radius} zoom={zoom} onOpen={setActive} cardFactor={size.width<700?.62:1}/>)}
   </motion.div>
  </div>
  <div className="pw-vignette absolute inset-0 pointer-events-none"/>
  <h1 id="photos-title" className="sr-only">Photos</h1>
  <div className="pw-dock absolute flex items-center gap-2"><span className="pw-drag-tip">◎ <span>Scroll to spin</span></span><span className="pw-divider"/>
   <button type="button" className="pw-control" aria-label="Zoom out" disabled={zoomLabel<=50} onClick={()=>setZoom(target.current.zoom-.2)}>−</button><output className="pw-zoom" aria-label="Zoom level">{zoomLabel}%</output><button type="button" className="pw-control" aria-label="Zoom in" disabled={zoomLabel>=250} onClick={()=>setZoom(target.current.zoom+.2)}>+</button><span className="pw-divider"/><button type="button" className="pw-reset" onClick={reset} aria-label="Reset photo globe">Reset </button>
  </div>
  <p className="pw-bottom-note absolute pointer-events-none">Scroll to spin <span>·</span> Drag in any direction <span>·</span> Click to look closer</p>
  <div className="pw-browse"><label className="sr-only" htmlFor="pw-photo-select">Jump to a photo</label><select id="pw-photo-select" value="" onChange={event=>{if(event.target.value)setActive(event.target.value);}}><option value="">Browse all {photos.length} photos</option>{photos.map(photo=><option key={photo.id} value={photo.id}>{photo.showCaption?photo.title:`Photo ${photos.indexOf(photo)+1}`}</option>)}</select></div>
  {active&&<Lightbox photos={photos} activeId={active} onChange={setActive} onClose={()=>setActive(null)}/>}
 </section>;
}
createRoot(document.getElementById('photoWallRoot')).render(<PhotoGlobe/>);
