import { completeLogin } from '@/lib/supabase/complete-login';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  const authorization = request.headers.get('authorization') ?? '';
  return completeLogin(authorization.startsWith('Bearer ') ? authorization.slice(7) : '');
}
