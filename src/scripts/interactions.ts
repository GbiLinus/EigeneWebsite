import { gsap, finePointer, reduced } from './motion';

// Glanzpunkt auf Glasflächen folgt dem Zeiger.
if (finePointer) {
  let current: HTMLElement | null = null;
  document.addEventListener(
    'pointermove',
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-spec]') ?? null;
      if (el !== current) {
        current?.style.setProperty('--spec', '0');
        current = el;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      el.style.setProperty('--spec', '1');
    },
    { passive: true },
  );
}

// Magnetische Buttons.
if (finePointer && !reduced) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.36);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// Gewählte Sprache merken.
document.querySelectorAll<HTMLAnchorElement>('[data-lang-link]').forEach((a) => {
  a.addEventListener('click', () => {
    try {
      localStorage.setItem('wdbr-lang', a.dataset.langLink ?? '');
    } catch {
      /* Speicher nicht verfügbar */
    }
  });
});
