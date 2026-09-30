type Pref = 'light' | 'dark' | 'system';

const KEY = 'wdbr-theme';
const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: light)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pref = (): Pref => {
  const p = root.dataset.themePref;
  return p === 'light' || p === 'dark' ? p : 'system';
};
const resolve = (p: Pref) => (p === 'system' ? (media.matches ? 'light' : 'dark') : p);

function apply(p: Pref) {
  const theme = resolve(p);
  root.dataset.themePref = p;
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#eef4f2' : '#041b20');
  document.querySelectorAll<HTMLElement>('[data-theme-set]').forEach((b) => {
    const on = b.dataset.themeSet === p;
    b.setAttribute('aria-checked', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  window.dispatchEvent(new CustomEvent('wdbr:theme', { detail: { theme, pref: p } }));
}

// Wechsel mit Kreis, der sich vom gedrückten Knopf aus öffnet
function choose(p: Pref, origin?: { x: number; y: number }) {
  try {
    localStorage.setItem(KEY, p);
  } catch {
    /* Speicher nicht verfügbar */
  }
  const changes = resolve(p) !== root.dataset.theme;
  if (!changes || reduced || !document.startViewTransition || !origin) {
    apply(p);
    return;
  }
  root.classList.add('theme-vt');
  const vt = document.startViewTransition(() => apply(p));
  vt.ready
    .then(() => {
      const { x, y } = origin;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove('theme-vt'));
}

// Systemeinstellung ändert sich, während "System" gewählt ist
media.addEventListener('change', () => {
  if (pref() === 'system') apply('system');
});

document.querySelectorAll<HTMLElement>('[data-theme-switch]').forEach((group) => {
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-theme-set]')];
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => {
      const r = b.getBoundingClientRect();
      choose(b.dataset.themeSet as Pref, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });
    b.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = buttons[(i + dir + buttons.length) % buttons.length];
      next.focus();
      choose(next.dataset.themeSet as Pref);
    });
  });
});

apply(pref());
