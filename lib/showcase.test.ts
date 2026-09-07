import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(path, 'utf8');
const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
const page = read('app/page.tsx');

describe('STARTUP/AD showcase', () => {
  it('keeps only public showcase routes', () => {
    for (const route of ['admin', 'client', 'connexion', 'demande', 'api', 'auth']) {
      const path = 'app/' + route;
      expect(existsSync(path) ? files(path) : []).toEqual([]);
    }
    expect(existsSync('middleware.ts')).toBe(false);
  });

  it('removes the contact section and contact form', () => {
    expect(page).not.toMatch(/ContactForm|className="contact"|id="contact"|Préparer mon email/);
    expect(existsSync('components/contact-form.tsx')).toBe(false);
    expect(existsSync('lib/contact-message.ts')).toBe(false);
    expect(page).toContain('mailto:startup.ad.contact@gmail.com');
  });

  it('keeps portfolio, navigation and only valid links', () => {
    expect(page.match(/<video\b/g)?.length).toBe(2);
    for (const phase of ['Prospecter', 'Rencontrer', 'Comprendre', 'Proposer', 'Créer']) expect(page).toContain(phase);
    const ids = [...page.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
    for (const [, href] of page.matchAll(/href="([^"]+)"/g)) {
      if (href.startsWith('#')) expect(ids).toContain(href.slice(1));
      else if (href.startsWith('/videos/')) expect(existsSync('public' + href)).toBe(true);
      else if (href.startsWith('/')) expect(existsSync('app' + href + '/page.tsx')).toBe(true);
    }
  });

  it('does not expose secrets or platform dependencies', () => {
    const deps = JSON.parse(read('package.json')).dependencies;
    for (const name of ['stripe', '@supabase/ssr', '@supabase/supabase-js']) expect(deps[name]).toBeUndefined();
    expect(read('.gitignore')).toContain('.env*');
    expect(read('.env.example')).not.toMatch(/=.+/);
  });
});
