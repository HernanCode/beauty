# Demo de reservas · Simply Schedule Appointments

WordPress + MariaDB en Docker, separado de la landing. Muestra **solo la zona de reserva**, sin la home ni el diseño editorial de la landing, pero con un acabado visual cuidado.

> La carpeta conserva el nombre `easy-appointments-demo` de la primera prueba. El plugin activo ahora es **Simply Schedule Appointments**; Easy Appointments está instalado pero inactivo.

## Acceso

- **Reserva:** <http://localhost:8085/>
- **WordPress:** <http://localhost:8085/wp-admin>
- Usuario: `admin`
- Contraseña: `demo-admin-2026`

Credenciales solo para esta demo local. No publicar el contenedor en internet.

## Qué está configurado

- 5 tratamientos con precio en el título y duración:
  - Facial signature — 85 € · 60 min
  - Ritual de luz — 95 € · 75 min
  - Limpieza profunda — 70 € · 50 min
  - Masaje craneofacial — 65 € · 45 min
  - Ritual corporal — 120 € · 90 min
- Sin selección de profesional: un único calendario (la versión Basic no permite equipo).
- Martes a sábado, 10:00–14:00 y 15:00–20:00.
- Huecos cada 30 minutos.
- Formulario de datos con nombre, email, teléfono y notas.
- Confirmación con resumen y opción de guardar en el calendario (.ics).
- Página de inicio = `[ssa_booking]`.
- Traducción al español instalada.

## Estilo editorial

El aspecto se consigue con CSS personalizado en **SSA → Settings → Styles → Custom CSS** (se guarda en `ssa_settings_json`):

- Fondo `#e8dfd0` y texto `#2b221c`.
- Cormorant Garamond para títulos; Hanken Grotesk para etiquetas.
- Tarjetas de servicio sin fondo, con hairlines.
- Calendario y horas con celdas rectangulares.
- Campos de formulario con línea inferior.
- Botones oscuros.

El CSS está guardado en la base de datos, no en el tema. Si se reinstala la base de datos, habría que volver a pegarlo.

## Límites de la versión gratis

- **Un solo calendario/profesional**. El modo equipo es Business (pago).
- Sin Google Calendar, pagos, SMS ni campos personalizados avanzados (Plus/Pro).
- El email usa `wp_mail`; no hay SMTP configurado, así que las confirmaciones no son fiables.
- No se ha configurado pasarela de pago.

## Comandos

```bash
# Arrancar
docker compose up -d

# Ver estado
docker compose ps

# Parar sin borrar datos
docker compose down

# Ver citas
docker compose exec db mariadb -uwordpress -pwordpress wordpress \
  -e "SELECT id, appointment_type_id, start_date, end_date, status FROM wp_ssa_appointments;"

# Borrar citas de prueba
docker compose exec db mariadb -uwordpress -pwordpress wordpress \
  -e "DELETE FROM wp_ssa_appointments;"
docker compose run --rm --entrypoint wp wpcli transient delete --all

# WP-CLI
docker compose run --rm --entrypoint wp wpcli --info
```

Los datos viven en volúmenes Docker. `docker compose down` no los borra; `docker compose down -v` sí.

## Relación con la landing

La landing de `/` (proyecto Vite) no se ha tocado. Esta demo sirve para validar el formulario real gratuito con un acabado editorial. En producción, la página de reserva se montaría en el WordPress definitivo con esta misma configuración y CSS, cambiando textos, precios y datos `[REEMPLAZAR]`.

## Prueba de Cal.com

Hay una página aparte para comparar con una herramienta externa:

- **Cal.com:** <http://localhost:8085/reserva-cal/>
- Usa la plantilla `page-cal.php` y el perfil público `bailey` como ejemplo.
- El enlace real se guarda en el campo personalizado `cal_link` de esa página.
- El marco (barra, titular, intro) es editorial; el widget de dentro es la interfaz de Cal.com y no se puede reestilizar.
- La cuenta de Cal.com la debe crear la clienta; después se sustituye `cal_link` por su usuario o por `usuario/evento`.

Cal.com se encarga de disponibilidad, confirmaciones, cancelaciones y calendario. En el plan gratis mantiene su marca y su interfaz. Es la opción de cero mantenimiento; SSA es la que queda más integrada visualmente.
