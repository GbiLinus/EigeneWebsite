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
