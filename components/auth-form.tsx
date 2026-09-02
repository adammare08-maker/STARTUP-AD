'use client';

import { useState, type SyntheticEvent } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault(); setLoading(true); setMessage('');
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const email = String(values.email || ''); const password = String(values.password || '');
    try {
    const supabase = await getBrowserSupabase();
    if (!supabase) { setMessage('Les comptes clients ne sont pas encore activés.'); return; }
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { first_name: String(values.firstName || '') } } });
    if (result.error) setMessage('Connexion impossible. Vérifiez les informations saisies.');
    else if (mode === 'signup') setMessage('Compte créé. Vérifiez votre email si une confirmation est demandée.');
    else window.location.assign('/client');
    } catch {
      setMessage('Connexion impossible pour le moment. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return <form className="auth-form" onSubmit={submit}>
    {mode === 'signup' && <label>Prénom<input name="firstName" maxLength={80} required /></label>}
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Mot de passe<input name="password" type="password" minLength={10} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>
    {message && <p role="status">{message}</p>}
    <button className="submit-button" disabled={loading}>{loading ? 'Patientez…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte client'}</button>
    <button className="text-button" type="button" onClick={() => { setMessage(''); setMode(mode === 'login' ? 'signup' : 'login'); }}>{mode === 'login' ? 'Créer un compte client' : 'J’ai déjà un compte'}</button>
    <small>Un compte client ne peut jamais devenir un compte vendeur. Adam reste l’unique administrateur.</small>
  </form>;
}
