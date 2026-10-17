import { calSettings } from './cal-settings.js';
import { loadCal } from './cal-embed.js';
import { createDemoBooking } from './booking-demo.js';

// SDK success means "created", not necessarily "confirmed" (approval/payment).
export function bookingOutcome(data={}){
  if(typeof data.uid!=='string'||!data.uid.trim())return 'unknown';
  return data.status==='ACCEPTED'&&data.paymentRequired===false?'accepted':'created';
}
export function createBooking(root,config,track,{getCal=loadCal,makeDemo=createDemoBooking,observe=(callback)=>new IntersectionObserver(callback,{rootMargin:'300px'})}={}){
  const settings=calSettings(config),mode=settings.mode==='live'?'configured':'demo';
  if(settings.mode==='demo')return makeDemo(root,track);
  let disposed=false,started=false,api,timeout,observer;
  const handlers=[],created=new Set(),accepted=new Set();
  root.dataset.bookingMode=settings.mode;
  root.innerHTML='<p class="eyebrow">RESERVAR VALORACIÓN</p><h3>Un espacio para tu primera consulta.</h3><p class="booking-status" role="status"></p><div class="cal-frame" hidden></div><a class="calendar-fallback" hidden target="_blank" rel="noopener noreferrer">Abrir agenda en Cal.com ↗</a><p class="booking-privacy">No compartas información clínica en esta página.</p>';
  const status=root.querySelector('.booking-status'),frame=root.querySelector('.cal-frame'),fallback=root.querySelector('.calendar-fallback');
  function failed(){if(disposed)return;clearTimeout(timeout);status.textContent='No pudimos cargar el calendario. Podés consultar la agenda directamente en Cal.com.';fallback.hidden=false;}
  async function start(){
    if(disposed||started||settings.mode!=='live')return;
    started=true;observer?.disconnect();
    status.textContent='Cargando disponibilidad de la clínica…';frame.hidden=false;
    fallback.href=settings.url;
    timeout=setTimeout(failed,20000);
    try{
      const Cal=await getCal();if(disposed)return;
      Cal('init',settings.namespace,{origin:'https://cal.com'});
      api=Cal.ns[settings.namespace];
      const listen=(action,fn)=>{
        const callback=event=>{if(!disposed&&event?.detail?.namespace===settings.namespace&&event.detail.type===action)fn(event.detail.data??{});};
        handlers.push({action,callback});api('on',{action,callback});
      };
      listen('linkReady',()=>{clearTimeout(timeout);status.textContent='Elegí un horario disponible. Cal.com te indicará si la reserva queda confirmada o pendiente.';});
      listen('linkFailed',failed);
      let viewed=false;
      listen('bookerViewed',()=>{if(!viewed){viewed=true;track('booking_started',mode);}});
      listen('bookingSuccessfulV2',data=>{
        const outcome=bookingOutcome(data);if(outcome==='unknown')return;
        if(!created.has(data.uid)){created.add(data.uid);track('booking_created',mode);}
        if(outcome==='accepted'){status.textContent='Cal.com informa que tu reserva fue aceptada. Revisá su confirmación y las indicaciones de la clínica.';if(!accepted.has(data.uid)){accepted.add(data.uid);track('booking_confirmation_reported',mode);}}
        else status.textContent='Cal.com registró tu solicitud. Revisá allí si requiere aprobación o completar algún paso; todavía podría estar pendiente.';
      });
      api('inline',{elementOrSelector:frame,calLink:settings.calLink,config:{layout:'month_view',theme:'light'}});
      api('ui',{hideEventTypeDetails:false,layout:'month_view',cssVarsPerTheme:{light:{'cal-brand':'#77564A'}}});
    }catch{failed();}
  }
  observer=observe(entries=>{if(entries.some(entry=>entry.isIntersecting))start();});observer.observe(root);
  return {start,mode,destroy(){disposed=true;clearTimeout(timeout);observer?.disconnect();for(const handler of handlers)api?.('off',handler);frame.replaceChildren();}};
}
