import { requireRole } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';

export async function GET() {
  const headers = { 'Cache-Control': 'private, no-store', Vary: 'Cookie', 'X-Content-Type-Options': 'nosniff' };
  try {
    const account = await requireRole('client');
    if (account.state === 'anonymous') return Response.json({ account: null }, { headers });
    if (account.state !== 'ready') return Response.json({ error: 'Espace indisponible.' }, { status: 503, headers });
    return Response.json({ account: {
      email: account.user.email,
      destination: account.profile.role === 'admin' ? '/admin' : '/client',
    } }, { headers });
  } catch {
    return Response.json({ error: 'Espace indisponible.' }, { status: 503, headers });
  }
}
