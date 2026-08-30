import { sendContactEmails, readEmailSettings, type ContactEmailSender, type EmailSettings } from './email';
import { contactRateLimiter, type ContactRateLimiter } from './rate-limit';
import { parseContactPayload } from './schema';

const MAX_BODY_BYTES = 16 * 1024;
const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

function json(status: number, body: object, extraHeaders?: HeadersInit) {
  const headers = new Headers(jsonHeaders);
  if (extraHeaders) new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  return new Response(JSON.stringify(body), { status, headers });
}

function clientKey(request: Request) {
  return request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

type HandlerOptions = {
  sender?: ContactEmailSender;
  limiter?: Pick<ContactRateLimiter, 'check'>;
  settings?: EmailSettings | null;
};

export function createContactHandler(options: HandlerOptions = {}) {
  const sender = options.sender ?? sendContactEmails;
  const limiter = options.limiter ?? contactRateLimiter;

  return async function POST(request: Request) {
    if (!isSameOrigin(request)) return json(403, { ok: false, message: 'Requête refusée.' });
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return json(415, { ok: false, message: 'Requête invalide.' });
    }
    const declaredSize = Number(request.headers.get('content-length') || 0);
    if (declaredSize > MAX_BODY_BYTES) return json(413, { ok: false, message: 'Message trop volumineux.' });

    let raw: string;
    try { raw = await request.text(); } catch { return json(400, { ok: false, message: 'Requête invalide.' }); }
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json(413, { ok: false, message: 'Message trop volumineux.' });
    }

    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { return json(400, { ok: false, message: 'Requête invalide.' }); }
    const parsed = parseContactPayload(payload);
    if (!parsed.ok) return json(400, { ok: false, message: 'Vérifiez les informations du formulaire.' });

    // Les robots qui remplissent le honeypot reçoivent une réponse neutre sans déclencher d’email.
    if (parsed.isHoneypot) return json(200, { ok: true });

    const rate = limiter.check(clientKey(request));
    if (!rate.allowed) return json(429, { ok: false, message: 'Trop de tentatives. Réessayez plus tard.' }, { 'Retry-After': String(rate.retryAfter) });

    const settings = options.settings === undefined ? readEmailSettings() : options.settings;
    if (!settings) return json(500, { ok: false, message: 'Le message n’a pas pu être envoyé.' });

    try {
      await sender(parsed.data, settings);
      return json(200, { ok: true });
    } catch {
      return json(500, { ok: false, message: 'Le message n’a pas pu être envoyé.' });
    }
  };
}
