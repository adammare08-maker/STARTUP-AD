# STARTUP/AD

Landing page de STARTUP/AD, construite avec TypeScript, React, Vinext et Tailwind CSS. Le formulaire utilise un endpoint privé `POST /api/contact` : aucune clé d’email n’est envoyée au navigateur et aucune base de données n’est créée.

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
| `CONTACT_TO_EMAIL` | Adresse qui reçoit les demandes, prévue pour `adam.mare08@gmail.com` |
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
