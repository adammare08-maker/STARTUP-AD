import { AccountAvatar } from '@/components/account-avatar';
import { googleAvatar } from '@/lib/account-identity';

// Render only inside a server-authorized private page. Never pass the full user/session to the client.
export function AccountIdentity({ email, name, avatar, role }: {
  email?: string;
  name?: unknown;
  avatar?: unknown;
  role: 'admin' | 'client';
}) {
  const displayName = (typeof name === 'string' ? name.trim().slice(0, 120) : '') || 'Mon compte';
  return <section className="account-identity" aria-label="Compte connecté">
    <AccountAvatar name={displayName} src={googleAvatar(avatar)} />
    <div className="account-details">
      <strong>{displayName}</strong>
      <span className="account-email">{email || 'Adresse non disponible'}</span>
      <span className="account-status"><span aria-hidden="true" />Connecté · {role === 'admin' ? 'Espace vendeur' : 'Espace client'}</span>
    </div>
  </section>;
}
