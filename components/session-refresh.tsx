'use client';
import { useEffect } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export function SessionRefresh() {
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    // Mount the standard Supabase browser client on every page, not only login.
    // Its cookie storage and automatic refresh are the sole session mechanism.
    void getBrowserSupabase().then(client => {
      if (cancelled || !client) return;
      const { data } = client.auth.onAuthStateChange(() => {
        // Do not await Supabase operations inside its auth callback (lock).
        window.dispatchEvent(new Event('startup-ad:auth'));
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }).catch(() => { /* UI can retry; do not erase a session on network failure. */ });
    function restore(event: PageTransitionEvent) {
      if (event.persisted) window.location.reload();
    }
    window.addEventListener('pageshow', restore);
    return () => { cancelled = true; unsubscribe?.(); window.removeEventListener('pageshow', restore); };
  }, []);
  return null;
}
