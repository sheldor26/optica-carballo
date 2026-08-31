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

## 🟡 Dos cosas de SEO que salieron cargando el Rusty Ardigan (2026-08-26)

**1. Colisión viva entre Blinded y Zion, hoy en producción.** `SEO_STRATEGY.md` le asigna al Rusty
Blinded el carril `lentes de sol redondos` (320/mes), pero su `meta_title` real, en el seed 68, es
**"Anteojos de Sol Rusty Blinded Redondos"** — o sea que ataca `anteojos de sol redondos` (210), que
es la keyword asignada al Zion. Dos fichas de la misma marca peleando la misma cadena.
Fix de una línea: cambiar el title del Blinded a `Lentes de Sol Rusty Blinded Redondos | Óptica
Carballo` (54 caracteres). Eso alinea el title con el carril que el doc ya le dio y le deja la
variante "anteojos" limpia al Zion.

**1-bis. Segunda colisión, misma clase: The Sil ↔ Zinz.** Salió cargando el Guardian.
`SEO_STRATEGY.md` le da a Vulk The Sil `lentes de sol cuadrados` (390) **y** `anteojos de sol
cuadrados` como H1, pero esa segunda también figura como primaria de Rusty Zinz sol. Dos productos
de marcas distintas peleando la misma cadena. Van dos colisiones encontradas en dos cargas seguidas,
lo que sugiere revisar el mapa entero de carriles y no sólo estos casos.

**2. La faceta `redondo` no existe, y ya son 3 redondos de sol sólo en Rusty** (Blinded, Zion,
Ardigan). En todo el catálogo hay **16 productos redondos huérfanos** y **530 búsquedas/mes**
(320 + 210) que ninguna página del sitio consolida, mientras tres fichas se las disputan entre ellas.
`/anteojos-de-sol/rusty/redondo` arrancaría con 3 productos, arriba del umbral que dispara el
`noindex` automático por thin content.
Es el mismo argumento que ya se usó para la faceta aviador con el Bruice: el valor no está en la
ficha nueva, está en que la faceta pase a ser un ranker creíble.
Va junto con la decisión más grande de facetas de forma que está abierta en `DATOS_PENDIENTES.md`
(cuadrado **25** productos con el Guardian, redondo 15, envolvente 7 — el 63% del catálogo sin
página de forma). Los números de `cuadrado`, que es el grupo más grande: **990 búsquedas/mes de
intención sol** y **2.530 de intención receta**, cerca de **3.500 al mes sin una sola página que las
consolide**, mientras seis fichas individuales se las disputan entre ellas.

**3. `SEO_STRATEGY.md` no tiene las últimas 8 cargas.** Faltan Malice, Blozon, Le Groupie, Zion,
Cinema, Rew, Ardigan y Guardian: sus carriles viven sólo en las cabeceras de los seeds y en
`CURRENT_STATE.md`. El archivo que los agentes leen como fuente de verdad está 8 productos atrasado,
y por eso las dos colisiones de arriba pasaron desapercibidas. Cada carga nueva se vuelve más cara
de decidir.

---

## ✅ CERRADO — Medidas sin verificar (abierto y cerrado 2026-08-29 → 2026-08-31)

Se había abierto tras auditar los 74 seeds con `measurements`: 10 declaraban al founder, 20 decían
"de la FOTO" y 44 no declaraban nada. **El founder lo cerró el 2026-08-31**: *"todos los modelos
subidos a opticacarballo.com.ar, ya fueron verificados por mi personalmente"*.
**No hay medidas que re-tomar.** Lo que faltaba era el registro de la procedencia, no la
verificación. La regla de declarar la fuente en cada seed nuevo sigue vigente (ver `MISTAKES.md`).

## 🔴 Superlativos de peso FALSOS en 10 productos vivos (2026-08-31)

Salió cargando el Rusty Gover, que pesa 23 g igual que el Bruice. Query sobre los 65 productos
activos con `weight_grams`, ordenados por peso: **10 productos afirman "ultraliviano" o "de los más
livianos" estando en la mitad PESADA del catálogo.** Viola la regla dura 8 (trust signals reales) y
es exactamente lo que el seed del Ardigan advirtió: *"ningún comparativo sin query"*.

