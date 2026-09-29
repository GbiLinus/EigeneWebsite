import type { Interest, Service, Staff, Status } from './types';

// Kleiner DOM-Baukasten. Inhalte immer als Textknoten, nie als HTML,
// denn Anfragen kommen von außen.
type Child = Node | string | number | null | undefined | false | Child[];
type Attrs = Record<string, string | number | boolean | null | undefined | EventListener>;

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  append(el, children);
  return el;
}

function append(el: Element, children: Child[]) {
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else el.append(c instanceof Node ? c : String(c));
  }
}

export const svg = (path: string, cls = 'icon') => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('class', cls);
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.8');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', path);
  s.append(p);
  return s;
};

export const icons = {
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  phone: 'M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
};

export const serviceLabel: Record<Service, string> = {
  website: 'Website',
  nfc: 'NFC-Aufsteller',
  hosting: 'Hosting',
};

export const interestLabel: Record<Interest, string> = {
  ...serviceLabel,
  bundle: 'Mega-Bundle',
};

export const statusLabel: Record<Status, string> = {
  neu: 'Neu',
  in_arbeit: 'In Arbeit',
  erledigt: 'Erledigt',
};

const dateFmt = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });

export function formatDate(iso: string | null) {
  if (!iso) return '';
  return dateFmt.format(new Date(iso));
}

// "vor 2 Std.", "gestern", sonst Datum
export function relativeTime(iso: string) {
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'gerade eben';
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) return `heute, ${timeFmt.format(date)}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `gestern, ${timeFmt.format(date)}`;
  return dateFmt.format(date);
}

// Tage bis zu einem Datum (negativ = vorbei)
export function daysUntil(isoDate: string) {
  const end = new Date(`${isoDate.slice(0, 10)}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - now.getTime()) / 86400000);
}

export function hostingState(isoDate: string | null): 'ok' | 'soon' | 'over' | null {
  if (!isoDate) return null;
  const d = daysUntil(isoDate);
  if (d < 0) return 'over';
  if (d <= 30) return 'soon';
  return 'ok';
}

export function avatar(staff: Staff | undefined, size: 'sm' | 'md' = 'sm') {
  if (!staff) return h('span', { class: `avatar avatar-${size} avatar-none`, title: 'Niemand zugewiesen' }, '–');
  return h('span', { class: `avatar avatar-${size}`, 'data-tone': staff.id === 'kristian' || staff.initials === 'KW' ? 'abend' : 'sole', title: staff.name }, staff.initials);
}

// Kurze Rückmeldung unten am Bildschirm
export function toast(message: string, tone: 'ok' | 'error' = 'ok') {
  // Bei offenem Panel dort anzeigen, sonst liegt die Meldung unter dem Panel
  const host = document.querySelector('dialog[open]') ?? document.body;
  let region = host.querySelector<HTMLElement>(':scope > .toast-region');
  if (!region) {
    region = h('div', { class: 'toast-region', role: 'status', 'aria-live': 'polite' });
    host.append(region);
  }
  const t = h('p', { class: `toast toast-${tone}` }, message);
  region.append(t);
  setTimeout(() => t.classList.add('is-out'), 2600);
  setTimeout(() => t.remove(), 3100);
}

// Seitenpanel auf Basis von <dialog>: Fokus bleibt im Panel, Esc schließt.
export function openPanel(title: string, body: Node, opts: { onClose?: () => void } = {}) {
  const close = () => dialog.close();
  const dialog = h(
    'dialog',
    { class: 'panel', 'aria-label': title },
    h(
      'div',
      { class: 'panel-inner' },
      h('header', { class: 'panel-head' }, h('h2', { class: 'panel-title' }, title), h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Schließen', onclick: close }, svg(icons.close))),
      h('div', { class: 'panel-body' }, body),
    ),
  );
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener('close', () => {
    opts.onClose?.();
    setTimeout(() => dialog.remove(), 300);
  });
  document.body.append(dialog);
  dialog.showModal();
  return { dialog, close };
}

// Bestätigung im Panel statt confirm()
export function confirmInline(button: HTMLButtonElement, question: string, onConfirm: () => void) {
  const box = h(
    'div',
    { class: 'confirm', role: 'group', 'aria-label': question },
    h('p', {}, question),
    h(
      'div',
      { class: 'confirm-actions' },
      h('button', { class: 'btn-s btn-danger', type: 'button', onclick: () => onConfirm() }, 'Ja, löschen'),
      h('button', { class: 'btn-s', type: 'button', onclick: () => box.replaceWith(button) }, 'Abbrechen'),
    ),
  );
  button.replaceWith(box);
  box.querySelector<HTMLButtonElement>('.btn-danger')?.focus();
}

export const urls = () => {
  const d = document.body.dataset;
  return {
    login: d.urlLogin ?? '/anmelden/',
    home: d.urlHome ?? '/intern/',
    enquiries: d.urlEnquiries ?? '/intern/anfragen/',
    customers: d.urlCustomers ?? '/intern/kunden/',
    password: d.urlPassword ?? '/intern/passwort/',
  };
};
