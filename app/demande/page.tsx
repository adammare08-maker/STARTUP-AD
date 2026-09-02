import type { Metadata } from 'next';
import { ProjectRequestForm } from '@/components/project-request-form';

export const metadata: Metadata = { title: 'Parlez-moi de votre startup — STARTUP/AD', description: 'Présentez votre startup et votre besoin directement à Adam.' };
export default function RequestPage() {
  return <main className="request-page"><header><a className="brand" href="/">STARTUP<span>/</span>AD</a><a className="underlined-link" href="/connexion">Espace client</a></header><section><div className="request-copy"><p className="section-index">PREMIÈRE ÉTAPE · UNE CONVERSATION</p><h1>Parlez-moi de votre startup.</h1><p>Pas besoin d’un brief parfait. Expliquez-moi simplement ce que vous construisez, pour qui et ce que vous voulez faire comprendre.</p></div><ProjectRequestForm /></section></main>;
}
