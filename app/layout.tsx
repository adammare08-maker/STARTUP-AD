import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://startup-ad-adam.adam-mare08.chatgpt.site'),
  title: 'STARTUP/AD — Des pubs pour ceux qui construisent',
  description: 'Adam crée des publicités pour les startups. Sa méthode commence par rencontrer et comprendre les personnes derrière les projets.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'STARTUP/AD — Des pubs pour ceux qui construisent',
    description: 'Prospecter, rencontrer, comprendre, proposer et créer : une approche publicitaire directe et humaine pour les startups.',
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: 'https://startup-ad-adam.adam-mare08.chatgpt.site/og.png', width: 1200, height: 630, alt: 'STARTUP/AD — Des pubs pour ceux qui construisent' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STARTUP/AD — Des pubs pour ceux qui construisent',
    description: 'Prospecter, rencontrer, comprendre, proposer et créer : une approche publicitaire directe et humaine pour les startups.',
    images: ['https://startup-ad-adam.adam-mare08.chatgpt.site/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
