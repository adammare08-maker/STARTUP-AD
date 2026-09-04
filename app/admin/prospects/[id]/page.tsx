import { workspaceAuth, WorkspaceUnavailable, WorkspaceHeader } from '@/components/workspace-shell';
import { notFound } from 'next/navigation';
import { uuid } from '@/lib/workspace/model';
export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };
export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await workspaceAuth(true);
  if (auth.state !== 'ready') return <WorkspaceUnavailable />;
  const { id } = await params;
  if (!uuid(id)) notFound();
  const { data: lead, error } = await auth.supabase.from('leads').select('*').eq('id', id).single();
  if (error || !lead) notFound();
  return <main className="workspace"><WorkspaceHeader admin email={auth.user.email} />
    <a href="/admin">← Retour à mon espace</a><h1>{lead.startup}</h1>
    <section className="workspace-panel"><h2>Demande de {lead.first_name}</h2>
      <p>{lead.email}</p><p>Site / LinkedIn : {lead.website || lead.linkedin || 'Non renseigné'}</p>
      <h3>Projet</h3><p style={{ whiteSpace: 'pre-wrap' }}>{lead.startup_description}</p>
      <h3>Besoin</h3><p>{lead.communication_need || 'À préciser ensemble'}</p>
      <p>Budget : {lead.budget || 'Non renseigné'}</p>
      {lead.message && <p style={{ whiteSpace: 'pre-wrap' }}>{lead.message}</p>}
    </section></main>;
}
