# Óptica Carballo — Backlog

Lista de pendientes acumulados que NO están bloqueando la próxima feature.
Son cosas chicas/medianas, mejoras visuales, optimizaciones, deuda técnica
liviana, o cosas que esperan input externo (assets, decisiones del founder).

## Cómo usar este archivo

- Cada vez que aparezca algo "para hacer después" — entra acá.
- Las features grandes con planificación propia NO entran acá — van como
  decisiones en `DECISIONS.md` y se ejecutan con el skill `/feature`.
- Cuando algo se completa, mover a `## Hecho` con commit hash + fecha.
- Si algo lleva 3+ meses sin tocarse, considerar moverlo a `## Descartado`.

---

## 🟡 Pendiente — assets visuales (esperan al founder)

- [x] ~~**Pipeline normalización de fotos al cargar productos**~~ — **Hecho
  2026-05-31** (Opción P). Script `scripts/normalize-product-photos.ts` con
  TypeScript + Claude Haiku 4.5 Vision (tool use) para detección de bbox
  + sharp para crop/resize/canvas. Output 2000×1333 con anteojo centrado
  al 92%. Uso: `pnpm normalize-photos --input <file-or-dir> [--output <dir>]`.
  Costo ~$0.001 USD por foto. Reemplaza approach Python+PIL del v3 original
  porque mantiene stack TS unificado + no requiere instalación local extra.
  Deps nuevas agregadas: `sharp` (image processing) + `tsx` (dev, correr TS).
- [x] ~~**Uniformar framing de fotos Vulk Day Light (4 variantes)**~~ — Hecho
  por founder 2026-05-30. Iter 8 restauró `scale-[1.4]` original. Standard
  para próximos productos: framing uniforme entre variantes desde subida
  inicial (mismo tamaño relativo del anteojo + centrado + mismo padding).
- [ ] **OG image 1200×630** → `app/opengraph-image.png` (Next 15 auto-detecta
  + meta `og:image`). Mejora preview en WhatsApp, redes, links compartidos.
  Founder dijo "lo voy a hacer luego" (2026-05-28).
- [ ] **Versión transparente del isotipo** (PNG con alpha o SVG) para usar
  en el header sobre fondo blanco sin el cuadrado azul como marco. La
  actual funciona como badge pero no es ideal a nivel diseño.
- [ ] **Fotos reales de productos**. Reemplazar el placeholder gris "Foto
  pendiente" en `product-card.tsx` y `product-gallery.tsx`. Requiere
  fotos físicas de los productos + decidir bucket (Supabase Storage cuando
  haya más de 50 productos; `public/products/` mientras tanto).
- [x] ~~**Subir fotos Vulk Raven** (seed 70, carga abierta 2026-06-14)~~ — **Hecho 2026-06-14**: founder subió las 7, todas HTTP 200, los 2 nombres con espacios/typo coinciden exacto con el seed. Scale confirmado visual = **1.0 en las 6** (fotos 900×442 más anchas que el card 3:2 → ya llenan ~90-95%; el 1.15 provisional cropeaba patillas).

## 🔴 Pendiente bloqueante para emails en producción (acción del founder)

- [ ] **Verificar dominio `opticacarballo.com.ar` en Resend**:
  - Resend Dashboard → Domains → Add Domain → `opticacarballo.com.ar`
  - Resend te da SPF, DKIM, MX records → agregar en el DNS del dominio (donde sea que lo tengas registrado).
  - Sin verificar: Resend rebota envíos desde `hola@opticacarballo.com.ar` y el fallback usa `onboarding@resend.dev` (funciona pero menos profesional).
- [ ] **Configurar webhook MP**:
  - Dashboard MP → Tus integraciones → Notificaciones → Configurar webhook.
  - URL: `https://opticacarballo.com.ar/api/mp/webhook` (cuando esté deployed).
  - Eventos: solo `Pagos` (`payment`).
  - MP genera signing key → agregar a Vercel como `MP_WEBHOOK_SECRET`.
