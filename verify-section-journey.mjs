import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('./journey.js',import.meta.url),'utf8').replace("import { clamp } from './motion.js';",'const clamp=p=>Math.max(0,Math.min(1,p));');
const {sectionPoseAt}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const anchors=[1000,3000,4300,5900];
assert.equal(sectionPoseAt(-100,anchors).size,148);
assert.equal(sectionPoseAt(9000,anchors).roll,90);
assert.equal(sectionPoseAt(9000,anchors).size,80);
const forward=[];
for(let y=0;y<=7000;y+=5){
  const pose=sectionPoseAt(y,anchors);
  assert(Object.values(pose).every(Number.isFinite));
  assert(pose.railX>=.87&&pose.railX<=.89);
  assert(pose.railY>=.34&&pose.railY<=.78);
  forward.push(pose);
}
for(let i=forward.length-1;i>=0;i--)assert.deepEqual(sectionPoseAt(i*5,anchors),forward[i],'Scroll must be reversible');
for(const y of anchors.slice(1)){
  const before=sectionPoseAt(y-.01,anchors),after=sectionPoseAt(y+.01,anchors);
  for(const key of Object.keys(before))assert(Math.abs(before[key]-after[key])<.001,'No jump at '+y);
}
assert.deepEqual(sectionPoseAt(2000,anchors),sectionPoseAt(2000,[1000,3000,4300,9000]),'Later layout changes must not affect earlier positioning');
console.log('PASS: section anchors, reversible movement, continuous joins and reduced size at booking.');
