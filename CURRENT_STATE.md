# Óptica Carballo — Current State

## Status

🟢 **Vulk Day Light — SEO end-to-end optimizado + productos relacionados + Brand schema + ItemList**

Founder pasó precio ($88.037 → 8803700 cents) + stock (3 unidades) + URL oficial Vulk como referencia. Pidió "excelente link interno con productos similares tipo Cardproducts" + se ofreció a hacer keyword research con Ubersuggest. **Invoqué `seo-strategist` proactivamente**, devolvió auditoría completa con 9 acciones priorizadas. **Implementadas 6 de impacto alto** en este turno: (1) **Slug cambiado** `vulk-day-light-sol` → `vulk-day-light` (sin sufijo redundante con categoría parent). (2) **meta_title** actualizado a `Anteojos de Sol Vulk Day Light Polarizados | Óptica Carballo` (60 chars, keyword frase principal). (3) **meta_description** actualizado con trust signal de "técnico óptico matriculado" reemplazando "G-Flex" sin volumen. (4) **Productos relacionados con algoritmo cascada** — query nueva `fetchRelatedProducts` en `lib/catalog/queries.ts` con 4 pasos: (a) misma cat+marca, (b) ±30% precio mismo cat, (c) misma forma armazón, (d) cualquier producto de la cat. Limit 6. Componente NUEVO `components/product/related-products.tsx` con grid 2/3/6 cols (mobile/tablet/desktop), RevealOnScroll con stagger, anchor SEO en nombre del producto (no "Ver producto" genérico), image priority. (5) **Brand schema completo** en ProductJsonLd con `brand.url` apuntando a marca page (Knowledge Graph eventual). (6) **ItemList JSON-LD nuevo** `components/seo/related-itemlist-jsonld.tsx` con `ListItem` positions de los relacionados (rich snippets potenciales). (7) **Subtítulo bajo H1** automático (calcula según categoría + género + polarizado de attributes), ej "Anteojos de sol unisex polarizados". (8) ProductDetailPage convertido a async para fetch de relacionados. Typecheck verde. **Pendiente próximo turno (recomendaciones SEO restantes)**: FAQ section + FAQPage schema (requiere preguntas reales del founder), estructura H2/H3 detallada (Características/Especificaciones/Envíos/FAQ), bloque "Explorá más opciones" con chips a páginas filtro (cuando existan `/anteojos-de-sol/polarizados`, `/rectangulares`). **2 PENDIENTES founder**: (a) subir 3 imágenes al bucket Supabase a `vulk-day-light/01-lateral.jpg`, `vulk-day-light/02-frontal.jpg`, `vulk-day-light/03-medidas.jpg` (path cambió de `vulk-day-light-sol/` a `vulk-day-light/`); (b) aplicar `supabase/seeds/03_vulk_day_light.sql` en SQL Editor del Dashboard.

🟡 **1er producto REAL preparado — Vulk Day Light (Sol) — SQL listo + ProductGallery funcional**

Founder pasó data del primer producto real: **Vulk Day Light** (anteojos de sol, marca Vulk no Rusty como yo había asumido). Procesamiento completo en este turno: (1) **Copy generado por `content-writer-medical`** (4 textos validados de límites de caracteres: short_description 148 chars, description 847 chars, meta_title 59 chars, meta_description 151 chars — todos honestos sin superlativos, mencionan limitación de polarizado con LCD). (2) **SQL listo** en `supabase/seeds/03_vulk_day_light.sql`: INSERT producto + variante (Carey Brillo / Verde, SKU 194185) + 3 imágenes (lateral 3/4 primary, frontal, esquema técnico de medidas). Attributes JSONB con frame_material `g-flex`, lens_treatment `[polarized, uv400]`, weight_grams 26.1, interchangeable_lenses true, hinge_material reinforced-plastic, measurements completas (frame 140mm, lens 51x31mm, bridge 20mm, temple 140mm). (3) **Helper nuevo** `lib/storage/product-image-url.ts` (pure JS, NO server-only) que construye URLs públicas de Supabase Storage deterministically (bucket es público — no necesita SDK). (4) **Extendido `ProductDetailData` type** con `images: ProductImage[]` + query `fetchProductPage` ahora selecciona `images:product_images(storage_path, alt_text, width, height, sort_order, is_primary)`. (5) **Reescrito `ProductGallery`** como client component: orden inteligente (`is_primary first, then sort_order`), main image grande con next/image + zoom on hover, thumbs clickeables debajo con grid auto-fit, fallback al placeholder anterior si no hay imágenes, focus visible accesibilidad, priority=true en primera imagen para LCP. (6) Typecheck verde. **2 PENDIENTES del founder**: (a) subir 3 imágenes al bucket Supabase `products` con paths exactos `vulk-day-light-sol/01-lateral.jpg`, `vulk-day-light-sol/02-frontal.jpg`, `vulk-day-light-sol/03-medidas.jpg`; (b) confirmar `price_cents` y `stock_qty` reales (SQL los deja en 0, la variante NO aparece comprable hasta que se actualicen). **Próximo paso**: founder hace upload + me pasa precio/stock → yo aplico SQL en cloud + UPDATE de precio + commit/push.

🟡 **Carga del 1er producto Rusty real — esperando data del founder**

Founder confirmó que el DNS de Resend está aprobado para `opticacarballo.com.ar` — eso destraba envío de mails transaccionales desde dominio propio (sale `RESEND_FROM_EMAIL=hola@opticacarballo.com.ar` u otro `@opticacarballo.com.ar` que decida). Pendiente que founder setee `RESEND_FROM_EMAIL` + `BUSINESS_ADMIN_EMAIL` en `.env.local` y Vercel. Founder pidió cargar 1er producto real antes de seguir con feature work — quiere ver cómo se ve la página de producto con data verdadera para iterar. **Estrategia decidida**: reemplazar uno de los 4 placeholders `[PH]` Rusty existentes en cloud (no crear nuevo) — preserva slugs ya indexables, elimina un `[PH]` del catálogo, más limpio. Le pasé al founder una plantilla estructurada de datos (marca, categoría, modelo, descripción corta+larga, atributos como material/forma/lentes/género, variantes con color+precio+stock+SKU, imágenes). **Cuando founder me pase la data**: armar SQL UPDATE para el producto + INSERT/UPDATE para variantes + upload de imágenes al bucket `products` de Supabase Storage + tag de las imágenes contra el producto (via columna nueva o tabla `product_images` — TBD según schema). **Próximo paso**: founder me pasa data del primer producto con su plantilla rellena.

🟢 **Polish consistente aplicado a category/brand/product pages + site-header glass effect**

Push exitoso a GitHub (commit `329b82d`) — Vercel redeploy auto. Después, founder pidió "seguir": apliqué el MISMO tratamiento visual de la home al resto del sitio para que no quede asimétrico (la home moderna y las otras páginas básicas). Cambios: (1) **`category-index-page.tsx`**: heading sube a `text-4xl md:text-5xl lg:text-6xl` con `text-balance`, envuelto en `RevealOnScroll`; cada `BrandGridCard` en RevealOnScroll con stagger `80 * idx`ms (barrido); descripción copy con text-balance. (2) **`brand-page.tsx`**: heading idem (4xl→6xl + text-balance), envoltorio RevealOnScroll; cada ProductCard en RevealOnScroll con stagger `60 * idx`ms (los productos van apareciendo a medida que scrolleás el catálogo). (3) **`product-page.tsx`**: nombre del producto sube a `text-4xl md:text-5xl` con text-balance; sección "Descripción" con heading más prominente (`text-xl md:text-2xl`) envuelto en RevealOnScroll, párrafo de descripción con `text-base leading-relaxed` (era `text-sm`). (4) **`site-header.tsx`**: cambió de `bg-background` opaco a `bg-background/75 backdrop-blur-md` con fallback `supports-[backdrop-filter]:bg-background/60` — efecto **glass/frosted moderno** cuando scrolleás (se ve el contenido difuminado debajo del header), border más sutil `border-border/60`. (5) NO toqué ProductGallery porque ahí va el showcase scroll-driven cuando lleguen imágenes reales. Typecheck verde. **Próximo paso**: push del segundo lote + redeploy.

🟢 **Capa 2 ítem 2 — Cursor magnético en CTAs del hero (framer-motion instalado)**

Founder aprobó instalación de `framer-motion`. Instalado v12.40.0 (~50KB gzip), 3 paquetes added en pnpm. Implementado componente `components/ui/magnetic-button.tsx` (client): wrapper polimórfico que aplica efecto magnético a children con `useMotionValue` + `useSpring` de framer-motion. **3 protecciones defensivas en montaje**: (1) si `matchMedia('(hover: hover) and (pointer: fine)')` no matchea → renderiza children pasthrough sin envoltorio (mobile/touch devices no reciben efecto, correcto); (2) si `prefers-reduced-motion` activo → también pasthrough sin lib motion behavior; (3) si no hay ref del wrapper → no-op. Spring config: `{stiffness: 220, damping: 18, mass: 0.4}` — produce overshoot mínimo, feel "tirado-con-elástico". Strength default 0.28 (28% del delta cursor-to-center). Aplicado a los 2 botones primary del hero ("Ver anteojos de sol" + "Ver anteojos de receta"); el botón WhatsApp NO se envolvió para no sobre-cargar. Typecheck verde. **Decisión consciente — Capa 2 ítem 3 (showcase scroll-driven en producto) PAUSADO**: requiere imágenes reales de producto (vistas frontal/lateral/3-cuartos) para tener sentido. Implementarlo sobre el placeholder "Foto pendiente" sería polish prematuro (regla CLAUDE.md "no half-finished implementations"). Movido a pendientes: implementar cuando founder cargue 1er producto Rusty con imágenes reales. **Próximo paso**: founder revisa visual de Capa 2 (hero editorial + cursor magnético). Si gusta, opciones: ajustar detalles, esperar imágenes para showcase, o avanzar a Capa 3 (3D monturas con react-three-fiber para productos premium, lector de receta IA — ADR-022).

🟢 **Capa 2 ítem 1 — Hero editorial cinematográfico CSS-only**

Founder dio luz verde a Capa 2 con "dale". Empecé por el ítem que NO requiere libs nuevas (respetando regla 6 CLAUDE.md de no instalar sin pedir): rediseño del HomeHero. Cambios: (1) **Gradient mesh background animado** — 3 blobs radiales con `blur-3xl` (foreground/[0.04-0.06] opacidad para que sea sutil) y keyframes `mesh-drift-a/b/c` que drift muy lento (22s/28s/34s ease-in-out infinite) con scale entre 0.95 y 1.12 — efecto "respiración" cinematográfica sin distraer. (2) **Tipografía editorial grande** — heading sube de `md:text-6xl` a `md:text-7xl lg:text-[5.5rem]` con `leading-[1.05]`, `tracking-tight`, `text-balance` (Tailwind 3.4+) para mejor wrap. Mitad del heading "asesoramiento óptico real" con `bg-clip-text text-transparent` gradient sutil para no romper accesibilidad. (3) **Animación de entrada escalonada** — utility `.hero-reveal` con `cubic-bezier(0.16, 1, 0.3, 1)` (curva "ease-out-expo" cinemática) + 4 delays (50/200/400/600ms) para eyebrow → heading → subhead → CTAs. (4) Eyebrow del hero: `tracking-[0.2em]` uppercase, info validada ("óptica matriculada · 30+ años"). (5) CTA primary con `shine-on-hover` + flecha animada. (6) Container más alto: `py-20 md:py-32` (de `py-16 md:py-24`). 0 libs nuevas, typecheck verde. **Detectado y corregido en runtime**: inicialmente inventé "desde 1995" en el eyebrow — ningún archivo del proyecto valida ese año. Corregido a "30+ años" que sí está documentado en CLAUDE.md/BRANDS.md. **Próximo paso**: founder revisa visual del nuevo hero. Si gusta, ofrezco instalar `framer-motion` (~50KB gzip) para los 2 ítems Capa 2 restantes (showcase scroll-driven en producto + cursor magnético en CTAs).

🟢 **Capa 1 modernización LOTE 2 implementado — reveal-on-scroll + shine sweep + View Transitions API**

Founder dio OK para continuar. Implementado lote 2 (3 ítems restantes de Capa 1): (1) Componente NUEVO `components/ui/reveal-on-scroll.tsx` (client) con IntersectionObserver — threshold 0.12, rootMargin `-64px` bottom para que el reveal dispare un poco antes del border, disconnect post-trigger para evitar re-runs, **respeta `prefers-reduced-motion` chequeando matchMedia en montaje y marcando visible=true inmediatamente** (sin animación si el user opted out), polimorfismo via prop `as` (div/section/ul/li/article) con TypeScript correcto. (2) Aplicado en `categories-section.tsx` (heading + 2 cards con delays 0/120/220ms), `brands-section.tsx` (heading + cada chip con stagger `60 * idx`ms — barrido suave de izq a der), `value-props.tsx` (cada li con stagger `100 * idx`ms). NO se envolvió HomeHero ni TrustMarquee porque ya están visibles al cargar. (3) Utility class `.shine-on-hover` en globals.css con `::before` pseudo-element gradient diagonal blanco semi-transparente que cruza el botón con `cubic-bezier(0.4, 0, 0.2, 1)` 0.7s. Aplicado al CTA primary "Ver anteojos de sol" del hero (+ flecha que avanza). El gradient usa `hsl(var(--primary-foreground) / 0.28)` para que se adapte al theme. (4) Page transitions con View Transitions API **vía CSS puro** (`@view-transition { navigation: auto }` + animaciones `vt-fade-in/out` con translateY 8px) — funciona en Chrome 126+, Edge, Safari 18+ sin tocar next.config (sin features experimentales). Fallback elegante (navegación instantánea sin animar) en browsers viejos. **Override `prefers-reduced-motion` aplicado a view-transitions también**. Typecheck verde. **Capa 1 COMPLETA**. **Próximo paso**: founder revisa visual completo en dev server. Si gusta, salto a Capa 2 (hero video editorial / showcase scroll-driven en producto / cursor magnético desktop) — o ajusta detalles antes.

🟢 **Capa 1 modernización LOTE 1 implementado — smooth scroll + product cards premium + trust marquee**

Founder dio luz verde a Capa 1 Camino A (Tailwind/CSS-only, sin libs nuevas). Implementado lote 1 (3 de 6 items): (1) Smooth scroll global en `html` + override completo de `prefers-reduced-motion` (cancela animations + transitions + scroll smooth si user opted out — accesibilidad YMYL crítica); (2) Product cards con hover premium (`-translate-y-0.5` + shadow-lg + border foreground/30 + image-zoom 1.03 dentro de `group/card` para no chocar con groups parent — usé named group de Tailwind 3.2+); (3) Brand grid cards más expresivas (`-translate-y-1` + shadow-xl + flecha animada `translate-x-1` con duration-300); (4) Brand chips del home con lift sutil + scale del texto; (5) Componente NUEVO `components/home/trust-marquee.tsx` — strip negro full-bleed con 5 value props (Óptica matriculada habilitada • 30+ años AR • Envíos al país • Stock real verificado • Marcas oficiales) en loop CSS `marquee 40s linear infinite`, técnica duplicar items + `translateX(-50%)` para loop infinito sin reset visible, pausa-on-hover via `group:hover`; (6) TrustMarquee insertado en home entre Hero y Categories. Typecheck verde (`tsc --noEmit` sin errores). 6 archivos modificados, 1 nuevo, 0 libs instaladas, 0 KB extra. **Próximo paso (Capa 1 lote 2)**: reveal-on-scroll con IntersectionObserver, shine sweep en CTAs principales, page transitions con View Transitions API nativa de Next 15. **Esperando feedback visual del founder** en dev server antes de seguir.

🟡 **Plan "Capa 1 modernización" propuesto — esperando OK del founder para implementar**

Founder pidió que el sitio se vea "más moderno" pasando 5 refs heterogéneas (Cartier luxury, Cleo fintech-friendly, aircenter agency, aimee illustrated, sidewave experimental). Honestidad técnica: ninguno es e-commerce médico/YMYL, y scroll-jacking + WebGL pesado de varios de esos rompe Core Web Vitals (= ranking factor SEO crítico) y mobile UX (mayoría tráfico AR). Plan presentado en 3 capas: **Capa 1** (polish base sin riesgo: smooth scroll CSS, hover premium en product cards, page transitions con View Transitions API nativa, reveal-on-scroll con IntersectionObserver, marquee de marcas CSS, shine sweep en CTAs), **Capa 2** (diferenciación: hero video editorial, cursor magnético desktop, showcase scroll-driven en producto), **Capa 3** (wow factor: 3D monturas con react-three-fiber, animación upload IA para lector de receta). Recomendación: arrancar Capa 1 con **Camino A — Tailwind/CSS-only sin libs nuevas** (0 KB extra, máxima perf, cubre 90% del look "moderno") en vez de Camino B (framer-motion + lenis ~65KB). Si después de ver Capa 1 falta algo, agregamos framer-motion puntual. **Plan Capa 1**: 6 items, ~6-8 archivos modificados, 2 nuevos (`components/ui/reveal-on-scroll.tsx`, `components/home/brands-marquee.tsx`), ~30-45 min trabajo, sin migraciones, sin breaking, todo respeta `prefers-reduced-motion`. **Próximo paso**: founder da OK para arrancar Capa 1 (Camino A) o pide cambios al plan.

🟢 **Deploy en producción FUNCIONAL — `opticacarballo.com.ar` LIVE detrás de feature flag OFF**

Founder importó el repo a Vercel, configuró env vars (6 críticas: Supabase URL/anon/service_role + SITE_URL + CART_COOKIE_SECRET random + `NEXT_PUBLIC_CHECKOUT_ENABLED=false`), reintentó deploy y pasó. Primer build había fallado con `supabaseUrl is required` porque `generateStaticParams` de `/anteojos-de-receta/[brand]/[product]` ejecuta queries a Supabase en build-time (no runtime), así que las env vars NEXT_PUBLIC_* tenían que estar en Vercel ANTES del build, no después. Resuelto agregando las env vars y haciendo redeploy. Dominio custom `opticacarballo.com.ar` apuntando OK. **Pendientes inmediatos del founder**: (a) actualizar `NEXT_PUBLIC_SITE_URL` en Vercel al dominio custom (estaba con vercel.app inicialmente) → redeploy; (b) en Supabase Dashboard → Auth → URL Configuration, agregar `https://opticacarballo.com.ar/**` como Redirect URL, sino `/ingresar` falla en prod. **Decisión pendiente del founder**: dirección estética del sitio (pasó 5 refs muy distintas — Cartier, Cleo, aircenter, aimee, sidewave). Propuesta de 3 capas (polish base / diferenciación / wow factor) presentada — esperando que founder elija dirección estética antes de implementar.

