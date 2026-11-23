<?php
/**
 * Template Name: Cal.com Demo
 * Description: Página de prueba para incrustar Cal.com con el estilo editorial.
 */
$cal_link = get_post_meta(get_the_ID(), 'cal_link', true);
if (empty($cal_link)) {
    $cal_link = 'bailey';
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class('cal-demo-page'); ?>>
  <?php wp_body_open(); ?>
  <header class="cal-demo-bar">
    <a class="cal-demo-bar__back" href="<?php echo esc_url(home_url('/')); ?>">← Volver a SSA</a>
    <span class="cal-demo-bar__logo">[NOMBRE DEL SALÓN]</span>
    <span class="cal-demo-bar__tag">Demo Cal.com</span>
  </header>

  <main class="cal-demo-shell">
    <p class="cal-demo-label">Reserva de cita</p>
    <h1 class="cal-demo-title">Elige tu ritual</h1>
    <p class="cal-demo-intro">
      Prueba de integración con Cal.com. El widget de abajo es real; el contenido es un perfil público de ejemplo.
      En producción se sustituye por el enlace de la cuenta del salón.
    </p>

    <div class="cal-demo-embed">
      <div id="cal-inline" class="cal-inline"></div>
    </div>

    <p class="cal-demo-note">
      Demo · Cal.com mantiene la disponibilidad y las confirmaciones. Los textos y el marco son de la web.
    </p>
  </main>

  <script type="text/javascript">
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    Cal('init', 'salon', { origin: 'https://app.cal.com' });
    Cal.ns.salon('inline', {
      elementOrSelector: '#cal-inline',
      calLink: '<?php echo esc_js($cal_link); ?>',
      layout: 'month_view'
    });
    Cal.ns.salon('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
      theme: 'light',
      styles: { branding: { brandColor: '#6b4733' } }
    });
  </script>
  <?php wp_footer(); ?>
</body>
</html>
