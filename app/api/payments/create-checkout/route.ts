import Stripe from 'stripe';
import { getServerSupabase, getServiceSupabase } from '@/lib/supabase/server';

export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin && new URL(origin).host!==new URL(request.url).host) return Response.json({ok:false},{status:403});
  const secret=process.env.STRIPE_SECRET_KEY; const siteUrl=process.env.NEXT_PUBLIC_SITE_URL;
  if(!secret||!siteUrl) return Response.json({ok:false,message:'Paiement non configuré.'},{status:503});
  const supabase=await getServerSupabase(); if(!supabase)return Response.json({ok:false},{status:503});
  const {data:{user}}=await supabase.auth.getUser(); if(!user)return Response.json({ok:false},{status:401});
  let missionId=''; try{missionId=String((await request.json()).missionId||'');}catch{return Response.json({ok:false},{status:400});}
  const {data:mission}=await supabase.from('missions').select('id,title,price_cents,client_id').eq('id',missionId).eq('client_id',user.id).single();
  if(!mission||mission.price_cents<50)return Response.json({ok:false},{status:404});
  const stripe=new Stripe(secret);
  const session=await stripe.checkout.sessions.create({mode:'payment',customer_email:user.email,line_items:[{quantity:1,price_data:{currency:'eur',unit_amount:mission.price_cents,product_data:{name:mission.title}}}],success_url:`${siteUrl}/client?paiement=succes`,cancel_url:`${siteUrl}/client?paiement=annule`,metadata:{mission_id:mission.id,client_id:user.id}});
  const admin=getServiceSupabase(); if(admin)await admin.from('payments').insert({mission_id:mission.id,client_id:user.id,amount_cents:mission.price_cents,status:'en_attente',stripe_checkout_session_id:session.id});
  return Response.json({ok:true,url:session.url});
}
