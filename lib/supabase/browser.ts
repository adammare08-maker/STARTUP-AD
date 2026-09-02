import { createBrowserClient } from '@supabase/ssr';

export async function getBrowserSupabase() {
  const response = await fetch('/api/auth/config', { cache: 'no-store' });
  if (!response.ok) return null;
  const { url, key } = await response.json() as { url?: string; key?: string };
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
