import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      // Founder 2026-05-31: catálogos con `<main className="container">`
      // se veían más chicos que /marcas/<slug> (que usa
      // `max-w-screen-2xl px-4 sm:px-6 lg:px-8`). El override `screens
      // 2xl: 1280px` limitaba el ancho 256px menos que BrandPage en
      // viewport ≥1280px. Causa: grids tenían cards más chicos →
      // anteojos relativos más chicos.
      // Fix: eliminar override (Tailwind default 2xl = 1536px) +
      // padding responsive matching BrandPage (lg:2rem). Ahora TODOS
      // los catálogos usan el mismo ancho efectivo en desktop.
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // "serif" = display tipográfico del sitio. Ahora Bricolage Grotesque
        // (grotesco, NO serif) → fallback a sans, no a Georgia.
        serif: ['var(--font-serif)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          foreground: 'hsl(var(--brand-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Reemplazo CSS del pop `scale [1,1.3,1]` que hacía framer-motion en
      // wishlist/compare buttons (framer se sacó del camino crítico de JS —
      // sesión perf 2026-06-11).
      keyframes: {
        pop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
      },
      animation: {
        pop: 'pop 0.3s ease-in-out',
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
