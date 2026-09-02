-- STARTUP/AD V1 — un seul vendeur, Adam. Exécuter dans Supabase SQL Editor.
create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'client');
create type public.lead_status as enum ('nouveau', 'a_contacter', 'discussion', 'besoin_compris', 'proposition_envoyee', 'negociation', 'accepte', 'client', 'mission_en_cours', 'attente_retour', 'livraison', 'termine', 'perdu');
create type public.proposal_status as enum ('brouillon', 'envoyee', 'acceptee', 'refusee', 'expiree');
create type public.mission_status as enum ('a_demarrer', 'en_creation', 'version_envoyee', 'retours_demandes', 'modification', 'validation_finale', 'livre', 'termine');
create type public.payment_status as enum ('non_paye', 'en_attente', 'paye', 'echec', 'rembourse');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'client',
  first_name text,
  last_name text,
  startup text,
  email text not null,
  website text,
  linkedin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null,
  description text not null, price_cents integer, price_label text not null default 'Sur devis',
  estimated_delay text, revisions integer, requirements text, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(), title text not null, description text not null,
  media_path text, media_type text, ad_type text, context text, year integer,
  project_kind text not null check (project_kind in ('client_reel','projet_personnel','concept')),
  link_url text, active boolean not null default true, created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(), client_id uuid references public.profiles(id) on delete set null,
  first_name text not null, last_name text, startup text not null, email text not null,
  phone text, website text, linkedin text, startup_description text not null,
  problem_solved text, target_audience text, communication_need text, service_id uuid references public.services(id),
  budget text, desired_deadline text, message text, source text not null default 'site',
  private_notes text, status public.lead_status not null default 'nouveau',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(), lead_id uuid references public.leads(id) on delete set null,
  client_id uuid not null references public.profiles(id) on delete cascade, service_id uuid references public.services(id),
  title text not null, description text not null, deliverables text not null, price_cents integer not null check(price_cents >= 0),
  estimated_delay text, revisions integer, special_terms text, valid_until date,
  status public.proposal_status not null default 'brouillon', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.missions (
  id uuid primary key default gen_random_uuid(), proposal_id uuid unique references public.proposals(id),
  client_id uuid not null references public.profiles(id) on delete cascade, title text not null, brief text not null,
  price_cents integer not null, status public.mission_status not null default 'a_demarrer',
  start_date date, estimated_delivery date, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id) on delete cascade,
  sender_id uuid not null references public.profiles(id), body text not null check(char_length(body) between 1 and 4000),
  read_at timestamptz, created_at timestamptz not null default now()
);

create table public.files (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id) on delete cascade,
  owner_id uuid not null references public.profiles(id), storage_path text unique not null, original_name text not null,
  mime_type text not null, size_bytes bigint not null check(size_bytes between 1 and 52428800),
  kind text not null check(kind in ('brief','source','version','final')), created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id) on delete cascade,
  client_id uuid not null references public.profiles(id), amount_cents integer not null check(amount_cents >= 0), currency text not null default 'eur',
  stripe_checkout_session_id text unique, stripe_payment_intent_id text,
  status public.payment_status not null default 'non_paye', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id),
  client_id uuid not null references public.profiles(id), document_type text not null check(document_type in ('devis','facture','avoir')),
  sequential_number text unique, storage_path text, issued_at date, created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;

create or replace function public.create_client_profile() returns trigger language plpgsql security definer set search_path=public
as $$ begin insert into public.profiles(id,email,first_name,role) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'first_name',''),'client'); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_client_profile();

revoke update(role) on public.profiles from authenticated;

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.leads enable row level security;
alter table public.proposals enable row level security;
alter table public.missions enable row level security;
alter table public.messages enable row level security;
alter table public.files enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;

create policy "profiles own or admin" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles for update using (id=auth.uid()) with check (id=auth.uid());
create policy "public active services" on public.services for select using (active or public.is_admin());
create policy "admin services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "public active portfolio" on public.portfolio_items for select using (active or public.is_admin());
create policy "admin portfolio" on public.portfolio_items for all using (public.is_admin()) with check (public.is_admin());
create policy "admin leads" on public.leads for all using (public.is_admin()) with check (public.is_admin());
create policy "client own leads" on public.leads for select using (client_id=auth.uid());
create policy "proposal parties" on public.proposals for select using (client_id=auth.uid() or public.is_admin());
create policy "admin proposals" on public.proposals for all using (public.is_admin()) with check (public.is_admin());
create policy "client answer proposal" on public.proposals for update using (client_id=auth.uid()) with check (client_id=auth.uid() and status in ('acceptee','refusee'));
create policy "mission parties" on public.missions for select using (client_id=auth.uid() or public.is_admin());
create policy "admin missions" on public.missions for all using (public.is_admin()) with check (public.is_admin());
create policy "messages parties" on public.messages for select using (public.is_admin() or exists(select 1 from public.missions m where m.id=mission_id and m.client_id=auth.uid()));
create policy "messages insert parties" on public.messages for insert with check (sender_id=auth.uid() and (public.is_admin() or exists(select 1 from public.missions m where m.id=mission_id and m.client_id=auth.uid())));
create policy "files parties" on public.files for select using (public.is_admin() or exists(select 1 from public.missions m where m.id=mission_id and m.client_id=auth.uid()));
create policy "files insert parties" on public.files for insert with check (owner_id=auth.uid() and (public.is_admin() or exists(select 1 from public.missions m where m.id=mission_id and m.client_id=auth.uid())));
create policy "payments parties" on public.payments for select using (client_id=auth.uid() or public.is_admin());
create policy "admin payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "invoices parties" on public.invoices for select using (client_id=auth.uid() or public.is_admin());
create policy "admin invoices" on public.invoices for all using (public.is_admin()) with check (public.is_admin());

create policy "mission storage read" on storage.objects for select using (
  bucket_id='mission-files' and exists(select 1 from public.files f join public.missions m on m.id=f.mission_id where f.storage_path=name and (m.client_id=auth.uid() or public.is_admin()))
);
create policy "mission storage delete admin" on storage.objects for delete using (bucket_id='mission-files' and public.is_admin());

create index idx_leads_status on public.leads(status);
create index idx_leads_client_id on public.leads(client_id);
create index idx_proposals_client_status on public.proposals(client_id,status);
create index idx_missions_client_status on public.missions(client_id,status);
create index idx_messages_mission_created on public.messages(mission_id,created_at);
create index idx_files_mission_id on public.files(mission_id);
create index idx_payments_client_status on public.payments(client_id,status);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('mission-files','mission-files',false,52428800,array['image/png','image/jpeg','image/webp','video/mp4','application/pdf','application/zip'])
on conflict (id) do nothing;

-- Attribution du rôle admin : à exécuter manuellement après création du compte Adam.
-- update public.profiles set role='admin' where email='ADRESSE_EMAIL_ADAM';
