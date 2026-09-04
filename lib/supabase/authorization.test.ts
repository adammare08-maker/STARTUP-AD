import { beforeEach, describe, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ create: vi.fn(), cookies: vi.fn(), user: vi.fn(), profile: vi.fn(), eq: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: m.cookies }));
vi.mock('@supabase/ssr', () => ({ createServerClient: m.create }));
import { requireRole } from './server';

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-test');
  m.cookies.mockResolvedValue({ getAll: () => [], set: vi.fn() });
  m.eq.mockReturnValue({ single: m.profile });
  m.create.mockReturnValue({ auth: { getUser: m.user }, from: () => ({ select: () => ({ eq: m.eq }) }) });
});
describe('Server authorization (no trusted browser role)', () => {
  it('does not mistake a database outage for an account role', async () => {
    m.user.mockResolvedValue({ data: { user: { id: 'client-id' } } });
    m.profile.mockResolvedValue({ data: null, error: { message: 'private error' } });
    expect((await requireRole('client')).state).toBe('unavailable');
    expect((await requireRole('admin')).state).toBe('unavailable');
  });
  it('rejects anonymous access to both spaces', async () => {
    m.user.mockResolvedValue({ data: { user: null } });
    expect((await requireRole('admin')).state).toBe('anonymous');
    expect((await requireRole('client')).state).toBe('anonymous');
    expect(m.profile).not.toHaveBeenCalled();
  });
  it('refuses admin even when client metadata claims admin', async () => {
    m.user.mockResolvedValue({ data: { user: { id: 'client-id', user_metadata: { role: 'admin' } } } });
    m.profile.mockResolvedValue({ data: { role: 'client' } });
    expect((await requireRole('admin')).state).toBe('forbidden');
    expect((await requireRole('client')).state).toBe('ready');
    expect(m.eq).toHaveBeenCalledWith('id', 'client-id');
  });
  it('accepts admin from the authenticated profile only', async () => {
    m.user.mockResolvedValue({ data: { user: { id: 'owner-id' } } });
    m.profile.mockResolvedValue({ data: { role: 'admin' } });
    expect((await requireRole('admin')).state).toBe('ready');
    expect(m.eq).toHaveBeenCalledWith('id', 'owner-id');
  });
  it('fails closed on missing/inaccessible profile', async () => {
    m.user.mockResolvedValue({ data: { user: { id: 'client-id' } } });
    m.profile.mockResolvedValue({ data: null });
    expect((await requireRole('admin')).state).toBe('forbidden');
  });
});
