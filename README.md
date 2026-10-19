# VÉLORA — PREVIEW DE DESARROLLO

Solo revisión y pruebas. No es una clínica real ni una versión terminada. Fechas/horarios ilustrativos, sin disponibilidad clínica ni reservas reales. Cal.com preparado, sin cuenta autorizada conectada.

# VÉLORA

Revisión de conversión: reserva accesible desde el hero, navegación y llamadas contextuales; un único modal DEMO sin envíos ni almacenamiento. Video móvil y escritorio en reproducción continua silenciosa a 0.85x; el scroll controla el implante y los textos. Anatomía educativa 01→02→03 con selección manual, teclado y movimiento reducido. Se conserva el GLB y la escena 3D persistente.

Los módulos de profesional, instalaciones, reseñas, video testimonial y caso educativo distinguen ejemplos ficticios de contenido verificado. No hay profesionales, testimonios ni casos clínicos reales configurados. Doce FAQ y contenido de valoración, alternativas, presupuesto y preparación. El componente de testimonio en video no promete reproducción cuando falta un recurso autorizado.

Demostración conceptual de una landing odontológica interactiva. No representa una clínica real, no brinda atención odontológica ni confirma reservas.

## Desarrollo
Node.js 22. Ejecutar npm ci y npm run dev. Para producción: npm run build. La salida es dist/ y la base de producción es /velora-dental-demo/.

Se usan Vite y Three.js, fuentes locales Fredoka/Nunito, un modelo GLB, un MP4 silencioso y una ilustración SVG educativa. El modelo y la ilustración son conceptuales.

## Contacto
config.js → reservation concentra identidad, mode demo/live, authorized, calLink, namespace y timeZone. DEMO muestra una simulación local sin envíos, almacenamiento ni citas reales. LIVE exige provider cal.com, evento público real, autorización expresa y zona IANA válida; carga el embed oficial con enlace alternativo al proveedor. clinicInformation.authorized y clinicMedia controlan por separado los contenidos verificados. No hay claves API ni campos de historia clínica. commercial/contact.js mantienen compatibilidad histórica y no controlan el CTA principal.

bookingSuccessfulV2 indica creación, no necesariamente confirmación. Se distingue pendiente/pago y aceptación reportada. Los CustomEvents locales no contienen UID/email/horas ni elevan appointment_confirmed a true: para conversiones autoritativas faltan backend/webhooks verificados. La cuenta real no fue conectada ni probada; el ciclo LIVE se verifica con dobles sin solicitudes externas.

## Publicación y actualizaciones
GitHub Pages usa .github/workflows/deploy.yml. Cada actualización de main instala dependencias con npm ci, verifica contacto, compila, comprueba rutas y publica dist. El resultado figura en Actions y Settings → Pages.

Desde Codex: solicitar actualizar este repositorio con los cambios de 04-WEB, conservando la lista de archivos publicables; comprobar build y workflow antes de declarar éxito. No subir node_modules, dist, archivos .env, capturas, referencias de terceros ni informes internos.

Los originales del proyecto se conservan. El GLB web conserva geometría/materiales con texturas de1024px. Video por scroll con fuente móvil720p existente y slot para vertical futuro en config.js; ante fallo muestra poster. Opciones y anatomía son secciones separadas; el esquema conserva tres estados con scroll/manual sin tramo vacío reservado. El implante flota sobre el contenido con tamaño sostenido, cambia de lado y termina horizontal. Se arrastra directamente en dos ejes sin modos; el exterior conserva scroll. Los controles quedan encima de la capa3D. Con movimiento reducido se utiliza un recorrido estático. El render se detiene cuando no hay cambios. Android físico y rendimiento de campo siguen pendientes.

## Recursos y atribuciones
Fredoka y Nunito: licencias SIL Open Font License incluidas en public/fonts. Dependencias gratuitas con sus licencias correspondientes. Los recursos visuales fueron aportados y declarados como generados por el titular del proyecto; esto no constituye una comprobación independiente del plan/licencia de la herramienta generadora. No se concede aquí una licencia de redistribución general del modelo o fotografías. Ver ASSET-NOTICES.md.
