import { getServiceSupabase } from '@/lib/supabase/server';
import { canClaimOwner, isConfiguredOwner } from '@/lib/supabase/owner';

const reply = (body: object, status = 200) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

// The token is verified with Supabase before resolving or changing a role.
export async function completeLogin(token: string) {
  try {
    if (!token || token.length > 8185) return reply({ error: 'Connexion requise.' }, 401);
    const service = getServiceSupabase();
    if (!service) return reply({ error: 'Connexion indisponible.' }, 503);
    const { data: { user }, error } = await service.auth.getUser(token);
    if (error || !user || !user.email_confirmed_at || user.is_anonymous) return reply({ error: 'Connexion requise.' }, 401);
    const { data: profile, error: profileError } = await service.from('profiles').select('id,role').eq('id', user.id).single();
    if (profileError || !profile) return reply({ error: 'Votre espace est indisponible. Contactez Adam.' }, 503);

    if (isConfiguredOwner(user, process.env.ADMIN_EMAIL, process.env.ADMIN_USER_ID)) {
      const { data: admins, error: adminsError } = await service.from('profiles').select('id').eq('role', 'admin');
      if (adminsError || !admins || !canClaimOwner(user.id, admins)) return reply({ error: 'Accès vendeur indisponible.' }, 409);
      if (profile.role !== 'admin') {
        const { data: updated, error: updateError } = await service.from('profiles').update({ role: 'admin' }).eq('id', user.id).eq('role', 'client').select('id').single();
        if (updateError || !updated) return reply({ error: 'Accès vendeur indisponible.' }, 503);
      }
      return reply({ destination: '/admin' });
    }
    return reply({ destination: profile.role === 'admin' ? '/admin' : '/client' });
  } catch {
    return reply({ error: 'Connexion indisponible. Réessayez.' }, 503);
  }
}
