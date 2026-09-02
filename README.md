# STARTUP/AD — plateforme freelance personnelle

Site et fondation V1 de l’espace freelance personnel d’Adam, construits avec TypeScript, React, Vinext et Tailwind CSS. STARTUP/AD comporte un vendeur unique (Adam) : l’inscription publique ne peut créer que des comptes clients. Le plan V1/V2/V3 se trouve dans `docs/platform-roadmap.md`.

La landing page et `POST /api/contact` restent opérationnels. La V1 ajoute une demande détaillée sans compte, une authentification client, les espaces `/admin` et `/client`, un schéma PostgreSQL protégé par RLS, Stripe Checkout et la préparation d’un stockage privé.

## Fonctionnement du formulaire

1. Le navigateur envoie les champs en JSON à `/api/contact` sur le même domaine.
2. L’API vérifie l’origine, le type et la taille de la requête, normalise les champs et applique leurs limites.
3. Un honeypot piège les robots simples et une limite de 5 demandes par adresse IP sur 10 minutes freine les abus.
4. Le serveur envoie un email en texte brut via Resend, avec l’adresse du prospect dans `Reply-To`.
5. Aucun message n’est enregistré dans une base de données par STARTUP/AD.

La limitation en mémoire est adaptée à cette première version peu fréquentée. Dans une architecture distribuée, chaque instance possède son propre compteur : en cas de spam soutenu, ajoutez Cloudflare Turnstile ou une limitation globale Cloudflare avant d’augmenter les quotas.

## Configuration locale

Prérequis : Node.js 22.13 ou plus récent.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Renseignez les valeurs réelles dans `.env.local`, qui est ignoré par Git. Ouvrez ensuite `http://localhost:3000`.

| Variable | Rôle |
| --- | --- |
| `EMAIL_API_KEY` | Clé privée Resend, utilisée uniquement côté serveur |
| `CONTACT_TO_EMAIL` | Adresse privée qui reçoit les demandes, à configurer uniquement dans l’environnement serveur |
| `CONTACT_FROM_EMAIL` | Expéditeur sur un domaine vérifié : `STARTUP/AD <contact@VOTRE_DOMAINE_VÉRIFIÉ>` |
| `CONTACT_SEND_CONFIRMATION` | `true` pour confirmer automatiquement au prospect, sinon `false` |

Ne committez jamais `.env.local`, une clé API ou un secret. `.env.example` ne contient que des exemples.

## Configurer Resend

Resend a été choisi pour son API HTTP simple, sa compatibilité avec un runtime serverless et la possibilité d’utiliser un domaine authentifié.

1. Créez un compte Resend.
2. Ajoutez un domaine ou, de préférence, un sous-domaine d’envoi que vous possédez.
3. Ajoutez chez votre hébergeur DNS les enregistrements SPF et DKIM donnés exactement par Resend, puis attendez le statut vérifié. Configurez aussi DMARC selon les besoins du domaine.
4. Créez une clé API limitée à l’envoi et placez-la dans `EMAIL_API_KEY` côté serveur.
5. Choisissez une adresse du domaine vérifié pour `CONTACT_FROM_EMAIL`. L’adresse du visiteur reste dans `Reply-To`, jamais dans `From`.
6. Configurez les quatre variables dans les secrets/variables du projet de déploiement, puis redéployez.

Pour changer le destinataire, modifiez uniquement `CONTACT_TO_EMAIL`. Pour remplacer Resend plus tard, implémentez un adaptateur conforme au type `ContactEmailSender` dans `lib/contact/email.ts`; ni le formulaire ni la validation n’ont besoin de changer.

## Tests et build

```bash
npm test
npm run build
```

Les tests couvrent un formulaire valide, un email invalide, un champ obligatoire absent, un champ trop long, le honeypot, la limitation répétée, une erreur du fournisseur et la réussite complète. Aucun email réel n’est envoyé pendant les tests.

Pour un test manuel réel, configurez les variables, démarrez le site, envoyez le formulaire, vérifiez l’email reçu et utilisez « Répondre » pour confirmer que le destinataire est bien le prospect.

## Déploiement, données et droit

Le site est prévu pour OpenAI Sites et un runtime Cloudflare compatible. Ajoutez les variables dans les paramètres du projet, jamais dans GitHub. Le frontend et l’API partagent le même domaine : aucun CORS n’est ajouté et les requêtes provenant d’une autre origine sont refusées.

Le prénom, la startup, l’email et les champs librement remplis sont transmis à Resend afin de remettre l’email à Adam. STARTUP/AD ne les conserve pas dans une base de données, mais le fournisseur et la boîte de réception peuvent appliquer leur propre conservation.

Avant une mise en production publique, vérifiez manuellement la politique de confidentialité, les mentions légales, la durée de conservation des emails, les conditions/DPA du fournisseur, le droit de suppression et les obligations applicables à votre pays. Cette documentation technique ne constitue pas une garantie de conformité juridique.

## Activer la plateforme V1

### Supabase et compte Adam

1. Créez un projet Supabase appartenant à Adam.
2. Exécutez `supabase/migrations/001_startup_ad_v1.sql` dans l’éditeur SQL.
3. Configurez `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et la clé privée `SUPABASE_SERVICE_ROLE_KEY`.
4. Créez le compte d’Adam, puis attribuez-lui manuellement le rôle admin :

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'EMAIL_REEL_ADAM');
```

Toutes les inscriptions publiques reçoivent automatiquement le rôle `client`. Le rôle admin n’est jamais proposé par le navigateur. Activez aussi la confirmation d’email dans Supabase Auth.

### Stripe

1. Créez et vérifiez le compte Stripe lié à l’activité légale d’Adam.
2. Configurez d’abord les clés de test `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Ajoutez un webhook vers `https://VOTRE_DOMAINE/api/webhooks/stripe` pour `checkout.session.completed` et `checkout.session.expired`, puis configurez `STRIPE_WEBHOOK_SECRET`.
4. Configurez `NEXT_PUBLIC_SITE_URL` avec l’URL exacte du site et testez le passage du paiement de `en_attente` à `paye`.

Les cartes restent traitées par Stripe : STARTUP/AD ne stocke aucun numéro de carte.

### Variables supplémentaires

Les variables Supabase et Stripe figurent dans `.env.example`. `ADMIN_EMAIL` sert de repère de configuration. Toutes les clés privées restent exclusivement côté serveur et ne doivent jamais être commitées.

### Fichiers privés

La migration crée le bucket privé `mission-files`. `/api/files/upload-url` contrôle la session, l’accès à la mission, le type MIME et une limite de 50 Mio avant d’autoriser un envoi. L’interface complète de livraison et l’enregistrement final des métadonnées restent volontairement dans la suite de la V1 ; le flux n’est donc pas encore activé pour les clients.

### Limites assumées de cette livraison

Cette livraison installe une fondation exploitable, mais les écrans complets de création/édition des propositions, le Kanban, l’acceptation interactive, la messagerie, la livraison versionnée et la génération de factures restent dans la roadmap. Les tables existent afin d’éviter une future refonte de données. Elles ne doivent pas être présentées comme des fonctionnalités déjà disponibles.

Avant l’ouverture publique, vérifiez les CGV, les mentions légales, les délais et modalités de paiement, la numérotation séquentielle des factures, la franchise de TVA si applicable, les durées de conservation et les obligations françaises en vigueur. La table `invoices` ne constitue pas à elle seule un système de facturation validé. Ce projet ne garantit pas la conformité juridique ou comptable.
