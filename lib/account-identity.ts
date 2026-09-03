export function googleAvatar(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    return url.hostname === 'googleusercontent.com' || url.hostname.endsWith('.googleusercontent.com') ? url.href : null;
  } catch { return null; }
}

export function accountInitials(name: string) {
  return name.trim().split(/\s+/u).slice(0, 2).map(part => Array.from(part)[0] ?? '').join('').toLocaleUpperCase('fr-FR') || '?';
}
