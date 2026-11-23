# Prompt de desarrollo: web de salón de belleza (estética editorial premium)

## 1. Rol y objetivo

Eres un desarrollador front-end senior especializado en webs editoriales de lujo. Tu tarea es construir una web de **salón de belleza** que reproduzca **con la máxima fidelidad** el lenguaje visual de las capturas de referencia adjuntas: sobria, silenciosa, cálida y de apariencia cara.

Recibes:
1. Las capturas de referencia.
2. `design-tokens.json`.
3. Este documento.

**Prioridad absoluta: fidelidad visual a las referencias.** No improvises estética, no "mejores" el diseño, no añadas elementos decorativos y no tomes decisiones visuales arbitrarias. Si algo no está definido en las referencias ni en los tokens, aplica la solución más sobria posible usando solo los tokens existentes y menciónalo al final en una lista de "decisiones tomadas".

## 2. Regla de oro: `design-tokens.json` es la fuente de verdad

- Todo color, fuente, tamaño, interlineado, tracking, espaciado, radio, sombra, duración y curva sale de `design-tokens.json`.
- Traslada los tokens a `tailwind.config` (`theme.extend`) y/o a variables CSS en `:root`. **Prohibido** escribir valores sueltos (`#E8DFD0`, `text-[19px]`...) en el marcado si existe token equivalente.
- Cada token lleva un campo `source`:
  - `observed`: medido en las capturas. Respétalo exactamente.
  - `estimated`: estimado visualmente. Úsalo tal cual y, al terminar, compáralo con la referencia; si ves desviación, ajusta el token (no el componente).
  - `proposed`: no está en las capturas (hover, focus, movimiento, responsive). Aplícalo tal cual, sin extenderlo con estilos nuevos.
  - `not_observed`: no lo inventes.

## 3. Contexto y contenido

- Es un salón de belleza. El **lenguaje visual** debe ser el de la referencia; el **contenido** se adapta al sector.
- El nombre de marca aún no existe: usa `[NOMBRE DEL SALÓN]` como logotipo de texto en mayúsculas (token `logo`).
- Idioma: español de España. Tono cálido, breve y concreto. Sin clichés ("experiencia única", "descubre la magia") ni *lorem ipsum*.
- Cualquier dato real que no se te haya dado (reseñas, precios, dirección, horarios, teléfono) debe aparecer marcado como `[REEMPLAZAR]`. **No inventes reseñas ni puntuaciones**: el widget se construye con los datos de ejemplo `4.9 / 5.0 · Excelente · Basado en 284 reseñas` y debe quedar marcado como dato provisional en un comentario HTML.
- Los medios gráficos se proporcionan aparte. Reserva cada contenedor con su proporción y su overlay; usa `<img>` con `src` provisional neutro (bloque del color `background.muted`) y `alt` descriptivo editable.

### Correspondencia de contenido (referencia → salón)

| Patrón de la referencia | Texto equivalente en el salón |
|---|---|
| Hero: eyebrow `A PRIVATE RETREAT` | `SALÓN DE BELLEZA` |
| Hero: titular `HIDDEN IN / MALLORCA` (2 líneas, ≈9 y ≈8 caracteres) | `BELLEZA / SIN PRISA` |
| Hero: etiquetas laterales (lugar, región) | `[BARRIO]` · `[CIUDAD], ESPAÑA` |
| Hero: párrafo inferior izquierdo (≈75 caracteres, 3 líneas) | Una frase sobre el espacio y el enfoque del salón |
| Sección de ritmo: `TIME TO / RESTORE` + etiquetas `GARDEN SPA`, `DAILY RITUALS` + botón `Explore Wellness` | `TIEMPO / PARA TI` + `FACIALES`, `RITUALES` + botón `Ver tratamientos` |
| Sección carrusel: `SETTLE IN`, subtítulo de 2 líneas, enlace `Explore All Rooms →` | `ELIGE TU RITUAL`, subtítulo de ≈90 caracteres, `Ver todos los tratamientos →` |
| Tarjeta: `GARDEN ROOM` / `2 Guests · 38 m² · Garden View` / `From €420/Night` | `FACIAL SIGNATURE` / `60 min · Cabina individual · Cuidado facial` / `Desde 85 €` |
| Enlace del header `Check Availability ↗` | `Reservar cita ↗` |
| Botón del header y CTA | Apuntan a `#reserva` o a un enlace de WhatsApp provisional `[REEMPLAZAR]` |

