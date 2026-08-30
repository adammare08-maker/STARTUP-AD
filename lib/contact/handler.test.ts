import { describe, expect, it, vi } from 'vitest';
import { createContactHandler } from './handler';
import { ContactRateLimiter } from './rate-limit';

const settings = {
  apiKey: 'test-key',
  toEmail: 'recipient@example.com',
  fromEmail: 'STARTUP/AD <contact@example.com>',
  sendConfirmation: false,
};

const validPayload = {
  firstName: 'Léa',
  startup: 'Nova',
  email: 'lea@nova.example',
  website: 'https://nova.example',
  project: 'Une application qui aide les fondateurs à mieux présenter leur produit.',
  adType: 'Vidéo courte',
  budget: '500 €',
  _honey: '',
};

function request(body: unknown, ip = '203.0.113.10') {
  return new Request('https://startup-ad.example/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': ip },
    body: JSON.stringify(body),
  });
}

function setup(sender = vi.fn().mockResolvedValue(undefined), limit = 5) {
  return {
    sender,
    handler: createContactHandler({ sender, settings, limiter: new ContactRateLimiter(limit, 60_000) }),
  };
}

describe('POST /api/contact', () => {
  it('accepte un formulaire valide et transmet les données normalisées', async () => {
    const { handler, sender } = setup();
    const response = await handler(request({ ...validPayload, firstName: '  Léa  ' }));
    expect(response.status).toBe(200);
    expect(sender).toHaveBeenCalledOnce();
    expect(sender.mock.calls[0][0].firstName).toBe('Léa');
  });

  it.each([
    [{ ...validPayload, email: 'email-invalide' }, 'email invalide'],
    [{ ...validPayload, project: '' }, 'champ obligatoire absent'],
    [{ ...validPayload, project: 'x'.repeat(3001) }, 'champ trop long'],
  ])('rejette un formulaire invalide : %s', async (payload) => {
    const { handler, sender } = setup();
    const response = await handler(request(payload));
    expect(response.status).toBe(400);
    expect(sender).not.toHaveBeenCalled();
  });

  it('ignore silencieusement un honeypot rempli', async () => {
    const { handler, sender } = setup();
    const response = await handler(request({ ...validPayload, _honey: 'robot' }));
    expect(response.status).toBe(200);
    expect(sender).not.toHaveBeenCalled();
  });

  it('limite les requêtes répétées', async () => {
    const { handler, sender } = setup(undefined, 1);
    expect((await handler(request(validPayload))).status).toBe(200);
    const response = await handler(request(validPayload));
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeTruthy();
    expect(sender).toHaveBeenCalledOnce();
  });

  it('masque une erreur du fournisseur', async () => {
    const { handler } = setup(vi.fn().mockRejectedValue(new Error('secret provider error')));
    const response = await handler(request(validPayload));
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain('secret provider error');
  });

  it('confirme une réussite complète sans exposer de détail interne', async () => {
    const { handler } = setup();
    const response = await handler(request(validPayload));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
