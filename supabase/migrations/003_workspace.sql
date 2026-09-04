-- Après 001 et 002. Ajouts sans suppression de données ni désactivation de RLS.
begin;
alter table public.missions add column if not exists lead_id uuid references public.leads(id) on delete set null;
alter table public.missions add column if not exists workflow_stage text not null default 'discussion'
  check (workflow_stage in ('discussion','proposition','acceptee'));
alter table public.proposals add column if not exists mission_id uuid references public.missions(id);
alter table public.proposals add column if not exists deposit_cents integer not null default 0
  check (deposit_cents >= 0 and deposit_cents <= price_cents);
update public.proposals p set mission_id=m.id from public.missions m
  where m.proposal_id=p.id and p.mission_id is null;
update public.missions set workflow_stage='acceptee' where proposal_id is not null;
create index if not exists idx_proposals_mission on public.proposals(mission_id);
-- Un brouillon n'est pas une proposition envoyée au client.
drop policy if exists "proposal parties" on public.proposals;
create policy "proposal parties" on public.proposals for select
  using ((client_id=auth.uid() and status<>'brouillon') or public.is_admin());

create or replace function public.workspace_request(p_title text,p_startup text,p_brief text,p_need text)
returns uuid language plpgsql security definer set search_path='' as $$
declare u public.profiles; lid uuid; mid uuid;
begin
  select * into u from public.profiles where id=auth.uid();
  if u.id is null or u.role <> 'client' then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_title is null or length(trim(p_title)) not between 1 and 120
    or p_startup is null or length(trim(p_startup)) not between 1 and 120
    or p_brief is null or length(trim(p_brief)) not between 1 and 3000
    or p_need is null or length(trim(p_need)) not between 1 and 1600 then
    raise exception 'Invalid input' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(u.id::text,0));
  if (select count(*) from public.missions where client_id=u.id and created_at>now()-interval '1 day')>=5 then
    raise exception 'Request limit' using errcode='22023'; end if;
  insert into public.leads(client_id,first_name,startup,email,startup_description,communication_need,source)
    values(u.id,coalesce(u.first_name,''),trim(p_startup),u.email,trim(p_brief),trim(p_need),'espace_client') returning id into lid;
  insert into public.missions(client_id,lead_id,title,brief,price_cents)
    values(u.id,lid,trim(p_title),trim(p_brief)||E'\n\nBesoin : '||trim(p_need),0) returning id into mid;
  return mid;
end; $$;

create or replace function public.workspace_propose(p_mission uuid,p_title text,p_description text,p_deliverables text,
 p_price integer,p_deposit integer,p_revisions integer,p_delay text,p_terms text,p_valid_until date)
returns uuid language plpgsql security definer set search_path='' as $$
declare m public.missions; pid uuid;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into m from public.missions where id=p_mission for update;
  if m.id is null or m.proposal_id is not null then raise exception 'Invalid mission' using errcode='22023'; end if;
  if p_title is null or length(trim(p_title)) not between 1 and 120
    or p_description is null or length(trim(p_description)) not between 1 and 3000
    or p_deliverables is null or length(trim(p_deliverables)) not between 1 and 3000
    or p_price is null or p_price not between 1 and 10000000
    or p_deposit is null or p_deposit not between 0 and p_price
    or p_revisions is null or p_revisions not between 0 and 50
    or p_delay is null or length(trim(p_delay)) not between 1 and 120
    or p_terms is null or length(p_terms)>4000
    or p_valid_until is null or p_valid_until<current_date then raise exception 'Invalid input' using errcode='22023'; end if;
  update public.proposals set status='expiree',updated_at=now() where mission_id=m.id and status='envoyee';
  insert into public.proposals(mission_id,lead_id,client_id,title,description,deliverables,price_cents,deposit_cents,revisions,estimated_delay,special_terms,valid_until,status)
    values(m.id,m.lead_id,m.client_id,trim(p_title),trim(p_description),trim(p_deliverables),p_price,p_deposit,p_revisions,trim(p_delay),p_terms,p_valid_until,'envoyee') returning id into pid;
  update public.missions set workflow_stage='proposition',updated_at=now() where id=m.id;
  insert into public.messages(mission_id,sender_id,body) values(m.id,auth.uid(),'Je vous ai envoyé une proposition. Vous pouvez la consulter dans ce dossier.');
  return pid;
end; $$;

create or replace function public.workspace_answer(p_mission uuid,p_proposal uuid,p_answer text,p_note text)
returns uuid language plpgsql security definer set search_path='' as $$
declare m public.missions; p public.proposals;
begin
  if auth.uid() is null then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into m from public.missions where id=p_mission for update;
  if m.id is null or m.client_id<>auth.uid() or public.is_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into p from public.proposals where id=p_proposal and mission_id=m.id and client_id=auth.uid() for update;
  if p.id is null then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_answer='accepter' and p.status='acceptee' and m.proposal_id=p.id then return m.id; end if;
  if p_answer is null or p_answer not in ('accepter','refuser','modifier') or p_note is null or length(p_note)>2000
    or (p_answer='modifier' and length(trim(p_note))=0) or p.status<>'envoyee'
    or p.valid_until<current_date or m.proposal_id is not null then raise exception 'Invalid answer' using errcode='22023'; end if;
  update public.proposals set status=case when p_answer='accepter' then 'acceptee'::public.proposal_status else 'refusee'::public.proposal_status end,updated_at=now() where id=p.id;
  if p_answer='accepter' then
    update public.missions set proposal_id=p.id,price_cents=p.price_cents,workflow_stage='acceptee',updated_at=now() where id=m.id;
  else update public.missions set workflow_stage='discussion',updated_at=now() where id=m.id; end if;
  insert into public.messages(mission_id,sender_id,body) values(m.id,auth.uid(),
    case p_answer when 'accepter' then 'Proposition acceptée.' when 'refuser' then 'Proposition refusée.' else 'Modification de la proposition demandée.' end || E'\n' || p_note);
  return m.id;
end; $$;

revoke all on function public.workspace_request(text,text,text,text) from public,anon;
revoke all on function public.workspace_propose(uuid,text,text,text,integer,integer,integer,text,text,date) from public,anon;
revoke all on function public.workspace_answer(uuid,uuid,text,text) from public,anon;
grant execute on function public.workspace_request(text,text,text,text) to authenticated;
grant execute on function public.workspace_propose(uuid,text,text,text,integer,integer,integer,text,text,date) to authenticated;
grant execute on function public.workspace_answer(uuid,uuid,text,text) to authenticated;
commit;
