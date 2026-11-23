import '../styles.css';
import '../cal.css';

const SERVICES = [
  {
    slug: 'tratamiento-facial',
    name: 'Tratamiento facial',
    duration: '50 min',
    description: 'Limpieza e hidratación facial relajante.',
  },
  {
    slug: 'coloracion-y-mechas',
    name: 'Coloración y mechas',
    duration: '120 min',
    description: 'Coloración completa o mechas, con asesoramiento de color.',
  },
  {
    slug: 'manicura-y-pedicura',
    name: 'Manicura y pedicura',
    duration: '60 min',
    description: 'Manicura y pedicura con esmaltado.',
  },
  {
    slug: 'corte-de-pelo',
    name: 'Corte de pelo',
    duration: '45 min',
    description: 'Corte personalizado con lavado y peinado.',
  },
];

const booking = document.querySelector('[data-booking]');
const servicesElement = document.querySelector('[data-services]');
const placeholder = document.querySelector('[data-placeholder]');
const embedHost = document.querySelector('[data-embed-host]');
const calendarElement = document.querySelector('.cal-booking__calendar');
const baseLink = booking?.dataset.calBase || 'samuel-hernan-dvb4jx';

if (!booking || !servicesElement || !placeholder || !embedHost || !calendarElement) {
  // La página no tiene la estructura esperada.
} else {
  /* Cal.com embed loader */
  (function (C, A, L) {
    let p = function (a, ar) {
      a.q.push(ar);
    };
    let d = C.document;

    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;

        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }

        if (ar[0] === L) {
          const api = function () {
            p(api, arguments);
          };
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

  const Cal = window.Cal;

  const uiOptions = {
    hideEventTypeDetails: true,
    layout: 'month_view',
    theme: 'light',
    cssVarsPerTheme: {
      light: {
        'cal-brand': '#6B4733',
        'cal-brand-emphasis': '#4A3D34',
        'cal-brand-text': '#EFE7DA',
        'cal-brand-subtle': '#D6CDBF',
        'cal-brand-accent': '#EFE7DA',

        'cal-text': '#2B221C',
        'cal-text-emphasis': '#2B221C',
        'cal-text-subtle': '#4A3D34',
        'cal-text-muted': 'rgba(43, 34, 28, 0.55)',
        'cal-text-inverted': '#EFE7DA',

        'cal-text-semantic-info': '#2B221C',
        'cal-text-semantic-attention': '#6B4733',
        'cal-text-semantic-error': '#6B4733',
        'cal-text-info': '#2B221C',
        'cal-text-success': '#4A3D34',
        'cal-text-attention': '#6B4733',
        'cal-text-error': '#6B4733',

        'cal-bg': '#E8DFD0',
        'cal-bg-emphasis': '#D6CDBF',
        'cal-bg-subtle': '#D6CDBF',
        'cal-bg-muted': '#CCC2B3',
        'cal-bg-inverted': '#1F1814',
        'cal-bg-attention': '#E8DFD0',
        'cal-bg-error': '#E8DFD0',

        'cal-bg-semantic-info-subtle': '#D6CDBF',
        'cal-bg-semantic-attention-subtle': '#D6CDBF',
        'cal-bg-semantic-error-subtle': '#D6CDBF',

        'cal-border': 'rgba(43, 34, 28, 0.15)',
        'cal-border-emphasis': 'rgba(43, 34, 28, 0.4)',
        'cal-border-subtle': 'rgba(43, 34, 28, 0.12)',
        'cal-border-muted': 'rgba(43, 34, 28, 0.08)',
        'cal-border-error': 'rgba(43, 34, 28, 0.4)',
        'cal-border-semantic-error': 'rgba(43, 34, 28, 0.3)',
        'cal-border-semantic-attention-subtle': 'rgba(43, 34, 28, 0.2)',
        'cal-border-semantic-error-subtle': 'rgba(43, 34, 28, 0.3)',

        'cal-border-booker': 'transparent',
        'cal-border-booker-width': '0px',
        radius: '0px',
      },
    },
  };

  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollToCalendar = () => {
    if (!isMobile()) return;

    requestAnimationFrame(() => {
      const top = calendarElement.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    });
  };

  const mountCalendar = (service) => {
    const namespace = `salon-${service.slug}`;
    const containerId = `cal-inline-${service.slug}`;

    embedHost.innerHTML = '';
    const container = document.createElement('div');
    container.id = containerId;
    container.className = 'cal-inline';
    embedHost.appendChild(container);

    placeholder.hidden = true;
    embedHost.hidden = false;

    Cal('init', namespace, { origin: 'https://app.cal.com' });
    Cal.ns[namespace]('ui', uiOptions);
    Cal.ns[namespace]('inline', {
      elementOrSelector: `#${containerId}`,
      calLink: `${baseLink}/${service.slug}`,
      layout: 'month_view',
    });

    scrollToCalendar();
  };

  servicesElement.innerHTML = SERVICES.map(
    (service) => `
      <button
        class="cal-service"
        type="button"
        data-service="${service.slug}"
        aria-pressed="false"
        aria-controls="calendario"
      >
        <span class="cal-service__name">${service.name}</span>
        <span class="cal-service__meta">${service.duration}</span>
        <span class="cal-service__description">${service.description}</span>
      </button>`,
  ).join('');

  servicesElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-service]');
    if (!button || button.classList.contains('is-active')) return;

    const service = SERVICES.find((item) => item.slug === button.dataset.service);
    if (!service) return;

    servicesElement.querySelectorAll('.cal-service').forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('is-active');
    button.setAttribute('aria-pressed', 'true');

    mountCalendar(service);
  });
}
