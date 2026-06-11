# Óptica Carballo — Performance Audit

# Audit 2026-06-11 — el sitio servía TODO dinámico (corrige al audit 2026-05-29)

## Resumen ejecutivo

El audit anterior (abajo) concluyó "no hay bugs evidentes" mirando código + tabla del build. **Midiendo producción con curl la realidad era otra**: TODAS las páginas públicas se servían con `cache-control: no-store` y `x-vercel-cache: MISS` (TTFB home 2,1s / categoría 1,1s) — el ISR de `revalidate = 300` estaba 100% anulado. Las imágenes eran livianas (5-7KB AVIF) pero el optimizador de Vercel las re-optimizaba cada hora (origen Supabase con `max-age=3600`) → 0,4-0,8s por imagen, ×174 imágenes en una categoría.

## Causas raíz encontradas (todas arregladas 2026-06-11)

| # | Causa | Efecto | Fix |
|---|-------|--------|-----|
| 1 | `CompareBarWrapper` (server) en el layout leía cookie con `cookies()` | TODAS las páginas dinámicas | CompareBar 100% client + `/api/compare/thumbs` |
| 2 | 5 queries + 5 metadata builders usaban el cliente Supabase con cookies | Marca/PDP/related dinámicas | `createStaticClient` (data pública) |
| 3 | `RecentlyViewed` (server) leía cookie `oc_recent` | Home + PDPs dinámicas | Client-side + `/api/recently-viewed/cards` |
| 4 | PDP llamaba `getCurrentUser()`+`getMyAlertFor()` para el botón de alerta | Cada PDP dinámica | `CreateAlertButton` autoresuelve (cookie `sb-*` + action) |
| 5 | Categorías sol/receta leían `searchParams` (filtros) | Categorías dinámicas | Filtrado client-side, URL como fuente de verdad, fallback estático con grid completo (SEO) |
| 6 | Sin `minimumCacheTTL` (origen Supabase `max-age=3600`) | Imágenes re-optimizando cada hora | `images.minimumCacheTTL = 31 días` |
| 7 | Middleware llamaba `supabase.auth.getUser()` para TODOS | Latencia en cada request anónimo | Early-return si no hay cookies `sb-*` |

## Resultado (verificado en build + smoke test local de prod)

- Rutas prerenderizadas: 147 → **187** (home ○ 5m, categorías ○ 5m, PDPs ● 5m, marcas ● 5m).
- TTFB local del build de prod: home 52ms, categoría 8ms, PDP 6ms (antes en prod: 600-2100ms).
- Grid completo presente en el HTML estático (SEO intacto); filtros instantáneos client-side.
- Siguen dinámicas (correcto, personalizadas): favoritos, comparar, carrito, checkout, mi-cuenta, admin.

## Regla de oro nueva (ver MISTAKES 2026-06-11)

Todo audit de perf EMPIEZA midiendo producción: `curl -sI` a home/categoría/PDP + 1 imagen, mirando `cache-control` y `x-vercel-cache`. Página con `revalidate` que devuelve `no-store` = hay `cookies()`/`headers()`/`searchParams` escondido en el árbol. **Post-deploy de esta sesión: verificar `x-vercel-cache: HIT` en la segunda request.**

## ⚠️ Regla operativa de imágenes (por minimumCacheTTL 31d)

Si se REEMPLAZA la foto de un producto, subirla con OTRO nombre de archivo (el path es la cache key del optimizador — el mismo path puede servir la versión vieja hasta 31 días).

## Pendientes que quedaron en BACKLOG

- Dinamizar framer-motion (~60kB en el bundle inicial de todas las páginas).
- Backfill de `cacheControl: 31536000` en objetos viejos del bucket (mitigado por minimumCacheTTL — prioridad baja).

---

# Audit 2026-05-29 (histórico — conclusión INCORRECTA, ver arriba)

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
