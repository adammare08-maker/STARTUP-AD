export default function PrivacyPage() {
  return <main className="legal-page">
    <a className="brand" href="/">STARTUP<span>/</span>AD</a>
    <p className="section-index">Protection des données</p>
    <h1>Politique de confidentialité</h1>
    <div className="legal-notice"><strong>Document à compléter avant l’ouverture publique</strong><p>Cette page décrit le fonctionnement technique prévu. L’identité juridique complète du responsable, les durées de conservation, les coordonnées professionnelles et les bases légales doivent être vérifiées et complétées par Adam avant la mise en production.</p></div>
    <div className="legal-notice"><strong>Données traitées</strong><p>Selon les fonctionnalités utilisées, STARTUP/AD peut traiter les données de contact, les informations de compte, les messages, les informations décrivant un projet, les propositions, les missions, les fichiers transmis, les commandes et le statut des paiements.</p><p>Ces informations servent à répondre aux demandes, préparer et réaliser une prestation, échanger avec le client, livrer les créations et suivre le paiement.</p></div>
    <div className="legal-notice"><strong>Prestataires techniques</strong><p>Resend est prévu pour remettre les emails, Supabase pour l’authentification, la base PostgreSQL et le stockage privé, et Stripe pour le paiement. Stripe traite les données bancaires sur ses propres interfaces sécurisées : STARTUP/AD ne stocke pas les numéros de carte.</p></div>
    <div className="legal-notice"><strong>Accès et fichiers</strong><p>Les espaces admin et client sont privés. Les règles d’accès prévues empêchent un client de consulter les informations ou fichiers d’un autre client. Adam conserve un accès administrateur nécessaire au suivi des missions.</p></div>
    <div className="legal-notice"><strong>Vos demandes</strong><p>Pour toute question ou demande liée à vos données, contactez Adam à adam.mare08@gmail.com. Les modalités précises d’exercice des droits et les durées de conservation devront être complétées avant l’ouverture publique.</p></div>
    <a className="underlined-link" href="/">Retour au site</a>
  </main>;
}
