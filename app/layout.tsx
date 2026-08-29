import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'STARTUP/AD — Publicités modernes pour startups',
  description: 'Création de publicités vidéo, visuelles et sociales accessibles pour les startups. Échangez directement avec Adam, fondateur de STARTUP/AD.',
  openGraph: {
    title: 'STARTUP/AD — Des pubs qui donnent envie',
    description: 'Des publicités modernes et accessibles pour présenter votre startup.',
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'STARTUP/AD — Publicités pour startups' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STARTUP/AD — Des pubs qui donnent envie',
    description: 'Des publicités modernes et accessibles pour présenter votre startup.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