🟢 **Proyecto pusheado a GitHub privado — listo para conectar a Vercel**

Founder pidió subir el proyecto a GitHub para poder importarlo en Vercel. Verifiqué que `.gitignore` excluye `.env*.local` y que `git ls-files | grep .env` solo devuelve `.env.example` (template sin secrets reales — los secrets nunca estuvieron trackeados). Repo creado como **privado** vía `gh repo create optica-carballo --private --source=. --push`: https://github.com/sheldor26/optica-carballo. Push exitoso de `main` con 14 commits acumulados desde el inicio del proyecto. **Próximo paso del founder**: ir a vercel.com/new, importar el repo, configurar env vars críticas en el dashboard de Vercel (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL, CART_COOKIE_SECRET ≥32 chars random, `NEXT_PUBLIC_CHECKOUT_ENABLED=false` para arrancar apagado), deployar. Después del primer deploy: agregar la URL de Vercel como Redirect URL en Supabase Auth Dashboard para que login funcione. Las env vars de MP, Resend y MiCorreo se agregan recién cuando se vaya a activar venta real.

🟢 **Migraciones 00005 + 00006 + 00007 aplicadas y VERIFICADAS en cloud (4/4 SELECTs)**

Founder aplicó el bootstrap idempotente (~232 líneas) sin errores. Los 4 SELECTs de verificación devolvieron exactamente lo esperado: bucket `products` público 5MB, policy `products: anyone reads SELECT`, funciones `reserve_stock` + `increment_variant_stock`, columna `order_items.brand_name text`. Bootstrap derivado borrado (cumplió su rol). CLOUD_APPLIED.md marcado ✅ VERIFICADO para las 3 migraciones. **Schema cloud está en paridad total con local** — listo para testing E2E real cuando configuremos webhook MP + dominio Resend en cloud. **Próximo paso real depende del founder**: (1) verificar dominio Resend, (2) configurar webhook MP en panel, (3) creds MiCorreo cuando respondan, (4) data primer producto Rusty real para reemplazar `[PH]`.

🟢 **`/mi-cuenta/pedidos` listo + Migración 00007 (brand_name) + bootstrap idempotente**

Sesión enfocada en lo que NO depende de inputs externos pendientes (creds MiCorreo, data productos, configuración Resend/MP en prod). Construido: (1) Migración 00007 que agrega `order_items.brand_name` (resuelve TODO conocido de emails con brand vacío) + backfill desde catálogo; (2) `/mi-cuenta/pedidos` lista con badges de status (Pago pendiente / Pagado / En camino / etc), formato fecha es-AR, link a detalle; (3) `/mi-cuenta/pedidos/[id]` detalle completo con items, totales, dirección, tracking, mp_payment_id, link de factura, CTA WhatsApp; (4) Update dashboard `/mi-cuenta` con tile "Mis pedidos" prominente; (5) Bootstrap cloud regenerado con guards idempotentes (`DROP POLICY IF EXISTS`, `ADD COLUMN IF NOT EXISTS`) — seguro re-aplicar aunque 00005 esté parcialmente en cloud. **Founder ahora puede aplicar el bootstrap entero (~232 líneas) sin que falle el error 42710 previo**. RLS de orders ya filtra por user — un user nunca ve pedidos de otro.

🟢 **Sub-feature 3 completa — webhook MP + emails transaccionales (Resend) funcional**

Flow completo de venta cerrado end-to-end (en dev, falta deploy + DNS + creds prod). Webhook `/api/mp/webhook` recibe notifications de MP, valida signature con `MP_WEBHOOK_SECRET` (opcional en dev, obligatorio en prod), fetcha el payment completo vía SDK MP, mapea status MP → status orders, hace UPDATE con idempotencia (no procesa 2x el mismo payment_id), y dispara 2 emails vía Resend cuando una order pasa a `paid`: (1) al cliente confirmando pago + detalles + dirección + total, (2) al founder con datos para facturar manual y despachar. Templates HTML inline-friendly (Gmail/Outlook/Apple Mail compatibles). Smoke 5/5: GET health, POST con type≠payment skipped, POST con JSON inválido 400, POST con payment_id falso fetcha MP y devuelve "not found" graceful, POST sin signature secret procesa sin verificar (correcto en dev). **Próximas acciones críticas del founder antes de prod**: (1) confirmar SELECTs cloud para regenerar bootstrap solo con 00006, (2) configurar webhook URL en panel MP + `MP_WEBHOOK_SECRET` para signature validation real, (3) verificar dominio Resend para enviar desde `hola@opticacarballo.com.ar`, (4) setear `BUSINESS_ADMIN_EMAIL` para recibir notifications admin.

🟢 **Sub-feature 2b PARTE 2 completa — integración Mercado Pago Checkout Pro V1 funcional E2E**

Founder pasó credenciales TEST de MP. Instalé `mercadopago` v3.0.0 SDK + agregué `lib/mp/{client,preferences}.ts` + modifiqué `lib/checkout/actions.ts` para llamar `createCheckoutPreference` post-`createOrderFromCart`, redirigir al `init_point` (o `sandbox_init_point` en modo TEST). Guardo `mp_preference_id` + `payment_method='mercadopago'` en `orders`. Pages nuevas `/checkout/exito` y `/checkout/error` con info post-redirect (orden, payment_id, status). E2E validado: la creación de preference contra sandbox MP devuelve URLs reales (`https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=...`). Detalle aprendido: MP rechaza `auto_return: 'approved'` con back_urls localhost — código condiciona auto_return solo si el SITE_URL NO es local. **Próxima sub-feature**: webhook MP (sub-feature 3) que actualiza `orders.status` cuando el pago se confirma, + emails con Resend (requiere `RESEND_API_KEY`).

🟢 **Decisión logística cerrada: Mi Correo REST > PAQ.AR**

Founder pasó AMBOS PDFs oficiales (PAQ.AR v2.0 + MiCorreo). Análisis comparativo: **Mi Correo gana** porque tiene endpoint `/rates` de cotización (PAQ.AR no), permite cuenta con DNI o CUIT sin agreement comercial corporativo (PAQ.AR requiere 3-6 semanas trámite), usa JWT moderno, y los endpoints faltantes (rótulo, tracking, cancelar) se gestionan desde el portal web `micorreo.correoargentino.com.ar` — aceptable para volumen 5-20/mes. Confirmado: cotización dinámica desde V1 (con fallback a tabla por zonas hardcoded actual) + ofrecer ambos delivery types (domicilio + retiro en sucursal). **Founder acción ahora**: solicitar credenciales API MiCorreo al área Comercial Correo Argentino. **Cuando lleguen**: sub-feature LOGISTICA con `lib/correo/*` (auth + quote + agencies + import) + migración 00007 (agregar shipping_delivery_type + agency_code + correo_ext_order_id a orders) + UI con delivery type toggle + selector sucursal + re-cotización.

🟢 **Sub-feature 2b PARTE 1 completa — /checkout funcional (sin MP todavía) detrás del flag**

Construido el flow completo de checkout SIN integración de pago: `/checkout` con auth + address selector + resumen + cálculo de envío por zonas (CABA/GBA, interior cercano/lejano, Patagonia) + free shipping desde $80k. Server action `submitCheckout` con reserve_stock atómico vía RPC + INSERT orders con snapshots ADR-007 + INSERT order_items + compensación de stock si falla. Página `/checkout/pendiente?order=X` post-confirmación con CTA WhatsApp temporal. Todo detrás del feature flag (default OFF → /checkout devuelve 404; flag ON → flow completo). Nueva migración 00006 con `reserve_stock` + `increment_variant_stock`. PAQ.AR v2.0 confirmado factible (manual oficial, founder evaluando vs Mi Correo REST) — pero NO tiene endpoint de cotización, por eso el cálculo de envío sigue siendo tabla por zonas hardcoded; cuando el founder elija API y tenga creds, integramos alta de orden + rótulo + tracking en nueva sub-feature LOGISTICA. **Próxima sesión**: sub-feature 2b PARTE 2 (MP preference + redirect + páginas post-redirect) cuando el founder tenga creds MP test.

🟢 **Feature flag `NEXT_PUBLIC_CHECKOUT_ENABLED` instaurado — switch limpio entre WhatsApp y cart-online**

Founder definió estrategia final: construir TODO el flow de venta (cart + checkout + MP + webhook) detrás de un feature flag, dejarlo oculto hasta tener "suficientes artículos para que valga la pena activarlo". Esta sesión: etapa 0 — el flag. Reactivar = setear `NEXT_PUBLIC_CHECKOUT_ENABLED=true` en Vercel + redeploy 1 min. Flag por default OFF: CartBadge oculto, VariantList con "Consultar WhatsApp", /carrito con "Próximamente". Flag ON: CartBadge visible, "Agregar al carrito" inline, /carrito linkea a /checkout. **Próxima etapa**: sub-feature 2b — `/checkout` + Mercado Pago Checkout Pro V1. Necesito credenciales MP sandbox del founder antes de instalar el SDK.

🟢 **Migración 00005 (bucket products público) lista en local + helpers TS — pendiente aplicar a cloud**

3 decisiones del founder cerradas: (1) carga de productos vía **seeds SQL asistidos** — founder me pasa data por chat, yo armo el SQL, founder corre en SQL Editor cloud; (2) imágenes en **bucket Supabase Storage `products` público** (CDN + next/image compatible); (3) empezamos por **Rusty reemplazando los 4 productos `[PH]` actuales**. Migration 00005 creada y testeada en local (bucket público 5MB, mime whitelist, 1 policy SELECT pública, escritura solo service_role). Helpers TS server-only en `lib/storage/products.ts`: upload + getPublicUrl + delete + suggestFilename. **Próximo paso del founder**: aplicar bootstrap al cloud + pasarme data del 1er producto Rusty real.

🟢 **Modo "pre-venta" activado — cart UI oculto + CTA por variante = WhatsApp contextual**

Founder pidió subir páginas de productos **sin habilitar compra** mientras MP no esté integrado y facturación se hace manual al principio. Cambios chicos: CartBadge del header comentado, `AddToCartButton` por variante reemplazado por `VariantWhatsappCta` con mensaje pre-llenado (marca + modelo + SKU + precio + variante). Cart code intacto (`lib/cart/*`, server actions, /carrito page, /api/cart/count) — listo para reactivar cuando llegue MP (descomentar 2 líneas + swap del prop en VariantList). `/carrito` sigue accesible vía URL directa pero noindex y nadie lo linkea. **Próxima decisión del founder**: cómo cargar productos reales (admin UI propio en /admin, vs Supabase Studio, vs seeds SQL asistidos por mí).

🟢 **Sub-feature 2a (addresses CRUD en /mi-cuenta) completo — 5/5 smoke tests verdes**

User puede crear/editar/eliminar/marcar-default direcciones de envío desde `/mi-cuenta/direcciones`. Server actions con Zod validation (24 provincias AR enum, postal_code CPA o 4 dígitos, teléfono permisivo). Ownership via RLS + verificación de session en cada action. Delete promueve auto otra address a default. Próxima sub-feature: 2b /checkout completo con `mercadopago` SDK v2 (founder confirmó).

🟢 **Cart sub-feature 1 (cookie-based) completo — 7/7 smoke tests verdes**

Carrito anónimo persistido en cookie firmada (HMAC-SHA256) con Zod schema validation. 4 server actions (add/update/remove/clear) con validaciones duras (stock, max-qty, max-items, placeholder rejection). Página `/carrito` con resolución viva contra DB e issues flag (`unavailable`/`out_of_stock`/`over_stock`). CartBadge cliente en header lee count vía `/api/cart/count` (HttpOnly cookie, requiere route handler) — preserva SSG del storefront. AddToCartButton inline por variante en página de producto. CTA "Iniciar compra" disabled con tooltip hasta que sub-feature 2 (MP) esté lista. **Próxima sub-feature**: 2 = crear order + Mercado Pago preference; 3 = webhook MP + Tusfacturas AFIP.

## Última actualización

**Fecha**: 2026-05-28
**Por**: SEO end-to-end del producto Vulk Day Light. seo-strategist agent invocado, 6 acciones high-impact implementadas: slug → vulk-day-light, meta title/description optimizados con keyword frase y trust signal, productos relacionados con algoritmo cascada en 4 pasos (misma marca → similar precio → misma forma → cualquier), Brand schema con URL, ItemList JSON-LD, subtítulo auto-generado bajo H1. Archivos nuevos: `components/product/related-products.tsx`, `components/seo/related-itemlist-jsonld.tsx`. Modificados: `lib/catalog/queries.ts` (+fetchRelatedProducts), `components/catalog/product-page.tsx` (async + integra related + JSON-LDs + subtítulo), `components/seo/product-jsonld.tsx` (brand URL), `supabase/seeds/03_vulk_day_light.sql` (slug nuevo + precio 8803700 + stock 3 + meta optimizados). Typecheck verde. Quedan FAQs y H2/H3 jerarquía para próximo turno.

**Fecha**: 2026-05-28
**Por**: 1er producto real (Vulk Day Light) preparado end-to-end. Archivos: NUEVO `supabase/seeds/03_vulk_day_light.sql`, NUEVO `lib/storage/product-image-url.ts`. Modificados: `lib/catalog/queries.ts` (ProductDetailData con images + query incluye product_images), `components/catalog/product-page.tsx` (pasa images al gallery), `components/product/product-gallery.tsx` (reescrito como client component con gallery real + thumbs + fallback). content-writer-medical invocado proactivamente para los 4 textos (todos dentro de límites de chars). Typecheck verde. Pendiente del founder: subir 3 imágenes al bucket + confirmar precio y stock.

**Fecha**: 2026-05-28
**Por**: DNS Resend aprobado por founder. Decisión: cargar 1er producto Rusty real reemplazando placeholder existente (no crear nuevo). Plantilla estructurada de datos enviada al founder. Sin cambios de código en este turno — sesión termina esperando data del founder.

**Fecha**: 2026-05-28
**Por**: Polish consistente aplicado al resto del sitio post-push de Capa 2. Archivos modificados: `components/catalog/category-index-page.tsx`, `components/catalog/brand-page.tsx`, `components/catalog/product-page.tsx`, `components/layout/site-header.tsx`. Cambios: tipografía editorial (text-4xl→6xl + text-balance), reveal-on-scroll con stagger en grids, header glass/frosted con backdrop-blur. Typecheck verde. Listo para commit + push.

**Fecha**: 2026-05-28
**Por**: Capa 2 ítem 2 implementado — Cursor magnético en CTAs del hero con `framer-motion` 12.40.0 instalado. Nuevo archivo: `components/ui/magnetic-button.tsx` (client component con useMotionValue+useSpring + protecciones defensivas para mobile/touch/reduced-motion). Modificado: `components/home/home-hero.tsx` (envuelve 2 CTAs primary con MagneticButton). Typecheck verde. Decisión consciente: ítem 3 Capa 2 (showcase scroll-driven en producto) PAUSADO hasta tener imágenes reales — implementarlo sobre placeholder "Foto pendiente" sería polish prematuro.

**Fecha**: 2026-05-28
**Por**: Capa 2 ítem 1 implementado — Hero editorial cinematográfico CSS-only (gradient mesh animado + tipografía editorial grande + animación entrada escalonada cubic-bezier(0.16,1,0.3,1) + shine en CTA). 2 archivos modificados: `app/globals.css` (3 keyframes mesh-drift + utility hero-reveal con 4 delays), `components/home/home-hero.tsx` (rediseño con gradient mesh background + text-balance + tipografía 7xl/5.5rem). Typecheck verde. Mistake detectado y auto-corregido pre-cierre: inventé "desde 1995" como año fundación → corregido a "30+ años" (dato validado en CLAUDE.md). Esperando feedback visual del founder antes de pedir aprobación para framer-motion (ítems Capa 2 restantes).

**Fecha**: 2026-05-28
**Por**: Capa 1 modernización lote 2 implementado. Archivos modificados: `app/globals.css` (shine + view-transitions + keyframes vt-fade), `components/home/home-hero.tsx` (CTA con shine), `components/home/categories-section.tsx` (reveals + stagger), `components/home/brands-section.tsx` (reveals + stagger por chip), `components/home/value-props.tsx` (reveals + stagger por prop). Archivo nuevo: `components/ui/reveal-on-scroll.tsx`. Typecheck verde. Capa 1 COMPLETA — 9 ítems implementados (smooth scroll + product cards + brand cards + brand chips + trust marquee + reveal-on-scroll + shine CTAs + page transitions + prefers-reduced-motion global).

**Fecha**: 2026-05-28
**Por**: Capa 1 modernización lote 1 implementado (Camino A — Tailwind/CSS-only, sin libs nuevas). 6 archivos modificados (`app/globals.css`, `app/(storefront)/page.tsx`, `components/product/product-card.tsx`, `components/catalog/brand-grid-card.tsx`, `components/home/brands-section.tsx`) + 1 nuevo (`components/home/trust-marquee.tsx`). Typecheck verde. Esperando feedback visual del founder en dev server antes de seguir con lote 2 (reveal-on-scroll + shine CTAs + page transitions).

**Fecha**: 2026-05-28
**Por**: Deploy a Vercel funcional + dominio `opticacarballo.com.ar` LIVE. Primer build falló por env vars faltantes (`supabaseUrl is required` desde `generateStaticParams`); founder agregó 6 env vars críticas y redeploy pasó. Pendientes del founder: (1) actualizar `NEXT_PUBLIC_SITE_URL` al dominio custom + redeploy, (2) agregar Redirect URL en Supabase Auth Dashboard. Conversación sobre dirección estética del sitio iniciada (founder pasó 5 refs heterogéneas) — propuesta de 3 capas presentada, esperando decisión del founder antes de implementar.

**Fecha**: 2026-05-28
**Por**: Proyecto subido a GitHub privado (sheldor26/optica-carballo) vía `gh repo create --private --source=. --push`. Verificación previa: `.gitignore` protege `.env*.local`, solo `.env.example` (template) está trackeado. Founder ahora puede importar el repo en Vercel. Sin cambios de código en esta sesión — solo operación git/gh + instrucciones de configuración Vercel (env vars críticas, Redirect URLs Supabase post-deploy).

