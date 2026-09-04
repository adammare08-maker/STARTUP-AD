import { afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ requireRole: vi.fn(), createServerClient: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ requireRole: mocks.requireRole }));
vi.mock('@supabase/ssr', () => ({ createServerClient: mocks.createServerClient }));
import { GET } from '../../app/api/auth/session/route';
import { middleware, config } from '../../middleware';
import { NextRequest } from 'next/server';

afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });
describe('Authenticated account navigation', () => {
  it.each(['client', 'admin'])('uses only the verified database role: %s', async role => {
    mocks.requireRole.mockResolvedValue({ state: 'ready', user: { email: 'test@example.test', user_metadata: { role: 'admin' } }, profile: { role } });
    const r = await GET();
    expect(await r.json()).toEqual({ account: { email: 'test@example.test', destination: '/' + role } });
    expect(mocks.requireRole).toHaveBeenCalledWith('client');
    expect(r.headers.get('cache-control')).toContain('no-store');
    expect(r.headers.get('vary')).toBe('Cookie');
  });
  it('returns no identity after logout or without a session', async () => {
    mocks.requireRole.mockResolvedValue({ state: 'anonymous' });
    expect(await (await GET()).json()).toEqual({ account: null });
  });
  it.each(['unconfigured', 'forbidden'])('fails closed for %s', async state => {
    mocks.requireRole.mockResolvedValue({ state });
    expect((await GET()).status).toBe(503);
  });
  it('does not expose backend errors', async () => {
    mocks.requireRole.mockRejectedValue(new Error('sensitive internal detail'));
    expect(await (await GET()).text()).not.toContain('sensitive');
  });
});

describe('SSR session renewal', () => {
  it('refreshes the workspace write endpoint as well as pages', () => {
    expect(config.matcher).toContain('/api/workspace');
  });
  it('passes rotated and removed cookies to both the page and browser', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-public');
    const request = new NextRequest('https://site.example/client', { headers: { cookie: 'sb-test=old; sb-test.1=obsolete' } });
    const getUser = vi.fn();
    mocks.createServerClient.mockImplementation((_url, _key, options) => {
      getUser.mockImplementation(async () => {
        expect(options.cookies.getAll().find((c: {name: string}) => c.name === 'sb-test').value).toBe('old');
        options.cookies.setAll([
          { name: 'sb-test', value: 'rotated', options: { path: '/', sameSite: 'lax', maxAge: 40000000 } },
          { name: 'sb-test.1', value: '', options: { path: '/', maxAge: 0 } },
        ]);
        return { data: { user: { id: 'test-client' } } };
      });
      return { auth: { getUser } };
    });
    const result = await middleware(request);
    expect(getUser).toHaveBeenCalledOnce();
    expect(request.cookies.get('sb-test')?.value).toBe('rotated');
    expect(result.cookies.get('sb-test')?.value).toBe('rotated');
    expect(result.cookies.get('sb-test.1')?.maxAge).toBe(0);
    expect(result.headers.get('x-middleware-request-cookie')).toContain('sb-test=rotated');
    expect(result.headers.get('cache-control')).toBe('private, no-store');
  });
  it('does not remove valid cookies on transient network failure', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-public');
    mocks.createServerClient.mockReturnValue({ auth: { getUser: vi.fn().mockRejectedValue(new Error('offline')) } });
    const r = await middleware(new NextRequest('https://site.example/admin'));
    expect(r.cookies.getAll()).toEqual([]);
    expect(r.headers.get('cache-control')).toContain('no-store');
  });
});
