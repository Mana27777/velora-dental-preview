import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=(path)=>readFileSync(new URL(path,import.meta.url),'utf8');
const main=read('./main.js');
const css=read('./style.css');
const html=read('./index.html');
const config=read('./config.js');
const video=read('./scroll-video.js');

assert.match(config,/playbackMode:\s*'scrub'/,'El video debe controlarse por el scroll.');
assert.match(video,/strictScroll:playbackMode==='scrub'/);
assert.match(video,/video\.loop=!this\.strictScroll/,'El modo scroll debe desactivar el loop.');
assert.match(video,/this\.watchdog=setTimeout\(\(\)=>\{this\.busy=false;if\(!this\.video\.seeking\)this\.seek\(\);\},1200\)/,'Un seek lento no debe cambiar a reproducción automática.');
assert.match(video,/catch\{this\.poster\(\);\}/,'Los fallos del seek no deben activar playback.');
assert.doesNotMatch(video,/on\(video,'ended',[^\n]*playVisible/,'El video no debe reiniciarse al final.');

const previousHeroScale=.88,currentHeroScale=.88*.8;
assert.ok(Math.abs(currentHeroScale/previousHeroScale-.8)<1e-9,'La reducción móvil adicional debe ser 20% y solo en el hero.');
assert.match(main,/if\(mobile\)desired\*=1-\.20\*\(1-follow\)/);
assert.match(main,/footerBlend=clamp\(/,'El cambio de pose del footer debe estar ligado al scroll.');
assert.match(main,/footerRailX=viewWidth<=700\?\.75:.77/);
assert.match(main,/sectionPose\.railY\+=\(\.93-sectionPose\.railY\)\*footerBlend/);
assert.match(main,/const left=x\*viewWidth-width\/2-3,top=centerY\*viewHeight-height\/2-3/,'La zona táctil debe seguir la silueta del modelo.');
assert.match(main,/width:\$\{width\+6\}px;height:\$\{height\+6\}px/,'La zona táctil debe usar un margen estrecho.');

assert.match(css,/\.hero-video:after\{content:""!important;display:block!important;[^}]*background:rgba\(31,25,23,\.2\)[^}]*backdrop-filter:blur\(1px\)/,'El video lleva un velo oscuro de vidrio sutil.');
assert.match(css,/\.chapter::before\{content:none!important\}/,'Los textos no deben estar contenidos en una viñeta.');
assert.match(css,/\.chapter::after\{[^}]*radial-gradient\(ellipse 85% 72% at 47% 46%,rgba\(248,232,211,\.84\)/,'La lectura se apoya en una luz cálida visible, no en una tarjeta.');
assert.match(css,/\.hero-video video,\.hero-video\.video-ready video\{opacity:1!important;transition:none!important\}/);
assert.match(css,/footer\{position:relative;min-height:clamp\(230px,34vh,330px\)/);
assert.doesNotMatch(html,/VÉLORA DENTAL es una demostración conceptual\. No brinda atención odontológica\./);
assert.match(html,/<footer>[\s\S]*?Pie de página[\s\S]*?<\/nav><\/footer>/);
assert.match(main,/Vista previa de reservas · sin citas reales/,'La indicación honesta debe conservarse en la reserva.');

console.log('Final hero/video/touch/footer adjustment checks passed.');
