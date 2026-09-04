import type { ContactData } from './schema';

export async function notifyFormSubmit(data: ContactData) {
  const recipient = process.env.CONTACT_TO_EMAIL?.trim() || 'startup.ad.contact@gmail.com';
  // Identify the actual form page for this server-to-server submission.
  // Never forward arbitrary visitor headers or a visitor-provided website.
  const siteOrigin = 'https://startup-ad-adam.adam-mare08.chatgpt.site';
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json',
      Referer: `${siteOrigin}/`, Origin: siteOrigin },
    signal: AbortSignal.timeout(12000),
    body: JSON.stringify({
      name: data.firstName, email: data.email, startup: data.startup,
      website: data.website, message: data.project, advertising_need: data.adType, budget: data.budget,
      _replyto: data.email, _subject: `Nouvelle demande STARTUP/AD — ${data.startup.replace(/[\r\n]/g, ' ')}`,
      _template: 'table', _captcha: 'false',
    }),
  });
  if (!response.ok) throw new Error(`FORMSUBMIT_HTTP_${response.status}`);
  let result: unknown;
  try { result = await response.json(); } catch { throw new Error('FORMSUBMIT_NON_JSON'); }
  if (!response.ok || !result || typeof result !== 'object' || !('success' in result) ||
    ![true, 'true'].includes(result.success as boolean | string)) {
      const message = result && typeof result === 'object' && 'message' in result ? String(result.message) : '';
      if (/activat/i.test(message)) throw new Error('FORMSUBMIT_ACTIVATION');
      if (/web server|HTML files/i.test(message)) throw new Error('FORMSUBMIT_ORIGIN');
      if (/email/i.test(message)) throw new Error('FORMSUBMIT_ADDRESS');
      throw new Error('FORMSUBMIT_REJECTED');
    }
}

export async function saveThenNotify(data: ContactData, save: (data: ContactData) => Promise<void>, notify = notifyFormSubmit) {
  await save(data);
  try { await notify(data); return { notification: 'submitted' as const }; }
  catch (error) {
    const code = error instanceof Error && /^FORMSUBMIT_(HTTP_\d{3}|NON_JSON|ACTIVATION|ORIGIN|ADDRESS|REJECTED)$/.test(error.message)
      ? error.message : 'FORMSUBMIT_NETWORK';
    console.warn('contact_notification', code);
    return { notification: 'pending' as const };
  }
}
