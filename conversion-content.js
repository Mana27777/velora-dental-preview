import './conversion-content.css';

const asset = (path) => `${import.meta.env?.BASE_URL ?? '/'}${path}`;
const escape = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const safeUrl = (value = '') => {
  const url = String(value).trim();
  if (!url || /[\u0000-\u001f\\]/.test(url) || url.startsWith('//')) return '';
  if (/^[a-z][a-z\d+.-]*:/i.test(url)) {
    if (!/^https:\/\//i.test(url)) return '';
    try { const parsed = new URL(url); if (parsed.username || parsed.password) return ''; } catch { return ''; }
    return escape(url);
  }
  if (url.startsWith('#')) return /^#[a-z][\w:.-]*$/i.test(url) ? escape(url) : '';
  return escape(url.startsWith('/') ? url : asset(url));
};
const book = (label = 'Reservar valoración') => `<button class="conversion-book" type="button" data-booking-open aria-haspopup="dialog" aria-controls="booking-modal">${escape(label)}<span aria-hidden="true">↗</span></button>`;
const note = (text = 'Muestra conceptual · Se personaliza con información verificada.') => `<p class="conversion-note">${escape(text)}</p>`;
const heading = (eyebrow, title, description = '') => `<div class="conversion-heading"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${description ? `<p class="conversion-intro">${description}</p>` : ''}</div>`;

export const conversionBlockMap = Object.freeze({
  3: 'confianza-inicial', 4: 'testimonio-destacado', 10: 'proceso-tratamiento', 11: 'valoracion-individual',
  12: 'profesional', 13: 'instalaciones', 14: 'metodos', 15: 'resenas', 16: 'testimonio-video',
  17: 'caso-educativo', 18: 'diferenciales', 19: 'primera-valoracion', 20: 'tiempos-cuidados',
  21: 'presupuesto', 23: 'preparacion-ubicacion', 24: 'antes-de-reservar', 25: 'como-reservar',
});

/** Templates are mounted by main.js around the existing 3D, anatomy, FAQ and booking. */
export function buildConversionContent({ clinicInformation = {}, media = {}, bookingMode = 'demo' } = {}) {
  const clinic = clinicInformation;
  const verified = clinic.authorized === true;
  const portraitConfig = media.professional ?? {};
  const professional = {
    name: clinic.professionalName, license: clinic.licenseNumber,
    bio: clinic.professionalBio, training: clinic.professionalEducation,
    welcome: clinic.professionalWelcome,
  };
  const professionalReady = verified && professional.name && professional.license;
  const portrait = professionalReady && portraitConfig.authorized === true && safeUrl(portraitConfig.src);
  const professionalName = professionalReady ? escape(professional.name) : 'El profesional, antes que el tratamiento.';
  const license = professionalReady ? escape(professional.license) : 'Matrícula: se incorpora una vez verificada.';
  const location = verified && clinic.location ? escape(clinic.location) : 'Ubicación de la clínica · A configurar';
  const hours = verified && clinic.hours ? escape(clinic.hours) : 'Horarios de atención · A configurar';
  const contact = verified && clinic.contact ? escape(clinic.contact) : 'Contacto de ayuda · A configurar';
  const directions = verified ? safeUrl(clinic.directionsUrl) : '';
  const testimonial = media.testimonial ?? {};
  const testimonialSrc = testimonial.authorized === true ? safeUrl(testimonial.src) : '';
  const reviews = Array.isArray(clinic.reviews) && clinic.reviews.some((review) => review.authorized === true && review.quote)
    ? clinic.reviews.filter((review) => review.authorized === true && review.quote).slice(0, 3)
    : [
      { quote: 'Pude hacer mis preguntas y entender las alternativas antes de decidir.', example: true },
      { quote: 'Me resultó simple encontrar cómo coordinar una primera consulta.', example: true },
      { quote: 'Tener los próximos pasos explicados me ayudó a ordenar mis dudas.', example: true },
    ];
  const reviewCards = reviews.map((review, index) => `<figure class="conversion-review"><figcaption>${review.example ? '<span class="conversion-demo-label">Ejemplo de diseño · Testimonio ficticio</span>' : '<span class="conversion-demo-label">Testimonio autorizado</span>'}</figcaption><blockquote>“${escape(review.quote)}”</blockquote><p>${review.example ? `Voz ilustrativa ${String(index + 1).padStart(2, '0')}` : escape(review.author || 'Identidad reservada con autorización')}${!review.example && safeUrl(review.sourceUrl) ? ` · <a href="${safeUrl(review.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(review.sourceLabel || 'Consultar fuente')}</a>` : ''}</p></figure>`).join('');

  const trust = `<div class="conversion-content conversion-trust-group" data-scene="trust">
    <section class="conversion-trust" id="confianza-inicial" aria-label="Información de atención"><p class="conversion-demo-label">${verified ? 'Información de la clínica' : 'Presentación de ejemplo · Datos de clínica por configurar'}</p><dl><div><dt>Profesional</dt><dd>${professionalReady ? escape(professional.name) : 'Nombre por incorporar'}</dd></div><div><dt>Matrícula</dt><dd>${professionalReady ? escape(professional.license) : 'Por verificar'}</dd></div><div><dt>Consultorio</dt><dd>${verified && clinic.location ? escape(clinic.location) : 'Ubicación a configurar'}</dd></div><div><dt>Atención</dt><dd>${verified && clinic.hours ? escape(clinic.hours) : 'Condiciones de cada clínica'}</dd></div></dl></section>
    <figure class="conversion-featured-quote" id="testimonio-destacado"><figcaption class="conversion-demo-label">Ejemplo de presentación · Testimonio ficticio</figcaption><blockquote>“Entender mis opciones fue el primer paso para decidir con más claridad.”</blockquote><p>Espacio para una experiencia auténtica, con autorización y procedencia verificable.</p></figure>
  </div>`;

  const planning = `<section class="conversion-content conversion-planning" id="planificacion" data-scene="planning" aria-labelledby="planning-title">
    ${heading('DEL PRIMER ENCUENTRO A LOS CUIDADOS', '<span id="planning-title">Un plan pensado <em>para tu caso.</em></span>', 'Conocer las etapas ayuda a conversar con el profesional. El recorrido y los tiempos pueden variar.')}
    <ol class="conversion-process" id="proceso-tratamiento"><li><span>01</span><h3>Valoración</h3><p>Conversar sobre tu situación y evaluar qué información hace falta.</p></li><li><span>02</span><h3>Planificación</h3><p>Comparar alternativas y entender el plan propuesto.</p></li><li><span>03</span><h3>Tratamiento</h3><p>Realizar las etapas que correspondan, si están indicadas.</p></li><li><span>04</span><h3>Restauración y seguimiento</h3><p>Conocer los cuidados y controles definidos para tu caso.</p></li></ol>
    <div class="conversion-fit" id="valoracion-individual"><div><h3>¿Es una alternativa <em>para mí?</em></h3><p>No todas las situaciones se resuelven de la misma manera. Una evaluación odontológica permite conocer si un implante u otra opción pueden ser apropiados.</p></div>${book()}</div>
    ${note('Recorrido educativo general. Las etapas requieren indicación y revisión profesional.')}
  </section>`;

  const portraitContent = portrait
    ? `<img src="${portrait}" alt="${escape(portraitConfig.alt || `Retrato de ${professional.name}`)}" loading="lazy" decoding="async" width="480" height="560">`
    : `<div class="conversion-portrait-placeholder" role="img" aria-label="Espacio reservado para un retrato profesional autorizado"><svg viewBox="0 0 220 240" aria-hidden="true"><path d="M36 224V106a74 74 0 0 1 148 0v118"/><circle cx="110" cy="94" r="29"/><path d="M57 203v-20a53 53 0 0 1 106 0v20M26 224h168"/></svg><span>Retrato profesional autorizado</span></div>`;
  const videoContent = testimonialSrc
    ? `<video controls playsinline preload="none"${safeUrl(testimonial.poster) ? ` poster="${safeUrl(testimonial.poster)}"` : ''} aria-label="Testimonio autorizado"> <source src="${testimonialSrc}" type="video/mp4">${safeUrl(testimonial.captions) ? `<track kind="captions" src="${safeUrl(testimonial.captions)}" srclang="${escape(testimonial.captionLanguage || 'es')}" label="${escape(testimonial.captionLabel || 'Español')}" default>` : ''}Tu navegador no puede reproducir el video. <a href="${testimonialSrc}">Abrir el testimonio autorizado</a>.</video><p class="conversion-note">${escape(testimonial.credit || 'Testimonio publicado con autorización.')}${!testimonial.captions ? ' Subtítulos pendientes de incorporar antes del uso comercial.' : ''}</p>`
    : `<div class="conversion-video-placeholder"><span aria-hidden="true">“</span><h4>Una experiencia, en primera persona.</h4><p>Acá puede aparecer un testimonio en video, reproducido únicamente cuando el visitante lo elija.</p><p class="conversion-demo-label">Vista conceptual · No hay testimonio autorizado en esta demo.</p></div>`;

  const confidence = `<section class="conversion-content conversion-confidence" id="confianza" data-scene="confidence" aria-labelledby="confidence-title">
    ${heading('PERSONAS, ESPACIO Y CLARIDAD', '<span id="confidence-title">La confianza se construye <em>con información.</em></span>', 'Conocé cómo puede presentarse una clínica con contenido propio y verificable.')}
    <div class="conversion-professional" id="profesional"><figure>${portraitContent}</figure><div><p class="conversion-demo-label">${professionalReady ? 'Presentación profesional verificada' : 'Profesional de ejemplo · Sin identidad ni credenciales ficticias'}</p><h3>${professionalName}</h3><p class="conversion-license">${license}</p><p>${professionalReady && professional.bio ? escape(professional.bio) : 'Nombre, formación, experiencia y enfoque de atención se completan con la información autorizada del equipo real.'}</p><dl><div><dt>Formación y área de atención</dt><dd>${professionalReady && professional.training ? escape(professional.training) : 'Información verificable, por incorporar.'}</dd></div><div><dt>Mensaje de bienvenida</dt><dd>${professionalReady && professional.welcome ? escape(professional.welcome) : 'Un espacio para que el profesional explique cómo acompaña la primera consulta.'}</dd></div></dl></div></div>
    <div class="conversion-clinic" id="instalaciones"><div class="conversion-subheading"><h3>Un espacio <em>para conversar.</em></h3>${note('Imágenes conceptuales de VÉLORA. Se reemplazan por fotografías autorizadas de cada clínica.')}</div><div class="conversion-gallery"><figure><img src="${asset('images/recepcion-velora.webp')}" alt="Recepción del concepto visual VÉLORA" width="1600" height="893" loading="lazy" decoding="async"><figcaption>Recepción · Imagen conceptual</figcaption></figure><figure><img src="${asset('images/gabinete-velora.webp')}" alt="Gabinete del concepto visual VÉLORA" width="1600" height="893" loading="lazy" decoding="async"><figcaption>Consultorio · Imagen conceptual</figcaption></figure></div></div>
    <div class="conversion-capabilities" id="metodos"><h3>Información útil, <em>sin promesas vacías.</em></h3><p class="conversion-demo-label">${verified && clinic.equipment ? 'Información autorizada por la clínica.' : 'Módulos de ejemplo · No acreditan equipamiento de una clínica real.'}</p><div class="conversion-capability-grid"><article><span aria-hidden="true">01</span><h4>Evaluación y planificación</h4><p>Espacio para explicar los métodos y estudios que el equipo realmente utiliza.</p></article><article><span aria-hidden="true">02</span><h4>Recursos del consultorio</h4><p>${verified && clinic.equipment ? escape(clinic.equipment) : 'Equipamiento disponible, con sus aplicaciones y limitaciones verificadas.'}</p></article><article><span aria-hidden="true">03</span><h4>Cuidados y seguimiento</h4><p>Cómo se comunican las indicaciones y los controles de cada tratamiento.</p></article></div></div>
    <div class="conversion-reviews" id="resenas"><div class="conversion-subheading"><h3>Experiencias que merecen <em>ser escuchadas.</em></h3>${note('Muestras de diseño. No son opiniones de pacientes reales ni reseñas de Google.')}</div><div class="conversion-review-track" tabindex="0" role="region" aria-label="Ejemplos ficticios de testimonios">${reviewCards}</div></div>
    <div class="conversion-detail-pair"><details class="conversion-detail" id="testimonio-video"><summary>Testimonios en video<span aria-hidden="true">+</span></summary><div class="conversion-detail-body">${videoContent}</div></details><details class="conversion-detail" id="caso-educativo"><summary>Cómo presentar un caso autorizado<span aria-hidden="true">+</span></summary><div class="conversion-detail-body"><p class="conversion-demo-label">Ejemplo conceptual · No describe un paciente ni un resultado real.</p><h4>Del contexto a los cuidados.</h4><ol class="conversion-case-steps"><li><strong>Contexto y evaluación.</strong> La información inicial que el profesional considera relevante.</li><li><strong>Alternativas estudiadas.</strong> Opciones, indicaciones y limitaciones explicadas al paciente.</li><li><strong>Plan y seguimiento.</strong> Etapas indicadas y controles acordados para ese caso.</li></ol><p>Un caso real requiere consentimiento, revisión clínica y recursos autorizados. Un resultado individual no garantiza el mismo resultado en otras personas.</p></div></details></div>
    <div class="conversion-differentials" id="diferenciales"><h3>Elegir con <em>más claridad.</em></h3><ul><li>Información comprensible sobre las alternativas.</li><li>Presentación verificable del equipo y del espacio.</li><li>Un recorrido simple para coordinar la valoración.</li></ul>${note('Enfoques de presentación para personalizar con prácticas reales de cada clínica.')}</div>
  </section>`;

  const valuation = `<div class="conversion-content conversion-valuation" id="primera-valoracion" data-scene="valuation">
    ${heading('TU PRIMERA VALORACIÓN', 'Antes de decidir, <em>conversar.</em>', 'La primera consulta permite comprender tu situación y preguntar qué alternativas se pueden evaluar.')}
    <ol class="conversion-visit"><li><span>01</span><div><h3>Tu situación y tus preguntas</h3><p>Podés conversar sobre lo que buscás y las dudas que querés resolver.</p></div></li><li><span>02</span><div><h3>Una evaluación individual</h3><p>El profesional determina qué evaluación o estudios pueden hacer falta.</p></div></li><li><span>03</span><div><h3>Los próximos pasos</h3><p>Conocé las alternativas, sus límites y cómo se prepara un presupuesto.</p></div></li></ol>
    <p class="conversion-note">${verified && (clinic.valuationDuration || clinic.valuationCost) ? `${clinic.valuationDuration ? `Duración informada: ${escape(clinic.valuationDuration)}. ` : ''}${clinic.valuationCost ? `Valor de la consulta: ${escape(clinic.valuationCost)}.` : ''}` : 'Recepción, profesional a cargo, duración y costo de la consulta: se informan con los datos auténticos de cada clínica.'}</p>
    <div class="conversion-detail-pair"><details class="conversion-detail" id="tiempos-cuidados"><summary>Etapas, tiempos y cuidados<span aria-hidden="true">+</span></summary><div class="conversion-detail-body"><p>Los estudios, las etapas y la recuperación varían según la evaluación y el tratamiento indicado. No hay un plazo único para todas las personas.</p><p>Preguntá al profesional por la anestesia, las molestias posibles, los riesgos, la cicatrización y los cuidados y controles que corresponderían a tu caso.</p><p class="conversion-note">Información educativa general, sujeta a aprobación odontológica. No reemplaza indicaciones personales.</p></div></details><details class="conversion-detail" id="presupuesto"><summary>Un presupuesto que puedas entender<span aria-hidden="true">+</span></summary><div class="conversion-detail-body"><p>El costo de una valoración y el de un tratamiento son conceptos distintos. Un presupuesto individual permite saber qué está incluido y qué etapas o recursos se cotizan por separado.</p><ul><li>Evaluación, estudios y necesidades del caso.</li><li>Etapas, restauración y controles incluidos.</li><li>Medios de pago o financiación, solo cuando la clínica los ofrezca.</li></ul><p class="conversion-demo-label">${verified && clinic.paymentOptions ? `Opciones económicas informadas por la clínica: ${escape(clinic.paymentOptions)}` : 'Opciones económicas definidas por cada clínica. Esta demo no publica precios ni financiación de tratamientos.'}</p>${book('Conversarlo en una valoración')}</div></details></div>
    <div class="conversion-location" id="preparacion-ubicacion"><div><h3>Llegar con <em>tus preguntas.</em></h3><p>${verified && clinic.arrivalInstructions ? escape(clinic.arrivalInstructions) : 'Consultá a la clínica qué documentación o estudios previos conviene llevar.'} No hace falta compartir información médica en esta página.</p></div><dl><div><dt>Ubicación</dt><dd>${location}${directions ? `<a class="conversion-text-link" href="${directions}" target="_blank" rel="noopener noreferrer">Ver indicaciones ↗</a>` : ''}</dd></div><div><dt>Horarios y acceso</dt><dd>${hours}</dd></div><div><dt>Quién responde</dt><dd>${contact}</dd></div></dl>${!verified ? note('No hay una dirección operativa, horarios reales ni un mapa de clínica configurados en esta demostración.') : ''}</div>
  </div>`;

  const bookingContext = `<div class="conversion-content conversion-booking-context" data-scene="booking"><div id="antes-de-reservar"><p class="eyebrow">UN PRIMER PASO, CON CLARIDAD</p><h3>Tu valoración empieza <em>por una conversación.</em></h3><p>Conocé tus alternativas, hacé tus preguntas y entendé qué pasos podrían corresponder a tu caso.</p></div><ol class="conversion-booking-steps" id="como-reservar"><li><span>01</span><strong>Elegí un día.</strong></li><li><span>02</span><strong>Seleccioná un horario.</strong></li><li><span>03</span><strong>${bookingMode === 'live' ? 'Completá los datos y consultá la confirmación.' : 'Completá los datos.'}</strong></li></ol><p class="conversion-note">${bookingMode === 'live' ? 'Elegí disponibilidad real en la agenda de la clínica. El proveedor informa el estado de la reserva.' : 'Vista previa de reservas · Los días y horarios son ilustrativos. No se crean citas reales.'}</p></div>`;

  return { trust, planning, confidence, valuation, bookingContext };
}
