'use client';

import { useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  async function logout() {
    setLoading(true);
    setError(false);
    try {
      const supabase = await getBrowserSupabase();
      if (!supabase) throw new Error('Unavailable');
      const result = await supabase.auth.signOut({ scope: 'local' });
      if (result.error) throw new Error('Unavailable');
      window.location.assign('/connexion');
    } catch {
      setError(true);
      setLoading(false);
    }
  }
  return <div><button type="button" className="text-button" disabled={loading} onClick={logout}>{loading ? 'Déconnexion…' : 'Se déconnecter'}</button>{error && <p role="alert">Déconnexion impossible. Réessayez.</p>}</div>;
}
