# Plan d’implémentation — plateforme freelance STARTUP/AD

## Architecture trouvée

- React 19, TypeScript, Vinext et Tailwind CSS, déployés sur OpenAI Sites/Cloudflare.
- Landing page, profil d’Adam, portfolio vidéo et catalogue éditorial déjà présents.
- Formulaire privé `POST /api/contact` avec validation serveur, limite de taille, honeypot, rate limiting, contrôle d’origine et envoi Resend avec `Reply-To`.
- Aucun compte, aucune base de données, aucun stockage privé et aucun paiement actuellement.

## Phase V1 — indispensable pour vendre et servir un premier client

1. Conserver le site public, le profil, les cinq phases et le portfolio.
2. Ajouter un catalogue simple de prestations, sans prix inventé.
3. Enregistrer les demandes comme prospects en plus de l’email existant.
4. Ajouter une authentification client et un rôle admin strictement réservé à Adam.
5. Créer un tableau de bord Adam centré sur « À faire aujourd’hui » et un pipeline simple.
6. Créer un espace client minimal : demandes, propositions, missions, messages, fichiers et paiements.
7. Permettre à Adam de créer une proposition ; permettre au client de l’accepter ou la refuser.
8. Transformer une proposition acceptée en mission.
9. Utiliser Stripe Checkout pour un paiement total et vérifier les webhooks signés.
10. Stocker les fichiers privés dans un bucket privé avec contrôle d’accès par propriétaire.
11. Préparer les données de devis/facture, sans promettre une conformité juridique automatique.

## Phase V2 — après les premiers clients

- Acompte puis solde.
- Notifications et relances automatiques.
- Pièces jointes dans la messagerie.
- Génération PDF avancée des devis, factures et avoirs.
- Catalogue et portfolio entièrement modifiables depuis le dashboard.
- Historique détaillé des activités et exports comptables.
- Protection anti-bot Cloudflare Turnstile et rate limiting distribué.

## Phase V3 — uniquement si l’activité grandit

- Automatisations CRM avancées.
- Intégrations comptables.
- Analyses de revenus approfondies.
- Gestion avancée de versions de fichiers et archivage.

## Décisions structurantes

- Un seul vendeur : Adam. Aucun rôle vendeur ne peut être créé publiquement.
- Supabase est prévu pour l’authentification, PostgreSQL et le stockage privé afin de disposer d’autorisations Row Level Security explicites.
- Stripe Checkout traite les cartes ; STARTUP/AD ne reçoit ni ne stocke les numéros de carte.
- Resend reste le canal email. Le premier contact ne nécessite pas de compte.
- Les espaces `/admin` et `/client` sont `noindex` et leurs autorisations sont contrôlées côté serveur.
- Les informations légales, prix, numéros d’entreprise et règles de facturation restent des données à fournir et valider manuellement.

## Conditions avant activation en production

- Créer et configurer le projet Supabase, exécuter la migration SQL et créer le bucket privé.
- Créer le compte d’Adam, puis lui attribuer manuellement le rôle `admin` dans la base ; aucune route publique ne peut attribuer ce rôle.
- Configurer Stripe, son webhook et les variables secrètes.
- Renseigner les informations légales réelles et faire vérifier les documents/CGV par un professionnel compétent.
- Rendre le site accessible aux clients seulement après validation explicite de son niveau d’accès.
