// Demo-Modus: läuft komplett im Browser (localStorage), solange kein
// Supabase-Projekt eingetragen ist. Alle Daten hier sind Beispiele.
import type { Customer, Enquiry, Staff, Store } from './types';

export const DEMO_PASSWORD = 'vorschau';

const STAFF: Staff[] = [
  { id: 'linus', name: 'Linus Asche', initials: 'LA' },
  { id: 'kristian', name: 'Kristian Wachholz', initials: 'KW' },
];

const ACCOUNTS: Record<string, string> = {
  'linus@webdesignbr.de': 'linus',
  'kristian@webdesignbr.de': 'kristian',
};

const KEY = 'wdbr-demo-db-v1';
const SESSION_KEY = 'wdbr-demo-session';

interface Db {
  enquiries: Enquiry[];
  customers: Customer[];
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

function seed(): Db {
  const cafe = uid();
  const hotel = uid();
  return {
    enquiries: [
      {
        id: uid(),
        created_at: daysFromNow(-0.1),
        name: 'Beispiel: Anna Meyer',
        business: 'Eiscafé am Kurpark',
        email: 'anna@beispiel.de',
        phone: '05424 000000',
        message: 'Hallo, wir hätten gern zwei NFC-Aufsteller für unsere Tische draußen. Was kostet das mit Lieferung?',
        interests: ['nfc'],
        lang: 'de',
        status: 'neu',
        assignee: null,
        notes: null,
        customer_id: null,
      },
      {
        id: uid(),
        created_at: daysFromNow(-1.4),
        name: 'Beispiel: Tom Becker',
        business: 'Landgasthof Becker',
        email: 'tom@beispiel.de',
        phone: null,
        message: 'Unsere Website ist 12 Jahre alt und auf dem Handy kaum lesbar. Wir brauchen eine neue Seite mit Speisekarte und Öffnungszeiten.',
        interests: ['website', 'hosting'],
        lang: 'de',
        status: 'in_arbeit',
        assignee: 'linus',
        notes: 'Termin vor Ort am Donnerstag vereinbart.',
        customer_id: null,
      },
      {
        id: uid(),
        created_at: daysFromNow(-3),
        name: 'Example: Sarah Collins',
        business: 'Holiday flat Teutoburg',
        email: 'sarah@example.com',
        phone: null,
        message: 'Hi, do you also build small websites in English for holiday rentals?',
        interests: ['website'],
        lang: 'en',
        status: 'neu',
        assignee: 'kristian',
        notes: null,
        customer_id: null,
      },
      {
        id: uid(),
        created_at: daysFromNow(-12),
        name: 'Beispiel: Jonas Wolf',
        business: 'Café Salzblick',
        email: 'jonas@beispiel.de',
        phone: '0151 0000000',
        message: 'Wir möchten mehr Google-Bewertungen. Habt ihr Sticker für die Tür?',
        interests: ['nfc'],
        lang: 'de',
        status: 'erledigt',
        assignee: 'kristian',
        notes: 'Drei Sticker geliefert, Kunde angelegt.',
        customer_id: cafe,
      },
    ],
    customers: [
      {
        id: cafe,
        created_at: daysFromNow(-12),
        updated_at: daysFromNow(-12),
        business: 'Beispiel: Café Salzblick',
        contact_name: 'Jonas Wolf',
        email: 'jonas@beispiel.de',
        phone: '0151 0000000',
        address: 'Bad Rothenfelde',
        services: ['nfc'],
        hosting_until: null,
        notes: '3 Tür-Sticker, bezahlt.',
        assignee: 'kristian',
      },
      {
        id: hotel,
        created_at: daysFromNow(-340),
        updated_at: daysFromNow(-40),
        business: 'Beispiel: Pension Gradierblick',
        contact_name: 'Maria Schulte',
        email: 'maria@beispiel.de',
        phone: '05424 111111',
        address: 'Bad Rothenfelde',
        services: ['website', 'hosting', 'nfc'],
        hosting_until: daysFromNow(18).slice(0, 10),
        notes: 'Zweisprachige Seite. Hosting-Verlängerung ansprechen.',
        assignee: 'linus',
      },
      {
        id: uid(),
        created_at: daysFromNow(-400),
        updated_at: daysFromNow(-400),
        business: 'Beispiel: Friseur Haarmonie',
        contact_name: 'Leonie Brandt',
        email: 'leonie@beispiel.de',
        phone: null,
        address: 'Dissen',
        services: ['website', 'hosting'],
        hosting_until: daysFromNow(-5).slice(0, 10),
        notes: null,
        assignee: 'kristian',
      },
    ],
  };
}

function read(): Db {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Db;
  } catch {
    /* Speicher nicht verfügbar */
  }
  const db = seed();
  write(db);
  return db;
}

function write(db: Db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* Speicher nicht verfügbar */
  }
}

let memorySession: string | null = null;

const getSessionId = () => {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return memorySession;
  }
};

const setSessionId = (id: string | null) => {
  memorySession = id;
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* Speicher nicht verfügbar */
  }
};

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export function createDemoStore(): Store {
  return {
    demo: true,

    async signIn(email, password) {
      await wait(500);
      const id = ACCOUNTS[email.trim().toLowerCase()];
      if (!id || password !== DEMO_PASSWORD) throw new Error('Invalid login credentials');
      setSessionId(id);
    },

    async signOut() {
      setSessionId(null);
    },

    async session() {
      const id = getSessionId();
      const staff = STAFF.find((s) => s.id === id) ?? null;
      if (!staff) return null;
      const email = Object.entries(ACCOUNTS).find(([, v]) => v === id)?.[0] ?? '';
      return { email, staff };
    },

    async updatePassword() {
      await wait(500);
      throw new Error('Im Demo-Modus lässt sich das Passwort nicht ändern.');
    },

    async requestPasswordReset() {
      await wait(500);
    },

    async staff() {
      return STAFF;
    },

    async enquiries() {
      await wait();
      return [...read().enquiries].sort((a, b) => b.created_at.localeCompare(a.created_at));
    },

    async createEnquiry(input) {
      const db = read();
      db.enquiries.push({
        ...input,
        id: uid(),
        created_at: new Date().toISOString(),
        status: 'neu',
        assignee: null,
        notes: null,
        customer_id: null,
      });
      write(db);
    },

    async updateEnquiry(id, patch) {
      const db = read();
      db.enquiries = db.enquiries.map((e) => (e.id === id ? { ...e, ...patch } : e));
      write(db);
    },

    async deleteEnquiry(id) {
      const db = read();
      db.enquiries = db.enquiries.filter((e) => e.id !== id);
      write(db);
    },

    async customers() {
      await wait();
      return [...read().customers].sort((a, b) => a.business.localeCompare(b.business, 'de'));
    },

    async createCustomer(input) {
      const db = read();
      const now = new Date().toISOString();
      const customer: Customer = { ...input, id: uid(), created_at: now, updated_at: now };
      db.customers.push(customer);
      write(db);
      return customer;
    },

    async updateCustomer(id, patch) {
      const db = read();
      db.customers = db.customers.map((c) => (c.id === id ? { ...c, ...patch, updated_at: new Date().toISOString() } : c));
      write(db);
    },

    async deleteCustomer(id) {
      const db = read();
      db.customers = db.customers.filter((c) => c.id !== id);
      db.enquiries = db.enquiries.map((e) => (e.customer_id === id ? { ...e, customer_id: null } : e));
      write(db);
    },
  };
}
