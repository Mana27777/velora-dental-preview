import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calendarDays} from './booking-demo.js';
const read=f=>fs.readFileSync(new URL(f,import.meta.url),'utf8');
const {anatomyProgress,anatomyPose}=await import('data:text/javascript;base64,'+Buffer.from(read('./anatomy.js').replace(/^import drawing.*;\s*/,"const drawing='';")).toString('base64'));
for(const height of [800,844,873,915,932,1024,900]){
 const panel=694,travel=Math.round(height*.95),total=panel+travel;
 for(const top of [height,200,17,16])assert.equal(anatomyProgress(top,total,panel),0,'No advancement before local pin');
 const samples=Array.from({length:101},(_,i)=>anatomyProgress(16-travel*i/100,total,panel));
 assert.deepEqual([samples[0],samples[50],samples[100]].map(p=>anatomyPose(p).index),[0,1,2]);
 assert(samples.every((p,i)=>!i||p>=samples[i-1]));
 assert.deepEqual([...samples].reverse(),Array.from({length:101},(_,i)=>anatomyProgress(16-travel*(100-i)/100,total,panel)));
}
const days=calendarDays(2026,10,new Date(2026,10,1)).filter(Boolean);
assert(days.some(x=>x.disabled)&&days.some(x=>!x.disabled),'Demo has illustrative blocked dates');
const html=read('./index.html'),main=read('./main.js'),demo=read('./booking-demo.js');
assert(html.indexOf('id="booking-modal"')>html.indexOf('</main>'),'Modal does not reserve layout space');
assert(!/<dialog[^>]*\bopen\b/.test(html));
assert(main.includes('bookingModal.showModal()')&&main.includes("on(bookingModal,'close',closeBooking)"));
assert(main.includes('touchSurface.inert=true')&&main.includes('!document.hidden&&!modalOpen'));
assert(main.includes('visible&&!failed&&heroVisible'));
assert(demo.includes("type=\"email\"")&&demo.includes('form.reportValidity()'));
assert(!/fetch\(|localStorage|sessionStorage|sendBeacon|\.cookie/.test(demo));
assert(read('./config.js').includes("playbackMode: 'auto'"));
const movie=fs.readFileSync(new URL('./public/media/consultorio-vertical.mp4',import.meta.url));
assert(movie.indexOf(Buffer.from('moov'))<movie.indexOf(Buffer.from('mdat')));
assert.equal(movie.indexOf(Buffer.from('soun')),-1,'No audio track');
assert(movie.length<3_147_380);
console.log('PASS: local anatomy entry/sequence/reverse; modal semantics and motion/input suspension; demo privacy/blocked dates; silent faststart portrait video.');
