import { BackHome } from '@/components/back-home';
import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';
import { requireRole } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Connexion client — STARTUP/AD', robots: { index: false, follow: false } };
export default async function LoginPage() {
  const account = await requireRole('client');
  if (account.state === 'ready') redirect(account.profile.role === 'admin' ? '/admin' : '/client');
  return <main className="portal-shell"><a className="brand" href="/">STARTUP<span>/</span>AD</a><BackHome /><div className="portal-intro"><p className="section-index">ESPACE PRIVÉ</p><h1>Retrouvez votre projet.</h1><p>Propositions, mission, messages, fichiers et paiements au même endroit. Vous travaillez toujours directement avec Adam.</p></div><AuthForm /></main>;
}
