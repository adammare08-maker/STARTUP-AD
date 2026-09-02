import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';
import { requireRole } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Espace client — STARTUP/AD', robots: { index: false, follow: false } };
export default async function ClientPage() {
  const auth = await requireRole('client');
  if (auth.state === 'anonymous') redirect('/connexion');
  if (auth.state !== 'ready') return <main className="portal-shell"><a className="brand" href="/">STARTUP<span>/</span>AD</a><div className="setup-notice"><h1>Espace client bientôt disponible</h1><p>L’authentification sécurisée doit encore être reliée au projet Supabase de STARTUP/AD.</p></div></main>;
  const [{ data: proposals }, { data: missions }, { data: payments }] = await Promise.all([
    auth.supabase.from('proposals').select('*').eq('client_id', auth.user.id).order('created_at', { ascending: false }),
    auth.supabase.from('missions').select('*').eq('client_id', auth.user.id).order('created_at', { ascending: false }),
    auth.supabase.from('payments').select('*').eq('client_id', auth.user.id).order('created_at', { ascending: false }),
  ]);
  return <main className="dashboard"><header><a className="brand" href="/">STARTUP<span>/</span>AD</a><div><b>{auth.profile.first_name || auth.user.email}</b><LogoutButton /></div></header><section className="dashboard-head"><p className="section-index">ESPACE CLIENT</p><h1>Votre projet avec Adam.</h1><p>Retrouvez ici vos propositions, votre mission et vos paiements.</p></section><div className="dashboard-grid"><section><h2>Propositions</h2><p>{proposals?.length ? `${proposals.length} proposition(s)` : 'Aucune proposition.'}</p></section><section><h2>Missions</h2><p>{missions?.length ? `${missions.length} mission(s)` : 'Aucune mission.'}</p></section><section><h2>Paiements</h2><p>{payments?.length ? `${payments.length} paiement(s)` : 'Aucun paiement.'}</p></section></div></main>;
}
