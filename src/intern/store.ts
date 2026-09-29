import type { Store } from './types';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const key = import.meta.env.PUBLIC_SUPABASE_KEY as string | undefined;

export const isConfigured = Boolean(url && key);

let store: Promise<Store> | null = null;

// Lädt die passende Datenquelle erst bei Bedarf, damit die öffentliche
// Seite nichts davon mitschleppt.
export function getStore(): Promise<Store> {
  if (!store) {
    store = isConfigured
      ? import('./supabase').then((m) => m.createSupabaseStore(url!, key!))
      : import('./demo').then((m) => m.createDemoStore());
  }
  return store;
}
