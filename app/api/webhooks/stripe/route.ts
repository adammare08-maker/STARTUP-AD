import Stripe from 'stripe';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function POST(request:Request){
  const secret=process.env.STRIPE_SECRET_KEY; const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!secret||!webhookSecret)return new Response('Unavailable',{status:503});
  const signature=request.headers.get('stripe-signature'); if(!signature)return new Response('Invalid',{status:400});
  const stripe=new Stripe(secret); const body=await request.text(); let event:Stripe.Event;
  try{event=await stripe.webhooks.constructEventAsync(body,signature,webhookSecret);}catch{return new Response('Invalid',{status:400});}
  const supabase=getServiceSupabase(); if(!supabase)return new Response('Unavailable',{status:503});
  if(event.type==='checkout.session.completed'){
    const session=event.data.object;
    await supabase.from('payments').update({status:'paye',stripe_payment_intent_id:typeof session.payment_intent==='string'?session.payment_intent:null,updated_at:new Date().toISOString()}).eq('stripe_checkout_session_id',session.id);
  }else if(event.type==='checkout.session.expired'){
    await supabase.from('payments').update({status:'echec',updated_at:new Date().toISOString()}).eq('stripe_checkout_session_id',event.data.object.id);
  }
  return Response.json({received:true});
}
