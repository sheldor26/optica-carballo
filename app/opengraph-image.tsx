import { ImageResponse } from 'next/og';

/**
 * Open Graph image dinámica para social previews (WhatsApp, Facebook, X,
 * LinkedIn, etc). Next.js 15 detecta este archivo automáticamente y lo
 * usa para todas las páginas que no tengan opengraph-image específico.
 *
 * Estética: editorial dark consistente con HomeHero — fondo zinc-950 con
 * gradient sutil + título serif display + tagline + brand mark.
 *
 * Dimensiones: 1200x630 (estándar OG). Tipografías system-safe para no
 * depender de webfonts externos (ImageResponse soporta fonts custom pero
 * agrega complejidad y latencia de cold start).
 */
export const runtime = 'edge';
export const alt = 'Óptica Carballo — Anteojos originales con asesoramiento óptico real';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #09090b 0%, #000000 50%, #18181b 100%)',
          color: '#ffffff',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {/* Mesh glow sutil — círculos blur */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '300px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            right: '100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            filter: 'blur(80px)',
          }}
        />

        {/* Watermark "ÓC" decorativo — esquina inferior derecha */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '40px',
            fontSize: '500px',
            fontWeight: 500,
            lineHeight: 1,
            color: 'rgba(255,255,255,0.04)',
            display: 'flex',
          }}
        >
          ÓC
        </div>

        {/* Eyebrow superior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '20px',
            fontWeight: 500,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#d4a574',
            }}
          />
          <span>Óptica Carballo</span>
        </div>

        {/* Título principal — serif display */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 2,
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              fontSize: '90px',
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: '-0.025em',
              color: '#ffffff',
            }}
          >
            Anteojos originales
          </div>
          <div
            style={{
              fontSize: '90px',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 0.98,
              letterSpacing: '-0.025em',
              color: 'rgba(255,255,255,0.75)',
              marginTop: '8px',
            }}
          >
            con asesoramiento óptico real.
          </div>
        </div>

        {/* Footer — bullets + tagline corto */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span>30+ años en Argentina</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span>Asesoramiento personal</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span>Envíos a todo el país</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
