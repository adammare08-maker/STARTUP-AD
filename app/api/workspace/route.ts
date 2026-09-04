import { requireRole } from '@/lib/supabase/server';
import { cents, field, uuid } from '@/lib/workspace/model';
import { ContactRateLimiter } from '@/lib/contact/rate-limit';
export const dynamic='force-dynamic';
const limiter=new ContactRateLimiter(30,60_000);
const response=(status:number,body:object)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request:Request) {
  try {
    if(request.headers.get('origin')!==new URL(request.url).origin)return response(403,{error:'Requête refusée.'});
    if(!request.headers.get('content-type')?.startsWith('application/json'))return response(415,{error:'Requête invalide.'});
    const reader=request.body?.getReader();if(!reader)return response(400,{error:'Requête invalide.'});
    let size=0;const chunks:Uint8Array[]=[];
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16000){await reader.cancel();return response(413,{error:'Texte trop long.'});}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
    let body:Record<string,unknown>;try{body=JSON.parse(new TextDecoder().decode(bytes));if(!body||Array.isArray(body)||typeof body!=='object')throw new Error();}catch{return response(400,{error:'Requête invalide.'});}
    const auth=await requireRole('client');if(auth.state!=='ready')return response(auth.state==='anonymous'?401:403,{error:'Connexion requise.'});
    if(!limiter.check(auth.user.id).allowed)return response(429,{error:'Patientez une minute avant de réessayer.'});
    const action=body.action;let result;
    try {
      if(action==='request') {
        if(auth.profile.role!=='client')return response(403,{error:'Ce formulaire est destiné aux comptes clients.'});
        result=await auth.supabase.rpc('workspace_request',{p_title:field(body,'title',120),p_startup:field(body,'startup',120),p_brief:field(body,'brief',3000),p_need:field(body,'need',1600)});
      } else {
        if(!uuid(body.missionId))return response(400,{error:'Projet invalide.'});
        const {data:mission,error}=await auth.supabase.from('missions').select('id,client_id').eq('id',body.missionId).single();
        if(error||!mission||(auth.profile.role!=='admin'&&mission.client_id!==auth.user.id))return response(404,{error:'Projet introuvable.'});
        if(action==='message') result=await auth.supabase.from('messages').insert({mission_id:mission.id,sender_id:auth.user.id,body:field(body,'message',4000)}).select('id').single();
        else if(action==='propose') {
          if(auth.profile.role!=='admin')return response(403,{error:'Action réservée à Adam.'});
          const price=cents(body.price),deposit=cents(body.deposit);const revisions=Number(body.revisions);
          if(price<1||deposit>price||!Number.isInteger(revisions)||revisions<0||revisions>50)throw new Error('invalid');
          const date=field(body,'validUntil',10);if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date)))throw new Error('invalid');
          result=await auth.supabase.rpc('workspace_propose',{p_mission:mission.id,p_title:field(body,'title',120),p_description:field(body,'description',3000),p_deliverables:field(body,'deliverables',3000),p_price:price,p_deposit:deposit,p_revisions:revisions,p_delay:field(body,'delay',120),p_terms:field(body,'terms',4000,false),p_valid_until:date});
        } else if(action==='answer') {
          if(!uuid(body.proposalId)||!['accepter','refuser','modifier'].includes(String(body.answer)))throw new Error('invalid');
          result=await auth.supabase.rpc('workspace_answer',{p_mission:mission.id,p_proposal:body.proposalId,p_answer:body.answer,p_note:field(body,'note',2000,body.answer==='modifier')});
        } else return response(400,{error:'Action invalide.'});
      }
    }catch{return response(400,{error:'Vérifiez les champs du formulaire.'});}
    if(result.error)return response(409,{error:'Action indisponible ou état du projet modifié. Actualisez et réessayez. Si cela persiste, contactez Adam.'});
    return response(200,{ok:true,id:action==='request'?result.data:undefined});
  }catch{return response(503,{error:'Service indisponible. Réessayez dans quelques instants.'});}
}
