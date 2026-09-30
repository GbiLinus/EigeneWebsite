// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// Warnung beim Bauen: ohne Supabase gehen Anfragen live nicht raus
const env = loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', process.cwd(), '');
if (process.argv.includes('build') && !(env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_KEY)) {
  console.warn(
    env.PUBLIC_DEMO === 'true'
      ? '\n[WebDesignBR] Vorschau-Build im Demo-Modus: Anfragen landen nur im Browser. Nicht live stellen.\n'
      : '\n[WebDesignBR] PUBLIC_SUPABASE_URL/PUBLIC_SUPABASE_KEY fehlen: Kontaktformular und Mitarbeiterbereich funktionieren so nicht.\n',
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
