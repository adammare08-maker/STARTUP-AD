import { getServerSupabase } from '@/lib/supabase/server';
import { completeLogin } from '@/lib/supabase/complete-login';

export const dynamic = 'force-dynamic';
const redirect = (path: string) => new Response(null, {
  status: 303,
  headers: { Location: path, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
});

export async function GET(request: Request) {
  if (request.method !== 'GET') return new Response(null, { status: 405 });
  try {
    const params = new URL(request.url).searchParams;
    const code = params.get('code');
    if (params.has('error') || !code || code.length > 2048) return redirect('/connexion?oauth=error');
    const supabase = await getServerSupabase();
    if (!supabase) return redirect('/connexion?oauth=error');
    // PKCE verifies the code against the initiating browser's cookie verifier.
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) return redirect('/connexion?oauth=error');
    const result = await completeLogin(data.session.access_token);
    const outcome = await result.json() as { destination?: string };
    if (!result.ok || !['/admin', '/client'].includes(outcome.destination ?? '')) return redirect('/connexion?oauth=error');
    // Never accept a destination, host or role supplied in the OAuth query.
    return redirect(outcome.destination!);
  } catch {
    return redirect('/connexion?oauth=error');
  }
}
