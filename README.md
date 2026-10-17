# VÉLORA — PREVIEW DE DESARROLLO

Solo revisión y pruebas. No es una clínica real ni una versión terminada. Fechas/horarios ilustrativos, sin disponibilidad clínica ni reservas reales. Cal.com preparado, sin cuenta autorizada conectada.

# VÉLORA

Edición premium en desarrollo: acceso directo a información y reserva, ocho FAQ, esquema SVG ilustrativo y Cal.com inline preparado. Sin analítica externa ni datos médicos. Modo demo con fechas/horas ilustrativas, sin disponibilidad clínica ni reservas reales.

Demostración conceptual de una landing odontológica interactiva. No representa una clínica real, no brinda atención odontológica ni confirma reservas.

## Desarrollo
Node.js 22. Ejecutar npm ci y npm run dev. Para producción: npm run build. La salida es dist/ y la base de producción es /velora-dental-demo/.

Se usan Vite y Three.js, fuentes locales Fredoka/Nunito, un modelo GLB, un MP4 silencioso y una ilustración SVG educativa. El modelo y la ilustración son conceptuales.

## Contacto
config.js → reservation concentra identidad, mode demo/live, authorized, calLink y namespace. DEMO muestra una simulación local: calendario mensual, horarios de ejemplo y confirmación identificada como ilustrativa. No carga Cal.com, no envía ni almacena datos y no crea una cita. LIVE requiere provider cal.com, evento público real y autorización expresa; el SDK oficial se carga al acercarse a reserva o pulsar CTA, con fallback al mismo calendario si falla. No se incluyen claves API ni se solicita historia clínica. commercial/contact.js mantienen compatibilidad histórica y no controlan el CTA principal.

bookingSuccessfulV2 indica creación, no necesariamente confirmación. Se distingue pendiente/pago y aceptación reportada. Los CustomEvents locales no contienen UID/email/horas ni elevan appointment_confirmed a true: para conversiones autoritativas faltan backend/webhooks verificados. La cuenta real no fue conectada ni probada; el ciclo LIVE se verifica con dobles sin solicitudes externas.

## Publicación y actualizaciones
GitHub Pages usa .github/workflows/deploy.yml. Cada actualización de main instala dependencias con npm ci, verifica contacto, compila, comprueba rutas y publica dist. El resultado figura en Actions y Settings → Pages.

Desde Codex: solicitar actualizar este repositorio con los cambios de 04-WEB, conservando la lista de archivos publicables; comprobar build y workflow antes de declarar éxito. No subir node_modules, dist, archivos .env, capturas, referencias de terceros ni informes internos.

Los originales del proyecto se conservan. El GLB web conserva geometría/materiales con texturas de1024px. Video por scroll con fuente móvil720p existente y slot para vertical futuro en config.js; ante fallo muestra poster. Opciones y anatomía son secciones separadas; el esquema conserva tres estados con scroll/manual sin tramo vacío reservado. El implante flota sobre el contenido con tamaño sostenido, cambia de lado y termina horizontal. Se arrastra directamente en dos ejes sin modos; el exterior conserva scroll. Los controles quedan encima de la capa3D. Con movimiento reducido se utiliza un recorrido estático. El render se detiene cuando no hay cambios. Android físico y rendimiento de campo siguen pendientes.

## Recursos y atribuciones
Fredoka y Nunito: licencias SIL Open Font License incluidas en public/fonts. Dependencias gratuitas con sus licencias correspondientes. Los recursos visuales fueron aportados y declarados como generados por el titular del proyecto; esto no constituye una comprobación independiente del plan/licencia de la herramienta generadora. No se concede aquí una licencia de redistribución general del modelo o fotografías. Ver ASSET-NOTICES.md.
