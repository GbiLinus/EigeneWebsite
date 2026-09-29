import type { Customer, CustomerInput, Service, Staff, Store } from './types';
import { confirmInline, h, icons, openPanel, serviceLabel, svg, toast } from './ui';

const SERVICES: Service[] = ['website', 'nfc', 'hosting'];

interface Options {
  store: Store;
  staff: Staff[];
  customer?: Customer;
  prefill?: Partial<CustomerInput>;
  onSaved: (customer: Customer | null) => void;
}

// Panel zum Anlegen und Bearbeiten eines Kunden
export function openCustomerPanel({ store, staff, customer, prefill, onSaved }: Options) {
  const v: Partial<CustomerInput> = customer ?? prefill ?? {};
  const id = customer?.id ?? 'new';

  const field = (name: keyof CustomerInput, label: string, attrs: Record<string, string> = {}, wide = false) =>
    h(
      'div',
      { class: `f${wide ? ' f-wide' : ''}` },
      h('label', { for: `c-${name}-${id}` }, label),
      h('input', { id: `c-${name}-${id}`, name, value: (v[name] as string | null) ?? '', autocomplete: 'off', ...attrs }),
    );

  const form = h(
    'form',
    { class: 'stack', novalidate: true },
    h(
      'div',
      { class: 'f-grid' },
      field('business', 'Betrieb', { required: 'true' }, true),
      field('contact_name', 'Ansprechpartner'),
      field('phone', 'Telefon', { type: 'tel' }),
      field('email', 'E-Mail', { type: 'email' }, true),
      field('address', 'Ort oder Adresse', {}, true),
    ),
    h(
      'fieldset',
      { class: 'f-set' },
      h('legend', {}, 'Leistungen'),
      h(
        'div',
        { class: 'check-row' },
        SERVICES.map((s) =>
          h('label', { class: 'check' }, h('input', { type: 'checkbox', name: 'services', value: s, checked: v.services?.includes(s) ?? false }), serviceLabel[s]),
        ),
      ),
    ),
    h(
      'div',
      { class: 'f-grid' },
      h('div', { class: 'f' }, h('label', { for: `c-hosting-${id}` }, 'Hosting bezahlt bis'), h('input', { id: `c-hosting-${id}`, name: 'hosting_until', type: 'date', value: v.hosting_until?.slice(0, 10) ?? '' })),
      h(
        'div',
        { class: 'f' },
        h('label', { for: `c-assignee-${id}` }, 'Zuständig'),
        h(
          'select',
          { id: `c-assignee-${id}`, name: 'assignee' },
          h('option', { value: '' }, 'Niemand'),
          staff.map((s) => h('option', { value: s.id, selected: v.assignee === s.id }, s.name)),
        ),
      ),
    ),
    h('div', { class: 'f' }, h('label', { for: `c-notes-${id}` }, 'Notizen'), h('textarea', { id: `c-notes-${id}`, name: 'notes', rows: 4 }, v.notes ?? '')),
    h('p', { class: 'login-error', role: 'alert', style: 'margin:0;color:#ffa99c;font-size:.875rem' }),
    h('div', { class: 'panel-actions' }, h('button', { class: 'btn-s btn-accent', type: 'submit' }, customer ? 'Änderungen speichern' : 'Kunde anlegen')),
  );

  const error = form.querySelector<HTMLElement>('[role="alert"]')!;
  const actions = form.querySelector<HTMLElement>('.panel-actions')!;

  const read = (): CustomerInput => {
    const fd = new FormData(form);
    const s = (k: string) => {
      const val = String(fd.get(k) ?? '').trim();
      return val ? val : null;
    };
    return {
      business: s('business') ?? '',
      contact_name: s('contact_name'),
      email: s('email'),
      phone: s('phone'),
      address: s('address'),
      services: fd.getAll('services') as Service[],
      hosting_until: s('hosting_until'),
      assignee: s('assignee'),
      notes: s('notes'),
    };
  };

  const panel = openPanel(customer ? customer.business : 'Neuer Kunde', form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = read();
    if (!data.business) {
      error.textContent = 'Bitte den Namen des Betriebs eintragen.';
      form.querySelector<HTMLInputElement>('[name="business"]')?.focus();
      return;
    }
    const btn = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    btn.disabled = true;
    try {
      if (customer) {
        await store.updateCustomer(customer.id, data);
        toast('Kunde gespeichert');
        onSaved({ ...customer, ...data });
      } else {
        const created = await store.createCustomer(data);
        toast('Kunde angelegt');
        onSaved(created);
      }
      panel.close();
    } catch {
      error.textContent = 'Nicht gespeichert. Prüft die Verbindung und versucht es noch einmal.';
      btn.disabled = false;
    }
  });

  if (customer) {
    const del = h('button', { class: 'btn-s', type: 'button' }, svg(icons.trash), 'Kunde löschen');
    del.addEventListener('click', () =>
      confirmInline(del, `${customer.business} endgültig löschen?`, async () => {
        try {
          await store.deleteCustomer(customer.id);
          toast('Kunde gelöscht');
          onSaved(null);
          panel.close();
        } catch {
          toast('Nicht gelöscht. Versucht es noch einmal.', 'error');
        }
      }),
    );
    actions.append(del);
  }

  return panel;
}
