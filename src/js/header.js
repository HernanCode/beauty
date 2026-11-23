export function initHeader() {
  const header = document.getElementById('site-header');
  const trigger = document.querySelector('.menu-trigger');
  const overlay = document.getElementById('menu-overlay');
  const closeButton = overlay ? overlay.querySelector('[data-menu-close]') : null;
  const menuLinks = overlay ? Array.from(overlay.querySelectorAll('.menu-nav a')) : [];

  if (!header) return;

  /* ------------------------- Header overlay / sólido ------------------------- */
  let solid = null;
  let ticking = false;

  const updateHeader = () => {
    const next = window.scrollY > 24;
    if (next !== solid) {
      solid = next;
      header.dataset.state = solid ? 'solid' : 'overlay';
    }
    ticking = false;
  };

  updateHeader();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );

  if (!overlay || !trigger || !closeButton) return;

  /* -------------------------------- Menú overlay -------------------------------- */
  let isOpen = false;
  let lastFocused = null;

  const focusable = () =>
    Array.from(overlay.querySelectorAll('a[href], button:not([disabled])')).filter(
      (el) => el.offsetParent !== null,
    );

  const onKeydown = (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const items = focusable();
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const background = Array.from(document.querySelectorAll('main, .site-header, .site-footer'));

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;

    overlay.dataset.open = 'true';
    overlay.removeAttribute('inert');
    overlay.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    background.forEach((element) => element.setAttribute('inert', ''));
    document.documentElement.classList.add('menu-open');
    if (window.__lenis) window.__lenis.stop();

    document.addEventListener('keydown', onKeydown);
    closeButton.focus({ preventScroll: true });
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;

    overlay.dataset.open = 'false';
    overlay.setAttribute('inert', '');
    overlay.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    background.forEach((element) => element.removeAttribute('inert'));
    document.documentElement.classList.remove('menu-open');
    if (window.__lenis) window.__lenis.start();

    document.removeEventListener('keydown', onKeydown);
    if (restoreFocus && lastFocused) lastFocused.focus({ preventScroll: true });
  };

  trigger.addEventListener('click', openMenu);
  closeButton.addEventListener('click', () => closeMenu());

  menuLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const target = href && href.startsWith('#') ? document.querySelector(href) : null;

      closeMenu({ restoreFocus: false });

      if (!target) return;
      event.preventDefault();

      // Se desplaza después de cerrar el panel para que Lenis recupere el scroll.
      requestAnimationFrame(() => {
        if (window.__lenis) {
          const headerHeight =
            parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 86;
          window.__lenis.scrollTo(target, { offset: -headerHeight, force: true });
        } else {
          target.scrollIntoView({ block: 'start' });
        }
      });
    });
  });

  // Cierra el panel si se pulsa fuera de los enlaces (el fondo del overlay)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeMenu();
  });
}