| Producto | Peso | Puesto | Percentil | Dónde lo dice |
|---|---|---|---|---|
| **rusty-dileri** | 31,8 g | 59/65 | 91 | **en el `meta_title`** ← el peor |
| **vulk-yamain** | 30,9 g | 56/65 | 86 | "de los más livianos" |
| vulk-dieven (sol) | 28,5 g | 53/65 | 80 | "ultraliviano" |
| vulk-dieven-receta | 28,5 g | 52/65 | 80 | "ultraliviano" |
| vulk-the-sil | 28 g | 51/65 | 78 | "ultraliviano" |
| vulk-katleen (sol) | 26,3 g | 49/65 | 73 | "ultraliviano" |
| vulk-katleen-receta | 26,3 g | 48/65 | 73 | "ultraliviano" |
| rusty-feeled | 25 g | 39/65 | 56 | "de los más livianos" |
| rusty-bruice (sol) | 23 g | 32/65 | 47 | "de los más livianos" |
| rusty-bruice-receta | 23 g | 31/65 | 47 | "de los más livianos" |

Los que SÍ pueden decirlo con verdad: `rusty-r-cy-02-receta` (11,3 g, puesto 1),
`rusty-spell-receta` (12,6 g, 3º), `vulk-clems-receta` (14,3 g, 5º), `rusty-invig-receta` (14,7 g, 7º).

**El arreglo es sacar el adjetivo, no re-medir**: los pesos están bien, lo que está mal es el
comparativo. La frase honesta es "Pesa X g" y nada más, salvo que el producto esté de verdad en el
cuarto más liviano. El Gover se cargó así a propósito.

**Regla que queda**: antes de escribir cualquier comparativo de peso, correr la query de ranking.
Está en el seed 106 y en el del Ardigan.

## 🔴 Sacar el claim "G-Flex = flexible" de 51 productos (regla escalada por el founder 2026-08-26)

**Regla**: que un armazón sea de **G-Flex** NO autoriza a decir que es **flexible**. Es el nombre
comercial del polímero de Vulk, no una propiedad declarada — el fabricante no afirma flexibilidad
en ninguna ficha. Textual del founder: *"que sea G-Flex no indica que sea flexible… puede llevar a
una confusión para el comprador, debes recordar esto si o si"*. Segunda vez que lo corrige. Cae
bajo la regla dura 3 del negocio (no prometer lo que no se puede cumplir).

**Alcance medido contra la base el 2026-08-26**: **51 productos activos**, los 51 en la descripción
y **25 además en los callouts** de la ficha. Rusty y Vulk, sol y receta. Ejemplos: `rusty-beason`,
`rusty-cccp`, `rusty-play`, `vulk-dieven`, `vulk-katleen`, `vulk-my-crew-receta`,
`vulk-strewn-receta`.

