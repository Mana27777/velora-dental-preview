# VÉLORA

Edición premium en desarrollo: acceso directo a información y reserva, ocho FAQ, esquema SVG ilustrativo y Cal.com inline preparado. Sin analítica externa ni datos médicos. La configuración permanece en modo demo sin disponibilidad ni reservas.

Demostración conceptual de una landing odontológica interactiva. No representa una clínica real, no brinda atención odontológica ni confirma reservas.

## Desarrollo
Node.js 22. Ejecutar npm ci y npm run dev. Para producción: npm run build. La salida es dist/ y la base de producción es /velora-dental-demo/.

Se usan Vite y Three.js, fuentes locales Fredoka/Nunito, un modelo GLB, un MP4 silencioso y una ilustración SVG educativa. El modelo y la ilustración son conceptuales.

## Contacto
config.js → reservation concentra identidad, mode demo/live, authorized, calLink y namespace. DEMO no carga Cal.com ni muestra días/horas. LIVE requiere provider cal.com, evento público real y autorización expresa; el SDK oficial se carga al acercarse a reserva o pulsar CTA, con fallback al mismo calendario si falla. No se incluyen claves API ni se solicita historia clínica. commercial/contact.js mantienen compatibilidad histórica y no controlan el CTA principal.

bookingSuccessfulV2 indica creación, no necesariamente confirmación. Se distingue pendiente/pago y aceptación reportada. Los CustomEvents locales no contienen UID/email/horas ni elevan appointment_confirmed a true: para conversiones autoritativas faltan backend/webhooks verificados. La cuenta real no fue conectada ni probada; el ciclo LIVE se verifica con dobles sin solicitudes externas.

## Publicación y actualizaciones
GitHub Pages usa .github/workflows/deploy.yml. Cada actualización de main instala dependencias con npm ci, verifica contacto, compila, comprueba rutas y publica dist. El resultado figura en Actions y Settings → Pages.

Desde Codex: solicitar actualizar este repositorio con los cambios de 04-WEB, conservando la lista de archivos publicables; comprobar build y workflow antes de declarar éxito. No subir node_modules, dist, archivos .env, capturas, referencias de terceros ni informes internos.

Los originales del proyecto se conservan. El GLB web conserva geometría/materiales con texturas de 1024 px. El video sigue el scroll también en móvil: no hay autoplay en la configuración activa; ante fallo muestra poster. La explicación anatómica dispone de un tramo sticky de lectura de tres estados. El implante acompaña toda la página con anclas por sección, disminuye de tamaño y termina horizontal. Se arrastra directamente en dos ejes, sin modos ni botones de exploración; el exterior conserva scroll. Con movimiento reducido se utiliza un recorrido estático. El render se detiene cuando no hay cambios. Android físico y rendimiento de campo siguen pendientes.

## Recursos y atribuciones
Fredoka y Nunito: licencias SIL Open Font License incluidas en public/fonts. Dependencias gratuitas con sus licencias correspondientes. Los recursos visuales fueron aportados y declarados como generados por el titular del proyecto; esto no constituye una comprobación independiente del plan/licencia de la herramienta generadora. No se concede aquí una licencia de redistribución general del modelo o fotografías. Ver ASSET-NOTICES.md.
