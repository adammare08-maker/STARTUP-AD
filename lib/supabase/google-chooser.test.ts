import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { createClient } from '@supabase/supabase-js';

it('keeps the account chooser configured in the login form', () => {
  const form = readFileSync(new URL('../../components/auth-form.tsx', import.meta.url), 'utf8');
  expect(form).toContain("queryParams: { prompt: 'select_account' }");
});

it('Supabase forwards the account chooser parameter in the OAuth authorization URL', async () => {
  const client = createClient('https://test.supabase.co', 'public-test', {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://site.example/auth/callback', skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
  });
  expect(error).toBeNull();
  const url = new URL(data.url!);
  expect(url.searchParams.get('prompt')).toBe('select_account');
  expect(url.searchParams.get('provider')).toBe('google');
  expect(url.searchParams.get('redirect_to')).toBe('https://site.example/auth/callback');
});
