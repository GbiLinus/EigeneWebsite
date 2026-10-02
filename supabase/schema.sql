-- WebDesignBR: Datenbank für den Mitarbeiterbereich
-- Einmal im Supabase-Dashboard unter "SQL Editor" ausführen.
-- Voraussetzung: Region Frankfurt (eu-central-1), unter Authentication
-- "Allow new users to sign up" ausschalten.

-- Mitarbeiter: verknüpft Supabase-Login mit Namen
create table public.staff (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  initials text not null
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  business text not null check (char_length(business) between 1 and 200),
  contact_name text check (char_length(contact_name) <= 200),
  email text check (char_length(email) <= 320),
  phone text check (char_length(phone) <= 60),
  address text check (char_length(address) <= 500),
  services text[] not null default '{}',
  hosting_until date,
  notes text check (char_length(notes) <= 10000),
  assignee uuid references public.staff (id) on delete set null
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  business text check (char_length(business) <= 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (char_length(phone) <= 60),
  message text not null check (char_length(message) between 1 and 5000),
  interests text[] not null default '{}',
  lang text not null default 'de' check (lang in ('de', 'en')),
  status text not null default 'neu' check (status in ('neu', 'in_arbeit', 'erledigt')),
  assignee uuid references public.staff (id) on delete set null,
  notes text check (char_length(notes) <= 10000),
  customer_id uuid references public.customers (id) on delete set null
);

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index customers_hosting_until_idx on public.customers (hosting_until);

-- Nur eingetragene Mitarbeiter
create function public.is_staff() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.staff where id = auth.uid()) $$;

alter table public.staff enable row level security;
alter table public.customers enable row level security;
alter table public.enquiries enable row level security;

-- Zugriffsrechte ausdrücklich setzen (neue Projekte vergeben sie nicht
-- immer automatisch). Was davon erlaubt ist, regeln die Policies unten.
grant usage on schema public to anon, authenticated;
grant select on public.staff to authenticated;
grant select, insert, update, delete on public.customers, public.enquiries to authenticated;
grant insert on public.enquiries to anon;
grant execute on function public.is_staff() to authenticated;

create policy "staff read staff" on public.staff
  for select to authenticated using (public.is_staff());

create policy "staff manage customers" on public.customers
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff manage enquiries" on public.enquiries
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Das Kontaktformular darf nur neue Anfragen anlegen, nichts lesen
create policy "website creates enquiries" on public.enquiries
  for insert to anon
  with check (status = 'neu' and assignee is null and notes is null and customer_id is null);

-- updated_at automatisch setzen
create function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

create trigger customers_touch before update on public.customers
  for each row execute function public.touch_updated_at();

-- Nach dem Anlegen der beiden Logins unter Authentication > Users
-- die E-Mail-Adressen eintragen und nur diesen Befehl ausführen:
-- insert into public.staff (id, name, initials)
-- select id, 'Linus Asche', 'LA' from auth.users where email = 'linus@beispiel.de'
-- union all
-- select id, 'Kristian Wachholz', 'KW' from auth.users where email = 'kristian@beispiel.de';

-- ------------------------------------------------------------------
-- Spam-Bremse (kann auch nachträglich einzeln ausgeführt werden)
-- Höchstens 3 Anfragen pro E-Mail-Adresse in 10 Minuten und
-- höchstens 30 Anfragen insgesamt in 10 Minuten.
-- ------------------------------------------------------------------
create or replace function public.limit_enquiries() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if (select count(*) from public.enquiries
      where lower(email) = lower(new.email) and created_at > now() - interval '10 minutes') >= 3
     or (select count(*) from public.enquiries
      where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'too many enquiries' using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists enquiries_limit on public.enquiries;
create trigger enquiries_limit before insert on public.enquiries
  for each row execute function public.limit_enquiries();

-- ------------------------------------------------------------------
-- E-Mail an uns bei jeder neuen Anfrage (über Resend)
-- Kann auch nachträglich einzeln ausgeführt werden. Vorher einmal den
-- Resend-Schlüssel im Tresor ablegen (Schlüssel nur hier eintragen,
-- nie in Code, Chat oder E-Mail):
--   select vault.create_secret('re_...', 'resend_api_key');
-- Ohne Schlüssel wird keine Mail verschickt, das Formular funktioniert trotzdem.
-- ------------------------------------------------------------------
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_enquiry() returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  -- Ohne eigene Domain stellt Resend nur an die Adresse des Resend-Kontos zu.
  -- Mit verifizierter Domain: Absender auf die Domain ändern und Kristian ergänzen.
  sender constant text := 'WebDesignBR Website <onboarding@resend.dev>';
  recipients constant text[] := array['linus.webdesignbr@gmail.com'];
  api_key text;
  topics text;
  who text;
begin
  select decrypted_secret into api_key
    from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  if coalesce(api_key, '') = '' then
    return new;
  end if;

  select string_agg(case i
      when 'website' then 'Website'
      when 'nfc' then 'NFC-Aufsteller'
      when 'hosting' then 'Hosting'
      when 'bundle' then 'Mega-Bundle'
      else i end, ', ')
    into topics from unnest(new.interests) as i;

  -- Zeilenumbrüche aus dem Betreff halten
  who := regexp_replace(new.name || coalesce(' (' || nullif(new.business, '') || ')', ''), '\s+', ' ', 'g');

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || api_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', sender,
      'to', to_jsonb(recipients),
      'subject', left('Neue Anfrage: ' || who, 200),
      'text', concat_ws(E'\n',
        'Neue Anfrage über die Website',
        '',
        'Name: ' || new.name,
        'Betrieb: ' || coalesce(nullif(new.business, ''), '–'),
        'E-Mail: ' || new.email,
        'Telefon: ' || coalesce(nullif(new.phone, ''), '–'),
        'Interesse: ' || coalesce(topics, '–'),
        'Sprache: ' || case new.lang when 'en' then 'Englisch' else 'Deutsch' end,
        '',
        'Nachricht:',
        new.message,
        '',
        'Antworten: einfach auf diese E-Mail antworten, die Antwort geht an ' || new.email || '.'
      )
    ) || case
      -- Antwort-Adresse nur, wenn sie wie eine E-Mail aussieht, sonst lehnt Resend ab
      when new.email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then jsonb_build_object('reply_to', new.email)
      else '{}'::jsonb
    end,
    timeout_milliseconds := 5000
  );
  return new;
exception when others then
  -- Die Benachrichtigung darf das Speichern der Anfrage nie verhindern
  raise warning 'notify_new_enquiry: %', sqlerrm;
  return new;
end $$;

drop trigger if exists enquiries_notify on public.enquiries;
create trigger enquiries_notify after insert on public.enquiries
  for each row execute function public.notify_new_enquiry();
