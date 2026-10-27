(() => {
const selector='button:not(.tool-tile):not(.project-card-trigger),.header-links a,.landing-actions a,.project-links a,.side-nav a,.modal-links a,.tooling-board,.tool-dialog-icon,.project-card,.contact-panel,.contact-route,dialog';
const panels='.tooling-board,.tool-dialog-icon,.project-card,.contact-panel,.contact-route,dialog';
const nodes=new Set(),geometry=new WeakMap(),progress=new WeakMap(),ns='http://www.w3.org/2000/svg',reduced=matchMedia('(prefers-reduced-motion: reduce)');
let scheduled=false,hovered=null,frame=0,last=0;
function paint(node,phase){const data=geometry.get(node);if(!data)return;for(const segment of data.segments)segment.rect.setAttribute('stroke-dashoffset',String(-phase*data.length+segment.lag));}
function animate(now){frame=0;if(!hovered||document.hidden||reduced.matches)return;const node=hovered,dt=Math.min(50,now-last);last=now;const phase=((progress.get(node)||0)+dt/(node.classList.contains('edge-panel')?3100:2100))%1;progress.set(node,phase);paint(node,phase);frame=requestAnimationFrame(animate)}
function stop(){cancelAnimationFrame(frame);frame=0}
function setHover(node){if(node===hovered)return;stop();hovered?.classList.remove('edge-hover');hovered=node;hovered?.classList.add('edge-hover');if(hovered){paint(hovered,progress.get(hovered)||0);if(!reduced.matches&&!document.hidden){last=performance.now();frame=requestAnimationFrame(animate)}}}
function draw(node){if(!node.isConnected)return;let created=false,svg=[...node.children].find(child=>child.classList?.contains('edge-trace'));
 if(!svg){created=true;svg=document.createElementNS(ns,'svg');svg.classList.add('edge-trace');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');for(let i=23;i>=0;i--){const rect=document.createElementNS(ns,'rect');rect.dataset.tail=String(i);rect.style.setProperty('--segment-alpha',String(Math.pow(1-i/24,2.1)));rect.style.setProperty('--segment-color',i===0?'#F1FFB3':'#D2FF00');svg.append(rect)}node.append(svg)}
 const width=node.clientWidth,height=node.clientHeight;if(!width||!height)return;const css=getComputedStyle(node),value=css.borderTopLeftRadius,radius=value.includes('%')?Math.min(width,height)*parseFloat(value)/100:parseFloat(value)||0;
 const old=geometry.get(node);if(!created&&old?.width===width&&old?.height===height&&old?.radius===radius)return;
 const inset=2,w=Math.max(0,width-inset*2),h=Math.max(0,height-inset*2),rx=Math.max(0,Math.min(radius-inset,w/2,h/2)),segments=[];
 svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('preserveAspectRatio','none');
 for(const rect of svg.children){rect.setAttribute('x',String(inset));rect.setAttribute('y',String(inset));rect.setAttribute('width',String(w));rect.setAttribute('height',String(h));rect.setAttribute('rx',String(rx))}
 const first=svg.children[0],length=typeof first.getTotalLength==='function'?first.getTotalLength():2*(w+h-4*rx)+2*Math.PI*rx;
 for(const rect of svg.children){rect.setAttribute('stroke-dasharray',`${length*.011} ${length*.989}`);segments.push({rect,lag:Number(rect.dataset.tail)*length*.008})}
 geometry.set(node,{width,height,radius,length,segments});paint(node,progress.get(node)||0);
}
const resize=new ResizeObserver(entries=>{for(const entry of entries)draw(entry.target)});
const visible=new IntersectionObserver(entries=>{for(const entry of entries){entry.target.classList.toggle('edge-visible',entry.isIntersecting);if(!entry.isIntersecting&&entry.target===hovered)setHover(null)}},{rootMargin:'20px'});
function scan(){scheduled=false;for(const node of [...nodes])if(!node.isConnected){resize.unobserve(node);visible.unobserve(node);nodes.delete(node);if(node===hovered)setHover(null)}
 for(const node of document.querySelectorAll(selector)){if(!nodes.has(node)){nodes.add(node);if(getComputedStyle(node).position==='static')node.classList.add('edge-positioned');node.classList.add('edge-surface');if(node.matches(panels))node.classList.add('edge-panel');resize.observe(node);visible.observe(node)}draw(node)}
}
function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(scan)}
scan();new MutationObserver(records=>{if(records.some(record=>[...record.addedNodes,...record.removedNodes].some(node=>node.nodeType===1&&!node.classList?.contains('edge-trace')&&node.tagName?.toLowerCase()!=='rect')||record.target.matches?.('button,.tool-dialog-icon')&&![...record.target.children].some(child=>child.classList?.contains('edge-trace'))))queue()}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('pointerover',e=>{if(e.pointerType!=='touch')setHover(e.target.closest?.('.edge-surface')||null)},{passive:true});document.addEventListener('pointerout',e=>{if(!e.relatedTarget)setHover(null)},{passive:true});window.addEventListener('blur',()=>setHover(null));document.addEventListener('visibilitychange',()=>{if(document.hidden)setHover(null)});reduced.addEventListener('change',()=>setHover(null));
})();