- [ ] **Setear `BUSINESS_ADMIN_EMAIL`** en `.env.local` y Vercel para recibir notifications administrativas (alta de pagos). Sin esto los emails admin se silencian.

## 🔴 Pendiente bloqueante para sub-feature LOGISTICA (acción del founder)

- [ ] **Solicitar credenciales API MiCorreo** al área Comercial de Correo Argentino:
  - Llamar al **0800-777-0345** (línea PyMEs) o ir a sucursal Virasoro.
  - Decir: "Soy cliente MiCorreo (DNI/CUIT XXX) y quiero las credenciales API para integrar mi e-commerce. Necesito ambiente test y producción."
  - Te van a pedir: tu `customerId` MiCorreo (formato `00xxxxxxxx`, lo ves en perfil del portal `micorreo.correoargentino.com.ar`) + finalidad ("integración tienda online").
  - Te van a dar: `user` + `password` para Basic Auth en `/token`. Probablemente distintos para test y prod.
- [ ] **Confirmar `customerId` MiCorreo** en tu perfil del portal.
- [ ] **Confirmar CP de origen** de los envíos (Virasoro, Corrientes — probablemente 3342, verificar).

## 🟡 Pendiente pre-launch — prender cuotas (acción del founder + 1 línea de código)

- [ ] **Prender la visibilidad de cuotas** cuando el checkout MP esté operativo Y la promo de ≥3 cuotas sin interés esté ACTIVA en el panel de Mercado Pago. La feature está construida pero OCULTA detrás de un flag. Para prenderla: en [lib/site/installments.ts](lib/site/installments.ts) cambiar `INSTALLMENTS_ENABLED = false` → `true` (aparece en ficha + grid). Cambiar el nº de cuotas = `INTEREST_FREE_INSTALLMENTS`. ⚠️ No prender antes de tener la promo activa en MP — sería publicidad engañosa (Ley 24.240 art. 8, ver MISTAKES 2026-06-01).

## 🔴 Pendiente bloqueante para cart en producción (acción del founder)

- [ ] **Generar `CART_COOKIE_SECRET` para Vercel** (production env):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Agregar en Vercel Environment Variables como `CART_COOKIE_SECRET` (Production + Preview). **Debe ser DIFERENTE al de `.env.local`** — buena práctica de aislamiento. Sin esto, el cart tira error en runtime en prod.

## 🔴 Pendiente bloqueante para Auth UI en producción (acción del founder)

- [ ] **Configurar Redirect URLs en Supabase Auth** (Dashboard → Authentication → URL Configuration):
  - **Site URL**: `https://opticacarballo.com.ar`
  - **Redirect URLs** (Additional Redirect URLs):
    - `https://opticacarballo.com.ar/auth/callback`
    - `https://opticacarballo.com.ar/recuperar-clave/restablecer`
    - `http://localhost:3000/auth/callback`
    - `http://localhost:3000/recuperar-clave/restablecer`
  - Sin esto, los emails de confirmación de signup y de reset de contraseña tendrán links que no funcionan (Supabase los bloquea por seguridad).
- [ ] **Customizar templates de email** en Supabase Dashboard → Authentication → Email Templates:
  - Confirmar email (signup) → asunto + body en español, mencionar "Óptica Carballo".
  - Magic link → no usar (no implementado).
  - Reset password → asunto + body en español.
  - Change email → asunto + body en español.
  - Por default vienen en inglés y genéricos — se ven poco profesionales.

## 🟡 Pendiente — data real (acción del founder)

