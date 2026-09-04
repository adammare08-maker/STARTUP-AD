begin;
create table if not exists public.integration_credentials (
  name text primary key check (name in ('gmail_sender')),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  encrypted_secret text not null,
  iv text not null,
  updated_at timestamptz not null default now()
);
alter table public.integration_credentials enable row level security;
revoke all on table public.integration_credentials from public, anon, authenticated;
commit;
