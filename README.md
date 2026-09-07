# STARTUP/AD — vitrine personnelle d’Adam

Publicités pour jeunes startups. Un seul prestataire : Adam.

## Produit

Accueil, services, réalisations, à propos, vision et contact sur une page, avec mentions légales et confidentialité séparées. Design et médias existants conservés.

Pas de comptes, dashboard, CRM, paiement intégré ou messagerie privée. Principe : travailler avec de vrais clients, observer un problème réel, le comprendre, puis améliorer le site si nécessaire.

## Contact

Le formulaire à quatre champs prépare un lien mailto. Il ouvre la messagerie du visiteur, qui doit envoyer lui-même le message. Il ne prétend pas envoyer automatiquement un email et ne stocke pas les demandes. Un lien email direct est aussi disponible. Sans gestionnaire mail configuré, le visiteur peut copier l’adresse affichée dans sa messagerie web.

## Architecture et commandes

React 19, TypeScript, Vinext/Vite, Tailwind, hébergement Sites. `npm ci`, `npm test`, `npx tsc --noEmit`, `npm run build`. `npm run dev` démarre le développement local.

## Suppression de l’ancienne plateforme

Les routes /admin, /client, /connexion, /demande, /auth et les anciennes API ont été retirées, ainsi que les composants et dépendances Supabase/Stripe. Les anciennes URL retournent une page introuvable, avec retour à l’accueil. Aucun identifiant ou secret applicatif n’est nécessaire à la vitrine.

Les scripts SQL de `supabase/migrations` sont uniquement des archives historiques : ne pas les rejouer pour la vitrine. Aucune donnée distante, ressource Supabase, Google Cloud ou Stripe n’a été supprimée. Les anciens secrets de déploiement peuvent encore exister mais ne sont plus utilisés par cette application. Ne jamais publier .env.local.

## Avant ouverture publique

Compléter les mentions légales et les modalités de confidentialité avec les informations réelles d’Adam. Décider du devenir des anciennes données séparément, sans suppression automatique. Conserver la visibilité actuelle du déploiement jusqu’à décision explicite d’Adam.
