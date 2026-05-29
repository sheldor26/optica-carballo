import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['opsz'],
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
    <html lang="es-AR" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
