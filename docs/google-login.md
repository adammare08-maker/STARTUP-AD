# Connexion et inscription Google

Le bouton « Continuer avec Google » utilise Supabase Auth : il ouvre Google,
puis revient sur `/auth/callback`. Le flux PKCE échange le code à usage unique
contre une session avec le vérificateur du navigateur. La destination est
déterminée côté serveur : `/client`, ou `/admin` uniquement selon les protections
déjà en place (email confirmé et identifiant du compte vendeur configuré).

Un nouveau compte passe toujours par le trigger `create_client_profile()` et
reçoit le rôle `client`. Aucun rôle fourni par Google ou le navigateur n'est utilisé.
Un compte Google existant permet de créer un compte STARTUP/AD, pas de créer une
nouvelle adresse Gmail. Google peut demander de choisir un compte ou de consentir.

## Configuration manuelle requise

Google est désactivé dans les paramètres Supabase vérifiés pendant cette intervention.
Le site vérifie sa disponibilité à chaque clic et propose l'email en attendant.
La clé service-role de l'application ne permet pas de modifier les fournisseurs Auth.

1. Google Cloud / Google Auth Platform → Clients : ouvrir le client Web fourni.
   Son identifiant public est
   `601689724239-bt98g9ggb4ddam9lncfj0fedr1ejf59u.apps.googleusercontent.com`.
   Ajouter l'origine JavaScript autorisée
   `https://startup-ad-adam.adam-mare08.chatgpt.site`.
   Ajouter comme URI de redirection autorisée l'URL de callback affichée dans
   Supabase → Authentication → Sign In / Providers → Google
   (elle se termine par `/auth/v1/callback`). Copier l'URL exacte, ne pas la deviner.
2. Dans ce fournisseur Google de Supabase : renseigner cet identifiant et le
   **secret client correspondant**, puis activer et enregistrer Google.
   Le secret reste uniquement dans Supabase, jamais dans GitHub, le frontend,
   `.env.example`, un message ou un journal. Aucune nouvelle variable Google
   n'est nécessaire dans l'hébergement du site.
3. Supabase → Authentication → URL Configuration : vérifier la Site URL et
   autoriser précisément
   `https://startup-ad-adam.adam-mare08.chatgpt.site/auth/callback`.
   Ne pas utiliser de wildcard général ni désactiver les protections PKCE.
4. Si Google est en mode test, ajouter les testeurs autorisés dans Audience.
   Pour l'ouverture aux clients, vérifier les paramètres de publication et de
   consentement Google ainsi que l'accès externe au site Sites (actuellement privé).

## Vérification réelle restante

Utiliser « Continuer avec Google », choisir son propre compte, puis vérifier le
profil créé et le retour à l'espace attendu. Tester également un refus de consentement.
Les tests automatiques simulent les réponses OAuth ; aucun utilisateur de production
n'a été créé pour ces tests. Ils ne prouvent pas la configuration de Google Cloud.

Documentation officielle : https://supabase.com/docs/guides/auth/social-login/auth-google
