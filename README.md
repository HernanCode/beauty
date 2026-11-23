# Salón de belleza · Editorial Warm Minimal

Web estática de una sola página para un salón de belleza. HTML5 semántico, Tailwind CSS compilado con Vite, GSAP + ScrollTrigger y Lenis. Todo el sistema visual sale de `design-tokens.json` (colores, tipografía, layout, movimiento).

## Instalación

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera /dist
npm run preview   # sirve /dist en http://localhost:4173
```

Requiere Node 18+.

## Estructura

```
index.html
tailwind.config.js        tokens trasladados a theme.extend
src/styles.css            variables CSS + componentes (header, hero, carrusel, reserva…)
src/js/main.js            arranque
src/js/header.js          estados overlay/sólido + menú accesible con foco atrapado
src/js/carousel.js        carrusel infinito (ratón, táctil, teclado y botones)
src/js/motion.js          Lenis, reveals, parallax, salida del hero y reduced motion
public/media/             imágenes provisionales neutras (sustituir por AVIF/WebP)
public/fonts/             Cormorant Garamond y Hanken Grotesk (Google Fonts, en local)
public/robots.txt
```

## Demo de reserva (provisional)

Los botones `Reservar cita` del header y del bloque de reserva abren un diálogo con el flujo completo:

1. Elección de tratamiento.
2. Profesional, calendario y horas disponibles/llenas.
3. Datos de contacto y consentimiento.
4. Confirmación con resumen y descarga de `.ics`.

La disponibilidad es **simulada** para validar la experiencia: horario de martes a sábado, 10:00–20:00, pausa de 14:00 a 15:00, citas cada 30 minutos y ocupación aleatoria estable. Al confirmar, el hueco queda bloqueado en `localStorage` (solo se guarda la ocupación, no el nombre ni el email). El enlace `Reiniciar demo` limpia esos datos.

Esto **no es el plugin de WordPress**: es el prototipo de UX y flujo. En la implantación real, la disponibilidad la gestionará Easy Appointments (o el motor elegido) y esta pantalla se sustituirá o conectará a su formulario.

## Contenido pendiente (`[REEMPLAZAR]`)

Nombre del salón, barrio, ciudad, dirección, horarios, teléfono, email, redes, textos legales, dominio y precios. Las reseñas del widget (`4.9 / 5.0 · Excelente · Basado en 284 reseñas`) son datos de ejemplo indicados en el brief y están marcadas con un comentario HTML. Los precios también son de ejemplo y están marcados en comentarios.

## Medios

`public/media/*.svg` son bloques planos de color `background.muted` usados como reserva de proporción y overlay. Al entregar las fotografías definitivas, sustitúyelos por AVIF/WebP con `srcset`, `sizes`, `width`/`height` y `alt` descriptivo. El bloque del mapa debe sustituirse por el mapa real.

## Decisiones tomadas

- No había capturas de referencia en la carpeta de entrega (solo `prompt.md` y `design-tokens.json`): la fidelidad se ha ajustado al brief y a los tokens.
- El overlay se elevó para que el texto crema cumpla AA con los placeholders claros: `heroBase` 0.40 → 0.52, `heroDeep` 0.50 → 0.60 y `cardBottom` 0.55 → 0.66. Los tokens originales no se han modificado.
- La sección de reserva usa `background.inverse` para que el botón primario (crema) tenga contraste; el footer usa el mismo fondo y un hairline para separarlo.
- La sección de ritmo y el hero muestran las etiquetas laterales en desktop; en móvil pasan a una fila bajo el titular separadas por un punto medio.
- En móvil el carrusel mantiene el 78vw indicado; con escala 0.8 y sin separación, la vecina asoma ≈3vw (la geometría del brief no permite 78vw + 8vw + 48px a la vez).
- El dominio `salon-de-belleza.example` es un marcador: se usa en canonical/OG/JSON-LD para que el canonical sea válido hasta sustituirlo.
- Las fuentes de Google se sirven en local para precargarlas y evitar dependencia de red en runtime.

## Verificación

- Lighthouse móvil sobre `npm run build` + `preview`: Rendimiento 99, Accesibilidad 100, Buenas prácticas 100, SEO 100. El diálogo de reserva también se auditó abierto con Accesibilidad 100.
- Sin scroll horizontal en 1905, 1440, 1280, 1024, 768 y 390 px, tampoco con el diálogo de reserva abierto.
- En 1905 px: header 86, titular 139, carrusel activo 800 × 600, flechas a 48 px del borde, widget 296 × 131 y CTA de 54 px de alto.

## Prueba de Cal.com en la web de Vite

- Página: `/cal.html` (en desarrollo, `http://localhost:5173/cal.html`).
- Estilos: `src/cal.css`.
- Integración: `src/js/cal.js`.
- La página usa una composición 40/60: a la izquierda el titular, la intro y la lista de servicios; a la derecha el calendario de Cal.com, que se carga al elegir un servicio. La lista está definida en `src/js/cal.js` y el enlace base en `data-cal-base` de `cal.html` (`samuel-hernan-dvb4jx`). Si se añaden servicios en Cal, hay que añadirlos también a ese array.
- El marco exterior es editorial; todo el bloque de reservas (perfil, servicios y calendario) es Cal.com. Usa `cssVarsPerTheme` para vestir el booker con la paleta de la web (fondo, textos, bordes, radios 0).
- Vite está configurado como multipágina para incluir también `cal.html` en el build.

## Publicar en GitHub Pages

El proyecto usa `base: './'` en `vite.config.js` para que los assets funcionen tanto en la raíz como en `usuario.github.io/repositorio/`.

1. Ejecuta `npm run build`.
2. Publica el contenido de `dist/`, no la raíz del proyecto. Lo más sencillo es usar GitHub Actions con Pages; también puedes copiar `dist/` a una carpeta `docs/` y configurar Pages desde esa carpeta.
3. El archivo `public/.nojekyll` evita que GitHub Pages procese los assets con Jekyll.

No subas `node_modules/` ni `dist/` al repositorio si vas a construir en Actions. Si publicas manualmente, sube el contenido de `dist/` a la rama o carpeta que use Pages.

Si después de desplegar sigues viendo el CSS antiguo, fuerza recarga (Ctrl+Shift+R): GitHub Pages cachea los assets con hash y a veces tarda un minuto en actualizar.

## Versión estática sin Vite (GitHub Pages)

La carpeta `docs/` contiene el sitio ya construido: HTML, CSS y JS. No necesita Vite, `node_modules` ni compilación para publicarse.

1. Sube el repositorio a GitHub.
2. En Settings → Pages, elige **Deploy from a branch**.
3. Selecciona la rama principal y la carpeta **`/docs`**.
4. Guarda y espera a que GitHub Pages publique.

El build ya usa rutas relativas (`base: './'`) y `docs/.nojekyll`, así que funciona en `usuario.github.io/repositorio/`.

Si cambias el diseño, tendrías que volver a generar `docs/` desde la fuente con `npm run build` y copiar `dist/` a `docs/`. Si no vas a volver a tocar el diseño, puedes usar directamente `docs/` y olvidarte de Vite.
