'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent) return (
    <div className="form-success" role="status">
      <CheckCircle2 size={38} /><h3>Votre message est prêt.</h3>
      <p>Le formulaire fonctionne côté interface. Connectez votre service d’email avant la mise en ligne pour recevoir les demandes.</p>
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
      <label>Site ou réseau social <span>(facultatif)</span><input name="website" placeholder="https://" /></label>
      <label>Parlez-moi de votre projet<textarea name="project" rows={4} placeholder="Votre produit, votre idée, votre objectif…" required /></label>
      <div className="form-row">
        <label>Type de publicité<select name="adType" defaultValue="" required><option value="" disabled>Choisir un format</option><option>Vidéo courte</option><option>TikTok / Instagram</option><option>Création visuelle</option><option>Animation</option><option>Je ne sais pas encore</option></select></label>
        <label>Budget approximatif <span>(facultatif)</span><input name="budget" placeholder="Une fourchette suffit" /></label>
      </div>
      <button className="submit-button" type="submit">Envoyer ma demande <ArrowUpRight size={18} /></button>
      <small>Formulaire de démonstration — connexion à un service d’email à prévoir.</small>
    </form>
  );
}
