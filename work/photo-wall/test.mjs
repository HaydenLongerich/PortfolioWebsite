import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {PHOTO_ITEMS} from './src/photos.js';
import {makeGlobe,projectGlobe} from './src/wall-geometry.js';

test('15 real photographs, no app screenshots, all source and preview assets exist',()=>{
 assert.equal(PHOTO_ITEMS.length,15);assert.equal(new Set(PHOTO_ITEMS.map(p=>p.id)).size,15);
 for(const p of PHOTO_ITEMS){assert.ok(p.width>0&&p.height>0);assert.ok(p.placeholder.startsWith('data:image/webp;base64,'));assert.ok(!/cortex-|advisory-|invest-|bridgelink-/.test(p.src));for(const path of[p.src,...p.srcSet.split(', ').map(s=>s.split(' ')[0])])assert.ok(existsSync('../apex/dist/'+path),path);}
 assert.equal(PHOTO_ITEMS.filter(p=>p.src.endsWith('.png')).length,11);
});
test('photo positions span a unit sphere without duplicate points',()=>{
 const tiles=makeGlobe(PHOTO_ITEMS);assert.equal(tiles.length,15);
 for(const {point} of tiles)assert.ok(Math.abs(Math.hypot(point.x,point.y,point.z)-1)<1e-10);
 assert.equal(new Set(tiles.map(p=>JSON.stringify(p.point))).size,15);
});
test('full rotations return a photo to its original projection',()=>{
 for(const {point} of makeGlobe(PHOTO_ITEMS)){
  const a=projectGlobe(point,12,-15,300),b=projectGlobe(point,372,-15,300);
  for(const key of['x','y','z','scale','opacity'])assert.ok(Math.abs(a[key]-b[key])<1e-8);
  assert.ok(a.scale>0&&a.opacity>=.14&&a.opacity<=1);
 }
});
test('half a revolution swaps front and back, keeping coordinates finite',()=>{
 const a=projectGlobe({x:0,y:0,z:1},0,0,300),b=projectGlobe({x:0,y:0,z:1},180,0,300);
 assert.ok(a.opacity>b.opacity);assert.ok(a.scale>b.scale);assert.ok(a.z>0&&b.z<0);
});

test('each globe frame preserves its source ratio within the smaller size limits',()=>{
 for(const photo of makeGlobe(PHOTO_ITEMS)){
  assert.ok(photo.tileWidth<=160&&photo.tileHeight<=190);
  assert.ok(Math.abs(photo.tileWidth/photo.tileHeight-photo.width/photo.height)<1e-10);
 }
});

test('only the four hackathon photos show visible captions',()=>{
 assert.equal(PHOTO_ITEMS.filter(photo=>photo.showCaption).length,4);
 for(const photo of PHOTO_ITEMS)assert.equal(photo.showCaption,photo.collection==='SOON Hackathon');
});
