export function calendarDays(year,month,today=new Date()){
  const start=new Date(year,month,1),offset=(start.getDay()+6)%7;
  const count=new Date(year,month+1,0).getDate(),floor=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  return Array.from({length:Math.ceil((offset+count)/7)*7},(_,index)=>{
    const day=index-offset+1;if(day<1||day>count)return null;
    return {day,key:`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,disabled:new Date(year,month,day)<floor};
  });
}
export function demoSelection(day,time,alias=''){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!['09:30','11:00','15:30','17:00'].includes(time))return null;
  const [year,month,date]=day.split('-').map(Number),value=new Date(year,month-1,date);
  if(value.getFullYear()!==year||value.getMonth()!==month-1||value.getDate()!==date)return null;
  const name=alias.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,40);
  return `${name?name+' · ':''}${new Intl.DateTimeFormat('es-AR',{weekday:'long',day:'numeric',month:'long'}).format(value)} · ${time}`;
}
export function createDemoBooking(root,track){
  const abort=new AbortController(),signal=abort.signal,now=new Date();
  let year=now.getFullYear(),month=now.getMonth(),day='',time='';
  root.dataset.bookingMode='demo';root.classList.add('booking-demo');
  root.setAttribute('aria-label','Simulación de reserva, sin disponibilidad real');
  root.innerHTML='<div class="booking-demo-badge">SIMULACIÓN · SIN DISPONIBILIDAD REAL</div><h3>Tu primera valoración,<br>a un paso.</h3><p class="demo-intro">Conocé cómo se reserva desde la web. Las fechas y horas son ilustrativas.</p><form class="demo-booking-form"><div class="demo-calendar"><div class="calendar-heading"><button type="button" class="calendar-prev" aria-label="Mes anterior">‹</button><h4 class="calendar-month" aria-live="polite"></h4><button type="button" class="calendar-next" aria-label="Mes siguiente">›</button></div><div class="calendar-weekdays" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="calendar-days" role="group" aria-label="Fechas ilustrativas"></div></div><div class="demo-booking-details"><fieldset><legend>Elegí un horario de ejemplo</legend><div class="demo-times"></div></fieldset><label class="demo-alias">Nombre de ejemplo <span>Opcional, solo para esta simulación</span><input name="demoAlias" autocomplete="off" maxlength="40" placeholder="Ejemplo: Alex"></label><p class="demo-selection" role="status">Elegí una fecha y un horario ilustrativos.</p><button class="demo-submit" type="submit" disabled>Simular reserva ↗</button><p class="demo-privacy">No se envían datos ni se crea una cita.</p></div></form><div class="demo-booking-result" hidden><div class="demo-result-symbol" aria-hidden="true">✓</div><h4>Así se vería tu confirmación.</h4><p class="demo-result-selection"></p><p>Simulación completada. No se creó ninguna reserva real.</p><p class="demo-next-step">Con la agenda de la clínica conectada, el paciente puede consultar horarios reales y recibir la confirmación correspondiente.</p><button class="demo-restart" type="button">Probar otra selección</button></div>';
  const find=selector=>root.querySelector(selector),days=find('.calendar-days'),times=find('.demo-times'),form=find('form'),submit=find('.demo-submit'),summary=find('.demo-selection'),result=find('.demo-booking-result');
  find('input').removeAttribute('name'); // Even a native fallback submit has no personal query fields.
  form.setAttribute('aria-label','Formulario de ejemplo. No crea reservas.');
  result.querySelector('h4').tabIndex=-1;
  function refresh(){
    summary.textContent=demoSelection(day,time)||'Elegí una fecha y un horario ilustrativos.';submit.disabled=!demoSelection(day,time);
    for(const button of days.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.day===day));
    for(const button of times.children)button.setAttribute('aria-pressed',String(button.textContent===time));
  }
  function calendar(){
    const label=new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(new Date(year,month,1));
    find('.calendar-month').textContent=label;find('.calendar-prev').disabled=year===now.getFullYear()&&month===now.getMonth();
    days.replaceChildren();
    for(const value of calendarDays(year,month,now)){
      if(!value){const blank=document.createElement('span');blank.setAttribute('aria-hidden','true');days.append(blank);continue;}
      const button=document.createElement('button');button.type='button';button.textContent=String(value.day);button.dataset.day=value.key;button.disabled=value.disabled;
      button.setAttribute('aria-label',`${value.day} de ${label}, fecha ilustrativa`);button.setAttribute('aria-pressed',String(day===value.key));
      days.append(button);
    }
  }
  days.addEventListener('click',event=>{const button=event.target.closest('button[data-day]');if(!button||button.disabled)return;day=button.dataset.day;refresh();track('booking_demo_date_selected','demo');},{signal});
  days.addEventListener('keydown',event=>{
    const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};if(!(event.key in moves))return;
    const buttons=[...days.querySelectorAll('button')],index=buttons.indexOf(event.target),next=buttons[index+moves[event.key]];
    if(next&&!next.disabled){event.preventDefault();next.focus();}
  },{signal});
  for(const value of ['09:30','11:00','15:30','17:00']){
    const button=document.createElement('button');button.type='button';button.textContent=value;button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>{time=value;refresh();track('booking_demo_slot_selected','demo');},{signal});times.append(button);
  }
  for(const [selector,delta] of [['.calendar-prev',-1],['.calendar-next',1]])find(selector).addEventListener('click',()=>{const next=new Date(year,month+delta,1);year=next.getFullYear();month=next.getMonth();day='';calendar();refresh();},{signal});
  form.addEventListener('submit',event=>{
    event.preventDefault();const selection=demoSelection(day,time,find('input').value);if(!selection)return;
    find('.demo-result-selection').textContent=selection;form.hidden=true;result.hidden=false;
    track('booking_demo_completed','demo');result.querySelector('h4').focus();
  },{signal});
  find('.demo-restart').addEventListener('click',()=>{result.hidden=true;form.hidden=false;find('input').value='';day='';time='';refresh();find('.calendar-next').focus({preventScroll:true});},{signal});
  calendar();refresh();
  return {mode:'demo',start(){},destroy(){abort.abort();const input=find('input');if(input)input.value='';root.replaceChildren();}};
}
