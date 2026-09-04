import { createContactHandler } from '../../../lib/contact/handler';
import { getServiceSupabase } from '@/lib/supabase/server';
import { saveThenNotify } from '@/lib/contact/formsubmit';

export const POST = createContactHandler({ processor: (data) => saveThenNotify(data, async (entry) => {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Storage unavailable');
  // Public intake: never trust an email or a browser-supplied role as account ownership.
  const { error } = await supabase.from('leads').insert({
    first_name: entry.firstName, startup: entry.startup, email: entry.email,
    website: entry.website || null, startup_description: entry.project,
    communication_need: entry.adType || null, budget: entry.budget || null, source: 'site_contact',
  });
  if (error) throw new Error('Storage unavailable');
}) });
