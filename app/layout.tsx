import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://startup-ad-adam.adam-mare08.chatgpt.site'),
  title: 'STARTUP/AD — Des pubs pour ceux qui construisent',
  description: 'Moi, c’est Adam, j’ai 18 ans. Je crée des publicités accessibles pour les startups et je préfère apprendre en faisant.',
  openGraph: {
    title: 'STARTUP/AD — Des pubs pour ceux qui construisent',
    description: 'Adam, 18 ans : des publicités accessibles pour les startups, avec une approche directe et humaine.',
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: 'https://startup-ad-adam.adam-mare08.chatgpt.site/og.png', width: 1200, height: 630, alt: 'STARTUP/AD — Des pubs pour ceux qui construisent' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STARTUP/AD — Des pubs pour ceux qui construisent',
    description: 'Adam, 18 ans : des publicités accessibles pour les startups, avec une approche directe et humaine.',
    images: ['https://startup-ad-adam.adam-mare08.chatgpt.site/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
