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
-- die IDs hier eintragen und ausführen:
-- insert into public.staff (id, name, initials) values
--   ('<uuid von Linus>', 'Linus Asche', 'LA'),
--   ('<uuid von Kristian>', 'Kristian Wachholz', 'KW');
