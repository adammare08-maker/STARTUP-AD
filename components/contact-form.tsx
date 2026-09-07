'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactEmail, prepareContactEmail } from '@/lib/contact-message';

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.href = prepareContactEmail({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      startup: String(data.get('startup') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    setPrepared(true);
  }
  return <form className="contact-form" action={`mailto:${contactEmail}`} method="post" encType="text/plain" onSubmit={handleSubmit} aria-label="Préparer un email à Adam" aria-describedby="contact-help">
    <p id="contact-help">Quatre champs pour préparer votre email. Votre messagerie s’ouvrira : il vous restera à envoyer le message.</p>
    <div className="form-row">
      <label htmlFor="contact-name">Votre nom<input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Ex. Léa" /></label>
      <label htmlFor="contact-startup">Nom de la startup <span>(facultatif)</span><input id="contact-startup" name="startup" autoComplete="organization" maxLength={120} placeholder="Ex. Nova" /></label>
    </div>
    <label htmlFor="contact-email">Votre email<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="vous@startup.com" /></label>
    <label htmlFor="contact-message">Votre projet / besoin<textarea id="contact-message" name="message" required rows={5} maxLength={1500} placeholder="Présentez-moi simplement votre projet et ce dont vous avez besoin." /></label>
    <button type="submit" className="submit-button">Préparer mon email <ArrowUpRight size={18} aria-hidden="true" /></button>
    <p role="status" aria-live="polite">{prepared ? 'Votre message est prêt à être ouvert dans votre messagerie. Il n’est pas encore envoyé : vérifiez-le puis cliquez sur Envoyer dans votre messagerie.' : ''}</p>
    <small>Aucun envoi automatique ni enregistrement sur le site. Si votre messagerie ne s’ouvre pas, écrivez directement à <a className="underlined-link" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</small>
  </form>;
}
