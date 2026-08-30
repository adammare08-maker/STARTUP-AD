'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, CheckCircle2, LoaderCircle, TriangleAlert } from 'lucide-react';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('https://formsubmit.co/ajax/adam.mare08@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Nouveau message STARTUP/AD — ${data.startup || data.firstName}`,
          _template: 'table',
        }),
      });

      if (!response.ok) throw new Error('Form submission failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') return (
    <div className="form-success" role="status">
      <CheckCircle2 size={38} />
      <h3>Votre message a bien été envoyé à Adam.</h3>
      <p>Merci pour votre message. Adam pourra vous répondre directement à l’adresse indiquée.</p>
      <button type="button" onClick={() => setStatus('idle')}>Envoyer un autre message</button>
    </div>
  );

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="text" name="_honey" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-row">
        <label>Votre prénom<input name="firstName" placeholder="Ex. Léa" required /></label>
        <label>Nom de la startup<input name="startup" placeholder="Ex. Nova" required /></label>
      </div>
      <label>Votre email<input type="email" name="email" placeholder="vous@startup.com" required /></label>
      <label>Site ou LinkedIn <span>(facultatif)</span><input name="website" placeholder="https://" /></label>
      <label>Racontez-moi votre projet<textarea name="project" rows={4} placeholder="Votre startup, votre produit, ce que vous essayez de construire…" required /></label>
      <div className="form-row">
        <label>Besoin publicitaire <span>(facultatif)</span><select name="adType" defaultValue=""><option value="">Je ne sais pas encore</option><option>Vidéo courte</option><option>TikTok / Reels</option><option>Création visuelle</option><option>Animation</option></select></label>
        <label>Budget approximatif <span>(facultatif)</span><input name="budget" placeholder="Une fourchette suffit" /></label>
      </div>
      {status === 'error' && (
        <p className="form-error" role="alert"><TriangleAlert size={17} /> Le message n’a pas pu être envoyé. Réessayez ou écrivez directement à adam.mare08@gmail.com.</p>
      )}
      <button className="submit-button" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? <><LoaderCircle className="spinner" size={18} /> Envoi en cours…</> : <>Envoyer à Adam <ArrowUpRight size={18} /></>}
      </button>
      <small>Vos informations sont uniquement utilisées pour répondre à votre demande.</small>
    </form>
  );
}
