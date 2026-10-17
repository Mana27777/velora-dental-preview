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
  clinicName: 'VÉLORA DENTAL', city: '', professionalName: '', licenseNumber: '',
};
// Completar únicamente con información autorizada del cliente real.
export const clinicInformation = {
  environment: '', team: '', credentials: '', location: '', hours: '', contact: '', privacy: '',
};
const asset=(path)=>(import.meta.env?.BASE_URL??'/')+path;
export const clinicVideo = {
  src: asset('media/consultorio-desktop.mp4'),
  // Higher-resolution existing source: avoid enlarging the 480p crop on phones.
  mobileSrc: asset('media/consultorio-desktop.mp4'),
  mobilePortraitSrc: asset('media/consultorio-vertical.mp4'),
  mobilePoster: asset('images/consultorio-vertical-poster.webp'),
  mobileObjectPosition: '54% 50%', portraitObjectPosition: '50% 50%',
  playbackMode: 'scrub', poster: asset('images/recepcion-velora.webp'),
};
// Slot educativo reservado. No se carga ni se representa anatomía sin un recurso aprobado.
export const anatomyResource = { src: '', approved: false };
