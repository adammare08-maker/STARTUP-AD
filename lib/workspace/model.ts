export type Mission = { id:string; title:string; brief:string; client_id:string; price_cents:number; status:string; proposal_id:string|null; workflow_stage?:string; estimated_delivery:string|null; created_at:string };
export const money = (cents:number) => (cents/100).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
export function projectStep(m:Mission) {
  if (!m.proposal_id) return m.workflow_stage==='proposition'?'Proposition à consulter':'Discussion avec Adam';
  return ({a_demarrer:'Proposition acceptée',en_creation:'Création en cours',version_envoyee:'Version disponible',retours_demandes:'Corrections demandées',modification:'Modifications en cours',validation_finale:'Validation finale',livre:'Livré',termine:'Terminé'} as Record<string,string>)[m.status] || 'En cours';
}
export function nextAction(m:Mission, admin:boolean) {
  if (!m.proposal_id) return m.workflow_stage==='proposition'?(admin?'Attendre la réponse du client':'Lire et répondre à la proposition'):(admin?'Échanger et préparer une proposition':'Présenter votre besoin dans la conversation');
  if(m.status==='retours_demandes') return admin?'Prendre connaissance des corrections':'Attendre la prochaine version';
  if(m.status==='termine'||m.status==='livre')return 'Consulter le dossier';
  return admin?'Organiser la prochaine étape avec le client':'Consulter les messages et la prochaine étape avec Adam';
}
export function cents(value:unknown) {
  if(typeof value!=='string'||!/^\d{1,6}([.,]\d{1,2})?$/.test(value))throw new Error('invalid');
  const n=Math.round(Number(value.replace(',','.'))*100);
  if(!Number.isSafeInteger(n)||n>10000000)throw new Error('invalid');return n;
}
export function field(body:Record<string,unknown>,name:string,max:number,required=true) {
  const value=body[name]; if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new Error('invalid');return value.trim();
}
export function uuid(value:unknown):value is string { return typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value); }
