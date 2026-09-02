import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* Server Component */ }
      },
    },
  });
}

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function requireRole(role: 'admin' | 'client') {
  const supabase = await getServerSupabase();
  if (!supabase) return { state: 'unconfigured' as const };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { state: 'anonymous' as const };
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || (role === 'admin' ? profile.role !== 'admin' : !['client', 'admin'].includes(profile.role))) return { state: 'forbidden' as const };
  return { state: 'ready' as const, supabase, user, profile };
}
