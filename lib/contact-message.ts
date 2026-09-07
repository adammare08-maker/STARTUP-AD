export const contactEmail = 'startup.ad.contact@gmail.com';

export function prepareContactEmail(values: { name: string; email: string; startup: string; message: string }) {
  // Visitor content stays in the body, never in recipient or header fields.
  const body = `Bonjour Adam,\n\n${values.message.trim()}\n\nNom : ${values.name.trim()}\nEmail de contact : ${values.email.trim()}\nStartup : ${values.startup.trim() || 'Non précisée'}`;
  return `mailto:${contactEmail}?subject=${encodeURIComponent('Parlons de mon projet — STARTUP/AD')}&body=${encodeURIComponent(body)}`;
}
