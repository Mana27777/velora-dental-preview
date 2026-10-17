import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=(name)=>readFileSync(new URL(name,import.meta.url),'utf8');
const html=read('./index.html');
const main=read('./main.js');
const css=read('./style.css');

assert.match(html,/<form method="dialog" class="dialog-close-form"><button class="dialog-close" type="submit" aria-label="Cerrar reserva">×<\/button><\/form>/,
  'El cierre debe ser un submit nativo de dialog para que cierre aunque falle el listener.');
assert.match(main,/on\(bookingModal,'close',closeBooking\)/,
  'Al cerrar el diálogo hay que restaurar scroll, foco y superficie táctil.');
assert.doesNotMatch(main,/on\(bookingModal\.querySelector\('\.dialog-close'\),'click'/,
  'No duplicar el cierre nativo con un handler de click.');
assert.match(css,/#booking-modal\{position:fixed;inset:50% 16px auto auto/,
  'En escritorio el panel permanece fijo a la derecha y centrado.');
assert.match(css,/#booking-modal \.dialog-close-form\{position:absolute;top:12px;right:14px;z-index:30/);
assert.match(css,/#booking-modal \.reservation-card\{z-index:1\}/,
  'El contenido no debe cubrir el control de cierre.');
assert.match(css,/@media\(max-width:700px\)\{#booking-modal\{inset:auto 10px 10px/,
  'En móvil el panel queda anclado como hoja inferior.');
assert.match(css,/\.chapter::before\{[^}]*backdrop-filter:blur\(11px\)/,
  'El vidrio difuso queda limitado al bloque de texto sobre video.');
assert.match(css,/rgba\(246,240,232,\.86\)/,
  'La capa conserva un fondo claro suficiente para la lectura.');
console.log('PASS: cierre nativo, botón por encima del contenido, panel fijo escritorio/móvil y vidrio localizado en los capítulos.');
