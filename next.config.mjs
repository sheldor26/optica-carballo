import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';

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
    // Vercel cachea cada imagen optimizada el máximo entre este TTL y el
    // max-age del origen. Supabase Storage sirve max-age=3600 (los seeds no
    // setearon cacheControl), así que sin esto cada imagen re-optimiza cada
    // hora → TTFB de 0.4-0.8s por imagen (audit 2026-06-11, x-vercel-cache
    // MISS constante). 31 días: si se reemplaza una foto, hay que subirla
    // con OTRO nombre de archivo (el path es la cache key).
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'http', hostname: '127.0.0.1', port: '54321' },
      { protocol: 'http', hostname: 'localhost', port: '54321' },
    ],
  },
  // Headers de seguridad estándar. HSTS ya lo setea la plataforma. `camera=(self)`
  // porque las features de Vision (lectura de receta / forma de rostro) usan la
  // cámara del propio sitio.
  //
  // CSP arranca en modo **Report-Only**: NO bloquea, solo reporta violaciones
  // (a la consola del browser). Así afinamos los orígenes contra el uso real
  // (MP, Supabase, GA4, Vercel, cámara/canvas) antes de pasarlo a enforcing
  // (`Content-Security-Policy` a secas) en una sesión dedicada. 'unsafe-inline'/
  // 'unsafe-eval' en scripts son pragmáticos para Next 15 en V1.
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.vercel-insights.com https://*.mercadopago.com https://*.mercadopago.com.ar",
      "frame-src 'self' https://*.mercadopago.com https://*.mercadopago.com.ar",
      "form-action 'self' https://*.mercadopago.com https://*.mercadopago.com.ar",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()',
          },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Saca el bloque YAML (---\n...\n---) del contenido renderizado de los .mdx.
    // El frontmatter lo lee gray-matter por separado (lib/content/articles);
    // sin este plugin, @next/mdx lo mostraba como texto visible en la guía.
    remarkPlugins: [remarkFrontmatter],
  },
});

export default withMDX(nextConfig);
