// Zentrale Firmendaten. Felder mit `null` sind noch offen und werden
// auf der Seite ausgeblendet, bis sie hier eingetragen sind.

export const site = {
  name: 'WebDesignBR',
  // TODO: echte Domain eintragen (auch in astro.config.mjs).
  url: 'https://webdesignbr.de',

  location: {
    town: 'Bad Rothenfelde',
    region: 'Osnabrücker Land',
    lat: 52.11167,
    lng: 8.16056,
    coords: '52°06′42″ N, 8°09′38″ E',
  },

  contact: {
    email: null as string | null, // z.B. 'info@webdesignbr.de'
    phone: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
    // Ziel-URL für das Kontaktformular (z.B. Serverless-Funktion).
    // Solange null, zeigt das Formular einen Vorschau-Hinweis und sendet nichts.
    formEndpoint: null as string | null,
  },

  // Cal.com-Buchungslinks, z.B. 'https://cal.com/linus-webdesignbr'.
  // Solange null, erscheint auf der Website kein "Termin buchen".
  booking: {
    linus: null as string | null,
    kristian: null as string | null,
  },

  // Angaben für das Impressum.
  company: {
    owner: null as string | null, // z.B. 'Linus Asche'
    legalForm: null as string | null, // z.B. 'Einzelunternehmen' oder 'GbR'
    street: null as string | null,
    zip: null as string | null,
    city: 'Bad Rothenfelde',
    vatId: null as string | null,
  },

  pricing: {
    website: { from: 250, to: 750 },
    hosting: { from: 50, to: 100 },
    nfc: [
      { qty: 1, price: 40 },
      { qty: 2, price: 70 },
      { qty: 3, price: 95 },
    ],
    // TODO: Umsatzsteuer-Hinweis. Kleinunternehmer:
    // 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
    taxNote: { de: null as string | null, en: null as string | null },
  },
} as const;

export type Site = typeof site;
