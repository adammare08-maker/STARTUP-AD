import type { ContactData } from './schema';

export type EmailSettings = {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
  sendConfirmation: boolean;
};

export type ContactEmailSender = (data: ContactData, settings: EmailSettings) => Promise<void>;

function optional(value: string) {
  return value || 'Non renseigné';
}

async function sendResendEmail(settings: EmailSettings, payload: Record<string, unknown>) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `startup-ad-${crypto.randomUUID()}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Email provider rejected the request');
}

export const sendContactEmails: ContactEmailSender = async (data, settings) => {
  const text = `Nouvelle demande reçue depuis STARTUP/AD

Prénom :
${data.firstName}

Startup :
${data.startup}

Email :
${data.email}

Site / LinkedIn :
${optional(data.website)}

Projet :
${data.project}

Besoin publicitaire :
${optional(data.adType)}

Budget :
${optional(data.budget)}`;

  await sendResendEmail(settings, {
    from: settings.fromEmail,
    to: [settings.toEmail],
    reply_to: data.email,
    subject: `Nouvelle demande STARTUP/AD — ${data.startup}`,
    text,
  });

  if (settings.sendConfirmation) {
    try {
      await sendResendEmail(settings, {
        from: settings.fromEmail,
        to: [data.email],
        reply_to: settings.toEmail,
        subject: 'Votre message à STARTUP/AD a bien été reçu',
        text: `Salut ${data.firstName},\n\nMerci de m’avoir présenté votre projet.\n\nJ’ai bien reçu votre message et je reviendrai vers vous dès que possible.\n\nAdam\nSTARTUP/AD`,
      });
    } catch {
      // La demande reste réussie si seule la confirmation facultative échoue.
    }
  }
};

export function readEmailSettings(env: Record<string, string | undefined> = process.env): EmailSettings | null {
  const apiKey = env.EMAIL_API_KEY?.trim();
  const toEmail = env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !toEmail || !fromEmail) return null;
  return {
    apiKey,
    toEmail,
    fromEmail,
    sendConfirmation: env.CONTACT_SEND_CONFIRMATION?.toLowerCase() === 'true',
  };
}
