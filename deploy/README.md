# Demo de reservas para WordPress

Paquete para probar la reserva de Simply Schedule Appointments en un WordPress de pruebas.

## Contenido

- `salon-booking-demo.zip`: tema instalable.
- `ssa-custom.css`: CSS que hay que pegar en SSA.
- `services.json`: los 5 tratamientos, duraciones y textos.
- `pages/reserva.txt`: shortcode de la página de reserva.
- `pages/reserva-cal.txt`: instrucciones de la página opcional de Cal.com.

## Requisitos

- WordPress autoalojado con acceso a plugins y temas. **WordPress.com gratis no permite subir temas ni plugins**; necesitas un hosting con PHP/MySQL (InfinityFree, 000webhost, un trial, etc.) o una instalación de pruebas.
- Simply Schedule Appointments **gratis** desde WordPress.org.

## Instalación

1. Instala WordPress y pon idioma español y zona horaria `Europe/Madrid`.
2. Instala y activa **Simply Schedule Appointments**.
3. Sube y activa el tema `salon-booking-demo.zip` en Apariencia → Temas → Añadir → Subir tema.
4. Crea los 5 tratamientos en **SSA → Appointment Types**:
   - Facial signature — 85 € · 60 min
   - Ritual de luz — 95 € · 75 min
   - Limpieza profunda — 70 € · 50 min
   - Masaje craneofacial — 65 € · 45 min
   - Ritual corporal — 120 € · 90 min
   - Sin empleados/profesionales (un solo calendario).
   - Disponibilidad: martes a sábado, 10:00–14:00 y 15:00–20:00.
   - Incremento: 30 minutos.
   - Layout: mes.
5. En **SSA → Settings → Styles → Custom CSS**, pega todo el contenido de `ssa-custom.css`.
6. Crea una página `Reserva` con el shortcode de `pages/reserva.txt` y publícala.
7. Ve a Ajustes → Lectura → Página estática y elige `Reserva` como portada.
8. Comprueba que la reserva crea citas y bloquea el hueco.

## Página opcional de Cal.com

El tema incluye la plantilla `Cal.com Demo` (`page-cal.php`).

1. Crea una página y asígnale la plantilla “Cal.com Demo”.
2. Añade el campo personalizado `cal_link` con el usuario o evento de Cal.com.
3. La página de reserva de SSA y la de Cal.com pueden convivir para comparar.

En el plan gratuito de Cal.com el widget mantiene su interfaz y su marca; el marco de la página es el editorial.

## Límites de SSA gratis

- Un solo calendario/profesional.
- Sin Google Calendar, pagos ni SMS.
- Los emails usan `wp_mail`; sin SMTP pueden no llegar.

## Nota sobre el CSS

El CSS está ajustado al HTML de SSA 1.6.13.9. Si una actualización cambia las clases, habrá que revisar las reglas de la cuadrícula de horas y de los campos.
