import { afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ getServerSupabase: vi.fn(), completeLogin: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ getServerSupabase: mocks.getServerSupabase }));
vi.mock('@/lib/supabase/complete-login', () => ({ completeLogin: mocks.completeLogin }));
import { GET as callback } from '../../app/auth/callback/route';
import { GET as availability } from '../../app/api/auth/google/route';

afterEach(() => { vi.resetAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('Google OAuth callback', () => {
  for (const query of ['', '?error=access_denied', '?code=' + 'x'.repeat(2049)]) {
    it(`rejects invalid callback (${query.length}) without exposing provider errors`, async () => {
      const r = await callback(new Request('https://site.example/auth/callback' + query));
      expect(r.status).toBe(303);
      expect(r.headers.get('location')).toBe('/connexion?oauth=error');
      expect(mocks.getServerSupabase).not.toHaveBeenCalled();
    });
  }
  for (const destination of ['/client', '/admin']) {
    it(`exchanges PKCE and uses only the server-approved ${destination} destination`, async () => {
      const exchange = vi.fn().mockResolvedValue({ data: { session: { access_token: 'test-token' } }, error: null });
      mocks.getServerSupabase.mockResolvedValue({ auth: { exchangeCodeForSession: exchange } });
      mocks.completeLogin.mockResolvedValue(Response.json({ destination }));
      const r = await callback(new Request('https://site.example/auth/callback?code=test-code&next=https://evil.example&role=admin'));
      expect(exchange).toHaveBeenCalledWith('test-code');
      expect(mocks.completeLogin).toHaveBeenCalledWith('test-token');
      expect(r.headers.get('location')).toBe(destination);
      expect(r.headers.get('cache-control')).toBe('no-store');
    });
  }
  it('fails safely on expired codes, missing verifier or network errors', async () => {
    mocks.getServerSupabase.mockResolvedValue({ auth: { exchangeCodeForSession: vi.fn().mockRejectedValue(new Error('private-detail')) } });
    const r = await callback(new Request('https://site.example/auth/callback?code=expired'));
    expect(r.headers.get('location')).toBe('/connexion?oauth=error');
    expect(mocks.completeLogin).not.toHaveBeenCalled();
  });
  it('rejects unsafe role resolution destinations', async () => {
    mocks.getServerSupabase.mockResolvedValue({ auth: { exchangeCodeForSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'test' } } }) } });
    mocks.completeLogin.mockResolvedValue(Response.json({ destination: '//evil.example' }));
    expect((await callback(new Request('https://site.example/auth/callback?code=ok'))).headers.get('location')).toBe('/connexion?oauth=error');
  });
});
describe('Google availability', () => {
  for (const enabled of [true, false]) {
    it(`reports provider state ${enabled} without returning configuration`, async () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project.example');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-public-key');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ external: { google: enabled }, other: 'not-for-client' })));
      expect(await (await availability()).json()).toEqual({ enabled });
    });
  }
  it('handles provider outages safely', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project.example');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-public-key');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('private-detail')));
    expect(await (await availability()).json()).toEqual({ enabled: false });
  });
});
