'use client';
import { useEffect, useState } from 'react';

type Account = { email?: string; destination: '/admin' | '/client' };
export function AccountLink() {
  const [account, setAccount] = useState<Account | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let controller: AbortController | undefined;
    let disposed = false;
    async function update() {
      controller?.abort();
      const current = new AbortController(); controller = current;
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store', signal: current.signal });
        if (!response.ok) throw new Error('Unavailable');
        const data = await response.json() as { account: Account | null };
        if (!disposed && !current.signal.aborted) { setAccount(data.account); setState('ready'); }
      } catch {
        if (!disposed && !current.signal.aborted) setState('error');
      }
    }
    void update();
    window.addEventListener('startup-ad:auth', update);
    window.addEventListener('focus', update);
    return () => { disposed = true; controller?.abort(); window.removeEventListener('startup-ad:auth', update); window.removeEventListener('focus', update); };
  }, []);
  if (state === 'loading') return <span className="header-login" role="status">Mon compte…</span>;
  if (!account) return <a className="header-login" href="/connexion">{state === 'error' ? 'Mon espace' : 'Se connecter'}</a>;
  return <a className="header-login connected-account" href={account.destination}>
    <span>● Connecté · {account.destination === '/admin' ? 'Espace vendeur' : 'Espace client'}</span>
    <small>{account.email}</small>
  </a>;
}
