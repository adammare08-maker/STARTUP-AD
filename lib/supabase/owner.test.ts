import { afterEach, describe, expect, it, vi } from 'vitest';
import { canClaimOwner, isConfiguredOwner } from './owner';
import { authErrorMessage } from './auth-message';
const server = vi.hoisted(() => ({ getServiceSupabase: vi.fn() }));
vi.mock('@/lib/supabase/server', () => server);
import { POST } from '../../app/api/auth/complete/route';

const user = { id: 'owner-id', email: 'owner@example.test', email_confirmed_at: '2026-01-01' };
afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); });

describe('single verified seller', () => {
  it('requires verified email AND the pinned user ID', () => {
    expect(isConfiguredOwner(user, user.email, user.id)).toBe(true);
    expect(isConfiguredOwner({ ...user, id: 'someone-else' }, user.email, user.id)).toBe(false);
    expect(isConfiguredOwner({ ...user, email_confirmed_at: undefined }, user.email, user.id)).toBe(false);
    expect(isConfiguredOwner({ ...user, is_anonymous: true }, user.email, user.id)).toBe(false);
    expect(isConfiguredOwner({ ...user, email: 'another@example.test' }, user.email, user.id)).toBe(false);
    expect(isConfiguredOwner(user)).toBe(false);
  });
  it('refuses a second seller', () => {
    expect(canClaimOwner(user.id, [])).toBe(true);
    expect(canClaimOwner(user.id, [{ id: user.id }])).toBe(true);
    expect(canClaimOwner(user.id, [{ id: 'another' }])).toBe(false);
  });
  it('rejects unauthenticated calls before accessing the database', async () => {
    expect((await POST(new Request('https://example.test/api/auth/complete', { method: 'POST' }))).status).toBe(401);
    expect(server.getServiceSupabase).not.toHaveBeenCalled();
  });
  for (const scenario of ['invalid', 'unconfirmed', 'client', 'owner', 'already-admin', 'conflict', 'db-error']) {
    it(`handles ${scenario} without trusting submitted email or role`, async () => {
      vi.stubEnv('ADMIN_EMAIL', user.email); vi.stubEnv('ADMIN_USER_ID', user.id);
      const query: any = { select: vi.fn(), eq: vi.fn(), update: vi.fn(), single: vi.fn() };
      for (const method of ['select', 'eq', 'update']) query[method].mockReturnValue(query);
      query.single.mockResolvedValue({ data: { id: user.id, role: scenario === 'already-admin' ? 'admin' : 'client' }, error: scenario === 'db-error' ? {} : null });
      query.then = (resolve: (v: unknown) => unknown) => Promise.resolve({ data: scenario === 'conflict' ? [{ id: 'other-admin' }] : [], error: null }).then(resolve);
      const client = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: scenario === 'invalid' ? null : { ...user, id: scenario === 'client' ? 'client-id' : user.id, email_confirmed_at: scenario === 'unconfirmed' ? undefined : user.email_confirmed_at } }, error: null }) }, from: vi.fn().mockReturnValue(query) };
      server.getServiceSupabase.mockReturnValue(client);
      const response = await POST(new Request('https://example.test/api/auth/complete', { method: 'POST', headers: { Authorization: 'Bearer test-token' } }));
      if (['invalid', 'unconfirmed'].includes(scenario)) { expect(response.status).toBe(401); expect(client.from).not.toHaveBeenCalled(); }
      else if (scenario === 'conflict') expect(response.status).toBe(409);
      else if (scenario === 'db-error') expect(response.status).toBe(503);
      else expect(await response.json()).toEqual({ destination: scenario === 'client' ? '/client' : '/admin' });
      expect(query.update).toHaveBeenCalledTimes(scenario === 'owner' ? 1 : 0);
    });
  }
  it('provides safe actionable signup messages', () => {
    expect(authErrorMessage('email_exists', 'signup')).toContain('Se connecter');
    expect(authErrorMessage('email_not_confirmed')).toContain('Confirmez');
    expect(authErrorMessage('over_email_send_rate_limit')).toContain('Patientez');
    expect(authErrorMessage('database-internal-detail', 'signup')).not.toContain('database');
  });
});
