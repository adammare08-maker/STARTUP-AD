'use client';

import { useEffect, useState, type SyntheticEvent } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import { authErrorMessage } from '@/lib/supabase/auth-message';
import { PasswordField } from '@/components/password-field';

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('oauth') === 'error') {
      setMessage('La connexion Google n’a pas abouti. Réessayez ou utilisez votre email et votre mot de passe.');
    }
  }, []);

  async function googleLogin() {
    if (loading) return;
    setLoading(true); setMessage('');
    try {
      const response = await fetch('/api/auth/google', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      const availability = await response.json() as { enabled?: boolean };
      if (!response.ok || availability.enabled !== true) {
        setMessage('La connexion Google n’est pas encore activée. Vous pouvez utiliser votre email et un mot de passe.');
        return;
      }
      const supabase = await getBrowserSupabase();
      if (!supabase) throw new Error('Unavailable');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw new Error('Unavailable');
    } catch {
      setMessage('Connexion Google indisponible pour le moment. Réessayez ou utilisez votre email.');
    } finally { setLoading(false); }
  }

  async function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault(); setLoading(true); setMessage('');
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const email = String(values.email || '').trim(); const password = String(values.password || '');
    try {
    const supabase = await getBrowserSupabase();
    if (!supabase) { setMessage('Les comptes clients ne sont pas encore activés.'); return; }
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { first_name: String(values.firstName || '') } } });
    if (result.error) setMessage(authErrorMessage(result.error.code, mode));
    else if (result.data.session) {
      const response = await fetch('/api/auth/complete', {
        method: 'POST', headers: { Authorization: `Bearer ${result.data.session.access_token}` },
        signal: AbortSignal.timeout(15000),
      });
      const outcome = await response.json() as { destination?: string };
      if (!response.ok || !['/admin', '/client'].includes(outcome.destination ?? '')) {
        setMessage('Votre connexion a réussi, mais votre espace est indisponible. Réessayez dans quelques instants.');
      } else window.location.assign(outcome.destination!);
    } else {
      setMessage('Vérifiez votre boîte mail (et les indésirables) pour confirmer votre adresse, puis connectez-vous. Si vous avez déjà un compte, utilisez « Se connecter ».');
    }
    } catch {
      setMessage('Connexion impossible pour le moment. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return <form className="auth-form" onSubmit={submit}>
    <h2>{mode === 'signup' ? 'Créer mon compte' : 'Me connecter'}</h2>
    <button className="google-login" type="button" disabled={loading} onClick={googleLogin}>Continuer avec Google</button>
    <p className="auth-divider">ou avec votre email</p>
    {mode === 'signup' && <label>Prénom<input name="firstName" maxLength={80} required /></label>}
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <PasswordField key={mode} mode={mode} />
    {mode === 'signup' && <small>Au moins 10 caractères. Un email vous permettra de confirmer votre adresse.</small>}
    {message && <p role="status">{message}</p>}
    <button className="submit-button" disabled={loading}>{loading ? 'Patientez…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte client'}</button>
    <button className="text-button" type="button" disabled={loading} onClick={() => { setMessage(''); setMode(mode === 'login' ? 'signup' : 'login'); }}>{mode === 'login' ? 'Créer un compte client' : 'J’ai déjà un compte'}</button>
    <small>Vous avez déjà un compte ? Connectez-vous. L’espace vendeur est réservé au compte vérifié d’Adam.</small>
  </form>;
}
