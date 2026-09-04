const messages: Record<string, string> = {
  SESSION_REQUIRED: 'Votre session a expiré. Reconnectez-vous dans un autre onglet, puis réessayez ici. Votre texte reste dans ce formulaire.',
  PROFILE_FORBIDDEN: 'Votre compte ne permet pas cette action. Contactez Adam avec le code PROFILE_FORBIDDEN.',
  ACCOUNT_UNAVAILABLE: 'Votre profil ne peut pas être chargé pour le moment. Réessayez. Si cela persiste, indiquez à Adam le code ACCOUNT_UNAVAILABLE.',
  CLIENT_REQUIRED: 'Le compte actuellement connecté est celui du vendeur. Connectez votre compte client dans ce navigateur pour ouvrir un dossier.',
  ORIGIN_REJECTED: 'L’adresse de cette page n’est pas reconnue. Ouvrez STARTUP/AD directement puis réessayez. Code ORIGIN_REJECTED.',
};
export function workspaceError(code: unknown) {
  return typeof code === 'string' && Object.hasOwn(messages, code)
    ? messages[code] : 'Enregistrement impossible. Réessayez dans quelques instants.';
}
