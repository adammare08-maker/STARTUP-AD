-- Correctif V1 à exécuter après 001. Ne désactive jamais RLS.
begin;

-- Une révocation de colonne ne neutralise pas un droit UPDATE sur la table.
revoke update on public.profiles from public, anon, authenticated;
revoke update (id, role, email, created_at, updated_at) on public.profiles from public, anon, authenticated;
grant update (first_name, last_name, startup, website, linkedin) on public.profiles to authenticated;

-- Le rôle ne peut être modifié que via SQL administrateur, jamais via l'API.
create or replace function public.guard_profile_role() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.role is distinct from old.role and
     (current_user in ('anon', 'authenticated') or auth.uid() is not null) then
    raise exception 'Role changes require database administration' using errcode = '42501';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role before update on public.profiles
for each row execute function public.guard_profile_role();

-- Les notes commerciales sont privées : aucun SELECT client sur leads.
drop policy if exists "client own leads" on public.leads;

-- La politique V1 permettait aussi de modifier le prix d'une proposition.
-- Refuser l'écriture directe jusqu'à l'implémentation d'une acceptation encadrée.
drop policy if exists "client answer proposal" on public.proposals;

-- Empêcher un client de rattacher le chemin privé d'un autre fichier à sa mission.
drop policy if exists "files insert parties" on public.files;
drop policy if exists "files insert admin" on public.files;
create policy "files insert admin" on public.files for insert to authenticated
with check (public.is_admin() and owner_id=auth.uid());

update storage.buckets set public=false where id='mission-files';
commit;
