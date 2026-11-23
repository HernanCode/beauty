import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const headerOffset = () => {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
  return parseFloat(value) || 86;
};

const initSmoothScroll = () => {
  const lenis = new Lenis({ lerp: 0.1 });
  window.__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
};

const initAnchors = (lenis) => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: -headerOffset(), force: true });
      } else {
        target.scrollIntoView({ block: 'start' });
      }
    });
  });
};

const initReveals = () => {
  const heroLines = gsap.utils.toArray('.hero .line');
  if (heroLines.length) {
    // y: 0 limpia el translateY(105%) que viene del CSS (GSAP lo lee en px).
    gsap.set(heroLines, { yPercent: 105, y: 0 });
    gsap.to(heroLines, {
      yPercent: 0,
      y: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.1,
    });
  }

  gsap.utils.toArray('[data-reveal-block]').forEach((block) => {
    const lines = block.querySelectorAll('.line');
    if (!lines.length) return;

    gsap.fromTo(
      lines,
      { yPercent: 105, y: 0 },
      {
        yPercent: 0,
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          once: true,
        },
      },
    );
  });

  gsap.utils.toArray('[data-reveal-media]').forEach((media) => {
    const image = media.querySelector('img');
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: media,
        start: 'top 88%',
        once: true,
      },
    });

    timeline.fromTo(
      media,
      { clipPath: 'inset(8% 8% 8% 8%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out' },
      0,
    );

    if (image) {
      timeline.fromTo(
        image,
        { scale: 1.15 },
        { scale: 1, duration: 1.2, ease: 'expo.out' },
        0,
      );
    }
  });
};

const initParallax = () => {
  gsap.utils.toArray('[data-parallax]').forEach((element) => {
    const section = element.closest('section') || element;
    gsap.fromTo(
      element,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
};

const initHeroExit = () => {
  const hero = document.querySelector('.hero');
  const media = document.querySelector('.hero-media-inner');
  const content = document.querySelectorAll('.hero-content, .hero-paragraph, .rating-widget');
  if (!hero) return;

  const trigger = {
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  };

  if (media) {
    gsap.to(media, { scale: 1.08, ease: 'none', scrollTrigger: trigger });
  }

  if (content.length) {
    gsap.to(content, { opacity: 0, y: -40, ease: 'none', scrollTrigger: trigger });
  }
};

export function initMotion() {
  const prefersReduced = window.matchMedia(REDUCED_QUERY).matches;
  let lenis = null;

  if (!prefersReduced) {
    lenis = initSmoothScroll();
  }

  initAnchors(lenis);

  if (prefersReduced) return;

  initReveals();
  initParallax();
  initHeroExit();

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
