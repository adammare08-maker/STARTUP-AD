import { WorkspaceHeader, WorkspaceUnavailable, workspaceAuth } from '@/components/workspace-shell';
import { WorkspaceForm } from '@/components/workspace-form';
export const dynamic='force-dynamic';
export const metadata={title:'Présenter ma startup — STARTUP/AD',robots:{index:false,follow:false}};
export default async function NewRequest(){const a=await workspaceAuth();if(a.state!=='ready')return <WorkspaceUnavailable />;
  const {error}=await a.supabase.from('missions').select('workflow_stage').limit(1);
  return <main className="workspace"><WorkspaceHeader email={a.user.email} admin={a.profile.role==='admin'} /><div className="workspace-title"><div><a href="/client">← Mes projets</a><h1>Racontez-moi votre startup.</h1><p>Cette demande ouvre une conversation. Elle ne vous engage à aucun achat.</p></div></div>
  {error||a.profile.role==='admin'?<p>Le formulaire est réservé aux clients et sera disponible après activation de la mise à jour.</p>:<WorkspaceForm action="request" label="Ouvrir mon dossier"><label>Nom du projet<input name="title" maxLength={120} required /></label><label>Votre startup<input name="startup" defaultValue={a.profile.startup||''} maxLength={120} required /></label><label>Que construisez-vous, pour qui et pourquoi ?<textarea name="brief" rows={6} maxLength={3000} required /></label><label>De quoi avez-vous besoin pour communiquer ?<textarea name="need" rows={4} maxLength={1600} required /></label><p>La demande sera associée à votre compte. Vos échanges resteront dans votre espace privé.</p></WorkspaceForm>}</main>;
}