## 4. Tecnología y estructura

- **HTML5 semántico + Tailwind CSS.** Tailwind vía build (preferible) o CDN con configuración de tokens.
- JavaScript vanilla en módulos pequeños. Para el movimiento (ver §8) usa **GSAP + ScrollTrigger** y **Lenis**, que son los únicos recursos de JS externos permitidos.
- Archivos sugeridos:

```
/index.html
/src/styles.css            (@tailwind + variables CSS generadas desde los tokens)
/tailwind.config.js        (theme.extend desde design-tokens.json)
/src/js/main.js            (inicialización)
/src/js/header.js          (estados overlay / sólido)
/src/js/carousel.js        (carrusel)
/src/js/motion.js          (Lenis + ScrollTrigger + reveals)
/src/components/           (si usas plantillas parciales)
```

- Código limpio, con componentes reutilizables (botón, enlace con flecha, tarjeta, etiqueta, bloque de titular, icono) y sin estilos duplicados. Clases ordenadas; nada de `!important`.
- Iconos como **SVG inline** (según `iconography`): menú, flecha derecha/izquierda, flecha diagonal ↗, estrella y logotipo "G" multicolor de Google. Sin librerías de iconos, sin emojis.

## 5. Tipografía

- Carga con Google Fonts (`display=swap`, `preconnect` y `preload` de la fuente display): la fuente `display` de los tokens y la fuente `label`.
- `display` (serif): logo, titulares, enlaces, botones, párrafos, precios y metadatos. Nunca en negrita.
- `label` (sans): solo etiquetas en mayúsculas con tracking amplio y el texto secundario del widget.
- Titulares siempre en **mayúsculas**, interlineado ajustado (<1), centrados. Usa los tamaños `fluid` de los tokens para responsive.
- Párrafos en minúsculas/mayúsculas normales. Nunca justificar. Respeta los `maxWidthPx` de los tokens.

## 6. Especificación de secciones (desktop de referencia: ≈1905 px)

### 6.1 Header (fijo, 86 px)
- Tres zonas con CSS grid (`1fr auto 1fr`), padding horizontal 32 px.
- Izquierda: icono de menú (dos líneas de 20 px, separación 6 px) + texto `Menu`, separados 10 px. Centro: logo. Derecha: `Reservar cita` + icono ↗ a 8 px, alineado a la derecha.
- Dos estados (ver `components.header.states`): **overlay** (transparente, texto `onDark`) mientras `scrollY ≤ 24`; **sólido** (fondo `background.base`, texto `primary`, línea inferior hairline) después. Transición según `motion.transitions.headerSwitch`.
- El menú abre un panel a pantalla completa (fondo `background.base`, enlaces en `displayL` centrados, botón `Cerrar` en la posición del trigger). Es una pieza no incluida en las capturas: constrúyela solo con tokens y sin elementos nuevos.

### 6.2 Hero principal (100svh)
- Contenedor de medio a sangre con overlay `heroDeep`. El header se superpone.
- Titular `displayXL` en 2 líneas, centrado, color `onDark`, ligeramente por encima del centro vertical del hero (el bloque ocupa aproximadamente el tramo 30–55 % del alto).
- Eyebrow en `label`, centrado, justo encima del titular (≈ 36 px de separación).
- Dos etiquetas `label` a ambos lados, a la altura del hueco entre las dos líneas del titular, separadas del titular por ≈ 45 px; la izquierda alineada a la derecha y la derecha a la izquierda hacia el titular.
- Párrafo `heroParagraph` anclado abajo-izquierda (a 32 px de los bordes).
- Widget de reseñas anclado abajo-derecha (a 32 px de los bordes). Estructura exacta en `components.ratingWidget`: 296 × 131 px, fondo `background.base`, sin radio ni sombra, estrellas + logo Google arriba, divisor hairline, y debajo `4.9` (`ratingValue`) con `/5.0` como superíndice, `Excelente` y `Basado en 284 reseñas` a la derecha.
- Sin botón en el hero principal (el CTA vive en el header).

