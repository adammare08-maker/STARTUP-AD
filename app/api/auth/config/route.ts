import { publicConfig } from '@/lib/supabase/public-config';

export const dynamic = 'force-dynamic';

// Explicit allowlist: never return process.env or any server credential.
export function GET() {
  const config = publicConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return Response.json(config ?? { error: 'Configuration indisponible' }, {
    status: config ? 200 : 503,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
