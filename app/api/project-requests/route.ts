import { ContactRateLimiter } from '@/lib/contact/rate-limit';
import { readEmailSettings, sendContactEmails } from '@/lib/contact/email';
import { getServiceSupabase } from '@/lib/supabase/server';

const limiter = new ContactRateLimiter(5, 10 * 60 * 1000);
const limits: Record<string, number> = { firstName:80,lastName:80,startup:120,email:254,website:300,linkedin:300,startupDescription:3000,problemSolved:1200,targetAudience:1200,communicationNeed:1600,service:120,budget:120,desiredDeadline:120,message:1600,_honey:200 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function reply(status:number, body:object, headers?:HeadersInit){ return Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}}); }
function clean(input:unknown){return typeof input==='string'?input.trim():'';}

export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin && new URL(origin).host!==new URL(request.url).host) return reply(403,{ok:false});
  if(!request.headers.get('content-type')?.startsWith('application/json')) return reply(415,{ok:false});
  if(Number(request.headers.get('content-length')||0)>20_000) return reply(413,{ok:false});
  let raw:unknown; try{raw=await request.json();}catch{return reply(400,{ok:false});}
  if(!raw||typeof raw!=='object'||Array.isArray(raw)) return reply(400,{ok:false});
  const body=Object.fromEntries(Object.keys(limits).map((key)=>[key,clean((raw as Record<string,unknown>)[key])]));
  if(Object.entries(limits).some(([key,max])=>body[key].length>max)||!body.firstName||!body.startup||!body.startupDescription||!body.communicationNeed||!emailPattern.test(body.email)) return reply(400,{ok:false});
  if(body._honey) return reply(200,{ok:true});
  const ip=request.headers.get('cf-connecting-ip')||request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
  const rate=limiter.check(ip); if(!rate.allowed)return reply(429,{ok:false},{'Retry-After':String(rate.retryAfter)});

  const supabase=getServiceSupabase();
  if(supabase){
    const {error}=await supabase.from('leads').insert({first_name:body.firstName,last_name:body.lastName||null,startup:body.startup,email:body.email.toLowerCase(),website:body.website||null,linkedin:body.linkedin||null,startup_description:body.startupDescription,problem_solved:body.problemSolved||null,target_audience:body.targetAudience||null,communication_need:body.communicationNeed,budget:body.budget||null,desired_deadline:body.desiredDeadline||null,message:body.message||null,source:'site'});
    if(error) return reply(500,{ok:false});
  }
  const settings=readEmailSettings();
  if(!settings) return reply(500,{ok:false});
  try{
    await sendContactEmails({firstName:body.firstName,startup:body.startup,email:body.email,website:body.website||body.linkedin,project:[body.startupDescription,body.problemSolved&&`Problème : ${body.problemSolved}`,body.targetAudience&&`Cible : ${body.targetAudience}`,body.message].filter(Boolean).join('\n\n'),adType:body.service||body.communicationNeed,budget:[body.budget,body.desiredDeadline&&`Délai : ${body.desiredDeadline}`].filter(Boolean).join(' · ')},settings);
    return reply(200,{ok:true});
  }catch{return reply(500,{ok:false});}
}
