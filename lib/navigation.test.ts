import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BackHome } from '../components/back-home';
import { PasswordField } from '../components/password-field';

describe('account navigation and password control', () => {
  it('returns home with an ordinary link, not a logout action', () => {
    const html = renderToStaticMarkup(createElement(BackHome));
    expect(html).toContain('href="/"');
    expect(html).toContain('Retour à l’accueil');
    expect(html).not.toContain('signOut');
  });
  for (const mode of ['login', 'signup'] as const) {
    it(`masks the ${mode} password initially and uses a non-submit toggle`, () => {
      const html = renderToStaticMarkup(createElement(PasswordField, { mode }));
      expect(html).toContain('type="password"');
      expect(html).toContain('type="button"');
      expect(html).toContain('aria-pressed="false"');
      expect(html).toContain('Afficher le mot de passe');
      expect(html).toContain(mode === 'login' ? 'current-password' : 'new-password');
    });
  }
});