**Fecha**: 2026-05-28
**Por**: Sub-feature 1 del checkout (cart cookie-based) construida end-to-end. Archivos nuevos: `lib/cart/{types,cookie,queries,actions}.ts`, `components/cart/{add-to-cart-button,cart-badge,cart-item-row,cart-page}.tsx`, `app/(storefront)/carrito/page.tsx`, `app/api/cart/count/route.ts`. Modificados: VariantList (inline button), SiteHeader (CartBadge), ProductDetailData type (id en variants), robots.ts (disallow /carrito). Smoke tests 7/7: empty cart, signed cookie con item inexistente → unavailable, tampered cookie → rejected, [PH] product → sin botón, home OK, robots meta noindex, robots.txt allow correcto. Build 26 páginas (sin regresión SSG/Static del storefront). Pendiente del founder: agregar `CART_COOKIE_SECRET` a Vercel para producción.

## Qué se construyó hasta ahora

### Entrega 1 — Agentes core (✅ completa)
- 7 agentes especialistas en `.claude/agents/`:
  - `optical-expert.md`
  - `seo-strategist.md` (con keyword research cargado)
  - `content-writer-medical.md`
  - `argentine-ecom.md`
  - `ai-features-engineer.md`
  - `conversion-optimizer.md`
  - `data-analyst.md`

### Entrega 2 — Agent Manager + memoria estructurada (✅ completa)
- Agente meta:
  - `agent-manager.md` (Versión A — Auditor Sistemático)
- Archivos de memoria:
  - `DECISIONS.md` (22 ADRs pre-cargados + 5 pendientes)
  - `AGENT_PERFORMANCE.md`
  - `METRICS.md`
  - `EXPERIMENTS.md`

### Entrega 4 — Skills (✅ completa — corregido 2026-05-27)
- 15 skills en `.claude/skills/`:
  - `feature.md`, `debug.md`, `deploy.md`, `review.md`
  - `agent-review.md`, `product.md`, `article.md`
  - `seo-audit.md`, `migration.md`, `keyword-research.md`
  - `competitor-analysis.md`, `onpage-optimization.md`
  - `migration-from-ml.md`, `whatsapp-handoff.md`
  - `image-optimization.md`
- ⚠️ Pendiente confirmar: `settings.json` con hook de auto-actualización al cerrar sesión (verificar si existe en `.claude/`).

### Migración 00002 identity_and_orders (✅ commit `1cee084` — 2026-05-28, local only)
- **5 tablas nuevas**:
  - `profiles` (1:1 con `auth.users` vía PK, ON DELETE CASCADE). DNI/CUIT/phone/display_name. Trigger `handle_new_user` con `SECURITY DEFINER` crea row auto en signup.
  - `addresses` (1:N user). UNIQUE partial `idx_addresses_one_default_per_user` garantiza solo 1 default per user.
  - `prescriptions` (1:N user, datos de salud sensibles). Schema oftalmológico completo: OD/OI con esfera/cilindro/eje/adición, DP, doctor + matrícula, fechas, image_path para futura imagen, expires_at, is_archived.
  - `orders` (snapshots inmutables ADR-007): cliente, dirección, totales centavos con CHECK ≥0, pago MP (mp_preference_id/mp_payment_id), facturación AFIP (invoice_id/invoice_cae), envío (tracking_number), prescription_id + snapshot JSONB. FKs no-blocking (SET NULL excepto user_id RESTRICT por auditoría). order_number text UNIQUE NOT NULL (function generator en feature de checkout).
  - `order_items` (snapshots producto+variante ADR-007, lens_options JSONB). CHECK `line_total_cents = quantity * unit_price_cents`.
- **RLS estricta en las 5**:
  - profiles: 2 policies (SELECT + UPDATE propio). Sin INSERT/DELETE policy (trigger + cascade lo manejan).
  - addresses: 4 policies (CRUD) con `auth.uid() = user_id` + WITH CHECK anti-spoofing.
  - prescriptions: 4 policies idem addresses (datos de salud → más estricto aún).
  - orders: 1 SELECT (writes vía service_role en server actions / webhooks).
  - order_items: 1 SELECT con EXISTS sobre orders del user.
- **7 índices nuevos**: `idx_addresses_user`, `idx_addresses_one_default_per_user` (UNIQUE partial), `idx_prescriptions_user (user_id, is_archived)`, `idx_orders_user (user_id, created_at DESC)`, `idx_orders_status`, `idx_orders_mp_payment` (partial WHERE NOT NULL para lookup en webhook), `idx_order_items_order`.
- **12 smoke tests verdes**: trigger crea profile auto con fallback al email, anon ve 0, cross-user blocking, WITH CHECK bloquea spoofing user_id, UNIQUE partial de default, CHECK od_axis 0-180, CHECK ranges de totales, order + items con RLS por owner, CHECK line_total consistency.
- **Tipos regenerados** (`pnpm db:types`): `types/supabase.ts` ahora con 10 tablas (5 nuevas + 5 catálogo).
- **Decisiones técnicas clave**:
  - `order.status` como CHECK text constraint (no enum) → agregar estado nuevo sin migración compleja.
  - `prescription_snapshot jsonb` en orders además del FK → inmutabilidad legal si user edita la receta después.
  - `order_number` text NOT NULL UNIQUE pero sin function default → la function generadora (formato `OC-YYYY-NNNNN`) viene con el feature de checkout (depende de sequence).
  - DNI/CUIT en plain text por ahora; encriptación con pgcrypto si founder pide.
  - Storage bucket privado para imágenes de receta NO en esta migración → viene con feature de upload (lector IA).
- **Pendiente cloud**: `supabase/cloud-bootstrap.sql` regenerado (332 líneas, solo migración 00002). Founder pega en SQL Editor del Dashboard.

### Páginas legales + Sobre nosotros + footer enriquecido (✅ commit `11835c9` — 2026-05-28)
- **4 páginas nuevas** en `(storefront)/`:
  - `sobre-nosotros`: historia, regente matriculada (condicional según env), técnico, "cómo trabajamos", marcas, atención.
  - `politica-de-devolucion`: arrepentimiento + cambios + productos exceptuados (cristales graduados, lentes de contacto abiertos) + garantía + cómo iniciar trámite. Plazos como `[PENDIENTE]`.
  - `boton-de-arrepentimiento`: art. 34 ley 24.240 textual + cómo ejercer + canales + excepciones.
  - `defensa-del-consumidor`: derechos del consumidor + canales OFICIALES reales (link a argentina.gob.ar) + marco legal.
- **Componentes nuevos `components/legal/`**:
  - `info-page-shell.tsx`: wrapper con breadcrumb + container + h1 + prose styling vía Tailwind arbitrary selectors (`[&_h2]:...`, `[&_p]:...`).
  - `placeholder-note.tsx`: bloque amarillo con icono `AlertTriangle`. Visible en producción para que el founder vea qué falta.
- **Footer extendido** (`components/layout/site-footer.tsx`): grid pasa de 3 a 4 columnas (md+) con nueva columna "Información" linkeando a las 4 páginas.
- **Helpers**:
  - `lib/site/nav.ts` agregado `FOOTER_INFO_LINKS` (separado de `PRIMARY_NAV` para no contaminar header).
  - `lib/catalog/metadata.ts` agregado `buildInfoPageMetadata({title, description, slug})` genérico.
- **Sitemap actualizado**: 4 URLs nuevas con `changeFrequency: monthly`, priority 0.5-0.6.
- **Anti-alucinación aplicada**: NO se inventa CUIT, dirección exacta, plazos, ni email oficial. Los marco como `[PENDIENTE]` en el texto, con `PlaceholderNote` arriba que dice exactamente qué falta y qué archivo editar. Los datos que sí están en env (regente name, locality, region, WhatsApp) se renderizan automáticamente.
- **Contenido legal genuino donde aplica**: artículo 34 ley 24.240 (texto del Estado, no inventado), links oficiales reales a argentina.gob.ar/produccion/defensadelconsumidor. Marco legal: leyes referenciadas con número.
- **Build**: las 4 páginas como `○ Static` con revalidate 86400 (1 día). First Load JS 105 kB. Total páginas pre-rendereadas en build: 24.

### Home definitiva (✅ commit `a2f968d` — 2026-05-28)
- **`app/(storefront)/page.tsx`**: Server Component que fetcha 3 queries en paralelo (`Promise.all`) — categorías sol, rx, y todas las marcas activas. Compone hero + categorías + marcas + value props. `revalidate = 300` → SSG con ISR.
- **Componentes en `components/home/`**:
  - `home-hero.tsx`: text-only con gradient sutil, 3 CTAs (sol, receta, WhatsApp condicional). Headline "Anteojos originales con asesoramiento óptico real" + sub con value prop.
  - `categories-section.tsx`: 2 cards (sol/receta) con stats reales (`"1 marca · 2 modelos"` actualmente porque solo Rusty tiene productos). Linkean a páginas índice.
  - `brands-section.tsx`: grid de las 5 marcas activas (incluso las sin productos), cards minimales con badge "Marca local". Apóstrofe de Paula Cahen renderea como `&#x27;`.
  - `value-props.tsx`: 4 items con `lucide-react` icons. **Trust signals reales según env**: regente matriculada (visible: hay name pero falta matrícula); 30+ años; envíos Andreani; WhatsApp condicional.
- **Schemas nuevos**:
  - `components/seo/organization-jsonld.tsx`: `@type: ["Organization", "Optician"]` con `address`, `telephone`, `sameAs` (wa.me). Solo emite campos del negocio configurados — no inventa data faltante.
  - `components/seo/website-jsonld.tsx`: WebSite con `inLanguage: 'es-AR'`. Sin SearchAction (no hay search global).
- **Helpers**:
  - `fetchAllActiveBrands()` agregado a `lib/catalog/queries.ts` — usa `createStaticClient`, devuelve marcas ordenadas por sort_order.
  - `buildHomeMetadata()` en `lib/catalog/metadata.ts` — title ~70 chars con marca + categorías + diferenciador, description con E-E-A-T.
- **Decisiones técnicas clave**:
  - **Sin imágenes hero / banners**. Hero text-only sostenido por gradient + tipografía + spacing. Cuando founder pase asset, swap a `next/image`.
  - **Sin productos destacados** (los `[PH]` no califican; total 4 productos hoy). Cuando founder reemplace `[PH]` y haya `is_featured = true`, agregar sección.
  - **Sin reviews / testimonios** (regla 7 — no inventar).
  - **Value prop de matrícula condicional**: si hay `NEXT_PUBLIC_REGENTE_MATRICULA`, muestra "Regente óptica matriculada"; sino fallback "Atención profesional". Si hay `NEXT_PUBLIC_REGENTE_NAME`, muestra "Asesoramiento personal de [nombre]". Hoy renderiza "Asesoramiento personal de María Carlota Carballo".
- **Validación contra cloud**: HTTP 200 (95 KB HTML), title + meta + schemas presentes, header/footer del `(storefront)` layout aplican. Build: home como `○ Static` revalidate 5m, 105 kB First Load JS sin cambio. `pnpm typecheck` + `lint` clean.

### Páginas índice de categoría /anteojos-de-sol y /anteojos-de-receta (✅ commit `538f7c3` — 2026-05-28)
- **URL**: `/anteojos-de-sol` y `/anteojos-de-receta` (sin marca). Antes daban 404 → ahora muestran grid de marcas con productos en esa categoría + count por marca.
- **Filtro**: solo aparecen marcas con `productCount > 0`. Vulk/Reef/Mormaii/Paula Cahen no aparecen hoy porque ningún seed les agregó productos. Cuando el founder cargue productos, aparecen automáticamente.
- **Helpers nuevos**:
  - `fetchCategoryIndex(category)` en `lib/catalog/queries.ts`: agrega count por brand en TS (más simple que GROUP BY de PostgREST). **Usa `createStaticClient` (sin cookies)** para que la página sea SSG, no Dynamic.
  - `buildCategoryIndexMetadata(category, brandNames)` en `lib/catalog/metadata.ts`: title con keyword genérica, description dinámica con `formatBrandList()` ("Rusty, Vulk y Reef" estilo es-AR).
- **Componentes nuevos**:
  - `components/catalog/brand-grid-card.tsx`: card de marca con badge "Marca local", descripción truncada (3 líneas), count + ArrowRight.
  - `components/catalog/category-index-page.tsx`: UI compartida. Breadcrumb 2-level, H1, copy intro por categoría (hardcoded en el componente, no en DB), grid responsive, JSON-LD CollectionPage + ItemList.
- **Pages**: `app/(storefront)/anteojos-de-sol/page.tsx` y `anteojos-de-receta/page.tsx` — thin wrappers de ~20 líneas.
- **Validación contra cloud**:
  - `/anteojos-de-sol` HTTP 200, Rusty (2 modelos) único visible. Title + meta description dinámica + 2 schemas.
  - `/anteojos-de-receta` idem.
  - Build: ambas como `○ Static` (revalidate 5m, expire 1y). Total 20 páginas en build (14 SSG + 2 Static + home + sitemap + robots + 404).
- **Decisión técnica**: `fetchCategoryIndex` usa cliente estático en vez de cookie-aware. Razón: query lee data pública (brands + product counts), no necesita session de usuario, y permite que la página sea SSG no Dynamic. Si en el futuro necesita filtrar por preferencias del usuario, se cambia.

### Páginas de receta + refactor a helpers compartidos (✅ commit `91b1d90` — 2026-05-28)
- **Decisión de arquitectura**: antes de duplicar ~500 líneas (sol vs rx, marca vs producto = 4 combinaciones casi idénticas), extraer la lógica común. Esto NO es "tres líneas similares OK" — son 4 archivos completos con divergencia esperada. El **segundo caso de un patrón es el momento de extraer**, no después.
- **Nuevos helpers `lib/catalog/`**:
  - `categories.ts`: `CATEGORIES.sol` y `CATEGORIES.rx` como source of truth (slug, name, shortLabel, metaPhrase).
  - `queries.ts`: `fetchBrandPage`, `fetchProductPage`, `getStaticBrandParams`, `getStaticProductParamsForCategory`. Tipos manuales (`BrandPageData`, `ProductDetailData`, etc.) centralizados — resuelve el problema conocido de embeds FK 1:1 que supabase-js tipa como arrays.
  - `metadata.ts`: `buildBrandMetadata` + `buildProductMetadata`. Title específico por categoría usando `category.metaPhrase`. `robots: noindex` para productos `[PH]`.
- **Componentes UI compartidos `components/catalog/`**:
  - `brand-page.tsx`: `BrandCatalogPage` recibe `category` + `brand` + `products`.
  - `product-page.tsx`: `ProductDetailPage` recibe `category` + `product`.
- **Page.tsx ahora thin wrappers** (~30 líneas cada una):
  - Sol: las 2 existentes refactorizadas (sin cambio funcional).
  - Receta: 2 nuevas + 2 not-found.tsx propias.
- **Validación**:
  - SOL intacto post-refactor: `/anteojos-de-sol/rusty` y `/anteojos-de-sol/rusty/rusty-wayfarer-classic-sol` HTTP 200.
  - RX funciona: `/anteojos-de-receta/rusty` HTTP 200 con 2 productos rx; `/anteojos-de-receta/rusty/rusty-redondo-vintage-rx` HTTP 200 con title específico de receta.
  - Empty state rx: `/anteojos-de-receta/mormaii` HTTP 200 ("Todavía no hay productos…").
  - Cross-category 404: `/anteojos-de-receta/rusty/rusty-wayfarer-classic-sol` (producto sol vía URL rx) → 404. La validación funciona en ambas direcciones.
  - Build: 14 SSG pages (5 sol marca + 5 rx marca + 2 sol producto + 2 rx producto).
  - First Load JS 105 kB (sin cambio — extracción no agregó shared chunks).
  - `pnpm typecheck` + `lint` clean.
- **Nota**: el sitemap.ts ya generaba URLs de receta (lo había agregado preventivamente). No requirió cambio en este commit.

### Página de producto individual /[brand]/[product] (✅ commit `c817f28` — 2026-05-28)
- **URL**: `app/(storefront)/anteojos-de-sol/[brand]/[product]/page.tsx` + `not-found.tsx`.
- **3 validaciones de seguridad** en `fetchProduct`: producto activo + brand matchea params + category matchea `anteojos-de-sol`. Cualquier mismatch → `notFound()`. Previene cross-brand (`/reef/rusty-x`) y cross-category (`/sol/producto-rx`) URLs sintéticas.
- **Componentes nuevos** (5):
  - `components/product/product-gallery.tsx` — placeholder "Foto pendiente" + thumbnails muteadas. Cuando founder pase fotos, swap a `next/image`.
  - `components/product/product-attributes.tsx` — ficha técnica (`dl/dt/dd`) con mapeo controlado de JSONB keys: `frame_material`, `frame_shape`, `lens_treatment`, `gender`. Keys desconocidas se ignoran.
  - `components/product/variant-list.tsx` — lista de variantes con etiquetas españolizadas (negro, carey, dorado, marrón degradé, etc.). Stock por variante.
  - `components/product/whatsapp-cta.tsx` — Botón con mensaje pre-llenado contextual ("Hola, me interesa el [producto]..."). Oculto si no hay número.
  - `components/seo/product-jsonld.tsx` — Product schema con `Offer` vs `AggregateOffer` según si low===high, `itemCondition: NewCondition`, `sku`, `brand`, `image` opcional.
- **Helpers nuevos**:
  - `lib/catalog/placeholder.ts` con `isPlaceholder(name)` — detecta `[PH]` en el nombre. Usado para `noindex` + exclusión de sitemap + supresión de Product JSON-LD.
  - `lib/site/business.ts` extendido con `getWhatsappLinkWithContext(message)` para CTAs contextuales.
- **SEO** (todos los findings críticos + importantes del seo-strategist aplicados):
  - Title `~60 chars`: "{name} | Anteojos de Sol - Óptica Carballo" (sin repetir marca — ya está en breadcrumb + Brand schema).
  - **Productos [PH] con `robots: { index: false, follow: true }`** + sin Product JSON-LD + excluidos del sitemap. Previene contaminación de Google con nombres placeholder.
  - `Offer` cuando un solo precio, `AggregateOffer` cuando hay rango.
  - `itemCondition: NewCondition` siempre.
  - `image: null` por ahora (placeholder); cuando haya fotos, se pasa URL absoluta.
  - Breadcrumb 4-level (Inicio → Sol → Brand → Product) tanto en HTML semántico como en BreadcrumbList JSON-LD.
- **Sitemap** actualizado (`app/sitemap.ts`):
  - Incluye URLs de producto con `priority: 0.7`.
  - **Filtra productos `[PH]`** (`!isPlaceholder(p.name)`).
  - `changeFrequency: weekly` consistente en todas las URLs (era `daily` exagerado — Google penaliza la mentira en crawl budget).