### 6.3 Sección de ritmo ("Time to restore")
- Medio a sangre de alto completo con overlay `heroBase`.
- Titular `displayL` en 2 líneas, centrado, color `onDark`. Etiquetas `label` a ambos lados, a la altura de la primera línea del titular, a ≈ 60 px del texto.
- Debajo, a ≈ 40 px del titular, botón primario centrado (167 × 54 px; ver `components.buttonPrimary`).

### 6.4 Sección carrusel ("Settle in")
- Fondo `background.base`. Cabecera centrada: titular `displayL` en `text.primary` (1 línea), subtítulo `lead` (máx. 460 px, 2 líneas), enlace con flecha. Separaciones según `layout.sectionHeader`.
- Carrusel centrado: tarjeta activa de **800 × 600 px** (4:3); las vecinas al **80 %** de escala (`transform: scale(.8)`, origen centro, sin atenuar opacidad), asomando recortadas por los bordes del viewport. Hueco nominal de 48 px entre diapositivas.
- Dos botones de flecha cuadrados de 36 px (`carouselArrowButton`), a 48 px del borde de la tarjeta activa y centrados verticalmente con ella.
- Tarjeta: imagen a sangre, overlay `cardBottom`, padding 32 px, título `cardTitle` en mayúsculas sobre metadatos `cardMeta` abajo-izquierda, precio `cardPrice` abajo-derecha. El texto escala con la tarjeta (no definir tamaños distintos para las inactivas).
- Comportamiento: avanza de una en una, **loop infinito**, arrastre/swipe con el dedo o ratón, navegación con flechas del teclado y botones. Transición `motion.transitions.carouselSlide`.

### 6.5 Secciones no incluidas en las capturas (reserva, ubicación, footer)
- Construye lo mínimo necesario usando **solo** tokens y patrones ya definidos: fondo `background.base` o `background.inverse`, titulares `displayL`, etiquetas `label`, botón primario, enlaces. Sin elementos visuales nuevos, sin tarjetas con sombras, sin gradientes y sin iconos fuera de `iconography`.
- Contenido: bloque `#reserva` con titular, horario, dirección, botones de cita y WhatsApp (`[REEMPLAZAR]`) y mapa. Footer sobrio con redes y aviso legal.

## 7. Responsive

Mobile-first con los breakpoints de `layout.breakpoints`. Verifica en 1920, 1440, 1280, 1024, 768 y 390 px.

| Elemento | ≥1280 (desktop / portátil) | 768–1279 (tablet) | <768 (móvil) |
|---|---|---|---|
| Gutter lateral | 32 px | 24 px | 20 px |
| Header | Estructura completa | Igual; enlace de reserva visible | Menú + logo + icono ↗ (sin texto); mantiene 72 px de alto |
| Titulares | Tamaños `fluid` de los tokens | Ídem | Ídem; permitir `text-wrap: balance`, nunca partir palabras |
| Etiquetas laterales del hero | A ambos lados del titular | A ambos lados, más cerca | Pasan a una fila bajo el titular, centradas y separadas por un punto medio |
| Párrafo inferior del hero | Abajo-izquierda | Abajo-izquierda | Centrado sobre el widget, ancho máx. 300 px |
| Widget de reseñas | Abajo-derecha | Abajo-derecha | Ancho completo menos gutters, anclado abajo |
| Carrusel | Activa 800 × 600 px, vecinas visibles | Activa `min(70vw, 640px)`, 4:3 | Activa 78vw con proporción 4:5, vecinas asomando 8vw; flechas debajo, centradas |
| Botón / CTA | 54 px de alto | Igual | Igual; mínimo 48 px de zona táctil |

Asegura que ningún texto desborde y que no haya scroll horizontal en ningún ancho. Usa `svh`/`dvh` y respeta *safe areas*.

## 8. Movimiento y scroll (requisito del cliente: sensación premium)

Las capturas no muestran animaciones; implementa **solo** lo que describen `motion` en los tokens, con los valores indicados:

