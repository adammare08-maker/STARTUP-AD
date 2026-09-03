# Sessions STARTUP/AD

La session reste celle de Supabase Auth, stockée par `@supabase/ssr` en cookies
SameSite=Lax, chemin `/`, avec expiration persistante fournie par la bibliothèque.
Aucun jeton n'est dupliqué dans un stockage maison.

- Le middleware renouvelle les jetons avant les pages protégées et transmet les
  cookies renouvelés à la requête ET à la réponse. Les réponses sont privées,
  non mises en cache.
- Le client Supabase partagé est initialisé sur toutes les pages pour permettre
  son rafraîchissement automatique, et pas uniquement sur le formulaire de login.
- L'accueil demande l'identité à `/api/auth/session` (sans cache). Le serveur
  vérifie l'utilisateur via `getUser`, puis son propre profil avec RLS. Seuls
  l'email et la destination de navigation sont renvoyés, jamais les jetons.
- `/connexion` redirige une session déjà valide vers le bon espace.
- La déconnexion utilise `signOut({ scope: 'local' })` de Supabase : suppression
  des cookies et révocation du refresh token de cette session. Un access token
  déjà émis peut rester valide jusqu'à expiration ; ce correctif ne change pas
  cette propriété de Supabase. Les autres appareils restent connectés.
- Une page restaurée depuis le cache arrière/avant du navigateur est rechargée
  pour ne pas afficher une ancienne vue privée après déconnexion.
- Aucun changement de migration, de RLS ou de règle d'attribution admin.

Référence : https://supabase.com/docs/guides/auth/server-side/creating-a-client

## Vérifications

`npm test` couvre notamment la rotation/suppression des cookies, la transmission
au rendu serveur, l'absence de cache, les redirections OAuth, les rôles et le
refus d'un client qui revendique admin dans ses métadonnées.

Ces tests automatisés utilisent des doubles de Supabase, pas les comptes réels.
Un parcours réel email/Google et une fermeture/réouverture nécessitent une
connexion volontaire avec un compte de test ou le compte du propriétaire.
Ne jamais placer les identifiants de ce compte dans le dépôt ou les logs.
