import type { Store } from './types';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const key = import.meta.env.PUBLIC_SUPABASE_KEY as string | undefined;

export const isConfigured = Boolean(url && key);

// Demo-Modus nur beim Entwickeln oder mit PUBLIC_DEMO=true (Vorschau-Builds).
// Live ohne Supabase schlagen Anfragen sichtbar fehl, statt still im Browser zu landen.
export const demoMode = !isConfigured && (import.meta.env.DEV || import.meta.env.PUBLIC_DEMO === 'true');

let store: Promise<Store> | null = null;

// Lädt die passende Datenquelle erst bei Bedarf, damit die öffentliche
// Seite nichts davon mitschleppt.
export function getStore(): Promise<Store> {
  if (!store) {
    store = isConfigured
      ? import('./supabase').then((m) => m.createSupabaseStore(url!, key!))
      : demoMode
        ? import('./demo').then((m) => m.createDemoStore())
        : Promise.reject(new Error('not configured'));
  }
  return store;
}
