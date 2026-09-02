import { randomUUID } from 'node:crypto';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';

const allowed=new Set(['image/png','image/jpeg','image/webp','video/mp4','application/pdf','application/zip']);
export async function POST(request:Request){
  const origin=request.headers.get('origin'); if(origin&&new URL(origin).host!==new URL(request.url).host)return Response.json({ok:false},{status:403});
  const supabase=await getServerSupabase(); const admin=getServiceSupabase(); if(!supabase||!admin)return Response.json({ok:false},{status:503});
  const {data:{user}}=await supabase.auth.getUser(); if(!user)return Response.json({ok:false},{status:401});
  let body:{missionId?:string;name?:string;mimeType?:string;size?:number}; try{body=await request.json();}catch{return Response.json({ok:false},{status:400});}
  const size=Number(body.size); if(!body.missionId||!body.name||!body.mimeType||!allowed.has(body.mimeType)||!Number.isFinite(size)||size<1||size>52_428_800)return Response.json({ok:false},{status:400});
  const {data:mission}=await supabase.from('missions').select('id,client_id').eq('id',body.missionId).single(); if(!mission)return Response.json({ok:false},{status:404});
  const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).single(); if(mission.client_id!==user.id&&profile?.role!=='admin')return Response.json({ok:false},{status:403});
  const extension=body.name.includes('.')?body.name.split('.').pop()!.replace(/[^a-zA-Z0-9]/g,'').slice(0,8):'bin'; const path=`${mission.id}/${user.id}/${randomUUID()}.${extension}`;
  const {data,error}=await admin.storage.from('mission-files').createSignedUploadUrl(path); if(error)return Response.json({ok:false},{status:500});
  return Response.json({ok:true,path,token:data.token});
}
