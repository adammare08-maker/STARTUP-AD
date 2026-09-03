import { createBrowserClient } from '@supabase/ssr';

let clientPromise: ReturnType<typeof loadClient> | undefined;

export function getBrowserSupabase() {
  return clientPromise ??= loadClient().catch(error => { clientPromise = undefined; throw error; });
}

async function loadClient() {
  const response = await fetch('/api/auth/config', { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Authentication unavailable');
  const { url, key } = await response.json() as { url?: string; key?: string };
  if (!url || !key) throw new Error('Authentication unavailable');
  return createBrowserClient(url, key);
}
