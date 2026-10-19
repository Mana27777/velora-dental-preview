// Número internacional, solo dígitos. Vacío mantiene el botón en modo demo.
export const commercial = {
  clinicName: 'VÉLORA DENTAL',
  mode: 'DEMO', // REAL exige número válido y autorización explícita.
  channel: 'booking', // 'whatsapp' o 'booking': una sola modalidad activa.
  bookingUrl: '',
  bookingAuthorized: false,
  whatsappNumber: '', // Internacional, solo dígitos; no usar números inventados.
  numberAuthorized: false,
  message: 'Hola, quisiera solicitar una valoración de implantología. ¿Qué turnos tienen disponibles?',
  buttonTitle: 'Elegir día y horario',
};
export const whatsappNumber = commercial.whatsappNumber;
export const whatsappMessage = commercial.message;
// Preparación Cal.com: no activa el antiguo selector ni carga servicios externos.
// LIVE exige un evento de la clínica real y su autorización; nunca usar un ejemplo.
export const reservation = {
  provider: 'cal.com', mode: 'demo', authorized: false,
  calLink: '', namespace: 'velora-valuation',
  timeZone: 'America/Argentina/Buenos_Aires',
  clinicName: 'VÉLORA DENTAL', city: '', professionalName: '', licenseNumber: '',
};
// Completar únicamente con información autorizada del cliente real.
export const clinicInformation = {
  authorized: false,
  environment: '', team: '', credentials: '', location: '', hours: '', contact: '', privacy: '',
  professionalName: '', professionalBio: '', professionalEducation: '', licenseNumber: '',
  equipment: '', paymentOptions: '', valuationDuration: '', valuationCost: '', arrivalInstructions: '',
  directionsUrl: '', reviews: [],
};
// Solo se habilitan recursos reales con derechos y autorización de la clínica.
export const clinicMedia = {
  professional: { authorized: false, src: '', alt: '' },
  testimonial: { authorized: false, src: '', poster: '', captions: '' },
};
const asset=(path)=>(import.meta.env?.BASE_URL??'/')+path;
export const clinicVideo = {
  src: asset('media/consultorio-desktop.mp4'),
  // Higher-resolution existing source: avoid enlarging the 480p crop on phones.
  mobileSrc: asset('media/consultorio-desktop.mp4'),
  mobilePortraitSrc: asset('media/consultorio-vertical.mp4'),
  mobilePoster: asset('images/consultorio-vertical-poster.webp'),
  mobileObjectPosition: '54% 50%', portraitObjectPosition: '50% 50%',
  playbackMode: 'playback', playbackRate: .85, poster: asset('images/recepcion-velora.webp'),
};
// Slot educativo reservado. No se carga ni se representa anatomía sin un recurso aprobado.
export const anatomyResource = { src: '', approved: false };
