import type { NewEnquiry } from '../intern/types';

// Schickt eine Anfrage ab: an einen eigenen Endpunkt, falls eingetragen,
// sonst in den Mitarbeiterbereich (Supabase, im Demo-Modus nur lokal).
export async function sendEnquiry(input: NewEnquiry, endpoint?: string | null) {
  if (endpoint) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(input)) {
      if (value === null || value === undefined) continue;
      fd.append(key, Array.isArray(value) ? value.join(', ') : String(value));
    }
    const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
    if (!res.ok) throw new Error(String(res.status));
    return;
  }
  const { getStore } = await import('../intern/store');
  const store = await getStore();
  await store.createEnquiry(input);
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Spamschutz ohne Drittanbieter: verstecktes Fangfeld plus Mindestzeit.
// Menschen brauchen vom ersten Feld bis zum Absenden mehr als ein paar Sekunden.
const MIN_FILL_MS = 2500;
const startedAt = new WeakMap<HTMLFormElement, number>();

export function watchForm(form: HTMLFormElement) {
  form.addEventListener('focusin', () => {
    if (!startedAt.has(form)) startedAt.set(form, performance.now());
  });
  // Nach dem Zurücksetzen zählt die Zeit neu
  form.addEventListener('reset', () => startedAt.delete(form));
}

export function looksLikeBot(form: HTMLFormElement) {
  const trap = form.elements.namedItem('website') as HTMLInputElement | null;
  if (trap?.value) return true;
  const start = startedAt.get(form);
  return start === undefined || performance.now() - start < MIN_FILL_MS;
}
