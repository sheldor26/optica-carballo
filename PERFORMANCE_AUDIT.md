# Óptica Carballo — Performance Audit (2026-05-29)

## Resumen ejecutivo

Sitio en buena salud técnica base. **No hay bugs evidentes de performance**. Para optimizaciones reales basadas en Core Web Vitals, hace falta data de usuarios reales (RUM) — activar Vercel Analytics o esperar GA4 a recolectar.

## Findings del code review

### ✅ Bien hecho

**Next/Image**:
- Todos los componentes usan `<Image>` de Next, no `<img>`.
- `fill` + `sizes` correctos en cards y gallery.
- `priority` en imágenes above-the-fold (home hero, header logo, gallery primera).
- Bucket Supabase es público — Next/Image puede optimizar al vuelo.

**Fonts**:
- `next/font/google` con Inter + Fraunces.
- `subsets: ['latin']` — descarga solo lo necesario.
- `display: 'swap'` — texto visible sin esperar font.

**Scripts de terceros**:
- GA4 con `strategy="afterInteractive"` — NO bloquea LCP/FID.
- Cookie banner con delay 600ms — no compite con paint inicial.
- FloatingWhatsapp con delay 800ms.

**Bundle**:
- 101 kB shared First Load JS — bueno para sitio con tantas features.
- Home: 8.48 kB + 174 kB total — aceptable.

**Routing**:
- 85+ páginas SEO mayormente static (●) o pre-rendered con ISR (revalidate 300).
- Solo páginas con searchParams o cookies son dynamic (ƒ).

### 🟡 Mejoras posibles (low priority)

- **Vercel Analytics**: no activado. Daría Web Vitals reales (LCP, CLS, INP) automáticos. Activación: Vercel Dashboard → Project → Analytics → Enable. Cero código.
- **Lighthouse CI**: agregar como GitHub Action que corre en cada PR + bloquea si baja de threshold. Effort: 30 min.
- **Image Optimization Manual**: si las imágenes originales de Supabase Storage son > 1 MB, considerar pre-compresión antes de upload. Next/Image las re-comprime pero parte de un archivo grande.

### ❌ NO encontrado (good news)

- Sin `<img>` raw.
- Sin scripts sync de terceros.
- Sin fonts custom sin preload.
- Sin imports síncronos de paquetes gigantes.
- Sin componentes client innecesarios marcados con `'use client'` cuando podrían ser server (audit superficial — para auditoría profunda, correr `npm run build` con bundle analyzer).

## Próximos pasos del founder

### Paso 1: Activar Vercel Analytics (1 minuto)

1. Vercel Dashboard → tu proyecto `optica-carballo`.
2. Tab **Analytics** (top nav).
3. Click **Enable** (si está deshabilitado).
4. Sin código nuevo, Vercel inyecta el script automático.

Beneficios:
- Core Web Vitals reales de tus usuarios (LCP, CLS, INP, FCP, TTFB).
- Sin costo si estás en Hobby plan.
- Sin consent banner extra (Vercel Analytics es first-party + IP anonimizada).

### Paso 2: Lighthouse audit manual (5 minutos)

1. Andá a [pagespeed.web.dev](https://pagespeed.web.dev).
2. Ingresá `https://opticacarballo.com.ar`.
3. Click **Analizar**.
4. Te da score Mobile + Desktop con LCP, CLS, INP, TTFB.

Si algún Core Web Vital está rojo:
- Pasame el score + métrica problemática.
- Hago debugging puntual.

Si todo verde → no hay nada que optimizar técnicamente. La mejora viene por contenido / SEO.

### Paso 3: Repetir audit periódicamente

- 1 vez por mes en pagespeed.web.dev.
- Después de cada feature grande (sprint nuevo).
- Antes de big push de marketing (Black Friday, etc).

## Métricas objetivo (Core Web Vitals)

Google considera "bueno" estos rangos:

| Métrica | Bueno | Necesita mejora | Pobre |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4s | > 4s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

Si pasamos los 3 en verde → Google nos premia con ranking. Hoy probablemente ya estamos en verde por buena base técnica.

## Cuándo profundizar

Sin tráfico real (eres + yo + tests), Lighthouse mide LCP del HTML/CSS/JS — no del comportamiento real con caché, conexiones lentas, dispositivos viejos. Por eso Vercel Analytics es la fuente real.

Después de 1-2 semanas con tráfico real:
- Si Vercel Analytics muestra LCP > 2.5s en p75 → investigar fotos pesadas o JS bloqueante.
- Si INP > 200ms → componentes pesados que bloquean main thread.
- Si CLS > 0.1 → animaciones que mueven layout sin reservar espacio.

Hasta entonces, no over-engineerear.
