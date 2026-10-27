import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import * as T from '../apex/dist/assets/three.module.js';
const s=fs.readFileSync('work/apex/dist/experience.js','utf8');const code=s.slice(s.indexOf('let entranceSeen='),s.indexOf('new IntersectionObserver',s.indexOf('let entranceSeen=')));
const pivot=new T.Group();pivot.position.y=.7;const camera=new T.PerspectiveCamera();camera.position.set(5,3,-6);camera.lookAt(0,.7,0);camera.aspect=1.7;
const ctx={T,pivot,camera,ready:true,reduced:{matches:false},pitch:0,orbit:Math.PI,uniforms:{uStrength:{value:0},uPoint:{value:new T.Vector2()},uTail:{value:new T.Vector2()}},hero:{classList:{add(){},remove(){}}},wake(){}};vm.createContext(ctx);vm.runInContext(code+'\nentranceVisible=true;enterStudio();',ctx);
vm.runInContext('driveEntrance(1/60)',ctx);assert.ok(pivot.position.length()>5);
for(let i=0;i<100;i++)vm.runInContext('if(entranceRunning)driveEntrance(1/60)',ctx);
assert.equal(pivot.position.x,0);assert.equal(pivot.position.y,.7);assert.equal(pivot.position.z,0);assert.equal(pivot.scale.x,1);assert.equal(pivot.rotation.y,Math.PI);assert.equal(ctx.uniforms.uStrength.value,0);
assert.equal(vm.runInContext('entranceTime',ctx),1.5);assert.equal(vm.runInContext('entranceRunning',ctx),false);vm.runInContext('enterStudio()',ctx);assert.equal(vm.runInContext('entranceRunning',ctx),false);
console.log('PASS: 1.5-second drive-in, exact final pose, reveal reset, plays only once.');
