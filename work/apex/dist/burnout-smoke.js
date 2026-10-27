import * as T from './assets/three.module.js';
// A fixed pool of soft tire-smoke sprites: one draw call, no textures or simulation grid.
export function createBurnoutSmoke(scene){
 const count=56,positions=new Float32Array(count*3),ages=new Float32Array(count).fill(10),seeds=new Float32Array(count),velocity=new Float32Array(count*3);
 for(let i=0;i<count;i++)seeds[i]=(i*.61803398875)%1;
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('aAge',new T.BufferAttribute(ages,1));geometry.setAttribute('aSeed',new T.BufferAttribute(seeds,1));
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,depthTest:true,uniforms:{uHeight:{value:600}},vertexShader:`
 attribute float aAge;attribute float aSeed;uniform float uHeight;varying float vAge;varying float vSeed;
 void main(){vAge=aAge;vSeed=aSeed;vec4 view=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*view;float size=.24+aAge*.70;gl_PointSize=aAge>2.1?0.:min(420.,uHeight*size/max(1.,-view.z));}
 `,fragmentShader:`
 varying float vAge;varying float vSeed;
 void main(){if(vAge>2.1)discard;vec2 p=gl_PointCoord*2.-1.;float angle=atan(p.y,p.x);float radius=length(p);float curl=sin(angle*3.+vSeed*19.+vAge*.7)*.07+sin(angle*5.-vAge*.5+vSeed*13.)*.035;float edge=1.-smoothstep(.35,.98,radius+curl);float cloud=.72+.18*sin(p.x*7.+p.y*4.+vSeed*13.+vAge)+.10*cos(p.y*9.-p.x*3.+vAge);float fade=smoothstep(0.,.10,vAge)*(1.-smoothstep(.45,2.1,vAge));float alpha=edge*cloud*fade*.19;if(alpha<.003)discard;gl_FragColor=vec4(mix(vec3(.35,.39,.38),vec3(.75,.78,.75),cloud*.55),alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }
 `});
 const points=new T.Points(geometry,material);points.frustumCulled=false;points.visible=false;points.renderOrder=1;scene.add(points);
 let index=0,accumulator=0,living=0;const emitter=new T.Vector3();
 function update(dt,pivot,emitting,restY,height){
  material.uniforms.uHeight.value=height;
  if(emitting){accumulator+=dt*48;pivot.updateWorldMatrix(true,false);while(accumulator>=1){accumulator--;const i=index++%count,side=i%2?1:-1,seed=seeds[i];emitter.set(side*1.04,-restY+.23,-1.82).applyMatrix4(pivot.matrixWorld);positions[i*3]=emitter.x;positions[i*3+1]=emitter.y;positions[i*3+2]=emitter.z;velocity[i*3]=-.55+seed*.45;velocity[i*3+1]=.27+seed*.25;velocity[i*3+2]=(seed-.5)*.6;ages[i]=0;}}
  living=0;for(let i=0;i<count;i++){if(ages[i]>=2.1)continue;ages[i]+=dt;positions[i*3]+=velocity[i*3]*dt;positions[i*3+1]+=velocity[i*3+1]*dt;positions[i*3+2]+=velocity[i*3+2]*dt;living++;}
  points.visible=living>0;geometry.attributes.position.needsUpdate=living>0;geometry.attributes.aAge.needsUpdate=living>0;return living>0;
 }
 function clear(){ages.fill(10);living=0;points.visible=false;accumulator=0}
 return {update,clear,get active(){return living>0},points};
}