- [ ] **Cargar productos de las otras 4 marcas** (Vulk, Reef, Mormaii,
  Paula Cahen D'Anvers) — actualmente solo Rusty tiene productos cargados.
- [ ] **Reemplazar `[PENDIENTE]` en páginas legales**: plazos de
  devolución, garantía, días de reintegro. Editar `politica-de-devolucion`
  y `boton-de-arrepentimiento`.
- [ ] **Completar env vars del negocio**:
  - `NEXT_PUBLIC_BUSINESS_PHONE`
  - `NEXT_PUBLIC_BUSINESS_ADDRESS_STREET`
  - `NEXT_PUBLIC_BUSINESS_ADDRESS_POSTAL`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - + email oficial (sin var todavía, agregar cuando se defina).
- [ ] **Confirmar política de devolución exacta** con la regente (plazos,
  qué se acepta, qué no).
- [ ] **CUIT del negocio** para facturación AFIP futura.

## 🟢 Mejoras técnicas (sin urgencia)

- [ ] **Auditar valores fuera de enum en `attributes` de productos sol** (detectado 2026-06-13 al cargar Blinded, vía catalog-loader). (a) `frame_shape`: 5 seeds de sol usan `"redondo"` (español) en vez del enum `"round"` → no matchean el filtro `/anteojos-de-sol/{shape}`. (b) `lens_treatment` por variante: Play (seed 63) y Patien (seed 65) usan `"espejado"` y `"antirreflejo-interno"`, que NO están en el enum del schema (`polarized|uv400|gradient|mirrored|photochromic`) → revisar si el comparador los renderiza o quedan crudos; si hace falta, mapear espejado→`mirrored` y mover el antirreflejo interno a callout (como se hizo en Blinded). Pasada de normalización + posible corrección de los seeds afectados. Bajo riesgo funcional (JSONB libre) pero ensucia comparador/filtros.

- [ ] **`scripts/ml-item.ts` — refrescar el access token de ML automáticamente** (detectado 2026-06-13, ver MISTAKES). El script usa el access token guardado en `marketplace_integrations` sin refrescarlo; los access token de ML duran ~6h → en sesiones largas de carga vence y da HTTP 401, frenando la importación hasta que el founder reconecta ML a mano. Mejora: usar el `refresh_token` (también en la tabla, encriptado) para renovar el access token + persistir el nuevo antes de fallar. Mientras tanto, el workaround es que el founder re-autentique.

- [ ] **`recommended_face_shapes` en los armazones del catálogo** (detectado 2026-06-11 al cargar Vulk Tour 81 vía catalog-loader). Es campo RECOMENDADO del schema (PRODUCT_SCHEMA línea 111) y lo usa el recomendador IA, pero ningún armazón lo tiene (My Crew, Tour 81, etc. lo omiten). Pasada dedicada: definir el vocabulario exacto que espera el recomendador (`["ovalada","redonda",...]`?), validarlo con `optical-expert` por forma (cuadrado/redondo → cara redonda/ovalada; etc.) y backfillear los productos. Hasta entonces el recomendador no sugiere por forma de cara.
- [ ] **Pesos pendientes — el founder pesa con balanza de precisión y pasa los gramos** (lista viva, desde 2026-06-11). Cuando ML/el fabricante no da el peso, el producto se carga SIN `weight_grams` (no inventamos; el casillero "Peso" del comparador queda vacío) y se anota acá. El founder los pesa y los pasa; si NO los pasa es porque el fabricante tampoco da el dato (queda vacío definitivo). Al recibir cada peso → agregar `weight_grams` al seed + DB (vía MCP) y tachar de la lista.
  - [ ] Vulk Tour 81 receta (seed 62) — tiene unidad física (315).
  - [ ] Rusty Play sol (seed 63).
  - [ ] Rusty Terdey sol (seed 64).
  - [ ] Rusty Blinded sol (seed 68).
  - [ ] Rusty And Now sol (seed 69).
  - [x] ~~Rusty Patien sol (seed 65) + receta (seed 66)~~ — **23,6 g** (founder pasó el peso 2026-06-13, aplicado a ambos, mismo frame).

- [ ] **Backfill de `cacheControl: 31536000` en objetos viejos del bucket `products`** (audit perf 2026-06-11). Los seeds subieron fotos con el default de Supabase (`max-age=3600`). Mitigado por `images.minimumCacheTTL = 31d` en next.config → prioridad baja. Si se hace: script que re-sube cada objeto con el cacheControl correcto (storage `update` necesita el archivo).
- [ ] **Content-Security-Policy (CSP)** (auditoría 2026-06-09). Los demás headers de seguridad ya están (commit `c93a101`: X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy). Falta CSP, que es la riesgosa: hay que listar orígenes de MP, Supabase, AFIP, fonts, etc. y testear que no rompa nada. Hacer con `Content-Security-Policy-Report-Only` primero.
- [ ] **Alt text de imágenes de producto** (auditoría 2026-06-09). En grids muchas imágenes salen con `alt="Variante"` (viene de la data `alt_text` en la DB) o `alt=""` (cards con `aria-hidden` a propósito, el nombre va como texto). Para Google Imágenes conviene alt descriptivo ("Rusty Xold negro mate — lentes polarizadas"). Requiere: (a) generar alt programático desde producto+variante en los componentes de imagen, respetando la intención de a11y actual, y/o (b) corregir `alt_text` en la DB. Pasada dedicada (toca varios componentes + data).
- [ ] **PDP mobile: barra fija de compra (sticky add-to-cart)** (auditoría 2026-06-09). En mobile la galería empuja el precio/compra abajo del fold. La página ya tuvo iteraciones de CRO (el precio se subió a propósito). Mejora: barra fija inferior con precio + CTA que aparezca al scrollear (con selección de variante, ya que hay multi-variante). Feature mediana, hacer con cuidado y revisión visual del founder. Coordinar z-index con el banner de cookies.
- [ ] **Datos del negocio para confianza/SEO (founder)**: **dirección física, ciudad/provincia y horario** del local → `/sobre-nosotros` (confianza + SEO local). El `llms.txt` ya quedó creado con la info general; falta sumar estos datos cuando el founder los pase. _(Nota: los claims de matrícula/regente se sacaron a propósito el 2026-06-09 — NO re-agregar matrícula al footer/llms.txt.)_
- [ ] **www → no-www con 301 (no 307)** (auditoría 2026-06-09). El redirect de `www.opticacarballo.com.ar` es 307 (temporal) → no transfiere link-equity. Se setea en el dashboard de Vercel (Domains), no en código, para no duplicar redirect. Acción del founder en Vercel.

- [ ] **Rate-limit / cache del endpoint público `app/api/shipping/quote`** (agregado 2026-06-08 con el estimador por CP del carrito). Hoy es público y sin throttle; cada cotización llama a la API de Correo (cap 1000/h por cuenta). Bajo tráfico no es problema, pero si hubiera abuso/scraping podría agotar el rate-limit de Correo. Mitigación futura: cache por (CP, itemCount) unos minutos + throttle por IP.
- [x] ~~**Job de expiración de reservas de stock para órdenes `pending` abandonadas**~~ — **Hecho 2026-06-09** (commit `f914147`). Cron `app/api/cron/cancel-abandoned-orders` (hourly, auth `CRON_SECRET`): cancela `pending` de +24h sin pago y reintegra stock vía `releaseOrderStock` (DB + ML, idempotente por `orders.stock_released_at`). Reusa el mismo camino que el reintegro al cancelar manual. Plazo `ABANDON_HOURS=24` (ajustable en el route).
- [ ] **Blindar el cron de abandonados contra "pago OK pero webhook falló"** (detectado 2026-06-09 al verificar el cron de cancelación). Caso raro: el cliente paga en MP pero el webhook nunca llega → la orden queda `pending` aunque esté pagada → el cron de 24h la cancelaría (y reintegraría stock de una venta real). Poco probable (MP reintenta el webhook por horas) pero con volumen conviene cubrirlo: antes de cancelar, el cron consulta a MP el estado real del pago (`mp_preference_id`/`external_reference`) y solo cancela si NO está aprobado. Alternativa más simple: un cron de reconciliación de pagos MP→DB (análogo al de stock ML). Prioridad sube con tráfico real.
- [x] ~~**Investigar si el nº de tracking de Correo se puede obtener automático por API**~~ — **CERRADO 2026-06-08: NO se puede (limitación de Correo, confirmada contra el manual completo + pruebas E2E en test y prod).** La API MiCorreo tiene SOLO 6 endpoints (`/register`, `/users/validate`, `/agencies`, `/rates`, `/shipping/import`, `/shipping/tracking`) — **no hay endpoint de "listar mis envíos" ni "dame el tracking de la orden X"**. El alta (`/shipping/import`) devuelve solo `{createdAt}` (verificado en body + headers, ambos ambientes). `/shipping/tracking` SOLO acepta el nº real de Correo (`000500...`); con nuestro `extOrderId`/`orderNumber`/`customerId` da `"No existe el cliente o pedido"` (21 intentos, distintos timings). El nº lo genera Correo y solo se publica en el **panel MiCorreo** + la etiqueta. **Flujo definitivo = alta automática (botón "Generar envío") + nº copiado a mano del panel una vez.** Única forma de evitar el copy-paste sería que Correo sume un endpoint de listado, o scrapear el panel (frágil, no recomendado). No re-investigar.
- [ ] **Mostrar el seguimiento del envío en vivo al cliente** (detectado 2026-06-08). Una vez cargado el nº de tracking de Correo, `/shipping/tracking` (GET+body, ver `fetchCorreoTracking` en `lib/correo/import.ts`) devuelve los eventos (PREIMPOSICION → en camino → entregado). Se podría mostrar ese timeline en `/mi-cuenta/pedidos/[id]` para que el cliente no salga a la web de Correo. Verificado que NO sirve para obtener el nº (solo el estado de un envío con nº ya conocido).
- [ ] **Endpoint/acción admin para forzar sync stock OUTBOUND (DB→ML)** (detectado 2026-06-08). Hoy solo existe el inbound (`/api/admin/ml-force-sync` = ML→DB). Para correcciones manuales de stock desde el sitio falta el camino inverso. Mientras tanto, corregir stock = editar en ML (fuente de verdad) y dejar que el inbound/webhook baje a la DB.
- [ ] **Agregar `/guias` + artículos al `app/sitemap.ts`** (gap descubierto 2026-06-01, ver MISTAKES). Hoy NINGÚN artículo ni el índice `/guias` están en el sitemap. Derivar de `listArticles()` (ya excluye `draft: true`, así que los borradores no se filtran solos). Agregar entry `/guias` (priority ~0.7) + un map sobre `listArticles()` (priority ~0.6, lastModified = updatedAt). Hacerlo cuando se publique el primer artículo nuevo del plan de defectos refractivos (o antes).
- [ ] **Migrar `pnpm lint`** a la CLI nueva de ESLint (Next 15 deprecó
  `next lint`, en Next 16 se elimina). Comando: `npx @next/codemod@canary
  next-lint-to-eslint-cli .`. No urgente — sigue funcionando bien.
- [ ] **`engines.npm` en package.json** para que falle si alguien usa
  npm en vez de pnpm. Ya hay `packageManager` field, pero engines.npm con
  versión inexistente sería más explícito.

## 🟢 Features menores futuras

- [ ] **Página `/sucursales`** o sección con mapa cuando se confirme la
  dirección exacta (Virasoro, Corrientes).
- [ ] **Páginas individuales de las otras marcas** activadas cuando tengan
  productos.
- [ ] **Estado "destacados" en home** cuando haya productos con
  `is_featured = true` reales (no `[PH]`).
- [ ] **Sub-categorías** por forma (Aviador, Wayfarer, Redondo) y por uso
  (Polarizados, Deportivos, Con aumento — este último ADR-010).
  Implementación con `categories.parent_id`.
- [ ] **Filtros** dentro de página de marca (color, forma, precio rango).
- [ ] **Anteojos de receta con Clip-on** (founder 2026-06-02): a futuro habrá
  armazones de receta que incluyen un **clip-on polarizado** (accesorio que se
  monta sobre el armazón). Implica: modelar el clip-on como atributo/variante,
  decidir si entra a `/polarizados` (el accesorio es polarizado, no la lente
  base) y cómo se comunica. Hoy receta NO tiene polarizados (por eso no existe
  `/anteojos-de-receta/polarizados`); cuando lleguen los clip-on, reevaluar.
- [ ] **Migrar brand-level `/marca/polarizados` al criterio "al menos una
  variante polarizada"** (2026-06-02): el `/polarizados` general ya usa
  `toPolarizedCatalog` (≥1 variante pol + card reducida), pero
  `/anteojos-de-sol/<marca>/polarizados` sigue con el criterio viejo
  (product-level "todas") vía `fetchBrandPageByFilter`. Unificar para
  consistencia.

---

## ✅ Hecho

- 2026-06-11: **Framer-motion fuera del camino crítico de JS** (mismo día que el fix de ISR). 12 componentes que cargaban en todas las páginas (header/mega-menú, MagneticButton, ScrollProgress, BackToTop, FloatingWhatsapp, FloatingChat, CookiesBanner, CompareBar, NewsletterForm del footer, FaqAccordion, Wishlist/CompareButton) pasaron a CSS (`tailwindcss-animate` + keyframe `pop` + vanilla JS). First Load JS: categorías 185→144 kB, PDPs 193→153 kB, guías 187→144 kB (−40 kB c/u). Framer queda solo en rutas puntuales (home hero/sections, tools, descubrir, FAQ search). Bonus SEO: las respuestas del FaqAccordion ahora están siempre en el HTML estático. Commit de la sesión 2026-06-11 ("perf: framer-motion fuera del bundle global").
- 2026-06-11: **Cache / rendering: el sitio respondía `no-store` en todo** (estaba arriba como "NO es quick win" — resultó abordable en una sesión). ISR real en todas las páginas públicas: CompareBar/RecentlyViewed/CreateAlertButton a client-side, queries+metadata a `createStaticClient`, categorías con filtrado client-side, `minimumCacheTTL` 31d para imágenes, middleware con early-return anónimo. 147 → 187 rutas prerenderizadas. Detalle en `PERFORMANCE_AUDIT.md` (audit 2026-06-11) + CURRENT_STATE. Commit de la sesión 2026-06-11 ("perf: ISR real en todo el sitio").
- 2026-05-30: Eliminados los 4 productos placeholder `[PH]` de Rusty (rusty-wayfarer-classic-sol, rusty-aviator-pilot-sol, rusty-redondo-vintage-rx, rusty-square-modern-rx). Cleanup SQL en `supabase/cleanup/20260530_delete_rusty_placeholders.sql`. Seed `02_rusty_products.sql` borrado del repo. Único producto Rusty real: `rusty-yau` (importado de ML).
- 2026-05-29: Texto SEO extenso por marca (`brands.seo_intro` 150-300 palabras + `seo_outro` 80-150 palabras). Migración + seed listos para aplicar al cloud. Renderizado en `BrandCatalogPage` (intro arriba, outro al pie).
- 2026-05-29 (commit pendiente sprint SEO+): `clean` script en package.json (`pnpm clean` = `rm -rf .next`).
- 2026-05-29 (commit pendiente sprint SEO+): FAQ schema en páginas de marca (5 FAQs específicas por marca en `lib/content/brand-faqs.ts`, renderizadas con `FaqAccordion` + `FaqJsonLd`).
- 2026-05-29 (commit pendiente sprint SEO+): AggregateOffer a nivel categoría en `/anteojos-de-sol` y `/anteojos-de-receta` (priceRange basado en variantes con stock real).
- 2026-05-28: API key comprometida rotada por el founder. Nueva key en
  `.env.local`.
- 2026-05-28: Migración 00001 (catálogo) aplicada al cloud (verificada).
- 2026-05-28: Migración 00002 (identity + orders) aplicada al cloud
  (post cloud drift detectado y resuelto — ver MISTAKES.md 2026-05-28
  "CLOUD_APPLIED marcó ✅ sin verificación real"). Verificada con SELECT.
- 2026-05-28: Migración 00003 (order_number generator) aplicada al cloud
  junto con 00002. Verificada con SELECT.

## ❌ Descartado

(vacío)
