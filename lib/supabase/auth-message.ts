export function authErrorMessage(code?: string, mode: 'login' | 'signup' = 'login') {
  switch (code) {
    case 'user_already_exists':
    case 'email_exists': return 'Un compte existe déjà. Utilisez « Se connecter ».';
    case 'email_not_confirmed': return 'Confirmez votre adresse avec le lien reçu par email, puis reconnectez-vous.';
    case 'invalid_credentials': return 'Email ou mot de passe incorrect. Si vous avez déjà un compte, utilisez son mot de passe.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit': return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
    case 'weak_password': return 'Choisissez un mot de passe plus robuste, avec au moins 10 caractères.';
    case 'signup_disabled': return 'Les inscriptions sont temporairement désactivées. Contactez Adam.';
    default: return mode === 'signup' ? 'Le compte n’a pas pu être créé. Réessayez dans quelques instants ou contactez Adam.' : 'Connexion impossible pour le moment. Réessayez.';
  }
}
