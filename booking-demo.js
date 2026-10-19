const exampleTimes=['09:30','11:00','15:30','17:00'];

export function calendarDays(year,month,today=new Date()){
  const start=new Date(year,month,1),offset=(start.getDay()+6)%7;
  const count=new Date(year,month+1,0).getDate(),floor=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  return Array.from({length:Math.ceil((offset+count)/7)*7},(_,index)=>{
    const day=index-offset+1;if(day<1||day>count)return null;
    return {day,key:`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,disabled:new Date(year,month,day)<floor||day%5===0};
  });
}
export function demoSelection(day,time,alias=''){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!exampleTimes.includes(time))return null;
  const [year,month,date]=day.split('-').map(Number),value=new Date(year,month-1,date);
  if(value.getFullYear()!==year||value.getMonth()!==month-1||value.getDate()!==date)return null;
  const name=alias.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,40);
  return `${name?name+' · ':''}${new Intl.DateTimeFormat('es-AR',{weekday:'long',day:'numeric',month:'long'}).format(value)} · ${time}`;
}

export function createDemoBooking(root,track=()=>{}){
  const abort=new AbortController(),signal=abort.signal,now=new Date();
  let year=now.getFullYear(),month=now.getMonth(),day='',time='';
  root.dataset.bookingMode='demo';root.classList.add('booking-demo');
  root.setAttribute('aria-label','Simulación de reserva, sin disponibilidad real');
  root.innerHTML=`
    <div class="booking-demo-badge">Vista previa de reservas · DEMO</div>
    <h3>Tu primera valoración.</h3>
    <p class="demo-intro">Probá el recorrido. Fechas y horarios de ejemplo, sin disponibilidad clínica real.</p>
    <ol class="booking-steps" aria-label="Pasos de la simulación"><li>Elegí un día</li><li>Elegí un horario</li><li>Completá los datos de prueba</li></ol>
    <form class="demo-booking-form" autocomplete="off" aria-label="Formulario de ejemplo. No crea reservas.">
      <div class="demo-calendar"><div class="calendar-heading"><button type="button" class="calendar-prev" aria-label="Mes anterior">‹</button><h4 class="calendar-month" aria-live="polite"></h4><button type="button" class="calendar-next" aria-label="Mes siguiente">›</button></div><div class="calendar-weekdays" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="calendar-days" role="group" aria-label="Fechas ilustrativas"></div><p class="calendar-example-note">Días habilitados solo para mostrar el funcionamiento.</p></div>
      <div class="demo-booking-details"><fieldset><legend>Horarios de ejemplo</legend><div class="demo-times"></div></fieldset>
        <label class="demo-alias">Nombre de prueba <span>Usá un nombre ficticio</span><input autocomplete="off" maxlength="40" placeholder="Ejemplo: Alex" required></label>
        <label class="demo-alias demo-email">Correo de prueba <span>No se enviará ningún mensaje</span><input type="email" inputmode="email" autocomplete="off" maxlength="120" placeholder="alex@example.invalid" required></label>
        <p class="demo-selection" role="status">Elegí una fecha y un horario ilustrativos.</p><button class="demo-submit" type="submit" disabled>Completar simulación ↗</button>
        <p class="demo-privacy">No ingreses datos personales ni de salud. No se guardan datos, no se envían correos y no se crea una cita.</p>
      </div>
    </form>
    <div class="demo-booking-result" hidden><div class="demo-result-symbol" aria-hidden="true">✓</div><h4 tabindex="-1">Simulación completada.</h4><p class="demo-result-selection"></p><p><strong>No se creó ninguna reserva real.</strong></p><p class="demo-next-step">Con la agenda autorizada de una clínica, Cal.com muestra disponibilidad real y comunica el estado de la reserva. Sus opciones de confirmación, recordatorios, cancelación y reprogramación se configuran con la clínica.</p><button class="demo-restart" type="button">Probar otra selección</button></div>`;
  const find=selector=>root.querySelector(selector),days=find('.calendar-days'),times=find('.demo-times'),form=find('form'),submit=find('.demo-submit'),summary=find('.demo-selection'),result=find('.demo-booking-result');
  function refresh(){
    summary.textContent=demoSelection(day,time)||'Elegí una fecha y un horario ilustrativos.';submit.disabled=!demoSelection(day,time);
    for(const button of days.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.day===day));
    for(const button of times.children){button.setAttribute('aria-pressed',String(button.textContent===time));button.disabled=!day||(Number(day.slice(-2))%2===0&&button.textContent==='17:00');}
    [...root.querySelectorAll('.booking-steps li')].forEach((step,index)=>{if(index===(time?2:day?1:0))step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
  }
  function calendar(){
    const label=new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(new Date(year,month,1));
    find('.calendar-month').textContent=label;find('.calendar-prev').disabled=year===now.getFullYear()&&month===now.getMonth();
    days.replaceChildren();
    for(const value of calendarDays(year,month,now)){
      if(!value){const blank=document.createElement('span');blank.setAttribute('aria-hidden','true');days.append(blank);continue;}
      const button=document.createElement('button');button.type='button';button.textContent=String(value.day);button.dataset.day=value.key;button.disabled=value.disabled;
      button.setAttribute('aria-label',`${value.day} de ${label}, fecha ilustrativa`);button.setAttribute('aria-pressed',String(day===value.key));days.append(button);
    }
  }
  days.addEventListener('click',event=>{const button=event.target.closest('button[data-day]');if(!button||button.disabled)return;day=button.dataset.day;time='';refresh();track('booking_demo_date_selected','demo');},{signal});
  days.addEventListener('keydown',event=>{
    const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7},buttons=[...days.querySelectorAll('button')];
    if(!(event.key in moves)&&event.key!=='Home'&&event.key!=='End')return;
    event.preventDefault();
    if(event.key==='Home'||event.key==='End'){const enabled=buttons.filter(button=>!button.disabled);(event.key==='Home'?enabled[0]:enabled.at(-1))?.focus();return;}
    let index=buttons.indexOf(event.target)+moves[event.key];
    while(index>=0&&index<buttons.length&&buttons[index].disabled)index+=moves[event.key];
    buttons[index]?.focus();
  },{signal});
  for(const value of exampleTimes){
    const button=document.createElement('button');button.type='button';button.textContent=value;button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>{time=value;refresh();track('booking_demo_slot_selected','demo');},{signal});times.append(button);
  }
  for(const [selector,delta] of [['.calendar-prev',-1],['.calendar-next',1]])find(selector).addEventListener('click',()=>{const next=new Date(year,month+delta,1);year=next.getFullYear();month=next.getMonth();day='';time='';calendar();refresh();},{signal});
  function reset(){
    result.hidden=true;find('.demo-result-selection').textContent='';form.hidden=false;form.reset();year=now.getFullYear();month=now.getMonth();day='';time='';calendar();refresh();root.scrollTop=0;
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const allowed=calendarDays(year,month,now).some(value=>value?.key===day&&!value.disabled);
    const selection=allowed&&demoSelection(day,time,find('input').value);if(!selection||(!day)||Number(day.slice(-2))%2===0&&time==='17:00')return;
    find('.demo-result-selection').textContent=selection;form.reset();form.hidden=true;result.hidden=false;
    track('booking_demo_completed','demo');result.querySelector('h4').focus();
  },{signal});
  find('.demo-restart').addEventListener('click',()=>{reset();find('.calendar-next').focus({preventScroll:true});},{signal});
  root.closest('dialog')?.addEventListener('close',reset,{signal});
  calendar();refresh();
  return {mode:'demo',start(){},reset,destroy(){abort.abort();form.reset();root.replaceChildren();}};
}
