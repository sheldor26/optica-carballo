import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

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
    <html lang="es-AR">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
