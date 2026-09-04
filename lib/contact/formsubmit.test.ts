import { afterEach, describe, expect, it, vi } from 'vitest';
import { notifyFormSubmit, saveThenNotify } from './formsubmit';
const data = { firstName: 'Test', startup: 'Test', email: 'test@example.com', website: '', project: 'Test', adType: '', budget: '' };
afterEach(() => vi.unstubAllGlobals());
describe('durable contact and FormSubmit', () => {
  it('saves before notifying', async () => {
    const order: string[] = [];
    expect(await saveThenNotify(data, async () => { order.push('save'); }, async () => { order.push('email'); })).toEqual({ notification: 'submitted' });
    expect(order).toEqual(['save', 'email']);
  });
  it('retains success when email fails', async () => {
    expect(await saveThenNotify(data, async () => {}, async () => { throw Error(); })).toEqual({ notification: 'pending' });
  });
  it('does not notify after storage failure', async () => {
    const notify = vi.fn();
    await expect(saveThenNotify(data, async () => { throw Error(); }, notify)).rejects.toThrow();
    expect(notify).not.toHaveBeenCalled();
  });
  it('requires provider success, not only HTTP 200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: false })));
    await expect(notifyFormSubmit(data)).rejects.toThrow();
  });
  it('sends only fixed fields including Reply-To', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ success: 'true' }));vi.stubGlobal('fetch', fetcher);
    await notifyFormSubmit(data);
    expect(JSON.parse(fetcher.mock.calls[0][1].body)._replyto).toBe(data.email);
  });
});
