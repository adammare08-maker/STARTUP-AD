export const dynamic = 'force-dynamic';

export async function GET() {
  let enabled = false;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const response = await fetch(`${url}/auth/v1/settings`, {
        headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const settings = await response.json() as { external?: { google?: boolean } };
        enabled = settings.external?.google === true;
      }
    }
  } catch { /* Only expose availability, never upstream errors. */ }
  return Response.json({ enabled }, { headers: { 'Cache-Control': 'no-store' } });
}
