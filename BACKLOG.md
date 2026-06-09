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
  - `NEXT_PUBLIC_REGENTE_MATRICULA`
  - `NEXT_PUBLIC_TECNICO_MATRICULA`
  - `NEXT_PUBLIC_BUSINESS_PHONE`
  - `NEXT_PUBLIC_BUSINESS_ADDRESS_STREET`
  - `NEXT_PUBLIC_BUSINESS_ADDRESS_POSTAL`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - + email oficial (sin var todavía, agregar cuando se defina).
- [ ] **Confirmar política de devolución exacta** con la regente (plazos,
  qué se acepta, qué no).
- [ ] **CUIT del negocio** para facturación AFIP futura.

## 🟢 Mejoras técnicas (sin urgencia)

- [ ] **Rate-limit / cache del endpoint público `app/api/shipping/quote`** (agregado 2026-06-08 con el estimador por CP del carrito). Hoy es público y sin throttle; cada cotización llama a la API de Correo (cap 1000/h por cuenta). Bajo tráfico no es problema, pero si hubiera abuso/scraping podría agotar el rate-limit de Correo. Mitigación futura: cache por (CP, itemCount) unos minutos + throttle por IP.
- [ ] **Job de expiración de reservas de stock para órdenes `pending` abandonadas** (detectado 2026-06-08 al limpiar órdenes de prueba). El stock se descuenta al CREAR la orden (`reserve_stock`), pero si el cliente nunca paga, la orden queda `pending` para siempre y el stock reservado **no se libera** → stock fantasma (se ve menos stock del real). Falta un cron que, pasado X tiempo (ej. 24-48h) sin pago, cancele la `pending` y reintegre su stock (en DB **y** push a ML, que es la fuente de verdad). Sin esto, hay que limpiar a mano. Prioridad sube cuando el checkout esté en producción con tráfico real.
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
