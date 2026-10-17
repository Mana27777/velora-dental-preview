import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calendarDays,demoSelection} from './booking-demo.js';
import {createMeasurement} from './measurement.js';
const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');
const source=read('./anatomy.js').replace(/^import drawing.*;\s*/,"const drawing='';");
const {anatomyProgress}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
for(const height of [620,800,844,932]){
  let previous=-1;
  for(let top=height;top>=-height;top-=4){const p=anatomyProgress(top,600,height);assert(p>=previous&&p>=0&&p<=1);previous=p;}
  assert.equal(anatomyProgress(height,600,height),0);assert.equal(anatomyProgress(-height,600,height),1);
}
assert.equal(anatomyProgress(NaN,600,844),null);
for(const [year,month,count] of [[2024,1,29],[2026,1,28],[2026,9,31],[2026,11,31]]){
  const cells=calendarDays(year,month,new Date(year,month,1));
  assert.equal(cells.filter(Boolean).length,count);assert.equal(cells.length%7,0);
  assert.equal(cells.findIndex(Boolean),(new Date(year,month,1).getDay()+6)%7);
}
const october=calendarDays(2026,9,new Date(2026,9,17));
assert(october.find(d=>d?.day===16).disabled);assert(!october.find(d=>d?.day===17).disabled);
assert.equal(demoSelection('2026-02-30','11:00'),null);assert.equal(demoSelection('2026-10-17','02:12'),null);
assert(demoSelection('2026-10-17','11:00',' Alex\n').startsWith('Alex · '));
const demo=read('./booking-demo.js');
assert(demo.includes('SIN DISPONIBILIDAD REAL')&&demo.includes('No se creó ninguna reserva real'));
assert(!/fetch\(|localStorage|sessionStorage|sendBeacon|\.cookie|window\.location/.test(demo));
assert(demo.includes("removeAttribute('name')"));
const css=read('./anatomy.css');assert(!css.includes('160svh'));assert(css.includes('.anatomy-story{position:relative;height:auto}'));
const html=read('./index.html');assert(html.indexOf('id="opciones"')<html.indexOf('id="educacion"'));assert(html.includes('</section>\n<section class="education information"'));
assert(!read('./style.css').includes('padding-right:22vw'));
const config=read('./config.js');assert(config.includes("mobilePortraitSrc: ''"));assert(config.includes("mobileSrc: asset('media/consultorio-desktop.mp4')"));
const target=new EventTarget(),events=[];target.addEventListener('velora:measurement',event=>events.push(event.detail));
const measure=createMeasurement({target,search:''});measure('booking_demo_completed','demo');
assert.equal(events.length,1);assert.equal(events[0].appointment_confirmed,false);assert.equal(events[0].provider_confirmation_reported,false);
console.log('PASS: compact anatomy progression, section separation, no product gutter, demo calendar/leap dates/validation/privacy, portrait slot and higher-resolution fallback.');
