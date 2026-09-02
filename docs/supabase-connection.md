# Connexion Supabase — état vérifié

Les variables Supabase sont configurées dans l’hébergement Sites. `.env.local`
reste ignoré par Git. Le navigateur récupère uniquement l’URL et la clé publique
via `/api/auth/config`. Les clés privées restent sur le serveur.

## Valeurs nécessaires

À renseigner uniquement dans `.env.local`, puis dans les variables de l'hébergement Sites (pas dans GitHub).

| Variable existante | Où trouver la valeur dans Supabase | Confidentialité |
| --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Projet → Connect → Project URL, ou Settings → Data API → Project URL | Publique |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Settings → API Keys → Publishable key, ou ancienne clé anon | Publique, jamais une clé secret/service_role |
| SUPABASE_SERVICE_ROLE_KEY | Settings → API Keys → Secret key, ou ancienne clé service_role | Strictement secrète, côté serveur |

Les noms de variables historiques sont conservés : le SDK installé accepte les nouvelles clés `sb_publishable_…` et `sb_secret_…` dans ces emplacements respectifs. Ne jamais mettre une clé secrète dans une variable NEXT_PUBLIC.
`ADMIN_EMAIL` et `ADMIN_USER_ID` sont deux variables serveur privées : l’adresse
confirmée d’Adam ET l’UUID de son compte Supabase existant. Les deux doivent correspondre.
Ne jamais utiliser les métadonnées de l’inscription pour définir ces valeurs.

Après connexion, `/api/auth/complete` vérifie le jeton auprès de Supabase, la
confirmation de l’email et ces deux valeurs. Il promeut uniquement ce profil
existant et refuse la promotion si un autre admin existe déjà. Les autres
comptes restent clients. Il ne crée ni utilisateur ni profil artificiel.
Une adresse saisie dans le formulaire ne suffit jamais à obtenir ce rôle.

Référence : https://supabase.com/docs/guides/getting-started/api-keys

## Correctif RLS requis avant ouverture des comptes

La migration 001 présente des défauts : révocation incomplète d'UPDATE sur role,
notes privées lisibles dans les prospects rattachés à un client, modification du prix
possible via la politique de réponse à une proposition, et métadonnées de fichiers
insérables directement par un client.

Exécuter `supabase/migrations/002_auth_security.sql` dans l'éditeur SQL Supabase.
Ce correctif ne désactive pas RLS et ne crée aucun utilisateur. Il restreint certaines
écritures clientes non encore implémentées dans l'interface. Ne pas rouvrir les anciennes
politiques pour contourner un refus d'accès.
Référence : https://supabase.com/docs/guides/database/postgres/column-level-security

## Promotion manuelle de secours, une fois le compte créé et confirmé

Dans SQL Editor, remplacer le placeholder par l'UUID exact du compte Adam
visible dans Authentication → Users. Aucun mot de passe ni email dans le dépôt.

```sql
begin;
update public.profiles
set role = 'admin'
where id = 'UUID_DU_COMPTE_ADAM'::uuid
  and role = 'client'
  and not exists (select 1 from public.profiles where role = 'admin');
commit;
```

Vérifier qu'une seule ligne a été modifiée. En cas de zéro ligne, vérifier le compte
et l'existence d'un admin, sans créer de profil artificiel ni modifier les politiques.
Se reconnecter puis ouvrir `/admin`. Le rôle provient de la base, jamais des métadonnées
transmises lors de l'inscription.

## Vérification restante

Après configuration : confirmation email Supabase, connexion/déconnexion, profil automatique
client, refus admin, isolation RLS entre deux comptes de test autorisés et stockage privé.
L’ouverture du formulaire d’inscription a été vérifiée dans le navigateur.
L’existence du compte d’Adam, sa confirmation et son profil ont été vérifiés
sans créer de compte de test en production. La connexion avec son mot de passe
reste à effectuer par Adam ; les tests automatisés couvrent la sélection du
vendeur, les refus d’accès et les erreurs. Ils ne remplacent pas un test réel
du cycle inscription → email → connexion pour un nouveau client.

Si un compte existe déjà, utiliser « Se connecter ». Le formulaire ne doit pas
annoncer une nouvelle création certaine lorsque Supabase masque un doublon.
Configurer les URL de confirmation dans Supabase Authentication → URL Configuration
pour l’URL réelle du site avant l’ouverture publique. L’accès Sites lui-même
reste privé : les comptes Supabase n’accordent pas un accès à cette couche externe.

L'email n'est pas activé sur le déploiement observé : EMAIL_API_KEY et CONTACT_FROM_EMAIL
sont absents. Stripe n'a pas été configuré pendant cette étape.
