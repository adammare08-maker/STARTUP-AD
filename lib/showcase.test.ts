import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { contactEmail, prepareContactEmail } from './contact-message';

const read = (path: string) => readFileSync(path, 'utf8');
const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
const page = read('app/page.tsx');

describe('Contact email preparation', () => {
  it('uses only the professional recipient and a fixed subject', () => {
    const url = new URL(prepareContactEmail({name:'Léa',email:'lea@example.com',startup:'Nova',message:'Bonjour & merci !'}));
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe(contactEmail);
    expect(url.searchParams.get('subject')).toBe('Parlons de mon projet — STARTUP/AD');
    expect(url.searchParams.get('body')).toContain('Bonjour & merci !');
    expect(url.searchParams.get('body')).toContain('Léa');
  });
  it('cannot inject recipients through visitor content', () => {
    const url = new URL(prepareContactEmail({name:'X\r\nBcc: other@example.com', email:'a@example.com&bcc=other@example.com',startup:'',message:'?cc=test@example.com#test'}));
    expect([...url.searchParams.keys()]).toEqual(['subject','body']);
    expect(url.pathname).toBe(contactEmail);
    expect(url.hash).toBe('');
    expect(url.searchParams.get('body')).toContain('Non précisée');
  });
  it('has four labelled fields and does not claim delivery', () => {
    const form = read('components/contact-form.tsx');
    expect(form.match(/<input\b/g)?.length).toBe(3);
    expect(form.match(/<textarea\b/g)?.length).toBe(1);
    for(const name of ['name','email','startup','message']) {
      expect(form).toContain('htmlFor="contact-'+name+'"');
      expect(form).toContain('id="contact-'+name+'"');
    }
    expect(form).toContain('Il n’est pas encore envoyé');
    expect(form).not.toMatch(/fetch\(|localStorage|sessionStorage/);
  });
});

describe('Showcase boundaries', () => {
  it('has no platform routes or session middleware', () => {
    for(const route of ['admin','client','connexion','demande','api','auth']) {
      const path = 'app/'+route;
      expect(existsSync(path) ? files(path) : []).toEqual([]);
    }
    expect(existsSync('middleware.ts')).toBe(false);
    expect(read('app/layout.tsx')).not.toContain('SessionRefresh');
  });
  it('has no dead internal navigation or missing media', () => {
    const ids = [...page.matchAll(/id="([^"]+)"/g)].map(match=>match[1]);
    for(const [,href] of page.matchAll(/href="([^"]+)"/g)) {
      if(href.startsWith('#')) expect(ids).toContain(href.slice(1));
      else if(href.startsWith('/videos/')) expect(existsSync('public'+href)).toBe(true);
      else if(href.startsWith('/')) expect(existsSync('app'+href+'/page.tsx')).toBe(true);
      else expect(href).toBe('mailto:'+contactEmail);
    }
    for(const [,src] of page.matchAll(/(?:src|poster)="([^"]+)"/g)) expect(existsSync('public'+src.split('?')[0])).toBe(true);
  });
  it('keeps both portfolio videos and the personal method', () => {
    expect(page.match(/<video\b/g)?.length).toBe(2);
    for(const phase of ['Prospecter','Rencontrer','Comprendre','Proposer','Créer']) expect(page).toContain(phase);
    expect(page).not.toMatch(/AccountLink|Se connecter|Créer un compte/);
  });
  it('removes Supabase and Stripe dependencies and all runtime secret reads', () => {
    const deps = JSON.parse(read('package.json')).dependencies;
    for(const name of ['stripe','@supabase/ssr','@supabase/supabase-js']) expect(deps[name]).toBeUndefined();
    const active = [...files('app'),...files('components').filter(p=>!p.includes(join('components','ui'))),...files('lib').filter(p=>!p.endsWith('.test.ts'))];
    for(const file of active.filter(p=>/\.(tsx?|css)$/.test(p))) expect(read(file)).not.toMatch(/process\.env|SUPABASE_SERVICE_ROLE_KEY|GMAIL_CLIENT_SECRET|STRIPE_SECRET_KEY/);
    expect(read('.gitignore')).toContain('.env*');
    expect(read('.env.example')).not.toMatch(/=.+/);
  });
});