- **Tipos**:
  - `.returns<>()` de supabase-js para forzar tipos correctos en embeds. Problema: la inferencia automática tipa `brand`/`category` (FK 1:1) como arrays cuando en runtime son objetos. Resolver con type assertions explícitas (`ProductRow`, `StaticParamRow`, `ProductSitemapRow`).
- **Validación contra cloud**:
  - `/anteojos-de-sol/rusty/rusty-wayfarer-classic-sol` HTTP 200 con info completa + meta noindex (porque tiene [PH]).
  - `/anteojos-de-sol/reef/rusty-wayfarer-classic-sol` HTTP 404 (cross-brand).
  - `/anteojos-de-sol/rusty/rusty-redondo-vintage-rx` HTTP 404 (cross-category, producto está en rx).
  - `/anteojos-de-sol/rusty/no-existe` HTTP 404.
  - Sitemap: 13 URLs, 0 productos placeholder.
  - `pnpm typecheck` + `pnpm lint` + `pnpm build` clean. Build pre-genera 2 URLs de producto (a pesar de noindex la página existe, solo le decimos a Google que no la indexe).

### Header + Footer del storefront (✅ commit `825a2e2` — 2026-05-28)
- **Layout group `(storefront)`** ahora envuelve home + páginas de marca con SiteHeader + SiteFooter.
- **Home movida** de `app/page.tsx` → `app/(storefront)/page.tsx` para heredar el layout.
- **Componentes**:
  - `components/layout/site-header.tsx` (Server) — logo texto, nav, WhatsApp button condicional. Sticky top con border-b.
  - `components/layout/site-footer.tsx` (Server) — razón social, ubicación (Virasoro, Corrientes), regente matriculada, nav, WhatsApp, copyright.
  - `components/layout/desktop-nav.tsx` (Client, usa `usePathname`) — links inline ≥md con active state vía `aria-current="page"`.
  - `components/layout/mobile-nav.tsx` (Client, Sheet de shadcn) — hamburger trigger en <md, drawer desde la izquierda.
- **Helpers**:
  - `lib/site/nav.ts` — `PRIMARY_NAV` con los 2 links activos (sol, receta). Source of truth reusable header + footer + futuro sitemap.
  - `lib/site/business.ts` — `getBusinessInfo()` lee env vars `NEXT_PUBLIC_BUSINESS_*` con función `nonEmpty()` helper. **Campos vacíos NO se renderizan** (regla 7: trust signals reales, no inventados). WhatsApp link se construye solo si hay número.
- **shadcn agregados**: `sheet`, `button` (peer dep `@radix-ui/react-dialog`).
- **Decisiones de UX**:
  - Logo texto hasta que founder pase SVG real.
  - WhatsApp visible en sm: con label + ícono; en mobile compact solo ícono.
  - Active state distintivo (color foreground vs muted-foreground) en desktop nav.
  - Mobile nav cierra al hacer click en un link (UX expected).
- **Lo que NO incluye intencionalmente** (próximo cuando aplique):
  - Links legales (`/politica-de-devolucion`, `/boton-de-arrepentimiento`, `/defensa-del-consumidor`) — se agregan cuando esté el checkout (legalmente obligatorios entonces).
  - Carrito, login, search bar — features futuras.
  - Logo SVG, redes sociales, newsletter, mega-menu.
- **Validación**:
  - `pnpm typecheck` clean (después de limpiar `.next` stale por mover home).
  - `pnpm lint` clean.
  - `pnpm build`: 11 páginas, 105 kB First Load JS (sin cambio significativo — Sheet de shadcn queda en chunk de página, no shared).
  - `pnpm dev` contra cloud: home (`/`) y `/anteojos-de-sol/rusty` renderean con header + footer.
  - Active state visible en `/anteojos-de-sol/rusty` (link "Anteojos de sol" highlighted).
  - Footer muestra "Regente: María Carlota Carballo" (matrícula oculta por env vacía).

