export function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const viewport = root.querySelector('[data-viewport]');
  const track = root.querySelector('[data-track]');
  const status = root.querySelector('[data-status]');
  const prevButton = root.querySelector('[data-prev]');
  const nextButton = root.querySelector('[data-next]');

  if (!viewport || !track) return;

  const originals = Array.from(track.children);
  const count = originals.length;
  if (count < 2) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Clones para el bucle infinito */
  const firstClone = originals[0].cloneNode(true);
  const lastClone = originals[count - 1].cloneNode(true);

  [firstClone, lastClone].forEach((clone) => {
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''));
    clone.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
  });

  track.insertBefore(lastClone, originals[0]);
  track.appendChild(firstClone);

  const slides = Array.from(track.children);
  let index = 1;
  let lastX = 0;
  let animating = false;
  let moveTimer = 0;
  let drag = null;
  let resizeFrame = 0;

  const getGap = () => parseFloat(getComputedStyle(slides[0]).marginRight) || 0;

  const getMetrics = () => {
    const slideWidth = slides[0].offsetWidth;
    return {
      slideWidth,
      gap: getGap(),
      viewportWidth: viewport.clientWidth,
    };
  };

  const xFor = (slideIndex) => {
    const { slideWidth, gap, viewportWidth } = getMetrics();
    return viewportWidth / 2 - slideWidth / 2 - slideIndex * (slideWidth + gap);
  };

  const updateActive = () => {
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));

    const real = ((index - 1) % count + count) % count;
    const title = originals[real].querySelector('.t-card-title');
    if (status) {
      status.textContent = `${real + 1} de ${count}: ${title ? title.textContent.trim() : ''}`;
    }

    originals.forEach((slide, i) => {
      // Solo la diapositiva visible entra en el orden de lectura.
      slide.toggleAttribute('aria-hidden', i !== real);
    });
  };

  const applyTransform = (slideIndex, animate) => {
    lastX = xFor(slideIndex);
    const value = `translate3d(${lastX}px, 0, 0)`;

    if (!animate) {
      track.style.transition = 'none';
      track.style.transform = value;
      // Fuerza el cálculo para que el salto no se anime al restaurar la transición.
      void track.offsetWidth;
      track.style.transition = '';
    } else {
      track.style.transform = value;
    }
  };

  const finishMove = () => {
    if (!animating) return;
    animating = false;
    window.clearTimeout(moveTimer);

    if (index === 0) {
      index = count;
      applyTransform(index, false);
      updateActive();
    } else if (index === count + 1) {
      index = 1;
      applyTransform(index, false);
      updateActive();
    }
  };

  const scheduleFinish = () => {
    window.clearTimeout(moveTimer);
    moveTimer = window.setTimeout(finishMove, prefersReduced ? 40 : 860);
  };

  const go = (direction) => {
    if (animating) return;
    animating = true;
    index += direction;
    updateActive();
    applyTransform(index, true);
    scheduleFinish();
  };

  /* Estado inicial */
  applyTransform(1, false);
  updateActive();

  /* Botones */
  if (prevButton) prevButton.addEventListener('click', () => go(-1));
  if (nextButton) nextButton.addEventListener('click', () => go(1));

  /* Teclado */
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  });

  /* Arrastre / swipe */
  viewport.addEventListener('pointerdown', (event) => {
    if (animating) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      baseX: lastX,
    };

    track.classList.add('is-dragging');
    viewport.classList.add('is-dragging');
    try {
      viewport.setPointerCapture(event.pointerId);
    } catch (error) {
      /* Sin captura: el gesto sigue funcionando por eventos del viewport */
    }
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const delta = event.clientX - drag.startX;
    track.style.transform = `translate3d(${drag.baseX + delta}px, 0, 0)`;
  });

  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;

    const delta = (event.clientX ?? drag.startX) - drag.startX;
    const { slideWidth } = getMetrics();
    const threshold = Math.min(120, slideWidth * 0.12);

    track.classList.remove('is-dragging');
    viewport.classList.remove('is-dragging');
    try {
      viewport.releasePointerCapture(event.pointerId);
    } catch (error) {
      /* nada */
    }
    drag = null;

    if (delta < -threshold) {
      go(1);
    } else if (delta > threshold) {
      go(-1);
    } else {
      animating = true;
      applyTransform(index, true);
      scheduleFinish();
    }
  };

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  /* Recolocación al cambiar de tamaño o cargar fuentes */
  const relayout = () => {
    resizeFrame = 0;
    if (animating) return;
    applyTransform(index, false);
  };

  const requestRelayout = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(relayout);
  };

  window.addEventListener('resize', requestRelayout);
  window.addEventListener('load', requestRelayout);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestRelayout());
  }

  track.addEventListener('transitionend', (event) => {
    if (event.target === track && event.propertyName === 'transform') finishMove();
  });
}
