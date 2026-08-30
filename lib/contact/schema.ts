export const CONTACT_LIMITS = {
  firstName: 80,
  startup: 120,
  email: 254,
  website: 300,
  project: 3000,
  adType: 80,
  budget: 120,
  honey: 200,
} as const;

export type ContactData = {
  firstName: string;
  startup: string;
  email: string;
  website: string;
  project: string;
  adType: string;
  budget: string;
};

const allowedAdTypes = new Set(['', 'Vidéo courte', 'TikTok / Reels', 'Création visuelle', 'Animation']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/[\t ]+/g, ' ') : '';
}

function validWebsite(value: string) {
  if (!value) return true;
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function parseContactPayload(input: unknown):
  | { ok: true; data: ContactData; isHoneypot: boolean }
  | { ok: false } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false };
  const body = input as Record<string, unknown>;
  const values = {
    firstName: clean(body.firstName),
    startup: clean(body.startup),
    email: clean(body.email).toLowerCase(),
    website: clean(body.website),
    project: clean(body.project),
    adType: clean(body.adType),
    budget: clean(body.budget),
    honey: clean(body._honey),
  };

  const withinLimits = (key: keyof typeof CONTACT_LIMITS, value: string) =>
    value.length <= CONTACT_LIMITS[key];

  if (
    !values.firstName || !values.startup || !values.email || !values.project ||
    !withinLimits('firstName', values.firstName) ||
    !withinLimits('startup', values.startup) ||
    !withinLimits('email', values.email) ||
    !withinLimits('website', values.website) ||
    !withinLimits('project', values.project) ||
    !withinLimits('adType', values.adType) ||
    !withinLimits('budget', values.budget) ||
    !withinLimits('honey', values.honey) ||
    !emailPattern.test(values.email) ||
    !validWebsite(values.website) ||
    !allowedAdTypes.has(values.adType)
  ) return { ok: false };

  const { honey: _unused, ...data } = values;
  return { ok: true, data, isHoneypot: Boolean(values.honey) };
}