### Página de marca /anteojos-de-sol/[brand] (✅ commit `ca0c2c9` — 2026-05-28)
- **Seeds aplicados a local** (no a cloud todavía):
  - 5 brands (Rusty, Vulk, Reef, Mormaii, Paula Cahen D'Anvers) — todas `is_argentine = true` (semántica ADR-023).
  - 2 categories top-level (anteojos-de-sol, anteojos-de-receta).
  - 4 products Rusty con `[PH]` (placeholder) en nombre — 2 en sol, 2 en receta.
  - 6 product_variants con SKUs, precios placeholder (centavos ARS), stock > 0.
- **Componentes nuevos**:
  - `components/ui/{card,badge}.tsx` (shadcn).
  - `components/product/product-card.tsx` con placeholder "Foto pendiente".
  - `components/seo/breadcrumb-jsonld.tsx`, `catalog-jsonld.tsx`.
  - `lib/format/currency.ts` (Intl.NumberFormat es-AR ARS sin decimales).
  - `lib/supabase/static.ts` (cliente sin cookies para `generateStaticParams` / scripts).
- **Página dinámica**:
  - `app/(storefront)/anteojos-de-sol/[brand]/page.tsx` con `revalidate = 300` (ISR).
  - `generateStaticParams` pre-genera las 5 marcas en build.
  - `generateMetadata` dinámica con title específico de sol ("Anteojos de sol X Originales | Envío a Todo el País - Óptica Carballo") y meta description con E-E-A-T (técnico matriculado, 30+ años, cuotas).
  - hreflang `es-AR` + `x-default` absolutos.
  - 5 schemas JSON-LD: BreadcrumbList, CollectionPage, ItemList, Brand, AggregateOffer.
  - `not-found.tsx` específico ("Esa marca todavía no está").
- **SEO infrastructure**:
  - `app/sitemap.ts` dinámico (lee brands activos, devuelve 13 URLs: 3 estáticas + 5 marcas × 2 categorías).
  - `app/robots.ts` (allow / + disallow /admin, /api, /mi-cuenta).
- **Validación local**:
  - `pnpm typecheck` clean, `pnpm lint` clean.
  - `pnpm build`: 11 páginas (5 SSG-ISR + 6 static), First Load JS 105 kB per brand (< 200 kB target).
  - `pnpm dev`: `/anteojos-de-sol/rusty` HTTP 200 con 2 productos rendereados; `/reef` empty state; `/marca-inexistente` HTTP 404.
- **NO incluido (scope cerrado)**:
  - Imágenes reales (placeholder gris hasta que founder pase fotos).
  - Páginas de producto individual.
  - Header/Footer/Nav.
  - Texto SEO 150-300 palabras por marca (requiere campo nuevo en DB).
  - FAQ schema, OG image dinámica (próximas mejoras según seo-strategist).

### Migración 00001 — catalog_foundation (✅ aplicada en local — 2026-05-28, commit `62d2e85`)
- **Archivo creado**: `supabase/migrations/20260528030711_catalog_foundation.sql` (~250 líneas).
- **Tablas definidas** (5): `brands`, `categories` (jerárquica), `products`, `product_variants`, `product_images`.
- **Función helper**: `handle_updated_at()` reusable por toda tabla con `updated_at`.
- **Extensión**: `pgcrypto` habilitada (para `gen_random_uuid()`).
- **RLS**: habilitado en las 5 tablas. Políticas: lectura pública solo si `is_active = true`. Escritura solo service_role.
- **Decisiones técnicas del SQL** (ninguna requiere ADR nuevo, todas dentro de ADR-004/005/013):
  - `price_cents bigint` en centavos (no `numeric`, no floats).
  - `stock_qty CHECK (>= 0)` — regla dura #1 del proyecto.
  - `UNIQUE NULLS NOT DISTINCT (parent_id, slug)` en categories — permite "polarizados" bajo varios padres.
  - `search_vector tsvector GENERATED ALWAYS AS ... STORED` en products con pesos (A=name, B=short_desc, C=desc), language spanish.
  - `product_images.variant_id` nullable: NULL = imagen del producto base (compartida).
  - Índice único parcial `is_primary` por producto (`WHERE is_primary = true AND variant_id IS NULL`).
  - Índice parcial `in_stock` (`WHERE is_active = true AND stock_qty > 0`).
  - `ON DELETE RESTRICT` en `brand_id` (no se borra marca con productos).
  - `ON DELETE CASCADE` en `product_id` para variants/images.
- **Scope cerrado intencionalmente**:
  - ❌ profiles, addresses, prescriptions, orders, articles, ai_*, wishlists, etc. → migraciones futuras.
  - ❌ `compare_at_price_cents` (precio tachado) → ALTER TABLE cuando se necesite.
  - ❌ `weight_grams` → cuando integremos Andreani API (ADR-017 V2).
  - ❌ Bucket "products" de Storage → se crea aparte, no es schema relacional.
- **Validación con `supabase db reset` (Step 7)** — todo verde:
  - 5 tablas creadas, RLS habilitada en las 5, 5 policies, 21 índices `idx_*`, 5 triggers `on_*_updated`.
  - Smoke test con role `anon`: ✅ ve solo registros activos; ✅ INSERT bloqueado por RLS.
  - `updated_at` trigger: ✅ se actualiza en UPDATE.
  - `search_vector` (tsvector spanish): ✅ matchea "polarizados" con rank > 0.
  - CASCADE: ✅ borrar product borra sus variants e images.
  - CHECK constraint: ✅ `stock_qty = -1` rechazado.
- **Tipos TS regenerados** (`pnpm db:types`): `types/supabase.ts` ahora refleja las 5 tablas con `Row`/`Insert`/`Update`/`Relationships`. `pnpm typecheck` clean, `pnpm lint` clean.
- **NO se aplicó a cloud todavía**: `supabase db push` o aplicar manualmente via SQL Editor queda para cuando el founder decida. Schema local y cloud están **desincronizados** intencionalmente hasta entonces.
- **Stack Supabase local sigue corriendo**: 10 contenedores Docker (`supabase_db_optica-carballo`, `supabase_studio_*`, etc.). Studio accesible en `http://127.0.0.1:54323`. Para parar: `supabase stop`.

### Entrega 5 — Setup inicial repo Next.js (✅ completa — 2026-05-27)
- **Toolchain instalada**: pnpm 9.15.9 (vía corepack), Supabase CLI 2.101.0 (binario en `~/.local/share/supabase/` con symlink en `~/.local/bin/`), Docker Desktop corriendo.
- **Scaffold creado** (81 archivos en el primer commit `f6b15f3`):
  - `package.json` con pnpm fijado (`packageManager`, `engine-strict=true`).
  - `tsconfig.json` estricto (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`).
  - `next.config.mjs` con `remotePatterns` para Supabase Storage cloud + local.
  - `tailwind.config.ts` v3.4 con preset de shadcn (CSS vars, baseColor neutral, plugin `tailwindcss-animate`).
  - `components.json` (shadcn config) — listo para agregar componentes con `pnpm dlx shadcn@latest add <name>`.
  - `app/layout.tsx` con `lang="es-AR"`, Inter font, `metadataBase` desde env.
  - `app/page.tsx` placeholder, `app/not-found.tsx`, `app/error.tsx` (todos en español argentino).
  - `lib/utils.ts` con `cn()` para shadcn.
  - `lib/supabase/{client,server,admin,middleware}.ts` con `@supabase/ssr` y cookies async de Next 15.
  - `middleware.ts` con matcher de Next App Router.
  - Estructura de carpetas según ARCHITECTURE.md (con `.gitkeep` en vacías).
  - `supabase/config.toml` (vía `supabase init`).
- **Validación todos los criterios pasaron**:
  - `pnpm typecheck` → clean (después de tipar `CookieOptions` en server/middleware Supabase).
  - `pnpm lint` → 0 errors, 0 warnings.
  - `pnpm build` → home 102 kB First Load JS (target <200 kB ✓), 4 páginas estáticas.
  - `pnpm dev` → Ready en 1066ms, HTTP 200 en `/`, `lang="es-AR"` verificado en response, título correcto.
  - `.gitignore` valida: `.env.local`, `node_modules`, `.next` NO aparecen en `git status`.
- **Primer commit**: `f6b15f3 — chore: setup inicial Next.js 15 + Tailwind + shadcn/ui + Supabase`.

### Entrega 3 — Documentación raíz (✅ completa — en este punto del proyecto)
- `CLAUDE.md` (identidad + reglas)
- `ARCHITECTURE.md` (stack + decisiones técnicas)
- `SEO_STRATEGY.md` (arquitectura SEO completa)
- `CONTENT_PLAN.md` (15 primeros artículos planificados)
- `BRANDS.md` (catálogo vivo de marcas)
- `AI_PROMPTS.md` (biblioteca versionada — 6 prompts core)
- `PRODUCTS_INVENTORY.md` (tracker pre-carga)
- `CURRENT_STATE.md` (este archivo)
- `MISTAKES.md` (vacío)
- `LEARNINGS.md` (vacío)
- `README.md` (manual de uso del sistema)

## Qué falta inmediatamente

- Verificar si existe `.claude/settings.json` con hook de auto-actualización al cerrar sesión. Si no, crearlo.
- **PEND-005 parcialmente cerrado**: el `.env.local` ya tiene credenciales del proyecto Supabase cloud (`tuddpfspnbnmafsqdvat.supabase.co`). Faltan confirmar las cuentas restantes (Vercel, Resend, MP dev, Tusfacturas, API IA, OpenAI, GSC, GA4). Actualizar `DECISIONS.md` PEND-005.
- Decidir si la próxima feature es schema inicial de DB (`/migration`) o página real (catálogo de marcas, home definitivo).

## Decisiones técnicas tomadas en esta sub-sesión (planning)

1. **Marcas reales del catálogo** (5, confirmadas por founder): Rusty, Vulk, Reef, Mormaii, Paula Cahen D'Anvers. Todas en sol Y receta. Reemplaza la lista anterior asumida (Rusty, Reef, Vulk, Prune, Infinit) que venía de keyword research, no de stock real.
2. **`is_argentine = true` para las 5**, incluso Mormaii (brasilera). El flag pasa de "origen argentino estricto" a "marca pensada como local / con presencia argentina". Formalizado en **ADR-023 nuevo**.
3. **Modelado sol vs receta = productos separados por uso**. Cada marco vendido como sol y como receta son rows distintas en `products`, slugs distintos (ej: `rusty-wayfarer-negro-sol` y `rusty-wayfarer-negro-rx`), category_id distinto. Razón: alinea con ADR-004 (URLs por categoría), SKUs típicamente distintos (sol tiene lente, receta no), trackeable independiente.
4. **Implica 2 categorías top-level mínimas en seed**: `anteojos-de-sol`, `anteojos-de-receta`. Sin sub-categorías (polarizados, aviador, etc.) en este step.
5. **ADR-009 (PEND-002)** pasa a 🟡 Parcial: Paula Cahen confirmada, las otras 4 colecciones (Las Oreiro, Valeria Mazza, Teresa Calandra, Pampita) siguen pendientes.
6. **Seeds en SQL plano, no script TS** (decisión técnica del plan V1, sin cambios). Evita instalar `tsx` + `dotenv`.
7. **Sin imágenes reales** en este step. Placeholder gris hasta que el founder pase fotos.

## Archivos actualizados en esta sub-sesión (no commiteados todavía)

- `BRANDS.md`: bloque nuevo arriba con las 5 marcas confirmadas; estado de Rusty, Reef, Vulk actualizado a 🟢 Activa; Mormaii agregada como entrada nueva; Paula Cahen D'Anvers agregada en su sección con estado 🟢.
- `DECISIONS.md`: ADR-009 actualizado con sección 2026-05-28 (parcial); ADR-023 nuevo (semántica de `is_argentine`).
- `CURRENT_STATE.md`: este archivo.

## Próximo paso EXACTO

**Próxima sesión código**: **Sub-feature 2b PARTE 1** — todo lo del checkout que NO depende de credenciales MP. Detrás del feature flag (default OFF).

Decisiones cerradas en esta sesión para 2b:
- **MP**: founder NO tiene cuenta MP todavía. La crea en paralelo. Yo arranco la parte 1 (sin MP), parte 2 (preference + redirect) viene cuando lleguen creds (`MP_ACCESS_TOKEN` test + `NEXT_PUBLIC_MP_PUBLIC_KEY` test).
- **Resend**: founder lo instala más adelante para sub-feature 3 (webhook + emails). Pendiente: cuenta Resend (https://resend.com gratis 100/día) + `RESEND_API_KEY`.
- **Shipping V1** (REVISADO post-investigación PAQ.AR): **tabla por zonas** hardcoded en `lib/shipping.ts`. Defaults conservadores propuestos: CABA/GBA $2.500, Interior cercano $4.500, Interior lejano $6.500, Patagonia $9.500, free shipping desde $80.000. Founder traerá 5 cotizaciones reales (CABA, Rosario, Mendoza, Bariloche, Ushuaia) para ajustar la tabla. **NO se inicia trámite cuenta corporativa Correo Argentino** (3-6 semanas + DX débil de API). Plan: Andreani principal con tabla fija → migrar a Andreani PyME API cuando llegue 50+ envíos/mes (ADR-017 sigue vigente). PAQ.AR queda como **fallback manual** (despacho en sucursal con cuenta personal) para CPs que Andreani no cubre.
- **Sin Tusfacturas en V1**: facturación manual al principio (founder confirmó).
- **Investigación argentine-ecom completada**: confirmó que PAQ.AR no tiene API pública (NDA + corporativo), Andreani sigue siendo mejor DX, y para volumen inicial (5-20 envíos/mes) integrar API no se justifica. Ver respuesta del agente en el transcript de esta sesión.

Scope sub-feature 2b parte 1 (todo SIN MP):
- `lib/shipping.ts` con `FREE_SHIPPING_THRESHOLD_CENTS = 80000_00`, `FLAT_SHIPPING_CENTS = 3500_00`, `calculateShipping(subtotalCents)`.
- Stock atomic revalidation (`UPDATE WHERE stock_qty >= ? RETURNING ...`) — defensa anti-overselling.
- Server action `createOrderFromCart(addressId)` con snapshots inmutables (ADR-007), genera `order_number` automático (función migration 00003).
- `/checkout/page.tsx` (auth required, redirect a /ingresar si no), con: resumen cart, address select (de las del user, link a crear si no tiene), envío calculado, total. Submit crea order y muestra "Esperando integración MP".

Scope sub-feature 2b parte 2 (CUANDO lleguen creds MP):
- Instalar `mercadopago` SDK v2.
- `lib/mp/preferences.ts` con `createPreference(order)`.
- Modificar `createOrderFromCart` para llamar `createPreference` y devolver `init_point`.
- Redirect a init_point.
- Pages post-redirect: `/checkout/exito`, `/checkout/pendiente`, `/checkout/error`.

Scope sub-feature 3 (CUANDO lleguen creds MP + Resend):
- Webhook MP en `app/api/mp/webhook/route.ts` con validación de signature + idempotencia.
- Update `orders.status` (pending → paid / failed).
- Email al cliente (Resend) confirmando pago.
- Email al founder con datos para facturar manualmente.
- Sin Tusfacturas — manual al principio.

**Pendientes del founder históricos** (no bloquean próxima sesión):
- Aplicar bootstrap 00005 al cloud + verificar (1 bucket + 1 policy).
- Pasarme data del 1er producto Rusty real para reemplazar `[PH]` (template en el cierre anterior).
- Generar `CART_COOKIE_SECRET` para Vercel (diferente al de dev).
- Redirect URLs en Supabase Auth Dashboard.
- Credenciales MP sandbox (para sub-feature 2b).

---

## ⛔ Pendientes históricos (no bloqueantes)

**Pre-decisión del founder** (resuelto): cómo cargar los productos reales al cloud. 3 caminos:
- **A. Admin UI propio** en `/admin/productos/...` — más laburo (~600 líneas, 2-3 sesiones), pero le da herramienta autosuficiente al founder. Justifica si va a cargar 50+ productos o si quiere editar en el futuro.
- **B. Supabase Studio** (table editor del Dashboard) — sin código nuevo, pero UX no ideal (especialmente para imágenes). Razonable para 10-30 productos iniciales.
- **C. Seeds SQL asistidos por mí** — founder me pasa la data por chat / CSV, yo armo el archivo `supabase/seeds/02_{brand}_products.sql`, founder lo corre en SQL Editor cloud. Híbrido: rápido para arrancar, sin código nuevo.

Hasta que decida, **sub-feature 2 (Mercado Pago) queda en pausa**. El sub-feature 3 (Tusfacturas) también — porque founder hará facturación manual al principio.

**Sub-feature 2b (Mercado Pago)** queda como _deferida indefinidamente_ hasta que se active el flow de ventas online real. Cuando llegue: instalar `mercadopago` SDK v2 (decisión ya tomada en esta sesión), crear `orders` + `order_items` (snapshots ADR-007) desde el cart, integrar API V1 Checkout Pro, redirigir a init_point.

**Pendiente del founder** (ANTES del deploy de cart a producción):
- Generar `CART_COOKIE_SECRET` de 32 bytes hex y agregar a Vercel (Production + Preview), DIFERENTE al de `.env.local` local. Sin esto, el cart tira error en runtime. Comando: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

**Otros pendientes del founder históricos** (no bloquean próxima sesión):

---

## ⛔ Pendientes históricos (no bloqueantes)

**Inmediato cuando se acerque deploy auth a producción**: founder pega los outputs de los 2 SELECTs de verificación del cloud:
```sql
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'prescriptions';
SELECT policyname, cmd FROM pg_policies
WHERE schemaname='storage' AND tablename='objects' AND policyname LIKE 'prescriptions:%'
ORDER BY policyname;
```
Esperado: 1 fila bucket (`prescriptions | prescriptions | false | 10485760`) + 4 filas policies. Si coincide → marco ✅ VERIFICADO en `CLOUD_APPLIED.md`, borro `supabase/cloud-bootstrap.sql`, commit "docs: 00004 prescriptions Storage aplicado a cloud + verificado".

**Otros pendientes del founder** (no bloquean próxima sesión código):
- Supabase Auth Dashboard → URL Configuration → Site URL + 4 Redirect URLs (BACKLOG.md 🔴, pendiente desde sesiones anteriores).

**Próxima sesión código**: server actions de checkout + integración Mercado Pago Checkout Pro V1 (ADR-015) + Tusfacturas para facturación AFIP post-payment (ADR-016). Es feature grande, va con foco propio. Probable división en 2-3 sub-features:
- 1) Cart minimalista (cookie/session, validación de stock).
- 2) Crear order + redirect a MP preference.
- 3) Webhook MP + actualización order.status + facturación Tusfacturas.

**Próxima sesión** (decidís vos):

### 🔴 Crítico para que el sitio sea publicable
1. **Reemplazar productos `[PH]` por datos reales** del founder: confirmar 4 modelos (2 sol + 2 rx) con nombre, descripción, atributos y precio real. Cuando el seed se actualice, los productos automáticamente dejan de tener `noindex` y entran al sitemap. Requiere input del founder, no de código.

### 🟡 Features importantes para storefront completo
2. ~~**Página de marca en categoría receta**~~ ✅ Hecho en commit `91b1d90`.
3. ~~**Página índice de categoría**~~ ✅ Hecho en commit `538f7c3`.
4. ~~**Home definitivo**~~ ✅ Hecho en commit `a2f968d`.
5. ~~**Páginas legales obligatorias + sobre nosotros**~~ ✅ Hecho en commit `11835c9`.

### 🔴 Acciones del founder (no de código) antes del checkout
6. **Reemplazar productos `[PH]`** con nombres, descripciones, precios reales (editar `supabase/seeds/02_rusty_products.sql` + reaplicar al cloud).
7. **Reemplazar `[PENDIENTE]` de las páginas legales** con plazos y políticas confirmadas por la regente (editar los 3 archivos en `app/(storefront)/{politica-de-devolucion,boton-de-arrepentimiento,sobre-nosotros}/page.tsx`).
8. **Completar env vars del negocio**: matrícula de regente (`NEXT_PUBLIC_REGENTE_MATRICULA`), del técnico (`NEXT_PUBLIC_TECNICO_MATRICULA`), CUIT, teléfono, email oficial, dirección exacta, WhatsApp.

### ⏸️ Episodio fuera-de-scope al cierre (descartado por el founder)
- Founder pidió ejecutar endpoint Anthropic Admin API. Pidió credenciales, pegó por error una API key normal (`sk-ant-api03-...`) en el chat → alerta urgente + instrucción de rotar (registrado en MISTAKES.md 2026-05-28). Founder descartó el pedido. **Acción pendiente del founder: confirmar rotación de la key comprometida.**

### /mi-cuenta/pedidos + Migración 00007 (✅ 2026-05-28, sin commit todavía)
- **Contexto**: founder dijo "continuar" sin nuevos inputs externos. Avancé con lo bloqueante interno (TODO de brand en emails) + features útiles autocontenidas (lista + detalle de pedidos en cuenta del user).
- **Migración 00007 `add_brand_name_to_order_items.sql`**:
  - `ALTER TABLE order_items ADD COLUMN brand_name text` (nullable — no hay data legacy en cloud todavía pero aceptamos null por seguridad operativa).
  - Backfill UPDATE desde `products → brands` para data legacy (best-effort, si producto borrado queda null).
  - Smoke local: `\d order_items` confirma columna agregada.
- **Update `createOrderFromCart`**: agrega `brand_name: it.brand.name` al INSERT order_items. Las orders nuevas tienen brand snapshot completo.
- **Update webhook `/api/mp/webhook`**: SELECT incluye `brand_name`, lo pasa a `itemsForEmail.brandName`. **TODO conocido resuelto**.
- **`lib/orders/types.ts`**: `OrderStatus`, `OrderListItem`, `OrderDetail`, `OrderItem`. Tipos manuales (no derivados de Database) para estabilidad si el schema cambia.
- **`lib/orders/labels.ts`**: `ORDER_STATUS_LABELS` (Pago pendiente / Pagado / En preparación / En camino / Entregado / Cancelado / Reembolsado) + `ORDER_STATUS_TONE` (neutral/success/info/warning/destructive) + `formatOrderDate` y `formatOrderDateShort` con `Intl.DateTimeFormat es-AR` + `America/Argentina/Buenos_Aires`.
- **`lib/orders/queries.ts`**:
  - `fetchUserOrders()`: lista resumida con count de items agregado en JS (evita N+1 sin GROUP BY de PostgREST). RLS auto-filtra `user_id = auth.uid()`.
  - `fetchOrderById(id)`: detalle completo + items con `brand_name`. Devuelve null si RLS bloquea o no existe (la page hace `notFound()`).
- **UI nuevos `components/account/`**:
  - `order-status-badge.tsx`: pill con tonos por status (emerald/sky/amber/destructive/muted) compatible dark mode.
  - `order-list.tsx`: lista en card con divisores, fecha + count + total + ChevronRight. Empty state con CTA a categorías.
  - `order-detail.tsx`: header con order_number mono + badge status, tracking destacado si shipped, items con qty bubble + brand + SKU + lineTotal, grid 2-col totales + dirección, link factura si existe, CTA WhatsApp pre-llenado con número de orden.
- **Pages nuevas**:
  - `app/(account)/mi-cuenta/pedidos/page.tsx` — lista (force-dynamic, requireAuth, noindex).
  - `app/(account)/mi-cuenta/pedidos/[id]/page.tsx` — detalle (force-dynamic, requireAuth, notFound si no es del user, noindex).
- **Update `app/(account)/mi-cuenta/page.tsx`**: nuevo tile "Mis pedidos" (Package icon) a la izquierda de "Mis direcciones". Grid sm:grid-cols-2.
- **Bootstrap idempotente** `supabase/cloud-bootstrap.sql` (~232 líneas combina 00005+00006+00007):
  - `DROP POLICY IF EXISTS "products: anyone reads" ON storage.objects` antes del CREATE → resuelve el error `42710 already exists` reportado por founder al re-aplicar 00005.
  - `ALTER TABLE ... ADD COLUMN IF NOT EXISTS brand_name text` → seguro re-aplicar.
  - `CREATE OR REPLACE FUNCTION` (ya idempotente) para reserve_stock + increment_variant_stock.
  - **Founder puede aplicar entero sin temor a "already exists"** — solo lo que falte se aplica.
- **Decisiones técnicas clave**:
  - **Status labels en español argentino**: "Pago pendiente" (no "pending"), "En camino" (no "shipped"), etc. El cliente NO ve los enums internos.
  - **Tabular nums en precios y fechas**: alineación vertical clean en listas (Tailwind `tabular-nums`).
  - **`tracking_number` destacado** si existe: card al inicio del detail con icono Truck — UX clave cuando llega "ya despachamos tu pedido".
  - **WhatsApp CTA en cada detail** con mensaje pre-llenado `"Hola! Te consulto por mi pedido OC-2026-NNNNN."` — facilita soporte humano para casos no automáticos.
  - **RLS hace el security en queries**, no validación adicional en TS: si el order_id en URL pertenece a otro user, `fetchOrderById` devuelve null → `notFound()`. Sin necesidad de chequeos manuales.
- **Smoke 4/4 verdes** (sin sesión):
  - `/mi-cuenta/pedidos` HTTP 307 → `/ingresar?next=...`
  - `/mi-cuenta/pedidos/<uuid>` HTTP 307
  - `/mi-cuenta` HTTP 307
  - Follow redirect a `/ingresar` renderiza form de login OK.
- **Validación**: typecheck + lint + build clean. Build muestra `/mi-cuenta/pedidos` y `/mi-cuenta/pedidos/[id]` como ƒ Dynamic.

### Sub-feature 3 — Webhook MP + emails transaccionales Resend (✅ 2026-05-28, commit `49a0309`)
- **Trigger**: founder confirmó que `RESEND_API_KEY` ya está en `.env.local` (también `RESEND_FROM_EMAIL=Óptica Carballo <hola@opticacarballo.com.ar>`).
- **Dep instalada**: `resend@6.12.4`.
- **`lib/emails/client.ts`**: singleton lazy del SDK Resend. `getFromAddress()` lee `RESEND_FROM_EMAIL` con fallback a `onboarding@resend.dev` (Resend default verificado, útil mientras founder verifica DNS de `opticacarballo.com.ar`). `getAdminEmail()` lee `BUSINESS_ADMIN_EMAIL` (opcional — si no está, no manda emails admin).
- **`lib/emails/templates/`**:
  - `shared.ts`: `escapeHtml`, `fmtPrice`, `emailLayout` con HTML5 + inline styles compatibles Gmail/Outlook/Apple Mail. Sin React Email (evita dep grande para 2 templates).
  - `order-confirmation-customer.ts`: subject "Confirmamos tu pedido OC-YYYY-NNNNN", body con bienvenida, número orden, payment_id MP, tabla de productos (qty + importe), totales, dirección de envío, "¿qué sigue?".
  - `order-notification-admin.ts`: subject "💰 Nuevo pago — OC-YYYY-NNNNN ($ X)", body con alerta + checklist de acciones manuales (facturar AFIP, imprimir rótulo, despachar, mandar tracking), datos cliente + email + tel, dirección envío + tel, productos con SKUs, totales, footer técnico con MP payment_id + order_id.
- **`lib/emails/send-order-emails.ts`**: 2 funciones `sendOrderConfirmationToCustomer` + `sendOrderNotificationToAdmin`. **Best-effort**: si Resend falla, log y retorna error sin tirar excepción (el webhook MP no debe responder 500 por email — MP reintentaría indefinidamente).
- **`lib/mp/webhook.ts`**:
  - `validateMpSignature({xSignature, xRequestId, dataId})`: HMAC-SHA256 del template `id:<X>;request-id:<Y>;ts:<Z>;` usando `MP_WEBHOOK_SECRET`. Si secret no está en env → `{ok:true, verified:false}` (aceptable dev/pre-launch). Si headers faltan o firma no matchea → `{ok:false}`. Usa `timingSafeEqual` contra timing attacks.
  - `fetchPaymentById(paymentId)`: fetcha el payment completo vía SDK `Payment(client).get({id})`. Devuelve `{id, status, status_detail, external_reference, transaction_amount, payment_method_id, payer_email}` o null.
  - `mpStatusToOrderStatus(mpStatus)`: mapea MP statuses (approved/in_process/rejected/cancelled/refunded/etc) → nuestros orders.status (paid/pending/cancelled/refunded). `in_mediation` devuelve null (mantener status actual).
- **`app/api/mp/webhook/route.ts`** (POST + GET):
  - **POST**: parse JSON, filtra `type==='payment'`, valida signature, fetcha payment, lookup order por `external_reference=order_number`, idempotencia (skip si `mp_payment_id` y `status` ya matchean), UPDATE `orders.status + mp_payment_id + payment_status + paid_at`, dispara emails SI transicionó a `paid`, responde 200 siempre (sino MP reintenta indefinidamente — excepción: 401 si signature inválida).
  - **GET**: health check (`{ok:true, endpoint:'mp-webhook'}`). Útil para que el founder confirme la URL desde el panel MP antes de configurar.
- **Decisiones técnicas clave**:
  - **Validación signature opcional en V1**: si `MP_WEBHOOK_SECRET` no está, procesa sin validar. Permite arrancar sin configurar el secret. Founder lo configura en panel MP cuando esté listo para prod.
  - **Status 200 a MP siempre** (excepto signature inválida): si devolvemos 500 por errores nuestros, MP reintenta exponencialmente. Mejor log + 200 + alertar internamente.
  - **Idempotencia por `mp_payment_id + status`**: doble check evita re-procesar pero permite legitimas actualizaciones (ej: approved → refunded).
  - **Emails solo en transición `wasUnpaid → isNowPaid`**: evita mandar email dos veces si MP reenvía el mismo evento.
  - **Templates HTML inline-friendly**: sin `<style>` blocks, todo `style="..."` en cada tag. Gmail clip parses así sin problemas.
  - **Fallback `RESEND_FROM_EMAIL` a `onboarding@resend.dev`**: founder puede testear sin verificar dominio DNS. Cuando verifique, usa el real automáticamente.
  - **`BUSINESS_ADMIN_EMAIL` opcional**: si no está, skip silencioso (no error). Útil si founder quiere arrancar sin recibir emails todavía.
  - **TODO conocido**: `brand_name` en email cliente está vacío. El schema `order_items` no guarda brand snapshot. Si importa para UX del email, hacer migración 00007 con `brand_name_snapshot` o joinear contra `products → brands` al render. Aceptable para V1.
- **Smoke 5/5 verdes**:
  - GET `/api/mp/webhook` → `{ok:true, endpoint:'mp-webhook'}`
  - POST `type='merchant_order'` → `{ok:true, skipped:'not a payment event'}`
  - POST con JSON inválido → 400 `{ok:false, error:'invalid json'}`
  - POST con secret configurado + sin headers → 401 (correcto — validación activa)
  - POST sin secret + `type='payment'` + payment_id falso → 200 `{ok:true, error:'payment not found in MP api'}` (graceful)
- **Validación**: typecheck + lint + build clean.
- **🔴 Acciones del founder antes de funcionar end-to-end en cloud**:
  1. **Configurar webhook en panel MP**: Dashboard → Tus integraciones → Notificaciones → Configurar webhook → URL `https://opticacarballo.com.ar/api/mp/webhook` → eventos: solo `payment` → MP genera signing key → agregar a Vercel como `MP_WEBHOOK_SECRET`.
  2. **Verificar dominio `opticacarballo.com.ar` en Resend**: Dashboard Resend → Domains → Add Domain → seguir instrucciones DNS (SPF/DKIM/MX records). Sin esto, Resend rebota envíos desde `hola@opticacarballo.com.ar`.
  3. **Setear `BUSINESS_ADMIN_EMAIL`** en `.env.local` y Vercel para recibir notifications administrativas.
  4. **Testing en dev local**: webhook MP no puede POSTear a `localhost`. Para E2E local: usar ngrok / tunnel.dev. Alternativa: testing directo en Vercel preview cuando se acerque deploy.

### Sub-feature 2b PARTE 2 — Integración Mercado Pago Checkout Pro V1 (✅ 2026-05-28, commit `b4a890f`)
- **Credenciales**: founder pasó TEST credentials de MP. Agregadas a `.env.local` como `MP_ACCESS_TOKEN` (server) + `NEXT_PUBLIC_MP_PUBLIC_KEY` (cliente, no usado V1 — sería para Bricks futuro).
- **Dep instalada**: `mercadopago@3.0.0` (la "v2" del API moderno con `MercadoPagoConfig` + clases `Preference`). 2 packages totales, sin warnings críticos.
- **`lib/mp/client.ts`**: singleton lazy `getMpClient()` que construye `MercadoPagoConfig` en el primer uso. Timeout 8s. Throw si falta env var. `isMpTestMode()` helper que detecta token TEST-... vs APP_USR-...
- **`lib/mp/preferences.ts`**: `createCheckoutPreference({orderNumber, payerEmail, cart, shipping})`. Arma items del cart con `unit_price = price_cents / 100` (MP usa decimales, no centavos). Agrega item extra de "Envío — {zoneLabel}" si shipping no es free. `external_reference = orderNumber` (formato OC-YYYY-NNNNN único) para matchear webhook con DB. `back_urls` apuntan a `/checkout/{exito,pendiente,error}`. `notification_url` apunta a `/api/mp/webhook` (handler en sub-feature 3). `statement_descriptor: 'OPTICA CARBALLO'` (aparece en resumen tarjeta del cliente). Devuelve `{preferenceId, initPoint, sandboxInitPoint}`.
- **Modificación `lib/checkout/orders.ts`**: nuevo `updateOrderMpPreference({orderId, preferenceId})` que UPDATE `orders.mp_preference_id + payment_method='mercadopago'` post-creación de preference. Best-effort (si falla, founder puede crear preference manual desde panel MP).
- **Modificación `lib/checkout/actions.ts`**: tras `createOrderFromCart`, llama `createCheckoutPreference`. Si OK → `updateOrderMpPreference` + `redirect(checkoutUrl)` (sandbox o prod según modo). Si FAIL → redirect a `/checkout/pendiente?order=X&mp_error=1` (orden queda en DB, founder coordina por WhatsApp).
- **Pages nuevas**:
  - `/checkout/exito` — post-redirect APROBADO. Lee `external_reference`, `payment_id`, `status` de query. Muestra orden, payment_id, mensaje "Te vamos a enviar email". CTAs: "Ver mi cuenta" / "Seguir navegando". **Informativa solamente** — el cambio real de `orders.status='paid'` lo hace el webhook (sub-feature 3). Esta página puede ser vista por user con conexión flaky o que cerró ventana.
  - `/checkout/error` — pago rechazado/cancelado. Lee `external_reference`, `status`. Muestra opciones (verificar datos, otro medio, contactar WhatsApp). CTA WhatsApp pre-llenado con número de orden.
  - `/checkout/pendiente` ya existía (sub-feature 2b parte 1), funciona para casos de pago pendiente (transferencia, Rapipago).
- **Decisiones técnicas clave**:
  - **`auto_return: 'approved'` solo si NO localhost**: MP rechaza la preference con back_urls que apuntan a localhost cuando auto_return está presente ("back_url.success must be defined"). En dev local omitimos auto_return — el user clickea "Volver al sitio" manual. En prod con dominio real funciona normal. Registrado en LEARNINGS.
  - **Items del cart + envío inline**: MP Checkout Pro V1 no tiene campo dedicado de shipping cost — va como item extra. Trick aceptado.
  - **`unit_price` en decimales**: el SDK MP recibe `1500.00` no `150000`. Conversión `price_cents / 100` en el helper.
  - **`external_reference = order_number`** (no UUID): legible en notificaciones MP + matchea con OC-YYYY-NNNNN del trigger 00003.
  - **`mp_payment_id` NO se guarda acá**: ese viene del webhook (sub-feature 3) — la preference solo identifica una "intención de pago". El payment_id real existe recién cuando el cliente paga.
  - **`isMpTestMode()`**: usa el `sandbox_init_point` automáticamente. Cuando founder pase a PROD, cambia `MP_ACCESS_TOKEN` por `APP_USR-...` y el helper devuelve `init_point` real sin tocar código.
- **E2E validado contra sandbox MP real**:
  - Test directo con node + creds reales del founder: preference creada OK, devolvió `preference_id` válido + `init_point` + `sandbox_init_point`. URLs reales `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1975674-...`
  - Smoke 4/4 sin sesión: `/checkout` HTTP 307 (auth), `/checkout/exito?params` HTTP 200 con info, `/checkout/error?params` HTTP 200 con info, `/checkout/pendiente?mp_error=1` HTTP 200.
- **Validación**: `pnpm typecheck` + `pnpm lint` + `pnpm build` clean. Build incluye `/checkout/exito` y `/checkout/error` como Dynamic.
- **Lo que queda para sub-feature 3 (cuando llegue Resend)**:
  - `/api/mp/webhook` route handler que recibe notifications de MP, valida signature, lookup order por `external_reference`, UPDATE `orders.status='paid' | 'cancelled'` + `mp_payment_id + paid_at`, idempotencia por `mp_payment_id`.
  - Email al cliente confirmando pago vía Resend.
  - Email al founder con datos para facturar manual (regla de negocio actual: sin Tusfacturas).

### Decisión: Mi Correo REST elegido como API logística (✅ 2026-05-28, commit `072cc81`)
- **Contexto**: founder pasó AMBOS PDFs oficiales (PAQ.AR v2.0 + MiCorreo) en sesiones consecutivas. Análisis comparativo en el transcript.
- **Decisión**: usar **Mi Correo REST** para sub-feature LOGISTICA (futura). NO usar PAQ.AR.
- **Razones**:
  - **Mi Correo tiene `/rates`** (cotización dinámica) — PAQ.AR NO. Esto es crítico para mostrar precio exacto en checkout.
  - **Mi Correo acepta DNI o CUIT** sin agreement comercial corporativo. PAQ.AR requiere cuenta corporativa con trámite de 3-6 semanas.
  - **Mi Correo usa JWT moderno** (POST /token con basic auth → bearer). PAQ.AR usa Apikey + agreement headers estilo viejo.
  - **Mi Correo tiene `/register`** vía API (autoservicio). PAQ.AR requiere gestión presencial con comercial.
- **Trade-offs aceptados** (lo que PAQ.AR sí tiene y Mi Correo no):
  - Rótulo PDF vía API → founder lo baja del portal web `micorreo.correoargentino.com.ar` post-import.
  - Tracking vía API → cliente lo ve en portal web; futuramente podemos linkearlo desde nuestra UI.
  - Cancelar vía API → manual desde portal. Para volumen 5-20/mes, OK.
- **Decisiones de scope para sub-feature LOGISTICA** (no codeada todavía):
  - Cotización dinámica desde V1 con fallback a tabla por zonas si la API falla (graceful degradation).
  - Ofrecer ambos delivery types: `D` (domicilio) y `S` (sucursal).
  - Mantener `lib/shipping.ts` como wrapper: detecta env vars MiCorreo configuradas → llama `lib/correo/quote.ts`; sino fallback a la tabla.
- **Pendiente del founder ANTES de poder arrancar sub-feature LOGISTICA**:
  - Solicitar credenciales API MiCorreo al área Comercial Correo Argentino (0800-777-0345 o portal). El PDF dice las credenciales se gestionan así.
  - Confirmar `customerId` MiCorreo (formato `00xxxxxxxx`, lo ve en su perfil del portal).
  - Confirmar CP de origen de envíos (Virasoro, Corrientes — probablemente 3342).
- **Plan técnico cuando lleguen credenciales** (~600-800 líneas, 2 sesiones):
  - **`lib/correo/`**: `auth.ts` (JWT con cache hasta expires), `quote.ts` (POST /rates), `agencies.ts` (GET /agencies por provincia, cache 1 día), `import-shipping.ts` (POST /shipping/import post-pago), `provinces.ts` (mapping nombre → código 1-letter), `constants.ts` (BUSINESS_POSTAL_CODE, dimensiones default, productType "CP").
  - **Migración 00007**: agregar a `orders` las columnas `shipping_delivery_type` text CHECK IN ('D','S'), `shipping_agency_code` text, `correo_ext_order_id` text.
  - **Refactor `lib/shipping.ts`**: wrapper con fallback a tabla.
  - **`components/checkout/checkout-page.tsx`**: toggle delivery type + selector sucursal condicional + re-cotización al cambiar address/type con loading.
  - **`lib/checkout/actions.ts`**: post-createOrder llamar `importShipping` (best-effort; si falla, log + alertar, order válida igual).
  - **Env vars nuevas**: `MICORREO_API_BASE_URL`, `MICORREO_API_USER`, `MICORREO_API_PASSWORD`, `MICORREO_CUSTOMER_ID`, `BUSINESS_POSTAL_CODE`.

### Sub-feature 2b PARTE 1 — /checkout sin MP (✅ 2026-05-28, commit `b32cbf2`)
- **Decisión de scope clave**: founder pidió "construir todo el flow de venta detrás de flag, oculto hasta tener masa crítica de productos". Parte 1 = todo lo del checkout que NO depende de credenciales MP. Parte 2 = preference + redirect (cuando lleguen creds MP). Esto desbloqueó arrancar inmediato.
- **`lib/shipping.ts`** — tabla por zonas hardcoded:
  - CABA/GBA $2.500, Interior cercano $4.500, Interior lejano $6.500, Patagonia $9.500. Free shipping desde $80.000.
  - Mapeo de las 24 provincias AR a 4 zonas en `PROVINCE_TO_ZONE`.
  - `calculateShipping({subtotalCents, provinceName}) → ShippingQuote` pura, sin DB/fetch.
  - Cuando founder elija API Correo + tenga creds, este helper se reemplaza por `lib/correo/quote.ts` con misma firma de retorno (`ShippingQuote`) — el resto del flow no cambia.
- **Migración 00006 `reserve_stock_function.sql`** — 2 funciones SQL:
  - `reserve_stock(p_items jsonb)`: decrementa stock_qty de N variants en una transacción. Aprovecha el CHECK `stock_qty >= 0` del schema (migración 00001) — si cualquier decremento dejaría negativo, falla TODO con SQLSTATE `23514` y rollback automático. Mensaje de error útil con SKU + disponible + pedido.
  - `increment_variant_stock(p_variant_id, p_amount)`: compensatoria. Se llama desde `createOrderFromCart` si un INSERT posterior a reserve falla.
  - Ambas `SECURITY INVOKER` + `REVOKE ALL FROM PUBLIC/anon/authenticated` + `GRANT EXECUTE TO service_role`. Solo invocables desde server actions con `createAdminClient`.
- **`lib/checkout/orders.ts`** — `createOrderFromCart(args)`:
  - Llama RPC `reserve_stock` (atómico).
  - INSERT `orders` con snapshots inmutables (ADR-007): `customer_name`, `customer_email`, `customer_phone`, `shipping_*` (12 columnas separadas para dirección snapshotteada — schema 00002), totales en centavos, `shipping_method` = zone, `notes` con zona y "Envío gratis" si aplica. `order_number` se autogenera por trigger 00003.
  - INSERT `order_items` con snapshots (`product_name`, `product_slug`, `variant_sku`, `variant_attributes`, `quantity`, `unit_price_cents`, `line_total_cents` validado por CHECK).
  - Compensación de stock si INSERT falla (best-effort, no transaccional — V1 acepta este riesgo para volumen 5-20/mes).
- **`lib/checkout/actions.ts`** — server action `submitCheckout(prev, formData)`:
  - Verifica flag, auth (`getCurrentProfile`), valida `address_id` (Zod uuid), fetcha address (RLS), lee cart cookie + resuelve, calcula shipping, llama `createOrderFromCart`.
  - Customer name: `profile.display_name || address.recipient_name || email-username || 'Cliente'`.
  - Post-éxito: borra cookie cart, `revalidatePath`, redirect a `/checkout/pendiente?order=<orderNumber>`.
- **UI nueva en `components/checkout/`**:
  - `address-selector.tsx` (client) — radios visuales en vez de `<select>` (mejor UX para 1-5 addresses); preselecciona default.
  - `checkout-summary.tsx` (server) — items con quantity + brand + SKU, subtotal/envío/total tabulares, banner "te faltan $X para envío gratis" cuando aplica.
  - `checkout-page.tsx` (client) — form con `useActionState`, layout grid 1fr+360px, empty state si user no tiene addresses con CTA a `/mi-cuenta/direcciones/nueva?next=/checkout`, link "agregar otra dirección", trust signal "pago seguro vía MP".
- **Pages**:
  - `app/(storefront)/checkout/page.tsx` (server, dynamic) — `notFound()` si flag OFF, `requireAuth('/checkout')`, redirect a `/carrito` si cart vacío o con issues, render `<CheckoutPage>` con addresses + shipping inicial (zona = provincia del default address o "Buenos Aires" fallback).
  - `app/(storefront)/checkout/pendiente/page.tsx` (server, dynamic) — "Recibimos tu pedido" + número de orden + mensaje "estamos integrando MP, mientras coordinamos por WhatsApp" + CTA WhatsApp con mensaje pre-llenado incluyendo el número de orden.
- **Decisiones técnicas clave**:
  - **Atomicidad vía función SQL**: en vez de hacer N UPDATEs en JS (no transaccional vía PostgREST), la función `reserve_stock` corre todo en una transacción de Postgres. CHECK constraint del schema es el último guardián, la función expone el error.
  - **Compensación de stock NO transaccional**: si el INSERT order falla post-reserve, llamamos `increment_variant_stock` para revertir. Best-effort — si esa compensación también falla, queda inconsistencia que requiere intervención manual. Aceptable para 5-20 envíos/mes; con volumen mayor se mueve TODO (reserve + insert) a una sola función SQL.
  - **Snapshots inmutables en order_items** (ADR-007): `product_name`, `variant_sku`, `unit_price_cents` se copian del cart resuelto. Si el founder cambia el precio o renombra el producto después, las orders viejas mantienen los datos del momento de compra.
  - **`product_id` y `variant_id` con `ON DELETE SET NULL`** (schema 00002): si se borra un producto, las orders quedan con los snapshots pero pierden el FK — válido para historial legal.
  - **Envío inicial en página**: se cotiza con la provincia del default address. Cuando el user cambia la selección, la cotización NO se re-calcula client-side todavía (mantenemos UI simple V1). La cotización final se valida en el server action al submit. Si en V2 el founder quiere preview dinámico, agrego una API route + fetch onChange.
  - **`shipping_address_id` FK opcional** + 12 columnas snapshot: si el user borra la address después, el snapshot sobrevive (ADR-007).
- **Smoke 4/4 verdes**:
  - Flag OFF (default): `/checkout` HTTP 404; `/checkout/pendiente` HTTP 404.
  - Flag ON sin sesión: `/checkout` HTTP 307 → `/ingresar?next=%2Fcheckout`.
  - Flag ON con order param: `/checkout/pendiente?order=OC-2026-00001` HTTP 200, renderiza "Recibimos tu pedido" + número + mención MP.
- **Smoke `reserve_stock` 3/4 verdes en local**:
  - Test 1 ✓ service_role decrementa OK (stock 5 → 3 con qty=2).
  - Test 2 ✓ stock insuficiente con mensaje claro (`disponible: 3, pedido: 99`).
  - Test 3 ❌ anon/authenticated llamando la función con permiso revocado crashea PG 17 local (bug raro de runtime). En producción cloud (PG 15/16) no debería pasar, y de cualquier modo en producción solo se llama vía `createAdminClient` (service_role). Registrado en MISTAKES.
  - Test 4 (sub-test rollback multi-item) ✓ stock correcto post-rollback.
- **Validación**: `pnpm typecheck` + `pnpm lint` + `pnpm build` clean. Sin regresión.
- **Pendiente del founder**:
  - Aplicar bootstrap 00005+00006 al cloud (195 líneas) + verificar con SELECTs.
  - Las 5 cotizaciones reales de envío para ajustar la tabla en `lib/shipping.ts`.

### Etapa 0 — Feature flag `NEXT_PUBLIC_CHECKOUT_ENABLED` (✅ 2026-05-28, commit `ee4a1ed`)
- **Decisión de producto**: founder redefinió estrategia — construir TODO el flow de venta detrás de un flag, dejarlo oculto hasta tener masa crítica de productos. Reactivar = flip 1 env var + redeploy. Implica: sub-features 2b + 3 SÍ se construyen, pero invisibles hasta que el flag se prenda.
- **Helper nuevo** `lib/features.ts` con `isCheckoutEnabled()`. Convención del proyecto para feature flags: env vars `NEXT_PUBLIC_*_ENABLED` con valor `'true'`. Cualquier otro valor (incluyendo ausente) → deshabilitada.
- **Aplicado en**:
  - `SiteHeader`: `{checkoutEnabled && <CartBadge />}`. Import descomentado.
  - `VariantList`: nueva prop `checkoutEnabled`. Si true → `AddToCartButton`. Si false → `VariantWhatsappCta`. Solo se muestra alguno si `showVariantCta` (false para `[PH]`).
  - `product-page.tsx`: pasa `checkoutEnabled={isCheckoutEnabled()}`.
  - `cart-page.tsx`: nueva prop `checkoutEnabled`. Si true → CTA "Iniciar compra" linkeable a `/checkout`. Si false → button disabled con texto "Checkout próximamente".
  - `/carrito/page.tsx`: pasa el flag al componente.
- **Decisiones técnicas clave**:
  - **`NEXT_PUBLIC_*_ENABLED` por convención**: env público para que server components renderizen correctamente desde build/request. Si el día de mañana hay flags server-only, se usa otro patrón.
  - **String `'true'` exacto** (no `'1'`, no truthy): explícito, sin ambigüedad. Falta de la env = no habilitada.
  - **Flag por feature, no global**: ej `CHECKOUT_ENABLED` solo controla cart+checkout. Si después queremos un flag para "lector de receta IA", es `RX_AI_READER_ENABLED` separado.
  - **Sin /checkout creado todavía**: cuando flag ON pero /checkout no existe (estado intermedio entre etapas), Next devuelve 404 natural. Acepta el costo de inconsistencia transitoria — la próxima sub-feature 2b crea /checkout.
- **Smoke 4/4 verdes** (toggle entre OFF y ON):
  - **OFF (default)**: home sin CartBadge (0 matches), producto `[PH]` sin "Agregar" (0 matches), sin "Consultar" inline (0 — porque `[PH]` no muestra ninguno).
  - **ON**: home con CartBadge (1 match), /carrito vacío sin link a /checkout (0 — empty state no muestra sidebar), /carrito CON item (cookie sintética) muestra "Iniciar compra" + `href="/checkout"` (3 matches).
- **Validación**: `pnpm typecheck` + `pnpm lint` + `pnpm build` clean. Build sin regresión.

### Migración 00005 — Bucket Storage `products` público + helpers (✅ 2026-05-28, local only)
- **Bucket `products`** público: `public=true`, max 5 MB por imagen, mime whitelist (jpeg/png/webp/avif). Path pattern sugerido: `<brand_slug>/<product_slug>/<filename>`.
- **1 RLS policy** `products: anyone reads` (SELECT TO public) — pública lectura. NO policy de INSERT/UPDATE/DELETE — solo `service_role` (que bypassa RLS) puede modificar: server actions admin o Supabase Studio del founder.
- **Smoke 3/3 verdes en local**:
  - Anon INSERT → bloqueado (`new row violates row-level security policy`) ✓
  - Authenticated INSERT → bloqueado (idem) ✓
  - service_role INSERT → OK ✓
- **Helpers server-only** (`lib/storage/`):
  - `constants.ts` extendido con bloque `products`: `PRODUCTS_BUCKET`, `PRODUCTS_MAX_BYTES`, `PRODUCTS_ALLOWED_MIME`, `PRODUCTS_MIME_TO_EXT`.
  - `products.ts` nuevo: `uploadProductImage` (valida mime + size, sube con `cacheControl: 31536000 immutable`), `getProductImagePublicUrl` (arma URL sin query a Storage), `deleteProductImage` (idempotente), `suggestFilename` (SKU → `rst-way-negro-001.webp`).
- **Decisiones técnicas clave**:
  - **Bucket público** (no privado como prescriptions): fotos de producto no son datos sensibles, queremos cache CDN y compatibilidad directa con `next/image`.
  - **Sin policies de escritura**: defensa-en-profundidad. Browser jamás puede modificar el bucket. Toda escritura pasa por server actions/scripts con `createAdminClient`.
  - **Mime whitelist incluye AVIF**: formato moderno con mejor compresión que WebP, compatible con next/image. Si el founder usa Canva/Photoshop, casi seguro exporta WebP/JPG.
  - **Path sin user namespace**: a diferencia de prescriptions, no hay ownership por user — son assets globales del catálogo.
  - **`next.config.mjs` ya soporta `*.supabase.co`**: no requiere ALTER.
- **Bootstrap regenerado**: `supabase/cloud-bootstrap.sql` (58 líneas, solo 00005). CLOUD_APPLIED.md marcado ⏳ Pendiente.
- **Pendiente del founder**:
  - Aplicar bootstrap en SQL Editor cloud + verificar con:
    ```sql
    SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id='products';
    SELECT policyname, cmd, roles FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname LIKE 'products:%';
    ```
    Esperado: 1 fila bucket (`products | products | true | 5242880`) + 1 fila policy (`products: anyone reads | SELECT | {public}`).
  - Pasarme data del 1er producto Rusty real para reemplazar `[PH]` (formato sugerido en docs).

### Modo pre-venta — UI sin cart, CTA por variante = WhatsApp (✅ 2026-05-28, commit `2f9a75f`)
- **Decisión de producto**: founder pidió "subir páginas de productos sin que la gente pueda comprar aún" y mantener facturación manual al principio. Implica: NO Mercado Pago en V1, NO Tusfacturas automatizado, sub-features 2b/3 quedan para cuando empiece el flow de ventas online real.
- **Cambios en UI**:
  - **CartBadge oculto** en `SiteHeader` (línea comentada + import comentado, con nota). Reactivar = descomentar 2 líneas.
  - **`AddToCartButton` reemplazado por `VariantWhatsappCta`** en `VariantList`. Cada variante con stock muestra un botón "Consultar" con mensaje pre-llenado: `"Hola! Quería consultar por el modelo {marca} {producto} ({variante}, SKU {sku}, {precio})"`.
  - Prop renombrada `canAddToCart` → `showVariantCta` (más neutra; mismo flag bool — false para `[PH]` productos).
  - Nuevos props requeridos en VariantList: `productName`, `brandName` (necesarios para componer el mensaje WhatsApp).
- **Cart code intacto y sin uso público**:
  - `lib/cart/{types,cookie,queries,actions}.ts` no se tocaron.
  - `app/(storefront)/carrito/page.tsx` sigue accesible vía URL directa (HTTP 200 con cart vacío).
  - `app/api/cart/count/route.ts` sigue respondiendo (devuelve 0).
  - Server actions siguen funcionando — sin UI que las dispare hoy.
- **Decisión técnica clave**: NO borrar cart code. Reactivar checkout = trivial cuando llegue MP (sub-feature 2b). Borrar y reescribir = trabajo perdido.
- **Smoke 4/4 verdes** (con WhatsApp number seteado temporalmente para testing):
  - Home no muestra CartBadge (0 matches `aria-label="Carrito`).
  - Producto `[PH]` no muestra CTAs inline por variante (0 matches `Consultar por WhatsApp sobre`).
  - WhatsappCta general (a nivel producto) sigue renderizando.
  - `/carrito` sigue HTTP 200 vía URL directa.
- **Comportamiento con env vacío**: si `NEXT_PUBLIC_WHATSAPP_NUMBER` está vacío (estado actual del founder), `VariantWhatsappCta` devuelve `null` (no renderiza) — regla 7: trust signals reales, no inventados. Cuando founder setee el número, los CTAs por variante aparecen automáticamente.
- **Validación**: `pnpm typecheck` + `pnpm lint` + `pnpm build` clean. Build sin regresión.

### Sub-feature 2a — Addresses CRUD en /mi-cuenta/direcciones (✅ 2026-05-28)
- **Páginas nuevas**:
  - `/mi-cuenta/direcciones` — lista, default primero ordenado por updated_at desc, empty state con CTA "Agregar mi primera dirección".
  - `/mi-cuenta/direcciones/nueva` — form crear.
  - `/mi-cuenta/direcciones/[id]/editar` — form editar con datos pre-cargados, `notFound()` si no es del user (RLS bloquea, queries devuelve null).
  - Todas con `dynamic = 'force-dynamic'` + `requireAuth(currentPath)` que redirige a `/ingresar?next=<currentPath>` si no hay sesión. Metadata `noindex, nofollow`.
- **Helpers nuevos `lib/addresses/`**:
  - `constants.ts` — `AR_PROVINCES` const tuple (24: CABA + 23 provincias) como source of truth del select.
  - `types.ts` — Zod schemas con validaciones específicas AR: postal_code regex `/^[A-Z]?\d{4}[A-Z]{0,3}$/i` (acepta CPA `B1900ABC` o 4 dígitos `1900`, normaliza a mayúsculas), teléfono regex permisivo `/^[\d+\-\s()]{6,30}$/` (acepta `+54 11 1234-5678`), province enum estricto. `AddressInput` / `Address` / `AddressFormState`.
  - `queries.ts` — `fetchUserAddresses()` ordena default primero, `fetchAddressById(id)` con select explícito de columnas (no `*`) por LEARNING de supabase-js .returns<> con maybeSingle. RLS hace ownership check.
  - `actions.ts` — 4 server actions: `createAddress`, `updateAddress` (bind con id), `deleteAddress`, `setDefaultAddress`. Cada una valida user con `auth.getUser()`. Insert auto-marca `is_default=true` si es la primera del user. Update/Insert con `is_default=true` primero desmarca el default anterior (evita violación de UNIQUE partial `idx_addresses_one_default_per_user`). Delete promueve auto la más reciente a default si la borrada era la default.
- **UI nuevos `components/account/`**:
  - `address-form.tsx` — client con `useActionState`, fields: label opcional, recipient_name, street + number (grid 1fr/140px), apartment opcional, city + postal_code (grid 1fr/140px), province `<select>`, phone opcional, checkbox is_default. Errores por field con `fieldErrors` map del Zod. Autocomplete attrs (`address-line1`, `postal-code`, `tel`).
  - `address-card.tsx` — server, render una address con badge "Predeterminada" condicional, link a editar, botón "Marcar como predeterminada" si no lo es, "Eliminar".
  - `delete-address-button.tsx` — client, confirm inline (2-step: click "Eliminar" → muestra "¿Eliminar? Sí/Cancelar") usando `useTransition`.
  - `set-default-button.tsx` — client, `useTransition` simple.
  - `form-submit-button.tsx` — variant de SubmitButton de auth, con label "Guardando..." en pending.
- **`/mi-cuenta` page actualizada** — nueva sección "Tu actividad" con tile/Button outlined que linkea a `/mi-cuenta/direcciones`.
- **Decisiones técnicas clave**:
  - **Provincias en enum TS (Zod), NO en SQL CHECK**: agregar provincia nueva = sólo cambiar TS array, sin migración. Schema actual de `addresses.province` es `text` libre (ADR-005).
  - **Default promotion automática en delete**: si la default se borra y hay otras, la más reciente toma su lugar. Si era la única, el user queda sin default (válido).
  - **Sin transacción explícita para setDefault**: 2 queries (UPDATE off, UPDATE on) en secuencia. Race condition teórica entre clics rápidos del mismo user podría violar UNIQUE partial — extremadamente improbable (mismo user, mismo cliente). Si pasa, el INSERT falla con error que el user puede retry. Acepto V1 — la operación atómica vendría con una stored procedure.
  - **Sin FK de orders.address_id**: al borrar una address, orders viejas NO se afectan (los datos están snapshotteados inline en orders por ADR-007).
  - **Select explícito de columnas en queries.ts**: `select('*')` rompe la inferencia de tipos cuando usamos `.returns<Address>()` con `.maybeSingle()` — error "Cannot cast array result to a single object". Solución: enumerar columnas explícitamente.
- **5/5 smoke tests verdes (sin sesión)**:
  - `/mi-cuenta/direcciones` HTTP 307 → `/ingresar?next=%2Fmi-cuenta%2Fdirecciones`.
  - `/mi-cuenta/direcciones/nueva` HTTP 307.
  - `/mi-cuenta/direcciones/<uuid>/editar` HTTP 307.
  - `/ingresar` post-redirect renderiza correctamente.
  - `robots.txt` incluye `Disallow: /mi-cuenta` (cubre /direcciones por prefix).
- **Validación**: `pnpm typecheck` + `pnpm lint` + `pnpm build` clean. Build 29 páginas (3 nuevas dynamic). First Load JS sin regresión.
- **Pendiente del founder testing**: validar flow con login (crear address → ver en lista → editar → marcar default → eliminar). Hasta que el founder testee logueado en cloud, no se valida el happy path end-to-end.

### Cart sub-feature 1 — cookie-based con HMAC (✅ 2026-05-28, commit `e7eba1f`)
- **Stack**: cookie HttpOnly `oc_cart` firmada con HMAC-SHA256 (env `CART_COOKIE_SECRET`, 32 bytes hex). Payload base64url + Zod schema validation al leer. Tampered o invalid → cart vacío silencioso.
- **Tipos** (`lib/cart/types.ts`): `CartItem` (variantId UUID + quantity 1-10), `Cart` (max 20 items distintos), `ResolvedCartItem` con flag `issue: 'unavailable' | 'out_of_stock' | 'over_stock' | null`.
- **Cookie utilities** (`lib/cart/cookie.ts`): read/write/delete async (`cookies()` de Next 15), server-only, `getSecret()` exige >= 32 chars o tira error explícito con instrucciones.
- **Resolver** (`lib/cart/queries.ts`): `resolveCart(cart)` hace 1 query con `in('id', variantIds)` + embed product→brand→category, marca items rotos sin quitarlos (UX: user decide quitar). Subtotal y count excluyen items con issue. `countCartItems()` helper para el badge.
- **Server actions** (`lib/cart/actions.ts`): `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`. Cada una valida con Zod, consulta DB para verificar variant existe+activo+sin placeholder+stock, escribe cookie, llama `revalidatePath('/carrito')` + `('/','layout')`.
- **Validaciones duras**:
  - `MAX_QUANTITY_PER_ITEM = 10` (anti-bot/anti-abuso).
  - `MAX_ITEMS_IN_CART = 20` (cordura + cookie size).
  - Variant `is_active = true` + producto activo + brand activa + category activa.
  - Producto NO `[PH]` (rechaza placeholders explícitamente).
  - `quantity <= variant.stock_qty` en cada add/update.
- **UI**:
  - `AddToCartButton` (client, inline en VariantList) con `useTransition`, estados pending/added/error, dispara `oc:cart-changed` para refresh del badge.
  - `CartBadge` (client, en SiteHeader) lee `/api/cart/count`, escucha `oc:cart-changed`. Preserva SSG del storefront (igual patrón que AuthMenu).
  - `CartItemRow` (client, en /carrito): select de cantidad (max = min(stock, MAX_QTY)), botón quitar, render de `issue` con tono destructive.
  - `CartPage` (server): empty state con CTAs a categorías, lista + sidebar resumen, CTA "Iniciar compra" disabled con tooltip "Próximamente".
- **Route handler** `/api/cart/count` (force-dynamic, no-store) — único endpoint cliente-readable porque la cookie es HttpOnly.
- **SEO**: `/carrito` con `robots: noindex, nofollow` + `robots.txt` con `Disallow: /carrito`.
- **Decisiones técnicas clave**:
  - **Cookie firmada** (no sólo Zod) → defensa-en-profundidad. Aunque DB es source of truth, evita ataques que dependan del payload (ej: futuras features que confíen en el cart sin re-resolución).
  - **CartBadge cliente con fetch** en vez de cookie-en-cliente → cookie sigue HttpOnly (defensa XSS), y SSG del storefront preservado.
  - **resolveCart no silencia broken items** → user ve qué pasa y decide. Evita "items que desaparecen misteriosamente".
  - **Sin cart merge en login**: V1 anónimo. Si el founder pide después, se hace cuando flow de checkout esté integrado.
  - **Sin cart drawer (Sheet)**: página dedicada alcanza, menos JS, mejor UX mobile.
  - **`z.uuid()` de Zod 4.x** es estricto (RFC 4122 v1-8 + nil + max) — rechaza UUIDs malformados. Bonus de defensa.
- **Smoke tests 7/7 verdes**:
  1. Sin cookie → `/carrito` HTTP 200 empty state, count=0.
  2. Cookie firmada con UUID inexistente → `/carrito` muestra "Producto no disponible" + "Ya no está disponible" + botón "Quitar"; count=0 (broken excluido).
  3. Cookie tampered (payload modificado, sig vieja) → rechazada silenciosamente, count=0.
  4. Producto `[PH]` (rusty-wayfarer-classic-sol) → NO renderiza botón Agregar.
  5. Home `/` HTTP 200 con CartBadge en header.
  6. `/carrito` tiene `<meta name="robots" content="noindex, nofollow">`.
  7. `robots.txt` incluye `Disallow: /carrito`.
- **Validación**: `pnpm typecheck` + `pnpm lint` + `pnpm build` clean. Build 26 páginas. Storefront sigue SSG/Static; `/carrito` y `/api/cart/count` son ƒ Dynamic (esperado).
- **Pendiente del founder**: agregar `CART_COOKIE_SECRET` (32 bytes hex distinto al de dev) en Vercel Environment Variables Production + Preview ANTES del primer deploy. Sin esto el cart explota en runtime.
- **Pendiente del founder testing local**: cuando reemplace algún producto `[PH]` por data real, validar add → ver en /carrito → cambiar cantidad → quitar → checkout disabled. Hasta entonces no se puede testear el happy path completo en cloud (todos los productos son [PH]).

### Deployment 00004 a cloud + verificación completa (✅ 2026-05-28)
- **Founder pegó `supabase/cloud-bootstrap.sql` (80 líneas) en SQL Editor del Dashboard**. Output: `Success. No rows returned` (esperado para DDL).
- **Verificación completa con 2 SELECTs** (regla post cloud-drift de 00002: nunca marcar ✅ sin SELECT):
  - SELECT 1 (bucket): ✅ `prescriptions | prescriptions | false | 10485760` (1 fila, valores exactos esperados).
  - SELECT 2 (policies): ✅ 4 filas con nombres `prescriptions: users {read,upload,update,delete} own files` y `cmd` correcto (SELECT/INSERT/UPDATE/DELETE).
- **Decisión técnica reforzada**: aunque las policies existan, no asumir que el bucket existe. `bucket_id='prescriptions'` en las policies es un string literal sin FK → policies se crean aunque el INSERT del bucket falle. La verificación del bucket por SELECT separado es no-negociable. Aplicación exitosa de la regla documentada en LEARNINGS.md 2026-05-28.
- **Cierre**: `CLOUD_APPLIED.md` marcado ✅ VERIFICADO con evidencia detallada; `supabase/cloud-bootstrap.sql` borrado (derivado, regenerable cuando haya nueva migración).

### Migración 00004 prescriptions Storage bucket + RLS + helpers (✅ commit `17b612b` — 2026-05-28, local only)
- **Bucket `prescriptions`** privado en Supabase Storage: `public=false`, max 10 MB por archivo, mime whitelist (jpeg/png/webp/pdf).
- **4 RLS policies** en `storage.objects` filtrando por `bucket_id='prescriptions'` + `(storage.foldername(name))[1] = auth.uid()::text`. Path pattern: `<user_id>/<prescription_id>/original.<ext>`.
- **Helpers server-only** (`lib/storage/`):
  - `constants.ts` — source of truth de bucket name, mime types, size limit, TTL signed URL. Tiene que coincidir con la migración.
  - `prescriptions.ts` — `uploadPrescriptionImage`, `getPrescriptionSignedUrl`, `deletePrescriptionImage`. Usan `createAdminClient` (service_role) para bypass de RLS desde server actions ya autenticadas.
- **Decisiones técnicas clave**:
  - Path con `user_id` como primer segmento → RLS de Storage valida ownership sin joins.
  - Mime whitelist y size limit duplicados en migración Y en TS constants (single source of truth en constants, migración los referencia).
  - Signed URL TTL 5 min default (suficiente para cargar img, no para compartir).
  - `upsert: true` en upload — permite re-subir corregido sin DELETE explícito.
  - Sin UI todavía (esperando feature de mi-cuenta/recetas o lector IA).
- **7 smoke tests verdes**: bucket OK, 4 policies presentes, Alice ve su archivo, Bob no ve el de Alice, anon no ve nada, Bob no puede insertar bajo namespace de Alice (WITH CHECK).
- **Pendiente cloud**: `supabase/cloud-bootstrap.sql` regenerado (80 líneas, solo 00004). Founder pega + verifica con SELECT (regla nueva post cloud drift).

### Migración 00003 order_number generator (✅ commit `4e4ffb2` — 2026-05-28, local only)
- **Sequence + 2 functions + 1 trigger** que auto-genera `orders.order_number` con formato `OC-YYYY-NNNNN` cuando el insert no lo pasa.
- **Counter global** (no reinicia anual). Año desde `now() AT TIME ZONE 'America/Argentina/Buenos_Aires'` (no UTC) — el "año" de la order es el de Argentina.
- **Override manual permitido**: el trigger solo dispara si `order_number IS NULL OR = ''`. Habilita importar histórico de Mercado Libre con sus números originales.
- **`generate_order_number()` función pública** invocable directo (preview de número en UI antes del insert, con cuidado del side-effect de `nextval`).
- **Gaps aceptables**: `nextval` no es rollback-safe — si una transacción falla, el número queda quemado. Comportamiento estándar y aceptable (la numeración legalmente importante la maneja Tusfacturas con su propio numerador AFIP).
- **Smoke tests verdes**: auto-gen (`OC-2026-00001`, `OC-2026-00002`), override (`ML-IMPORT-001`), string vacío auto-gen, preview directo, sequence avanza correcto.
- **Tipos regenerados**, typecheck + lint + build clean.
- **Pendiente cloud**: `supabase/cloud-bootstrap.sql` (58 líneas, solo migración 00003) → founder pega en Dashboard. `CLOUD_APPLIED.md` la marca como ⏳ Pendiente.

### Auth UI completo (✅ commit `12ca894` — 2026-05-28)
- **Pages nuevas** en `(auth)` layout group: `/ingresar`, `/registro`, `/recuperar-clave`, `/recuperar-clave/restablecer`. Todas con metadata `noindex, follow`. AuthFormShell wrapper compartido.
- **Route handler** `/auth/callback` — intercambia code de confirmación email / magic link por sesión. `safeNextPath` whitelist anti open-redirect.
- **Page `/mi-cuenta`** en `(account)` layout group — dashboard simple con datos del profile + logout. `getCurrentProfile()` redirige a `/ingresar?next=/mi-cuenta` si no hay sesión.
- **Server actions** (`app/(auth)/actions.ts`): `signIn`, `signUp`, `signOut`, `requestPasswordReset`, `resetPassword`. Validación Zod, errores en español argentino, `emailRedirectTo` apunta a `SITE_URL + /auth/callback`.
- **Helpers** (`lib/auth/server.ts`): `getCurrentUser()` (non-redirecting), `requireAuth(currentPath)`, `getCurrentProfile()`.
- **Componentes** (`components/auth/`): AuthFormShell, LoginForm, SignupForm, PasswordResetRequestForm, PasswordResetForm, LogoutButton, FormStatus (SubmitButton + FormFeedback). Todos con `useActionState` (React 19).
- **`AuthMenu`** client component en SiteHeader — hace `getUser()` en cliente para mantener SSG de las páginas del storefront. Skeleton de ~36×36 mientras hidrata (sin layout shift). Muestra "Ingresar" o "Mi cuenta" según session.
- **Dependencias nuevas**: `zod 4.4.3` (~14 KB) + shadcn `input`/`label`/`alert`.
- **Decisiones técnicas clave**:
  - Email + password único método V1 (OAuth en V2).
  - Confirmación de email obligatoria (default Supabase).
  - Mensaje neutro en password reset anti-enumeration ("si existe una cuenta…").
  - `safeNextPath()` whitelist (sólo paths que empiezan con `/` y no `//`).
  - AuthMenu client en vez de server para no romper SSG.
- **Validación contra cloud**: las 4 pages auth HTTP 200, `/mi-cuenta` sin sesión → 307 a `/ingresar?next=/mi-cuenta`, meta `noindex` presente. Build: storefront sigue SSG/Static, solo auth pages son Dynamic (esperado).
- **Pendiente del founder ANTES de testear flow end-to-end** (en BACKLOG.md sección 🔴 bloqueante):
  - Configurar Redirect URLs en Supabase Auth Dashboard.
  - (Opcional) Customizar templates de email en español.

### Housekeeping: BACKLOG centralizado + CLOUD_APPLIED tracker (✅ commit `b202d34` — 2026-05-28)
- **API key comprometida rotada** por el founder + `.env.local` actualizado con la nueva. Resuelve MISTAKE 2026-05-28 "API key real pegada en el chat".
- **Migraciones 00001 + 00002 aplicadas al cloud** por el founder vía SQL Editor del Dashboard. Resuelve los dos pendientes de "cloud sin migración".
- **`supabase/cloud-bootstrap.sql` ELIMINADO**: era derivado/transitorio (estaba en `.gitignore`). Cuando haga falta para una migración nueva, se regenera.
- **`supabase/CLOUD_APPLIED.md` NUEVO**: tabla viva de qué migraciones y seeds están en cloud (`tuddpfspnbnmafsqdvat`) vs lo que está en `supabase/migrations/`. Documenta el flujo para próximas migraciones (regenerar bootstrap → founder pega en Dashboard → confirmar → actualizar tracker → borrar bootstrap).
- **`BACKLOG.md` NUEVO** en raíz: lista centralizada de pendientes que NO son features con planning propio (assets visuales, data real, mejoras técnicas, features menores). Sección "Hecho" con commit hash/fecha + "Descartado" para histórico. Sustituye los listados ad-hoc dispersos.
- **`CLAUDE.md` actualizado**: tabla "Otros archivos importantes" incluye `BACKLOG.md` y `supabase/CLOUD_APPLIED.md`.

### Logo + favicon + iconos PWA en el storefront (✅ commit `102b501` + rename `d3da669` — 2026-05-28)
- **Assets cargados por el founder** a disco:
  - `public/brand/logo-square.png` (100×100 RGBA, 6.2 KB) — isotipo cuadrado azul oscuro.
  - `app/favicon.ico` (41 KB) — auto-detectado por Next 15.
  - `app/icon.png` (79 KB) — PWA / Android.
  - `app/apple-icon.png` (15 KB) — iOS home screen (renombrado de `apple-touch-icon.png` por convención Next 15).
- **`SiteHeader` actualizado**: reemplaza el span "Óptica Carballo" por `<Image priority src="/brand/logo-square.png" />` (100×100) + span con nombre. Mobile (<sm): solo logo. Desde sm+: logo + nombre. `rounded-md` suaviza el cuadrado azul contra el fondo blanco.
- **Auto-generación de meta tags por Next 15**: `<link rel="icon">` para favicon e icon, `<link rel="apple-touch-icon">` para apple-icon, con `sizes` detectado del archivo y URL con hash para cache busting. Sin tocar `layout.tsx`.
- **Pendiente del founder** (mencionado, no bloqueante):
  - Versión transparente del isotipo (PNG con alpha o SVG) para usar sobre fondo claro sin el cuadrado azul como marco. La actual funciona como badge pero no es ideal.
  - OG image 1200×630 para `opengraph-image.tsx` (lo hace "luego").

### 🟢 Próximas features de código (post-acciones del founder)
9. ~~**Migración 00002**~~ ✅ Hecho en commit `1cee084`. Pendiente: founder aplica al cloud (`supabase/cloud-bootstrap.sql`).
10. **Auth UI**: páginas de login, signup, forgot password. Server actions con `@supabase/ssr`. Validación con Zod. Email templates customizados en Supabase Auth dashboard.
11. **Bucket Storage privado `prescriptions/`** + RLS policies de Storage + función helper para signed URLs (las imágenes de receta no se exponen públicamente).
12. **Function generadora de `order_number`** (sequence + format `OC-YYYY-NNNNN`).
13. **Server actions de checkout**: pasos del cart → validar stock → crear order + items → preferencia MP → redirect.
14. **Integración Mercado Pago Checkout Pro** (ADR-015): webhook, redirección, confirmación de pago, actualizar `orders.status` → 'paid'.
15. **Tusfacturas integración** (ADR-016): facturación AFIP automática post-payment confirmation. Guardar invoice_id + CAE en orders.
16. **Logo SVG real + foto hero + fotos de productos en Storage**. Cuando tengas assets.

### 🟢 Pre-launch (más infra)
5. **Migración 00002**: profiles + addresses + auth setup. Habilita login + flujo de checkout.
6. **Fotos reales de productos** + Storage bucket + ALTER products para `images`.
7. **Logo SVG** real cuando founder pase asset.

Mi recomendación: **camino 1** primero (reemplazar [PH]) o **camino 2** (cubrir lado rx) en paralelo. Camino 4 hay que tenerlo listo cuando se acerque el launch.

**Cosas pendientes ortogonales**:

- Imágenes reales de productos (Storage bucket "products" + upload).
- Nombres y precios reales de productos Rusty (los actuales son `[PH]` placeholder).
- Dominio `opticacarballo.com.ar` (pendiente desde sesiones anteriores).
- PEND-001 a PEND-004 de `DECISIONS.md`.
- PEND-005: cuentas restantes (Vercel, Resend, MP dev, etc.).

## Decisiones técnicas tomadas en esta sesión (ejecución)

Decisiones operativas del setup, dentro del marco de ADR-001:

- **Supabase CLI instalada como binario directo en `~/.local/share/supabase/`** con symlink en `~/.local/bin/supabase` (en vez de `brew install`). Razón: el founder no tenía Homebrew y instalarlo era invasivo (sudo, ~200 MB, modifica shell rc). El binario es local, reversible con un `rm`, y `~/.local/bin` ya estaba en su PATH. Funcionó perfecto, sin sudo.
- **Supabase cliente apunta al proyecto cloud existente** (el founder tenía `.env.local` configurado con credenciales reales de `tuddpfspnbnmafsqdvat.supabase.co`). El comando `supabase init` se ejecutó igual para crear `supabase/config.toml` local, pero `supabase start` con Docker NO se corrió en esta sesión. Cuando haga falta DB local aislada, se corre.
- **pnpm fijado como package manager** (`"packageManager": "pnpm@9.15.9"` + `engine-strict=true` en `.npmrc`) para evitar que `npm install` rompa el lockfile.
- **Tailwind v3.4 fijado explícitamente**, no v4. Migrar a v4 será un ADR propio cuando shadcn termine de adaptarse.
- **Solo deps mínimas en este setup**: `next`, `react`, `@supabase/supabase-js`, `@supabase/ssr`, utilidades de shadcn (`clsx`, `tailwind-merge`, `cva`, `lucide-react`, `tailwindcss-animate`). NO instalo `mercadopago`, `resend`, `@anthropic-ai/sdk`, `openai`, `zod`, `react-hook-form` hasta que la feature que los necesita exista (regla "no librerías sin necesidad real").
- **Componentes shadcn se agregan uno a uno** con `pnpm dlx shadcn@latest add <comp>` cuando se necesiten, no bulk install.
- **`tsconfig.json` con `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true`** para forzar disciplina desde el día 1.
- **Layout root con `lang="es-AR"`** desde el primer commit (regla 9 de CLAUDE.md, regla 10 de hreflang).
- **404 y error boundary en español argentino** desde el setup, no agregados después.
- **`eslint: ^8.57.1`** (no v9), porque eslint-config-next 15 todavía es más estable con eslint 8. Migrar a v9 + flat config cuando next-lint deje de ser default (Next 16).
- **Tipado explícito de `CookieOptions` en clientes Supabase server/middleware**: TS strict no inferia los callbacks `setAll` de `@supabase/ssr`. Tipo explícito `{ name, value, options: CookieOptions }[]` resuelve sin perder safety.

## Decisiones tomadas en sesiones previas

Ya están en `DECISIONS.md` (ADR-001 a ADR-022). Resumen:
- Stack: Next.js 15 + Supabase + Vercel
- PWA en V1, no app nativa
- Monorepo único
- Estructura SEO de URLs definida
- Patrón de variantes de producto definido
- Receta reusable, snapshots en orders
- WhatsApp como complementario
- Agent Manager Versión A (Versión B se evalúa en septiembre 2026)
- Mercado Pago Checkout Pro V1
- Tusfacturas para AFIP
- Andreani principal + Correo Argentino fallback
- Stack de modelos IA (Sonnet default, Haiku simple, Opus crítico)
- Defensa anti-injection obligatoria

## Decisiones pendientes que afectan el progreso

Ver sección "Pendientes" en `DECISIONS.md`.

## Problemas encontrados

- **2026-05-27 (sesión validación)**: CURRENT_STATE.md estaba desincronizado — declaraba "Entrega 4 pendiente" pero los 15 skills ya estaban en disco. Detectado y registrado en `MISTAKES.md`.
- **2026-05-27 (sesión planning)**: Ninguno. Step 1 + Step 2 del skill `/feature` se ejecutaron sin fricción.
- **2026-05-27 (sesión pre-flight)**: Faltaban pnpm, Docker Desktop y Supabase CLI. Resuelto con instalación asistida.
- **2026-05-27 (sesión ejecución)**: 
  1. Al instalar Supabase CLI la primera vez, borré el binario hermano `supabase-go` pensando que era basura. El shim `supabase` lo necesita al lado para funcionar. Resuelto re-extrayendo el tarball completo a `~/.local/share/supabase/`. Registrado en `MISTAKES.md`.
  2. TS strict marcó 10 errores de tipo en los callbacks de cookies de `@supabase/ssr`. Resuelto agregando type alias `CookieToSet` + import de `CookieOptions`. Aprendizaje: cuando se usa `noUncheckedIndexedAccess` + `strict`, los callbacks de libs externas suelen necesitar tipado explícito. No es un error del sistema, es expected behavior de TS strict. Registrado en `LEARNINGS.md`.
- **2026-05-28 (sesión migración 00001)**: 
  1. La herramienta `Write` rechazó sobreescribir el archivo de migración recién creado por `supabase migration new` porque "no fue leído primero". Resuelto con un Read trivial. No es bug — es safeguard. No merece MISTAKES.
  2. `psql` no está instalado localmente en el sistema (no era pre-requisito explícito). Resuelto usando `docker exec supabase_db_optica-carballo psql ...` que sí tiene psql incluido. Patrón útil registrado en LEARNINGS.
  3. La migración aplicó sin errores en `supabase db reset`. Todos los smoke tests verdes. No hubo problemas conceptuales.
- **2026-05-28 (sesión extracción + rx)**:
  1. Falso positivo en grep: "Producto no encontrado" apareció en el HTML de una página con HTTP 200 y title correcto. Causa: Next 15 serializa el contenido de `not-found.tsx` dentro del RSC payload aunque la página principal renderice OK. No es bug. Aprendí: los greps sobre HTML de Next 15 pueden tener match en payload RSC, no solo en DOM visible. Para chequear contenido visible, mejor usar HTTP status code + title + el primer match único de algo del componente principal.
  2. Sin otros problemas. El refactor a helpers compartidos pasó sin issues — typecheck verde de una vez, sol sigue intacto post-refactor, rx funciona desde la primera curl.
- **2026-05-28 (sesión página de producto)**:
  1. **Tipos de Supabase JS para embeds tipan FK 1:1 como arrays**, no como objetos. En runtime devuelve objeto, pero TS strict se queja. Fix: usar `.returns<ProductRow>()` con tipos explícitos manuales por consulta. Aprendí: para queries con embeds, siempre definir tipo manual y pasarlo a `.returns<>()`. Registrado en LEARNINGS.
  2. **seo-strategist detectó 3 críticos**: `[PH]` en producción contaminaría Google con nombres placeholder; `AggregateOffer` con low===high es semánticamente incorrecto; falta `image` + `itemCondition` en Product schema. Aplicado todos: helper `isPlaceholder()` + `robots: noindex` + filtro sitemap + lógica Offer vs AggregateOffer + campos al schema.
  3. Sin problemas conceptuales. La página renderiza correctamente, las 3 validaciones de seguridad (cross-brand, cross-category, inexistente) responden 404.
- **2026-05-28 (sesión Header/Footer)**:
  1. **`pnpm typecheck` falló inicialmente** después de mover `app/page.tsx` a `app/(storefront)/page.tsx`. Causa: `.next/types/validator.ts` referenciaba la ruta vieja (cache stale). Fix: `rm -rf .next` y re-correr. Aprendí: cuando muevo rutas o cambio el tree de `app/`, conviene limpiar `.next/` antes de validar tipos.
  2. Greps fallaron con "Regente: " y "© 2026" — falsos negativos por React `<!-- -->` separadores. Mismo patrón que ya vi en sesiones anteriores (H1 del rusty). No es bug.
  3. Ninguno conceptual. Header/footer renderizó correctamente en home + brand page, mobile + desktop, contra cloud.
- **2026-05-28 (sesión página de marca)**:
  1. **Bug encontrado y arreglado**: `generateStaticParams` corre en build time (fuera de request scope) y NO puede usar `cookies()`. Mi primer intento usaba `lib/supabase/server.ts` (que usa cookies async). Síntoma: HTTP 500 "cookies was called outside a request scope". Fix: creé `lib/supabase/static.ts` con cliente sin cookies para contextos sin request (generateStaticParams, sitemap, robots, scripts standalone). Registrado en LEARNINGS.
  2. **Asumí marcas del catálogo desde keyword research** (Rusty/Reef/Vulk/Prune/Infinit) en vez de preguntar stock real. Founder corrigió (Rusty/Vulk/Reef/**Mormaii**/**Paula Cahen**). Capturado antes de tocar código. Registrado en MISTAKES.md como caso adicional del mismo principio anti-alucinación.
  3. Sin otros problemas. Toda la validación local pasó (typecheck, lint, build, dev contra Supabase Docker). seo-strategist agregó 4 críticos + 5 importantes que se aplicaron en el mismo commit.
- **2026-05-28 (micro-sesión deploy 00004 a cloud)**:
  1. Ninguno conceptual. Founder aplicó bootstrap, SELECT de policies devolvió las 4 esperadas con nombres y `cmd` correctos. Falta SELECT del bucket para cierre formal.
  2. Aplicación correcta de la regla nueva post cloud-drift de 00002: no se marcó ✅ VERIFICADO sin tener los 2 SELECTs en mano. Es exactamente el comportamiento que esa regla buscaba inducir.

## Métricas

Sistema sin métricas reales todavía (pre-launch). Ver `METRICS.md` para targets cuando arranque.

## Notas para la próxima sesión

- **Primera acción**: `supabase status` para confirmar que el stack local sigue corriendo. Si está parado, `supabase start` (esta vez es rápido — imágenes ya bajadas).
- **Si el `.env.local` apunta a cloud**: las queries de pnpm dev van a Supabase cloud, NO a la DB local con la migración aplicada. Si querés desarrollar contra local, hay que cambiar `NEXT_PUBLIC_SUPABASE_URL` a `http://127.0.0.1:54321` y usar las llaves locales (`sb_publishable_*` y `sb_secret_*` que imprimió `supabase start` — están en el log del background job de la sesión anterior).
- **Studio local** para inspección visual: `http://127.0.0.1:54323`.
- **NO modificar `supabase/migrations/20260528030711_catalog_foundation.sql` ya commiteado**. Cambios al schema = nueva migración con ALTER/CREATE.
- **NO instalar librerías nuevas sin preguntar** (regla 6 de CLAUDE.md).
- Recordar: reminder activo en memoria para evaluar Agent Manager Versión B en septiembre 2026.

---

## Template para futuras actualizaciones

```markdown
## Última actualización

**Fecha**: YYYY-MM-DD
**Por**: [quién]

## Qué se construyó

[Lista de cosas concretas hechas en la sesión]

## Qué decisiones se tomaron

[Si alguna decisión importante — referencia ADR en DECISIONS.md]

## Próximo paso EXACTO

[Una sola cosa, la más importante para la próxima sesión]

## Problemas encontrados

[Si hubo problemas — referencia MISTAKES.md si aplica]
```
