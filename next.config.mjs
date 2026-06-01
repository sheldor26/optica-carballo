import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permitir páginas .mdx además de .tsx — necesario para que Next reconozca
  // los archivos en content/guias/*.mdx. Cuando tengamos plugins de remark/
  // rehype (GFM, autolinks, syntax highlight), se suman en `withMDX` abajo.
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    // AVIF primero (comprime ~20% más que WebP) con fallback WebP para
    // browsers viejos. Next negocia según Accept header del browser.
    // Audit 2026-06-01: el sitio servía solo WebP (default). Gratis.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'http', hostname: '127.0.0.1', port: '54321' },
      { protocol: 'http', hostname: 'localhost', port: '54321' },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