**También en Mercado Libre** (descripciones vivas): MLA1905026356 (*"un material flexible y
resistente"*), MLA2824914416 (*"G-Flex (Polímero flexible y ligero)"*), MLA2035140957, el Bruice
recién publicado (*"es un polímero flexible que aguanta la torsión del uso diario"*), y
MLA1820759867 del Vulk Cinema (*"un polímero de alta resistencia mecánica y flexibilidad"*),
encontrado el 2026-08-26 al revisar las descripciones buscando códigos de color.

**Cómo reemplazarlo**: nombrar el material y apoyarse en un dato medible al lado, como el peso —
*"Frente de G-Flex. Todo el anteojo pesa 19,5 g"*. Es lo que se hizo en la placa del Trial MDEMI.

**Query para reencontrarlos**:
```sql
SELECT slug FROM products WHERE is_active
  AND (description ILIKE '%g-flex%' OR attributes::text ILIKE '%g-flex%')
  AND (description ILIKE '%flexib%' OR short_description ILIKE '%flexib%' OR attributes::text ILIKE '%flexib%');
```

**Falta el OK del founder** para hacer el barrido: son 51 fichas y toca texto de venta publicado.

---

## 🟡 Hallazgos de Google Search Console (2026-08-01, addendum al audit) — decisiones pendientes del founder

- [x] ~~**Canonical duplicado en `/sobre-la-marca` sol vs. receta**~~ — **Hecho 2026-08-01**. Founder eligió (b) canonical cruzado explícito. `buildBrandAboutMetadata` hace que receta apunte su canonical/hreflang a la versión de sol del mismo brand. Ver detalle en `AUDIT_2026-08-01.md` addendum.
- [x] ~~**Soft-404 en catálogo**~~ — **Hecho 2026-08-01**. Middleware (`middleware.ts` + `lib/catalog/existence-check.ts`) chequea existencia real de marca/producto con caché en memoria (TTL 300s) antes de dejar pasar la request; fuerza 404 real si no existe. Primer intento (query a Supabase por request) fue marcado regresión por `nextjs-performance`, rediseñado con caché y re-verificado OK. Detalle completo en `AUDIT_2026-08-01.md` addendum.

## 🟢 Pulido opcional — soft-404 existence-check (no bloquea nada, sugerido por nextjs-performance 2026-08-01)

- [ ] **Negative-cache en error de `refreshCache()`**: si Supabase está caído, cada request de catálogo reintenta la query sin backoff (el `cache` no se actualiza, así que el próximo request vuelve a disparar `refreshCache`). Cachear el error mismo 15-30s evitaría machacar la DB durante un incidente real. Fail-open ya cubre la parte de "no rompe nada" — esto es solo eficiencia bajo outage.
- [ ] **Stale-while-revalidate en `getCache()`**: hoy la request que cae justo cuando vence el TTL espera el refresh completo inline. Sería más prolijo servir el Set viejo inmediato y refrescar en background — impacto real hoy es despreciable (~1 request cada 5 min por isolate).

## 🟡 Bug encontrado por Codex en el 2do ciclo del loop de mejora (2026-08-01) — emails best-effort pueden perderse sin aviso

- [ ] **`sendPrescriptionReminderEmail`/`sendAlertEmail` tragan errores de Resend silenciosamente, y el cron marca `reminder_sent_at`/`last_notified_at` igual, sin verificar éxito del envío**: si Resend falla (rate limit, API caída, email inválido), el recordatorio se pierde sin reintento y sin que nadie se entere — el cron lo da por enviado. Mismo patrón en los 2 archivos (`lib/emails/send-prescription-reminder-email.ts` y `lib/emails/send-alert-email.ts`, este último preexistente). Fix: que las funciones de envío devuelvan `boolean`/lancen, y que el cron solo marque el timestamp de "enviado" si el envío realmente tuvo éxito — dejar sin marcar en caso de fallo para que el próximo run del cron reintente. No es urgente (Resend rara vez falla), pero es plata perdida en silencio si pasa.

## 🟡 Deuda técnica — recordatorio de receta (loop de mejora 2026-08-01, ítem 6, flagueado por optical-expert)

- [ ] **`prescriptions.expires_at` guarda en realidad la fecha de EMISIÓN, no de vencimiento** (nombre engañoso desde que se creó la tabla). Hoy `lib/prescription/types.ts` lo compensa calculando `emisión + PRESCRIPTION_VALIDITY_DAYS` en cualquier lugar que necesita el vencimiento real (`isExpired()`, el cron `check-prescription-expiry`). Riesgo real: alguien (humano o agente) lee el campo en el futuro, asume que ya es la fecha de vencimiento, y rompe el cálculo sin darse cuenta. Fix correcto es renombrar la columna (`issued_at` o similar) — no se hizo ahora porque toca `types/supabase.ts`, el RPC `create_order_from_cart`, `lib/checkout/prescription.ts` y el flujo de checkout entero; mejor como migración dedicada, no mezclada con una feature de retención.
- [ ] **Cron de recordatorio de receta (`check-prescription-expiry`) solo cubre anteojos recetados** — `lentes-de-contacto` no es categoría vendible hoy (solo documentada en `BRANDS.md` para el futuro), así que no hace falta la vigencia distinta (180 días vs. 365) que señaló `optical-expert`. **Si esa categoría se activa algún día, hay que ramificar el cron por tipo de receta ANTES de mandarle a compradores de lentes de contacto el mismo copy/umbral que a compradores de anteojos** — el criterio clínico es distinto (salud corneal, no solo graduación).

## 🟡 Deuda técnica y contenido del audit 2026-08-01 (medios/bajos, sin urgencia)

- [ ] **Hallazgo #15 — pipeline de imágenes bypasseado en 6 componentes cliente**: `compare-bar.tsx`, `search-dialog.tsx`, `compare-bar-search.tsx`, `quick-view.tsx`, `product-gallery.tsx`, `compare-table.tsx` reimportan la tabla completa de `lib/catalog/image-scale-overrides.ts` (776 líneas, crece con cada producto) en vez de recibir el scale ya resuelto por props, como sí hace `product-card.tsx`. Hoy el costo en bundle es bajo (~90 productos); se vuelve relevante a los 300+. Fix: agregar `primaryImageScale` resuelto server-side a `fetchProductsForCompareBySlugs`, `searchCatalog`, `getProductQuickViewAction` y la query de PDP, y sacar el import directo de esos 6 archivos `'use client'`. No se hizo en esta pasada porque toca 3 API routes + 6 componentes — mejor como pasada dedicada, no mezclada con el resto del audit.
- [ ] **Hallazgo #16 — solo 4 de 9 clusters de contenido SEO están escritos, cero satélites** (`content/guias/` vs. `SEO_STRATEGY.md` líneas 704-865). No es un bug de código, es trabajo editorial (`/article` o `optimizador-guias-optica`). Prioridad sugerida por `SEO_STRATEGY.md`: satélite `astigmatismo-como-se-ve` → satélite `diferencia-miopia-hipermetropia-astigmatismo` → pillar Hipermetropía → resto. **`/guias/anteojos-segun-forma-de-cara` es la más urgente**: 8+ fichas de producto ya la referencian como cross-link obligatorio y todavía no existe.

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
- [x] ~~**Subir fotos Vulk The Trial** (seed 71, carga abierta 2026-06-14)~~ — **Hecho 2026-06-14**: founder subió las 9, 9/9 HTTP 200, los nombres (incl. doble espacio del MDEMI) coinciden exacto con el seed → sin reconciliación. Scale confirmado visual = **1.0 en las 8** (fotos 900×442 más anchas que el card → ya llenan; el 1.20 cropeaba, como Raven).
- [ ] **Playbook catalog-loader: la convención de slug sol↔receta es load-bearing** (anotado 2026-06-14, deuda de proceso señalada por nextjs-performance). El cross-link sol↔receta de la PDP (`fetchCompanionModality`) deriva el par por slug: receta = sol + `-receta`. Si un futuro producto NO respeta la convención (ej. un sol cuyo slug termina en `-receta`, o un par con slugs distintos), el cross-link apuntaría mal o no aparecería. Al cargar un modelo que exista en ambas modalidades, mantener el slug exacto `X` (sol) / `X-receta` (receta). Sin impacto si el modelo existe en una sola modalidad.
- [x] ~~**Subir fotos Vulk Bennie 51** (seed 73, carga abierta 2026-06-14)~~ — **Hecho 2026-06-14**: founder subió las 7, 7/7 HTTP 200, nombres = seed exacto. Scale confirmado visual = **1.0 en las 6** (900×442 más anchas que el card → llenan ~95%; el "redondo small → 1.15" NO aplicó).
- [x] ~~**Vigilar LCP mobile tras el cambio de grilla a 1 col / 4 col**~~ — **Hecho 2026-08-01**. Founder pidió mejorar velocidad de carga de imágenes; audit de `nextjs-performance` confirmó la causa raíz exacta que este ítem anticipaba (`ProductCard` nunca recibía `priority`) MÁS un segundo problema compuesto no anotado antes: las cards de la 1ra fila estaban envueltas en `RevealOnScroll`, que las renderiza en `opacity-0` hasta que hidrata el JS — así que aunque tuvieran `priority`, el LCP seguía atado a la hidratación, no a la llegada de la imagen. Fix: prop `priority` en `ProductCard` (pasado a `CrossfadeImage`, que ya lo soportaba) + prop `eager` nuevo en `RevealOnScroll` (renderiza visible desde el SSR, sin animación, para contenido candidato a LCP). Aplicado a `idx < 4` en los 6 grids de catálogo (`category-filtered-page`, `gender-catalog-page`, `shape-catalog-page`, `brand-page`, `brand-gender-page`, `brand-filter-page`) + `favoritos/page.tsx`. Verificado en DOM: primeras 4 cards sin `loading="lazy"` (carga eager) y sin clases de animación (`opacity-100` inmediato); resto sin cambios. **Falta confirmar con Vercel Speed Insights (rate-limited al momento del audit) el LCP p75 real antes/después** — el hallazgo de código es sólido pero la mejora cuantitativa no está medida todavía.
- [ ] **Actualizar precio real de Vulk The Trial MDEMI/UPG15** (SKU 968279, seed 71). Se cargó con **precio provisional = igualado al S10 POL ($86.082,29 / 8608229c)** porque la variante está pedida pero aún no tiene MLA. Cuando entre el item a ML: actualizar al precio real + setear `mercadolibre_item_id` (vía admin action, NO SQL crudo — ver [[no-mutar-stock-ordenes-sql-crudo]]). Stock 0 hasta que llegue.

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

## 🟡 Activar el token del webhook de Mercado Libre (acción del founder — hallazgo #11, audit 2026-08-01)

El código ya soporta un token de origen para `/api/ml/webhook` (`ML_WEBHOOK_TOKEN`), pero el chequeo se OMITE mientras la env var no exista — así el webhook real de ML sigue funcionando sin cambios hasta que actives esto. No es urgente (el endpoint ya tiene rate limit y no permite manipular stock — solo dispara una re-consulta a la API real de ML), pero cierra la exposición de "cualquiera puede pegarle a la URL".

- [ ] Generar un token random: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- [ ] Agregarlo en Vercel como `ML_WEBHOOK_TOKEN` (Production).
- [ ] En el panel de Mercado Libre (Configuración de la app → Notificaciones), actualizar la URL del webhook a `https://opticacarballo.com.ar/api/ml/webhook?token=<el-token-que-generaste>`.
- [ ] Confirmar que sigan llegando eventos (`marketplace_webhook_events` sigue sumando filas `processed`).

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

- [ ] **Fotos de más resolución para 68 de los 78 productos** (detectado 2026-08-26). La foto primaria de 60 productos mide 900 px de ancho y la de 8 mide 1200; para una placa de Instagram de 1080 hacen falta 1400+, y por debajo de eso hay que agrandar el recorte y el contorno del anteojo sale más blando (el founder lo detectó a ojo). Ya se verificó que **rustyoptical.com no sirve**: publica todo a 900×442, incluida la colección SS26, y no tiene versión grande escondida en el HTML. Las galerías de Mercado Libre dan 1100-1200 con `GET /pictures/{id}`, o sea que tampoco alcanzan. **La única fuente son fotos propias del founder.** Mitigación aplicada mientras tanto: enfoque proporcional al estiramiento en el generador, que recupera un tercio de la nitidez perdida. Prioridad por stock: los 10 productos con más unidades cubren la mayor parte del valor.


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

- [ ] **`pnpm ig:producto --todos` para correr el catálogo entero** (detectado 2026-08-25). Hoy el script trabaja de a un producto, y la tanda completa de las 1.532 placas se corrió con un shell script armado a mano en un directorio temporal, que se perdió al reiniciar la sesión. Los PNG quedaron, pero la corrida no es reproducible. El flag tiene que recorrer los productos activos, generar los 7 diseños + los 3 extras en los dos formatos, y —importante— aceptar `PLACAS_SVG` para dejar los SVG y que `pnpm placas:verificar --svg` los revise sin regenerar nada (ver LEARNINGS 2026-08-25 sobre generar y verificar en una sola pasada). Sin eso, verificar el catálogo entero cuesta 1,5 h de recorte con rembg que ya se pagó.


- [ ] **Sacar el `?` del `storage_path` del Vulk Ready?** (detectado 2026-08-25 en la tanda de placas). Su carpeta en el bucket es `vulk-ready?-receta/`, con el signo de pregunta literal, porque salió del nombre del modelo. **La web anda bien** —Next Image escapa el `?` solo y la ficha sirve las fotos con HTTP 200— pero **el SDK de Supabase NO lo escapa en `.download()`**: corta el path ahí y devuelve "Object not found" aunque el archivo esté. Ya rompió el generador de placas (arreglado escapando cada segmento del path) y va a romper cualquier script nuevo que baje por path. Limpieza de fondo: renombrar los 3 objetos del bucket a `vulk-ready-receta/` y actualizar `storage_path` en `product_images`. ⚠️ Renombrar invalida el cache de 31 días de la imagen optimizada de Next para ese producto, así que las fotos van a tardar un rato en volver a servirse rápido. Es una migración de datos del catálogo: pedir OK al founder antes.


- [ ] **Tipografía del esquema de medidas** (detectado 2026-08-25 en la revisión visual de las placas de Instagram). El esquema que se ve en la placa `medidas` NO lo genera `placa-producto.ts`: es la imagen que quedó guardada en `product_images` cuando se corrió `pnpm placas` para Mercado Libre. Dos defectos suyos: (a) en algunos productos la cota se parte —el número queda arriba de la línea de medida y el "mm" cae abajo, huérfano—, y (b) los números salen con tracking abierto y se leen como dígitos sueltos ("1 4 5"), justo al revés de las filas de la placa, que van ajustadas. Se arregla en `scripts/lib/placas-medidas.ts` y obliga a regenerar y volver a subir el esquema de cada producto (nombre de archivo nuevo obligatorio: la imagen optimizada de Next se cachea 31 días por path). Caso de control: `vulk-53-3`, la cota del puente.


- [ ] **Terminar de unificar las placas de guías con las primitivas compartidas** (2026-08-25). `scripts/lib/placa-articulo.ts` ya usa `ajustarMedido` en sus tres titulares (pregunta, respuesta, titular) — eso arregló un desborde real de 64 px. Lo que queda es que **no importa nada de `placa-base.ts`**: tiene su propia copia de `enLineas()` y de `ajustar()` con el estimador de 0,52 px por carácter, todavía usado en los `enLineas` de temario, autoridad y la bajada del titular. Ojo con cuatro cosas al migrar: (a) los ítems del temario se dibujan en `x = MARGEN + 44`, así que su columna real es **884, no 928**; (b) medir cada ítem por separado da un cuerpo distinto por ítem y la lista sale despareja — hay que medir los N y quedarse con el mínimo; (c) el `kicker` de base no recibe `ctx`; (d) importar de base **cambia el render** de las 10 combinaciones (encabezado 25→22, pie 500/23→600/22, tracking del rótulo 7→8, el brillo pasa a círculo de 6 cortes), así que va con OK visual del founder. Verificación: `pnpm placas:verificar --guias` (cubre los 5 tipos × 2 formatos × cada FAQ, 166 placas) más una mirada a `como-leer-receta-anteojos` en `temario` story y `presbicia` en `autoridad` feed, que son los casos visualmente más apretados.


- [ ] **Fotos de modelo sin usar en el catálogo** (detectado 2026-08-01 al cargar Vulk Vartis). `PRODUCT_SCHEMA.md` menciona "imagen contexto (modelo usando los lentes)" como campo 🔴 recomendado, pero ningún seed real del catálogo lo usa hoy — todos van solo perfil+frente+medidas. El founder subió `modelo-vartis-LPink.jpg`/`Modelo-vartis-mdemi.jpg` (foto de una persona usando el armazón) pero quedaron sin insertar en `product_images` por falta de precedente/convención de dónde mostrarlas en la PDP. Evaluar si vale la pena definir el patrón (sort_order reservado, posición en la galería) para futuras cargas, o descartar el campo del schema si no se va a usar nunca.

- [ ] **Bug: filtro `/polarizados` no deriva de variantes en runtime pese al comentario del seed 79** (detectado 2026-07-14 por seo-strategist al auditar Vulk Dieven sol). `fetchBrandPageByFilter` (`lib/catalog/queries.ts:294-307`) filtra `/anteojos-de-sol/[brand]/polarizados` por `attributes.lens_treatment` a nivel PRODUCTO (containment `["polarized"]`) — NO por `polarized:true` de variantes individuales. El comentario de `79_rusty_zinz_sol.sql` línea 22 dice "se deriva del flag polarized:true de cada variante en runtime", lo cual es **incorrecto**: no existe tal derivación en el código actual. Consecuencia probable: Rusty Zinz (2/2 variantes polarizadas, pero `lens_treatment` de producto solo tiene `["uv400"]` según convención Bruk) posiblemente NO aparece hoy en esa faceta pese a ser 100% polarizado. Revisar todos los productos con variantes 100% polarizadas pero `lens_treatment` de producto sin `"polarized"` (convención actual solo agrega "polarized" a nivel producto cuando TODAS las variantes lo son — puede que ese paso se haya salteado en algunos seeds). Decidir: (a) agregar la derivación runtime real que el comentario asumía, o (b) auditar y corregir el campo `lens_treatment` de producto en los seeds afectados.

- [x] ~~(a) `frame_shape` mezclado español/inglés~~ — **RESUELTO 2026-06-29**: el item tenía la dirección AL REVÉS (el canónico real es ESPAÑOL: brand-filters usa `aviador`, mayoría de la data en español). Lo que rompía eran MIS cargas en inglés (round/square/aviator) → chips duplicados + /aviador no matcheaba The Trial. Normalizados los 8 productos en inglés → español (DB + 8 seeds), PRODUCT_SCHEMA corregido a canónico español. Ver MISTAKES 2026-06-29.
- [ ] **Auditar `lens_treatment` fuera de enum por variante** (detectado 2026-06-13). Play (seed 63) y Patien (seed 65) usan `"espejado"` y `"antirreflejo-interno"`, que NO están en el enum (`polarized|uv400|gradient|mirrored|photochromic`) → revisar si el comparador los renderiza o quedan crudos; si hace falta, mapear espejado→`mirrored` y mover el antirreflejo interno a callout (como se hizo en Blinded/And Now/Bennie). Bajo riesgo funcional (JSONB libre) pero ensucia comparador.

- [ ] **`scripts/ml-item.ts` — refrescar el access token de ML automáticamente** (detectado 2026-06-13, ver MISTAKES). El script usa el access token guardado en `marketplace_integrations` sin refrescarlo; los access token de ML duran ~6h → en sesiones largas de carga vence y da HTTP 401, frenando la importación hasta que el founder reconecta ML a mano. Mejora: usar el `refresh_token` (también en la tabla, encriptado) para renovar el access token + persistir el nuevo antes de fallar. Mientras tanto, el workaround es que el founder re-autentique.

- [ ] **Cross-link sol↔receta pendiente para Rusty Peating** (detectado 2026-07-14). Tiene versión de SOL activa en ML (MBLK/S10 + SBLK/DRT03) pero solo la versión RECETA fue cargada al catálogo (seeds 84/85, ambos sin aplicar). El cross-link es automático por convención de slug (`rusty-peating` ↔ `rusty-peating-receta`) — engancha solo apenas ambos estén aplicados. (Vulk Dieven resuelto: seed 87 sol ya cargado en el mismo turno.)

- [ ] **Falta faceta `/anteojos-de-sol/cuadrados`** (detectado 2026-07-14 por seo-strategist al cargar Rusty Peating sol). No existe la ruta ni a nivel top-level ni por marca (`/anteojos-de-sol/[brand]/cuadrados`), a pesar de que Rusty Zinz sol ya targetea `anteojos/lentes de sol cuadrados` (170-390/mes) como primaria desde el seed 79. Sin la faceta, esa keyword no tiene una URL de categoría a la que apuntar — el producto individual absorbe todo el peso. Evaluar agregar la faceta cuando haya volumen suficiente de cuadrados de sol cargados (hoy: Zinz, Peating).

- [ ] **`recommended_face_shapes` en los armazones del catálogo** (detectado 2026-06-11 al cargar Vulk Tour 81 vía catalog-loader). Es campo RECOMENDADO del schema (PRODUCT_SCHEMA línea 111) y lo usa el recomendador IA, pero ningún armazón lo tiene (My Crew, Tour 81, etc. lo omiten). Pasada dedicada: definir el vocabulario exacto que espera el recomendador (`["ovalada","redonda",...]`?), validarlo con `optical-expert` por forma (cuadrado/redondo → cara redonda/ovalada; etc.) y backfillear los productos. Hasta entonces el recomendador no sugiere por forma de cara.
- [ ] **Pesos pendientes — el founder pesa con balanza de precisión y pasa los gramos** (lista viva, desde 2026-06-11). Cuando ML/el fabricante no da el peso, el producto se carga SIN `weight_grams` (no inventamos; el casillero "Peso" del comparador queda vacío) y se anota acá. El founder los pesa y los pasa; si NO los pasa es porque el fabricante tampoco da el dato (queda vacío definitivo). Al recibir cada peso → agregar `weight_grams` al seed + DB (vía MCP) y tachar de la lista.
  - [ ] Vulk Tour 81 receta (seed 62) — tiene unidad física (315).
  - [ ] Rusty Play sol (seed 63).
  - [ ] Rusty Terdey sol (seed 64).
  - [ ] Rusty Blinded sol (seed 68).
  - [ ] Rusty Woxi receta (seed 74) — "livianos" sin gramaje.
  - [ ] Rusty And Now sol (seed 69).
  - [x] ~~Rusty Patien sol (seed 65) + receta (seed 66)~~ — **23,6 g** (founder pasó el peso 2026-06-13, aplicado a ambos, mismo frame).

- [ ] **Backfill de `cacheControl: 31536000` en objetos viejos del bucket `products`** (audit perf 2026-06-11). Los seeds subieron fotos con el default de Supabase (`max-age=3600`). Mitigado por `images.minimumCacheTTL = 31d` en next.config → prioridad baja. Si se hace: script que re-sube cada objeto con el cacheControl correcto (storage `update` necesita el archivo).
- [ ] **Content-Security-Policy (CSP)** (auditoría 2026-06-09). Los demás headers de seguridad ya están (commit `c93a101`: X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy). Falta CSP, que es la riesgosa: hay que listar orígenes de MP, Supabase, AFIP, fonts, etc. y testear que no rompa nada. Hacer con `Content-Security-Policy-Report-Only` primero.
- [ ] **Alt text de imágenes de producto** (auditoría 2026-06-09). En grids muchas imágenes salen con `alt="Variante"` (viene de la data `alt_text` en la DB) o `alt=""` (cards con `aria-hidden` a propósito, el nombre va como texto). Para Google Imágenes conviene alt descriptivo ("Rusty Xold negro mate — lentes polarizadas"). Requiere: (a) generar alt programático desde producto+variante en los componentes de imagen, respetando la intención de a11y actual, y/o (b) corregir `alt_text` en la DB. Pasada dedicada (toca varios componentes + data).
- [ ] **PDP mobile: barra fija de compra (sticky add-to-cart)** (auditoría 2026-06-09). En mobile la galería empuja el precio/compra abajo del fold. La página ya tuvo iteraciones de CRO (el precio se subió a propósito). Mejora: barra fija inferior con precio + CTA que aparezca al scrollear (con selección de variante, ya que hay multi-variante). Feature mediana, hacer con cuidado y revisión visual del founder. Coordinar z-index con el banner de cookies.
- [x] ~~**Dirección física + ciudad/provincia del local**~~ — ya confirmada por el founder (2026-06) y hardcodeada en `lib/site/business.ts` (Av. Lavalle 2686, Gob. Virasoro, Corrientes, CP 3342). Este doc quedó desactualizado — se detectó recién al sincronizar `lib/content/faqs.ts` con el audit del 2026-08-01 (hallazgo #5). Sigue pendiente:
- [ ] **Horario de atención del local (founder)**: no existe en ningún lado del código (`lib/site/business.ts` no tiene el campo). Falta para: FAQ (`retiro-en-local`, `local-fisico` en `lib/content/faqs.ts`, hoy con `[A CONFIRMAR: horario de atención]`), `openingHoursSpecification` en `organization-jsonld.tsx` (SEO local), y `/sobre-nosotros`. _(Nota: los claims de matrícula/regente se sacaron a propósito el 2026-06-09 — NO re-agregar matrícula al footer/llms.txt.)_
- [ ] **Umbral técnico de "graduación elevada" que requiere armado presencial** (founder/regente/proveedor de lentes). El FAQ `graduaciones-elevadas` ahora usa un criterio cualitativo (verificado con `optical-expert` 2026-08-01, sin inventar un número) porque el umbral real depende de la capacidad del laboratorio de esta óptica en particular (ej. si arman alto índice, si toman DNP con pupilómetro). Si el founder confirma el umbral operativo real (aprox. esférico/cilindro en dioptrías), sirve para automatizar el filtro en el configurador de recetas, no solo para el FAQ.
- [ ] **Si aceptan efectivo en el local para retiro en persona (founder)**: FAQ `medios-de-pago` en `lib/content/faqs.ts` sigue con `[A CONFIRMAR]` en este punto puntual.
- [ ] **Plazos reales de entrega de Correo Argentino, con historial propio** (verificado con `argentine-ecom` 2026-08-01): el FAQ `cuanto-tarda-envio` tenía rangos de días inventados sin verificar contra tiempos reales de MiCorreo — se sacaron (Ley 24.240 art. 8, publicidad engañosa si no se cumplen). Cuando haya un primer lote de entregas reales, volver con datos reales y reemplazar el `[A CONFIRMAR]` del FAQ.
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

- [ ] **Threads para Óptica Carballo** (habilitado 2026-08-25): la app de Meta ya tiene el caso
  de uso de la Threads API prendido. En productosvirales Threads rinde ~12x las vistas de X, así
  que vale probarlo acá. Sería una integración aparte (`lib/integrations/threads/`), pero puede
  reusar entera la cola de `social_posts` — la tabla ya tiene la columna `platform` justamente
  para esto; hoy el CHECK solo acepta `'instagram'` y habría que ampliarlo.
- [ ] **Instagram Shopping vía Catalog API** (habilitado 2026-08-25): el caso de uso está
  prendido y no se usa. Permitiría etiquetar productos en los posts y que el precio salga del
  catálogo. Para un e-commerce con 60+ productos cargados es la mejora con más upside de las que
  desbloquea la app de Meta. Requiere verificación del negocio y aprobación de compras en
  Instagram — no es un fin de semana.
- [ ] **Evaluar pasar el token de Instagram a un *page access token***: hoy se guarda un token de
  usuario de larga duración (60 días) que `token.ts` renueva solo. Un page token derivado de un
  token de usuario de larga duración **no vence nunca**, lo que sacaría de encima el único modo de
  falla silenciosa que le queda a la integración (que la renovación falle y el feed quede mudo).
  Implica cambiar el flujo de `seedToken`: token de usuario corto → largo → `GET /me/accounts` →
  guardar el token de la página. No urgente: la renovación anticipada de 7 días + el aviso por
  mail ya cubren el caso.
- [ ] **Apagar los casos de uso de la app de Meta que no se usan** (Marketing API, ads MCP,
  oEmbed, WhatsApp): no molestan, pero son los que hacen que Meta pida verificación del negocio.
  Si aparece ese cartel y traba algo, desactivarlos es lo primero a probar.

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
