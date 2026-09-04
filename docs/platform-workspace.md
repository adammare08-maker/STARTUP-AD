# STARTUP/AD — plateforme de travail

## Analyse et cible

La connexion et les autorisations serveur sont conservées. La vitrine, le portfolio
et le contact ne sont pas supprimés. Les dashboards actuels sont de simples listes
ou compteurs : ils deviennent des espaces d'action avec un dossier par projet.

Le dossier est créé dès la demande, avant tout engagement commercial. La table
`missions` représente ce dossier ; une proposition acceptée y fixe ensuite le
périmètre et le prix. `leads` conserve les notes commerciales privées d'Adam.
La conversation utilise `messages`. Les propositions sont liées au dossier et
leur acceptation est transactionnelle, sans permission UPDATE ouverte au client.

## Lot 1 — implémenté dans cette évolution

- Dashboard client et admin, navigation vers chaque dossier.
- Demande authentifiée → prospect + dossier (transaction SQL).
- Brief, messages, propositions et paiements enregistrés réunis sur une page.
- Proposition personnalisée, montant d'acompte, corrections prévues et conditions.
- Acceptation, refus ou demande de modification, enregistrés en base.
- Auth existante, noindex, contrôles serveur et RLS conservés.

Exécuter `supabase/migrations/003_workspace.sql` après 001 et 002 avant d'utiliser
les nouveaux formulaires. Aucune clé SQL d'administration n'est disponible dans
l'environnement de travail : cette migration n'est pas appliquée automatiquement.
Sans elle, l'interface affiche un état de configuration et conserve les données
existantes ; elle ne prétend pas que des demandes ont été enregistrées.

## Lots suivants — non considérés comme livrés

1. Stripe acompte/solde : réservation idempotente, événements signés, montants
   vérifiés côté serveur, reprise en cas d'échec, tests Stripe avant activation.
2. Versions et corrections : événements immuables, compteur transactionnel,
   prévisualisations distinctes des fichiers finaux, validations horodatées.
3. Livraison : autorisation de téléchargement après validation et paiement total,
   y compris dans les règles Storage, et liens signés courts.
4. Factures : informations légales fournies par Adam, documents et numérotation
   validés avant toute génération. Ne pas confondre proposition et facture.
5. Notifications email et pipeline admin plus complet, prix publics réels.

L'accès public de l'hébergement n'est pas modifié par ce lot. Les clés Stripe,
les paramètres email manquants et les mentions légales ne sont jamais inventés.
