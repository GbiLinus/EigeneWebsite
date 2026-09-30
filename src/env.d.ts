/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_KEY?: string;
  readonly PUBLIC_DEMO?: string;
}

// Apple-Attribut für Passwortregeln (Schlüsselbund schlägt passende Passwörter vor)
declare namespace astroHTML.JSX {
  interface InputHTMLAttributes {
    passwordrules?: string;
  }
}
