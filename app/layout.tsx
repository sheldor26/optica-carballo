import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { MicrosoftClarity } from '@/components/analytics/microsoft-clarity';
import './globals.css';

// Tipografía alineada a ShotPilot (founder 2026-06-29): Manrope (cuerpo) +
// Bricolage Grotesque (títulos). Se mantienen los nombres de variable
// (--font-sans / --font-serif) para no tocar las clases font-sans/font-serif
// de todo el sitio — "serif" ahora es el display grotesco, no Fraunces.
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const gscVerificationToken = process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Óptica Carballo',
    template: '%s | Óptica Carballo',
  },
  description:
    'Anteojos, lentes de contacto y servicios ópticos en Argentina.',
  alternates: {
    canonical: '/',
    languages: { 'es-AR': '/' },
  },
  // Google Search Console verification — meta tag automático cuando hay token.
  // Sin token (env var faltante) → no se incluye, no error.
  verification: gscVerificationToken
    ? { google: gscVerificationToken }
    : undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${manrope.variable} ${bricolage.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <GoogleAnalytics />
        <MicrosoftClarity />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
