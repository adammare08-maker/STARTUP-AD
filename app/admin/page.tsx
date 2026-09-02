import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';
import { requireRole } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tableau de bord Adam — STARTUP/AD', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const auth = await requireRole('admin');
  if (auth.state === 'anonymous') redirect('/connexion');
  if (auth.state === 'forbidden') redirect('/client');
  if (auth.state !== 'ready') return <main className="portal-shell"><a className="brand" href="/">STARTUP<span>/</span>AD</a><div className="setup-notice"><h1>Espace Adam non activé</h1><p>Configurez Supabase, exécutez la migration, créez votre compte puis attribuez-lui manuellement le rôle admin.</p></div></main>;
  const [{ data: leads }, { data: missions }, { data: proposals }] = await Promise.all([
    auth.supabase.from('leads').select('id,startup,first_name,status,created_at').order('created_at', { ascending: false }).limit(8),
    auth.supabase.from('missions').select('id,title,status,estimated_delivery').neq('status', 'termine').limit(8),
    auth.supabase.from('proposals').select('id,title,status,price_cents,created_at').order('created_at', { ascending: false }).limit(8),
  ]);
  return <main className="dashboard"><header><a className="brand" href="/">STARTUP<span>/</span>AD</a><div><b>Adam</b><LogoutButton /></div></header><section className="dashboard-head"><p className="section-index">ESPACE ADAM · VENDEUR UNIQUE</p><h1>Qu’est-ce que je dois faire aujourd’hui ?</h1></section><div className="dashboard-grid"><section><h2>Prospects récents</h2>{leads?.length ? leads.map((lead) => <article key={lead.id}><b>{lead.startup}</b><span>{lead.first_name} · {lead.status}</span></article>) : <p>Aucun prospect pour le moment.</p>}</section><section><h2>Missions en cours</h2>{missions?.length ? missions.map((mission) => <article key={mission.id}><b>{mission.title}</b><span>{mission.status} · {mission.estimated_delivery || 'Délai à définir'}</span></article>) : <p>Aucune mission en cours.</p>}</section><section><h2>Propositions</h2>{proposals?.length ? proposals.map((proposal) => <article key={proposal.id}><b>{proposal.title}</b><span>{proposal.status} · {(proposal.price_cents / 100).toLocaleString('fr-FR')} €</span></article>) : <p>Aucune proposition créée.</p>}</section></div></main>;
}
