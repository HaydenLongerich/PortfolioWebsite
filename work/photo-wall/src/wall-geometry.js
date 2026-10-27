export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export function makeLayout(photos) {
  const stagger = [0,130,25,190,75];
  const tiles = photos.map((photo,index) => {
    const column = index % 5, row = Math.floor(index / 5);
    const noise = seed => {const n=Math.sin(seed*127.1+43.7)*43758.5453;return n-Math.floor(n);};
    const ratio = photo.width > 0 && photo.height > 0 ? photo.height / photo.width : .625;
    return {...photo,left:55+column*500+(noise(index+1)-.5)*80,
      top:60+row*520+stagger[column]+(noise(index+31)-.5)*70,
      tileHeight:clamp(300*ratio,156,330),number:index+1,
      rotation:(noise(index+63)-.5)*10,depth:.55+noise(index+93)*.65,phase:noise(index+123)*Math.PI*2};
  });
  return {tiles,width:2400,height:Math.max(...tiles.map(p=>p.top+p.tileHeight))+80};
}
export function zoomView(view, requestedScale, px, py) {
  const scale = clamp(requestedScale,.5,2.5),ratio=scale/view.scale;
  return {scale,x:px-(px-view.x)*ratio,y:py-(py-view.y)*ratio};
}
export function constrainView(view, layout, viewport) {
  const scale=clamp(view.scale,.5,2.5);
  return {scale,x:clamp(view.x,-layout.width*scale+100,viewport.width-100),y:clamp(view.y,-layout.height*scale+100,viewport.height-140)};
}
export function makeGlobe(photos) {
 const goldenAngle=Math.PI*(3-Math.sqrt(5));
 return photos.map((photo,index)=>{
  const vertical=1-2*(index+.5)/photos.length;
  const ring=Math.sqrt(1-vertical*vertical),angle=index*goldenAngle;
  const ratio=photo.width/photo.height || 4/3;
  const tileWidth=Math.min(160,190*ratio),tileHeight=tileWidth/ratio;
  return {...photo,number:index+1,point:{x:Math.cos(angle)*ring,y:vertical,z:Math.sin(angle)*ring},tileWidth,tileHeight};
 });
}
export function projectGlobe(point,yaw,pitch,radius) {
 const ay=yaw*Math.PI/180,ax=pitch*Math.PI/180;
 const x=point.x*Math.cos(ay)+point.z*Math.sin(ay);
 const yz=-point.x*Math.sin(ay)+point.z*Math.cos(ay);
 const y=point.y*Math.cos(ax)-yz*Math.sin(ax),z=point.y*Math.sin(ax)+yz*Math.cos(ax);
 const perspective=1/(1-z*.28);
 return {x:x*radius*perspective,y:y*radius*perspective,z,scale:perspective,opacity:z>=0?1:.14+Math.pow(z+1,2)*.36};
}
