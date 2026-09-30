import type { Store } from './types';
import { site } from '../config/site';

const url = import.meta.env.PUBLIC_SUPABASE_URL || site.supabase.url;
const key = import.meta.env.PUBLIC_SUPABASE_KEY || site.supabase.publishableKey;

// Demo-Modus mit Beispieldaten im Browser: mit PUBLIC_DEMO=true (Tests,
// Vorschau-Builds) oder beim Entwickeln, solange Supabase fehlt.
// Live ohne Supabase schlagen Anfragen sichtbar fehl, statt still im Browser zu landen.
export const demoMode = import.meta.env.PUBLIC_DEMO === 'true' || (!(url && key) && import.meta.env.DEV);
export const isConfigured = Boolean(url && key) && !demoMode;

let store: Promise<Store> | null = null;

// Lädt die passende Datenquelle erst bei Bedarf, damit die öffentliche
// Seite nichts davon mitschleppt.
export function getStore(): Promise<Store> {
  if (!store) {
    store = demoMode
      ? import('./demo').then((m) => m.createDemoStore())
      : isConfigured
        ? import('./supabase').then((m) => m.createSupabaseStore(url!, key!))
        : Promise.reject(new Error('not configured'));
  }
  return store;
}
