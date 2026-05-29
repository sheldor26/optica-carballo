# Óptica Carballo — Analytics Setup

Setup técnico de analytics + observabilidad. Sprint hecho 2026-05-29.

## Qué está integrado

### Google Analytics 4 (GA4)

- Carga con `gtag.js` vía `<Script strategy="afterInteractive">`.
- **Respeta el cookie banner**: SOLO carga si el usuario eligió "Aceptar todas" en el banner. Si eligió "Solo necesarias" o no respondió → NO carga (compliance ley 25.326).
- Configuración: `anonymize_ip: true` + `SameSite=Lax;Secure`.
- Re-evalúa el consent al focus de la ventana + polling 2s (por si el user lo cambia en otra tab).

**Componente**: `components/analytics/google-analytics.tsx`
**Activación**: integrado en `app/layout.tsx` (root).

### Google Search Console (GSC)

- Meta tag de verificación incluido en `app/layout.tsx` cuando hay env var.
- `<meta name="google-site-verification" content="{NEXT_PUBLIC_GSC_VERIFICATION_TOKEN}">`.
- Sin token → no se renderiza, no error.

### Eventos custom trackeados

Definidos en `lib/analytics/track.ts` con helper `track(eventName, params)`. Si gtag no está cargado (sin consent), es no-op silencioso.

| Evento | Cuándo se dispara | Params |
|---|---|---|
| `search` | Cliente hace search en el dialog global (⌘K) | `query`, `results_count`, `has_results` |
| `quick_view` | Cliente abre modal Quick View de un producto | `slug`, `brand`, `cached` (true si reabrió) |
| `wishlist_toggle` | Cliente agrega/quita producto del wishlist | `slug`, `brand`, `action` (add/remove) |
| `compare_toggle` | Cliente agrega/quita producto del comparador | `slug`, `brand`, `action` (add/remove/rejected_full) |
| `whatsapp_click` | Cliente clickea CTA WhatsApp (botón flotante por ahora) | `source` (floating) |
| `newsletter_signup` | Cliente se suscribe al newsletter | `source`, `already_existed` |
| `checkout_initiated` | TODO Sprint futuro: click "Iniciar compra" | `cart_value`, `items_count` |
| `prescription_upload` | TODO: subió receta al lector IA | `format` (image/pdf) |
| `face_shape_analysis` | TODO: subió foto al recomendador | `shape_detected` |

Para sumar nuevos eventos: agregar entry a `Events` en `track.ts` + llamar `track(Events.X, {...})` donde corresponda.

### Vercel Analytics

**NO incluido iter 1**. El install del paquete `@vercel/analytics` falló con error de npm. Si querés sumarlo después:
- Activarlo desde Vercel Dashboard → Project → Analytics → Enable.
- O resolver el npm error e instalar `@vercel/analytics` manualmente.

GA4 ya cubre pageviews + eventos. Vercel Analytics sumaría Web Vitals automáticos (LCP, CLS, INP), no crítico iter 1.

## Tu acción (founder) — 30 minutos

### 1. Crear cuenta GA4

1. Andá a [analytics.google.com](https://analytics.google.com) → loguearte con la cuenta Google del negocio.
2. **Crear cuenta nueva** (si no tenés) con nombre "Óptica Carballo".
3. **Crear propiedad** nueva:
   - Nombre: "opticacarballo.com.ar"
   - Zona horaria: Argentina (GMT-3).
   - Moneda: ARS.
4. **Crear flujo de datos web**:
   - URL: `https://opticacarballo.com.ar`.
   - Nombre del flujo: "Sitio web producción".
5. GA4 te genera **Measurement ID** formato `G-XXXXXXXXXX`.
6. **Configurar env var en Vercel**:
   - Key: `NEXT_PUBLIC_GA_ID`.
   - Value: el `G-XXXXXXXXXX` que te dio GA4.
   - Environments: Production + Preview + Development.

Tras redeploy, GA4 va a empezar a recibir data cuando los visitantes acepten el cookie banner.

### 2. Crear cuenta Google Search Console

1. Andá a [search.google.com/search-console](https://search.google.com/search-console).
2. **Agregar propiedad** → elegí "Prefijo de URL" → ingresá `https://opticacarballo.com.ar`.
3. **Verificación**: te va a pedir verificar dueño. Elegí método **Etiqueta HTML**.
4. GSC te da un valor tipo `<meta name="google-site-verification" content="ABC123...">`. Copiá el valor del `content="..."` (sin las comillas).
5. **Configurar env var en Vercel**:
   - Key: `NEXT_PUBLIC_GSC_VERIFICATION_TOKEN`.
   - Value: el string que copiaste.
   - Environments: Production.
6. Tras redeploy, volvé a GSC y click "Verificar". Debería confirmar.
7. Ya verificado:
   - Submit sitemap: `https://opticacarballo.com.ar/sitemap.xml`.
   - GSC empieza a indexar y mostrar qué queries traen tráfico al sitio.

## Qué métricas mirar (después de 1-2 semanas con tráfico)

### En GA4

- **Reports → Realtime**: ver si llega tráfico ahora mismo.
- **Reports → Engagement → Events**: lista de todos los eventos custom. Ver cuáles se disparan más.
- **Reports → Engagement → Pages and screens**: páginas más visitadas.
- **Reports → Acquisition → Traffic acquisition**: de dónde viene el tráfico (Google orgánico, direct, social).
- **Explore → Funnel exploration**: armar embudos custom (ej: home → catálogo → PDP → carrito).

### En GSC

- **Performance**: queries que llevan a tu sitio + impresiones + clicks + posición promedio.
- **Pages**: cuáles páginas están indexadas + cuáles tienen problemas.
- **Coverage**: errores de indexación (404s, redirects, etc).
- **Sitemaps**: confirmar que se procesó OK.

## Métricas a vigilar en este proyecto específico

| Métrica | Cómo verla | Por qué importa |
|---|---|---|
| Visitantes únicos / semana | GA4 → Reports → Acquisition | Crecimiento del sitio |
| Páginas más vistas | GA4 → Engagement → Pages | Validar SEO de las hijas (hombre/mujer/wayfarer/etc) |
| Tasa de WhatsApp click | GA4 → Eventos → `whatsapp_click` count / sesiones | Conversión a contacto humano |
| Búsquedas frecuentes | GA4 → Eventos → `search` con param `query` | Qué buscan los visitantes (validar catálogo) |
| Search sin results | GA4 → Eventos → `search` con `has_results=false` | Qué NO encuentran (oportunidad de cargar producto) |
| Newsletter conversions | GA4 → Eventos → `newsletter_signup` | Captura de leads |
| Queries en GSC | GSC → Performance | Qué palabras nos traen tráfico orgánico |
| Posición promedio | GSC → Performance | Si las hijas SEO están escalando posiciones |

## Privacy compliance

- GA4 NO se carga sin consent del usuario.
- IP anonymization activado.
- Cookies samesite=lax + secure.
- Sin info personal en eventos (slugs públicos, no emails, no datos de pago).
- Política de privacidad menciona uso de GA4 cuando aceptás cookies.

Cumple ley 25.326 (Argentina) + GDPR-friendly default.
