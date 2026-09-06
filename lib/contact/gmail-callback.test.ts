import { afterEach, expect, it, vi } from 'vitest';
const m=vi.hoisted(()=>({role:vi.fn(),store:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({requireRole:m.role}));
vi.mock('@/lib/contact/gmail',()=>({storeGmailAuthorization:m.store}));
import { GET } from '../../app/api/auth/gmail/callback/route';
afterEach(()=>{vi.resetAllMocks();vi.unstubAllGlobals();vi.unstubAllEnvs();});
it.each([true,false])('stores authorization only for a verified Google email: %s',async verified=>{
 m.role.mockResolvedValue({state:'ready',user:{id:'owner'}});
 vi.stubEnv('CONTACT_TO_EMAIL','owner@example.test');
 const fetcher=vi.fn().mockResolvedValueOnce(Response.json({access_token:'test',refresh_token:'test-refresh'})).mockResolvedValueOnce(Response.json({email:'owner@example.test',email_verified:verified}));
 vi.stubGlobal('fetch',fetcher);
 const response=await GET(new Request('https://site.example/api/auth/gmail/callback?state=test-state&code=test-code',{headers:{cookie:'gmail_oauth_state=test-state; gmail_oauth_verifier=test-verifier'}}));
 expect(fetcher.mock.calls[1][0]).toBe('https://openidconnect.googleapis.com/v1/userinfo');
 expect(response.headers.get('location')).toContain(verified?'gmail=connected':'gmail=wrong-account');
 expect(m.store).toHaveBeenCalledTimes(verified?1:0);
});