1. **Smooth scroll** con Lenis, integrado con ScrollTrigger.
2. **Reveal de titulares** línea a línea con máscara (`overflow:hidden`) y `translateY`, con stagger.
3. **Reveal de medios** con `clip-path` + escala 1.15 → 1 al entrar en el viewport.
4. **Parallax suave** (±8 % como máximo) en los medios grandes.
5. **Salida del hero**: la imagen escala hasta 1.08 y el contenido se desvanece y sube ligeramente al hacer scroll.
6. Carrusel con escala de vecinas (descrito en §6.4) y cambio de estado del header.

Máximo 6 efectos. Siempre lentos y suaves. Anima solo `transform` y `opacity` (y `clip-path` en reveals). Respeta `prefers-reduced-motion` según `motion.reducedMotion`. No añadas cursores personalizados, partículas, marquesinas ni efectos de hover distintos de los definidos.

## 9. Accesibilidad, SEO y rendimiento

**Accesibilidad**
- Landmarks (`header`, `nav`, `main`, `section`, `footer`), un solo `h1` (el titular del hero) y jerarquía correcta de encabezados.
- Contraste mínimo AA para el texto. Verifica el texto crema sobre imagen con overlay; si no llega, sube la opacidad del overlay desde el token, no cambies el color del texto.
- Foco visible con los estilos de los tokens. Todo operable con teclado. El carrusel sigue el patrón ARIA (`role="region"`, `aria-roledescription="carousel"`, `aria-live="polite"`, botones con `aria-label`). El menú overlay atrapa el foco y se cierra con `Esc`.
- Las etiquetas decorativas del hero y los iconos llevan `aria-hidden="true"`. Los enlaces con solo icono llevan `aria-label`.

**SEO básico**
- `<title>` y `meta description` con el nombre del salón y la ciudad (`[REEMPLAZAR]`), `lang="es"`, canonical, Open Graph y Twitter Card básicos.
- Datos estructurados JSON-LD `HairSalon` o `BeautySalon` con campos `[REEMPLAZAR]`.
- URLs de ancla legibles (`#tratamientos`, `#reserva`) y `alt` descriptivos.

**Rendimiento**
- Medios en AVIF/WebP con `srcset` y `sizes`, `width`/`height` definidos, `loading="lazy"` (salvo el primer hero, con `fetchpriority="high"`).
- Cero *layout shift* (CLS < 0.1). LCP < 2.5 s en móvil. JS diferido, CSS purgado y fuentes con `font-display: swap`.
- Desactiva el parallax y reduce los efectos en dispositivos táctiles de gama baja si hay caída de FPS.

## 10. Prohibiciones

- Nada de radios, sombras difusas, *glassmorphism*, gradientes decorativos, colores o fuentes ajenos a los tokens.
- Nada de rejillas de tres tarjetas idénticas ni de composiciones recargadas: respeta el eje central y el espacio en blanco de la referencia.
- Nada de texto genérico ni de elementos "típicos de plantilla" (badges, contadores, sliders de logos, testimonios en tarjetas con sombra).
- No añadas librerías de UI, iconos ni animaciones adicionales a las indicadas.
- No cambies los tokens para que algo "quede bien": si un valor no encaja, señálalo en tu informe.

## 11. Entrega y criterios de aceptación

Entrega el proyecto completo, funcional y listo para ejecutar, con una breve nota de instalación. Al final incluye:
1. Lista de las "decisiones tomadas" donde los tokens o las capturas no bastaban.
2. Lista de los tokens `estimated` que ajustaste tras comparar con la referencia, con valor anterior y nuevo.

La implementación se considera correcta si:
- [ ] Al superponerla con las capturas (a ≈1905 px) los tamaños de titular, header, botón, carrusel (800 × 600, vecinas al 80 %) y widget (296 × 131) coinciden.
- [ ] No existe ningún valor de estilo fuera de `design-tokens.json`.
- [ ] El header cambia correctamente entre overlay y sólido.
- [ ] El carrusel funciona con ratón, táctil y teclado, y hace loop.
- [ ] Sin scroll horizontal ni desbordes en 1920, 1440, 1280, 1024, 768 y 390 px.
- [ ] Lighthouse: Accesibilidad ≥ 95, SEO ≥ 95, Rendimiento ≥ 90 en móvil.
- [ ] `prefers-reduced-motion` funciona.
