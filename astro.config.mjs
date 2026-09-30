// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { site } from './src/config/site.ts';

// Warnung beim Bauen: im Demo-Modus oder ohne Supabase gehen Anfragen live nicht raus
const env = loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', process.cwd(), '');
const hasSupabase = (env.PUBLIC_SUPABASE_URL || site.supabase.url) && (env.PUBLIC_SUPABASE_KEY || site.supabase.publishableKey);
if (process.argv.includes('build') && (env.PUBLIC_DEMO === 'true' || !hasSupabase)) {
  console.warn(
    env.PUBLIC_DEMO === 'true'
      ? '\n[WebDesignBR] Vorschau-Build im Demo-Modus: Anfragen landen nur im Browser. Nicht live stellen.\n'
      : '\n[WebDesignBR] Supabase fehlt: Kontaktformular und Mitarbeiterbereich funktionieren so nicht.\n',
  );
}

export default defineConfig({
  // TODO: echte Domain eintragen, sobald sie feststeht.
  site: 'https://webdesignbr.de',
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // CSS direkt ins HTML: keine blockierenden Stylesheet-Anfragen
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(intern|anmelden)\//.test(page),
      i18n: { defaultLocale: 'de', locales: { de: 'de-DE', en: 'en-US' } },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
