type Entry = { count: number; resetAt: number };

export class ContactRateLimiter {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly limit = 5, private readonly windowMs = 10 * 60 * 1000) {}

  check(key: string, now = Date.now()) {
    const current = this.entries.get(key);
    if (!current || current.resetAt <= now) {
      this.entries.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, retryAfter: 0 };
    }
    current.count += 1;
    if (current.count > this.limit) {
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
    }
    return { allowed: true, retryAfter: 0 };
  }
}

export const contactRateLimiter = new ContactRateLimiter();
