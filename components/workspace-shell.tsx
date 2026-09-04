import { AccountIdentity } from '@/components/account-identity';
import { LogoutButton } from '@/components/logout-button';
import { requireRole } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export async function workspaceAuth(admin=false){const a=await requireRole(admin?'admin':'client');if(a.state==='anonymous')redirect('/connexion');if(a.state==='forbidden')redirect('/client');return a;}
export function WorkspaceHeader({email,admin,name,avatar}:{email?:string;admin:boolean;name?:unknown;avatar?:unknown}){return <header className="workspace-header"><a className="brand" href={admin?'/admin':'/client'}>STARTUP<span>/</span>AD</a><nav aria-label="Espace de travail"><a href={admin?'/admin':'/client'}>Mes projets</a><a href="/">Voir le site</a></nav><div className="account-actions"><AccountIdentity email={email} name={name} avatar={avatar} role={admin?'admin':'client'} /><LogoutButton /></div></header>;}
export function WorkspaceUnavailable(){return <main className="workspace"><h1>Espace temporairement indisponible</h1><p>Les informations ne peuvent pas être chargées. Votre compte et vos données sont conservés.</p><a href="/">Retour au site</a></main>;}
