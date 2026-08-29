'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent) return (
    <div className="form-success" role="status">
      <CheckCircle2 size={38} /><h3>Votre message est prêt pour Adam.</h3>
      <p>Le formulaire attend encore d’être relié à l’adresse email d’Adam avant la mise en ligne publique.</p>
      <button type="button" onClick={() => setSent(false)}>Revenir au formulaire</button>
    </div>
  );
  return (
    <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
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
      <button className="submit-button" type="submit">Envoyer à Adam <ArrowUpRight size={18} /></button>
      <small>Formulaire de démonstration — connexion à un service d’email à prévoir.</small>
    </form>
  );
}
