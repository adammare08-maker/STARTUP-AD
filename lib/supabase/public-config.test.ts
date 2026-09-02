import { describe, expect, it } from 'vitest';
import { publicConfig } from './public-config';

describe('Public Supabase configuration allowlist', () => {
  const url = 'https://example.supabase.co';
  it('rejects missing configuration', () => expect(publicConfig()).toBeNull());
  it('rejects a server secret', () => expect(publicConfig(url, 'sb_secret_test_placeholder')).toBeNull());
  it('accepts a publishable key', () => expect(publicConfig(url, 'sb_publishable_test_placeholder')).toEqual({url,key:'sb_publishable_test_placeholder'}));
  it('rejects non-HTTPS URLs', () => expect(publicConfig('http://example.test', 'sb_publishable_test_placeholder')).toBeNull());
  it('rejects service-role JWTs', () => {
    const payload = Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url');
    expect(publicConfig(url, `test.${payload}.test`)).toBeNull();
  });
  it('accepts only anon legacy JWTs', () => {
    const payload = Buffer.from(JSON.stringify({role:'anon'})).toString('base64url');
    expect(publicConfig(url, `test.${payload}.test`)?.url).toBe(url);
  });
});
