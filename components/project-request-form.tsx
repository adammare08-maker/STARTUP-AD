'use client';

import { useState, type SyntheticEvent } from 'react';

export function ProjectRequestForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  async function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault(); setStatus('sending');
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/project-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!response.ok) throw new Error(); form.reset(); setStatus('success');
    } catch { setStatus('error'); }
  }
  if (status === 'success') return <div className="request-success" role="status"><h2>Merci, votre projet est arrivé jusqu’à Adam.</h2><p>Je vous répondrai dès que possible pour commencer par une vraie discussion.</p></div>;
  return <form className="project-request-form" onSubmit={submit}>
    <input className="honeypot" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="form-row"><label>Prénom<input name="firstName" maxLength={80} required /></label><label>Nom<input name="lastName" maxLength={80} /></label></div>
    <div className="form-row"><label>Startup<input name="startup" maxLength={120} required /></label><label>Email<input name="email" type="email" maxLength={254} required /></label></div>
    <div className="form-row"><label>Site web<input name="website" type="url" maxLength={300} /></label><label>LinkedIn<input name="linkedin" type="url" maxLength={300} /></label></div>
    <label>Décrivez votre startup<textarea name="startupDescription" maxLength={3000} rows={5} required /></label>
    <div className="form-row"><label>Quel problème résolvez-vous ?<textarea name="problemSolved" maxLength={1200} rows={3} /></label><label>Pour qui ?<textarea name="targetAudience" maxLength={1200} rows={3} /></label></div>
    <label>Quel est votre besoin en communication ?<textarea name="communicationNeed" maxLength={1600} rows={4} required /></label>
    <div className="form-row"><label>Prestation souhaitée<select name="service"><option value="">Je ne sais pas encore</option><option>Publicité vidéo courte</option><option>Vidéo TikTok / Reel</option><option>Animation publicitaire</option><option>Présentation vidéo d’une startup</option><option>Visuel publicitaire</option></select></label><label>Budget approximatif<input name="budget" maxLength={120} /></label></div>
    <label>Délai souhaité <span>(facultatif)</span><input name="desiredDeadline" maxLength={120} /></label>
    <label>Message complémentaire <span>(facultatif)</span><textarea name="message" maxLength={1600} rows={3} /></label>
    {status === 'error' && <p className="form-error" role="alert">La demande n’a pas pu être envoyée. Réessayez dans quelques instants.</p>}
    <button className="submit-button" disabled={status === 'sending'}>{status === 'sending' ? 'Envoi…' : 'Parler de mon projet'}</button>
    <small>Aucun compte n’est nécessaire pour ce premier message.</small>
  </form>;
}
