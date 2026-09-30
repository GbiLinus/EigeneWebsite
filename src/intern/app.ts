import { getStore } from './store';
import type { Session, Store } from './types';
import { avatar, urls } from './ui';

export interface Ctx {
  store: Store;
  session: Session;
}

let ctx: Promise<Ctx> | null = null;

// Prüft einmal pro Seite, ob jemand angemeldet ist. Ohne Anmeldung
// geht es zur Login-Seite, danach zurück hierher.
export function ready(): Promise<Ctx> {
  if (ctx) return ctx;
  ctx = (async () => {
    const u = urls();
    const store = await getStore().catch(() => null);
    // Nicht eingerichtet: die Login-Seite erklärt, was fehlt
    if (!store) {
      location.replace(u.login);
      return new Promise<Ctx>(() => {});
    }
    const session = await store.session();
    if (!session) {
      const next = encodeURIComponent(location.pathname);
      location.replace(`${u.login}?weiter=${next}`);
      return new Promise<Ctx>(() => {});
    }

    document.body.classList.add('is-ready');
    if (store.demo) document.body.classList.add('is-demo');

    if (!session.staff) {
      document.querySelector('[data-no-access]')?.removeAttribute('hidden');
      document.querySelector('[data-app]')?.setAttribute('hidden', '');
    }

    document.querySelectorAll<HTMLElement>('[data-me]').forEach((el) => {
      el.replaceChildren(avatar(session.staff ?? undefined, 'md'), document.createTextNode(session.staff?.name.split(' ')[0] ?? session.email));
    });

    document.querySelectorAll<HTMLButtonElement>('[data-logout]').forEach((btn) =>
      btn.addEventListener('click', async () => {
        await store.signOut();
        location.assign(u.login);
      }),
    );

    return { store, session };
  })();
  return ctx;
}

// Anzahl neuer Anfragen in Navigation und Tab-Titel
export function setNewCount(n: number) {
  document.querySelectorAll<HTMLElement>('[data-new-count]').forEach((el) => {
    el.textContent = n > 0 ? String(n) : '';
    el.hidden = n === 0;
  });
  const base = document.title.replace(/^\(\d+\)\s*/, '');
  document.title = n > 0 ? `(${n}) ${base}` : base;
}
