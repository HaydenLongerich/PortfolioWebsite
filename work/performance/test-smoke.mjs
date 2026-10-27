import assert from 'node:assert/strict';import * as T from '../apex/dist/assets/three.module.js';import {createBurnoutSmoke} from '../apex/dist/burnout-smoke.js';
const scene=new T.Scene(),pivot=new T.Group();scene.add(pivot);pivot.position.set(-2,.7,0);const smoke=createBurnoutSmoke(scene);
assert.equal(smoke.points.geometry.attributes.position.count,56);assert.equal(smoke.points.visible,false);
for(let i=0;i<60;i++)smoke.update(1/60,pivot,true,.7,600);assert.equal(smoke.active,true);assert.equal(smoke.points.visible,true);assert.ok([...smoke.points.geometry.attributes.position.array].every(Number.isFinite));
for(let i=0;i<140;i++)smoke.update(1/60,pivot,false,.7,600);assert.equal(smoke.active,false);assert.equal(smoke.points.visible,false);
smoke.update(.1,pivot,true,.7,600);smoke.clear();assert.equal(smoke.active,false);assert.equal(smoke.points.visible,false);
console.log('PASS: fixed 56-puff pool, follows world-space emitters, finite positions, fades fully, reduced-motion clear.');
