'use client';
import { useState, type ReactNode, type FormEvent } from 'react';
export function WorkspaceForm({action,missionId,proposalId,children,label}:{action:string;missionId?:string;proposalId?:string;children:ReactNode;label:string}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(busy)return;setBusy(true);setError('');
    try{const values=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,action,missionId,proposalId})});const payload:unknown=await r.json();const data=payload&&typeof payload==='object'?payload as Record<string,unknown>:{};if(!r.ok)throw new Error('Enregistrement impossible. Réessayez dans quelques instants.');
      if(action==='request'&&typeof data.id==='string'&&/^[0-9a-f-]{36}$/i.test(data.id))window.location.assign('/client/missions/'+data.id);else window.location.reload();
    }catch(err){setError(err instanceof Error?err.message:'Enregistrement impossible.');setBusy(false);}
  }
  return <form className="workspace-form" onSubmit={submit}><fieldset disabled={busy}>{children}<button className="submit-button" type="submit">{busy?'Enregistrement…':label}</button></fieldset>{error&&<p role="alert">{error}</p>}</form>;
}
