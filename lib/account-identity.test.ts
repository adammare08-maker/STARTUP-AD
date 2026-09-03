import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AccountIdentity } from '../components/account-identity';
import { accountInitials, googleAvatar } from './account-identity';

describe('private connected account identity', () => {
  it('uses initials when there is no Google photo', () => {
    expect(accountInitials('Alex Martin')).toBe('AM');
    expect(accountInitials('')).toBe('?');
    const html = renderToStaticMarkup(createElement(AccountIdentity, { name: 'Alex Martin', email: 'alex@example.test', role: 'client' }));
    expect(html).toContain('alex@example.test');
    expect(html).toContain('Connecté');
    expect(html).toContain('Espace client');
    expect(html).not.toContain('<img');
  });
  it('shows the seller role without hardcoded identity', () => {
    const html = renderToStaticMarkup(createElement(AccountIdentity, { name: 'Compte test', email: 'owner@example.test', role: 'admin', avatar: 'https://lh3.googleusercontent.com/a/test' }));
    expect(html).toContain('owner@example.test');
    expect(html).toContain('Espace vendeur');
    expect(html).toContain('referrerPolicy="no-referrer"');
    expect(html).toContain('<img');
  });
  it('rejects unsafe or unrelated avatar sources', () => {
    for (const src of ['javascript:alert(1)', 'http://lh3.googleusercontent.com/a', 'https://googleusercontent.com.evil.test/a', 'https://evil.test/a', 'https://user:pass@lh3.googleusercontent.com/a', {}, null]) expect(googleAvatar(src)).toBeNull();
    expect(googleAvatar('https://lh3.googleusercontent.com/a')).toBeTruthy();
  });
  it('handles malformed profile metadata and escapes displayed text', () => {
    expect(renderToStaticMarkup(createElement(AccountIdentity, { name: {}, role: 'client' }))).toContain('Mon compte');
    const html = renderToStaticMarkup(createElement(AccountIdentity, { name: '<script>alert(1)</script>', role: 'client' }));
    expect(html).not.toContain('<script>');
  });
});
