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
    linus: 'https://cal.com/linus-asche' as string | null,
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
    // Aufsteller und Sticker
    nfc: [
      { qty: 1, price: 40 },
      { qty: 2, price: 70 },
      { qty: 3, price: 95 },
    ],
    // Tischaufkleber mit NFC: Preis pro Stück, gestaffelt
    tableTags: { first: 25, second: 20, third: 17.5, following: 15, max: 50 },
    // Mega-Bundle (alles inklusive). Der Inhalt pro Stufe steuert
    // die Ersparnis-Anzeige und den Konfigurator. showSaved: Ersparnis
    // anzeigen (beim Kompakt nicht, die kleinere Website ist dort günstiger).
    bundle: {
      tiers: [
        { key: 'kompakt', price: 800, website: 'kompakt', stands: 1, tags: 1, showSaved: false },
        { key: 'komplett', price: 1100, website: 'ausfuehrlich', stands: 2, tags: 25, showSaved: true },
      ],
    },
    // Konfigurator: Richtwert = günstigstes passendes Bundle plus alles,
    // was darüber hinausgeht. Der Mehrumfang wird mit Puffer gerechnet und
    // auf volle 50 € aufgerundet, damit das echte Angebot nicht höher ausfällt.
    configurator: {
      buffer: 0.1,
      roundTo: 50,
      standsBeyondThree: 25, // jeder weitere Aufsteller oder Sticker ab dem vierten
      hostingYear: 100, // jedes weitere Jahr Hosting
    },
    // TODO: Umsatzsteuer-Hinweis. Kleinunternehmer:
    // 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
    taxNote: { de: null as string | null, en: null as string | null },
  },
} as const;

export type Site = typeof site;
