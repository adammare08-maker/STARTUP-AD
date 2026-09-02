export function publicConfig(url?: string, key?: string) {
  if (!url || !key) return null;
  try {
    if (new URL(url).protocol !== 'https:') return null;
    const isPublic = key.startsWith('sb_publishable_') ||
      JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role === 'anon';
    return isPublic ? { url, key } : null;
  } catch { return null; }
}
