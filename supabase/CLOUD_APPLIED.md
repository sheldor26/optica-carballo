# Supabase Cloud — Registro de migraciones aplicadas

Source of truth para saber qué hay aplicado en el proyecto cloud
(`tuddpfspnbnmafsqdvat.supabase.co`) vs lo que existe en `supabase/migrations/`.

Las migraciones en disco son la fuente de verdad del SCHEMA. Este archivo solo
trackea **qué de ese schema ya está propagado al cloud**, para evitar
re-aplicar o saltarse algo.

---

## Migraciones aplicadas a cloud

| Archivo | Aplicada al cloud | Cómo | Notas |
|---|---|---|---|
| `20260528030711_catalog_foundation.sql` | ✅ 2026-05-28 | SQL Editor del Dashboard (founder pegó manualmente) | Schema base del catálogo + RLS lectura pública para activos. |
| `20260528114114_identity_and_orders.sql` | ✅ 2026-05-28 (VERIFICADO con SELECT) | SQL Editor del Dashboard (re-aplicada con bootstrap 00002+00003) | Verificación post-aplicación: `public_tables=10`, lista incluye profiles, addresses, prescriptions, orders, order_items. |
| `20260528122727_order_number_generator.sql` | ✅ 2026-05-28 (VERIFICADO con SELECT) | SQL Editor del Dashboard (mismo bootstrap que 00002) | Verificación post-aplicación: 2 functions (`generate_order_number`, `set_order_number`), 1 trigger (`on_orders_set_number`), sequence en 1. |
| `20260528125415_prescriptions_storage.sql` | ✅ 2026-05-28 (VERIFICADO con SELECT) | SQL Editor del Dashboard (bootstrap 80 líneas) | Verificación post-aplicación: bucket `prescriptions` con `public=false`, `file_size_limit=10485760` (10 MB). 4 policies en `storage.objects` filtradas por `policyname LIKE 'prescriptions:%'`: read (SELECT), upload (INSERT), update (UPDATE), delete (DELETE). |
| `20260528142242_products_storage.sql` | ✅ 2026-05-28 (VERIFICADO con SELECT) | SQL Editor del Dashboard (bootstrap combinado idempotente) | Verificación post-aplicación: `products | products | true | 5242880`. Policy `products: anyone reads | SELECT`. |
| `20260528151158_reserve_stock_function.sql` | ✅ 2026-05-28 (VERIFICADO con SELECT) | SQL Editor del Dashboard (bootstrap combinado idempotente) | Verificación post-aplicación: 2 funciones presentes (`reserve_stock`, `increment_variant_stock`). SECURITY INVOKER + REVOKE anon/authenticated/PUBLIC + GRANT service_role. |
| `20260528160715_add_brand_name_to_order_items.sql` | ✅ 2026-05-28 (VERIFICADO con SELECT) | SQL Editor del Dashboard (bootstrap combinado idempotente) | Verificación post-aplicación: columna `brand_name` (type text) presente en `public.order_items`. Backfill desde products→brands sin filas afectadas (no hay data legacy). |
| `20260528170000_product_images_unique_path.sql` | ⏳ pendiente | Bug fix: dedupe de `product_images` (conservar la más antigua por product_id + storage_path) + ADD UNIQUE constraint (product_id, storage_path) para que ON CONFLICT funcione. Detectado tras feedback founder "cada vez que elijo una variante se me van sumando fotos". Causa raíz: seeds 03/07 usaban ON CONFLICT DO NOTHING sin target → cada re-ejecución insertaba duplicados. |
| `20260528180000_newsletter_subscribers.sql` | ✅ 2026-05-29 (confirmado por founder) | Tabla `newsletter_subscribers` para captura de leads (single opt-in iter 1). Email UNIQUE + CHECK formato + CHECK lowercase. RLS estricto: sin policies para anon/authenticated → solo `service_role` accede (todas las ops pasan por `createAdminClient()` desde server actions). Trigger `updated_at`. Newsletter signup operativo en producción tras esta aplicación. |
| `20260529000000_marketplace_integrations.sql` | ⏳ pendiente | Foundations integración ML (ver ADR-024). Tabla `marketplace_integrations` (tokens OAuth + estado) + columna `mercadolibre_item_id` en `product_variants` (UNIQUE deferrable) + tabla `marketplace_sync_errors` (logs). Todas las tablas con RLS estricto solo service_role. **No es bloqueante hasta Sprint 2 (OAuth flow)** — sin esta tabla aplicada, el código de Sprint 2 va a fallar al intentar guardar tokens. Aplicar antes de avanzar con Sprint 2 de la integración ML. |
| `20260529100000_brands_seo_text.sql` | ✅ 2026-05-29 (confirmado por founder) | ALTER TABLE brands ADD seo_intro TEXT + seo_outro TEXT (ambos nullable). Renderizado en `BrandCatalogPage` (intro bajo H1, outro al pie). Aplicado junto con seed 09 vía bootstrap concatenado. |
| `20260529200000_product_alerts.sql` | ✅ 2026-05-29 (confirmado por founder) | Sistema alertas precio + stock. ENUM `alert_type` ('price_drop'|'stock_back'|'both') + tabla `product_alerts` con baseline snapshot + unsubscribe_token + RLS strict (user solo ve propias) + UNIQUE constraints (no duplicar misma alerta) + trigger updated_at. CRON `/api/cron/check-alerts` activo en Vercel (hourly schedule). Env vars verificadas: CRON_SECRET, RESEND_API_KEY, RESEND_FROM_EMAIL. |
| `20260529300000_ml_variation_support.sql` | ✅ 2026-05-29 (confirmado por founder) | Soporte para listings ML con multi-variation (un MLA con N variants). DROP UNIQUE individual de `mercadolibre_item_id` + ADD column `mercadolibre_variation_code text` + nuevo UNIQUE composite `(mercadolibre_item_id, mercadolibre_variation_code) DEFERRABLE INITIALLY DEFERRED`. NULLs DISTINCT default Postgres → variantes sin mapping ML no chocan entre sí. Necesario para mapear 2+ variantes del mismo MLA (Vulk Day Light multi-color). |
| `20260529400000_marketplace_webhook_events.sql` | ✅ 2026-05-29 (confirmado por founder) | Tabla `marketplace_webhook_events` con id text PK (el `_id` de cada webhook ML) para idempotencia + topic, resource, status (processed/failed/ignored), payload jsonb, error_message. RLS strict (sin policies → solo service_role accede). Bloqueante para Sprint 2b webhook real — sin esto, webhooks duplicados de ML procesan venta 2 veces y stock baja doble. |
| `20260530000000_coupons.sql` | ✅ 2026-05-30 (confirmado por founder) | Sprint 4 sistema cupones. ENUM `coupon_type` (`percentage`/`fixed_amount`/`free_shipping`) + tabla `coupons` (con CHECK constraint para value-por-tipo) + tabla `coupon_redemptions` (tracking de uso por user) + columnas `coupon_id` + `coupon_code` en `orders` + RPC `increment_coupon_usage` (SECURITY DEFINER + GRANT solo service_role) + trigger updated_at + RLS strict (coupons sin policies → solo service_role; redemptions: users ven sus propias). Aplicado vía bootstrap junto con seed 14 y migration 20260530100000. |
| `20260530100000_normalize_frame_shapes_spanish.sql` | ✅ 2026-05-30 (confirmado por founder) | Fix bug latente del CTA del recomendador: UPDATE 3 valores de `attributes.frame_shape` para normalizar a español (aviator→aviador, round→redondo, square→cuadrado). DO block que NOTICE si quedan valores fuera del enum FRAME_SHAPES (Rusty Yau con `wraparound` queda como gap documentado para iter futura). Sin esto, Sprint IA-1 (grid de productos en recomendador) devolvía 0 productos para 3 de 6 shapes. Aplicado vía bootstrap junto con migration 20260530000000 + seed 14. |
| `20260530200000_brands_includes_image.sql` | ✅ 2026-05-30 (confirmado por founder) | ALTER TABLE brands ADD includes_image_path text + includes_image_alt text (ambos nullable). Permite asociar UNA imagen brand-wide del kit incluido (estuche+franela+stickers) que se renderiza automáticamente al final de la galería de PDP de TODOS los productos de esa marca, sin duplicar la foto en cada seed. Excepción per-producto vía `attributes.hide_brand_includes_image=true`. UI implementada vía helper `buildGalleryImages()` en `components/catalog/product-page.tsx` que inyecta la imagen brand al final del array de images antes de pasarla a `ProductGallery`. |
| `20260531000000_swipe_matches.sql` | ✅ 2026-05-31 (VERIFICADO vía MCP) | Tabla `swipe_matches` para Opción Y (Tinder de monturas). PK compuesto (user_id, product_slug) → idempotente, no duplica matches. RLS enabled, 3 policies (users_can_select_own_matches, users_can_insert_own_matches, users_can_delete_own_matches). Verificación post-aplicación (MCP `execute_sql`): `rls_enabled=true, policies_count=3, rows_count=5` (founder ya hizo 5 swipes en testing). Permite persistir matches del usuario logueado + sync automático desde localStorage al loguearse. |

## Seeds aplicados a cloud

| Archivo | Aplicada al cloud | Notas |
|---|---|---|
| `seeds/01_categories_brands.sql` | ✅ 2026-05-28 | 2 categorías top-level + 5 marcas reales. |
| `seeds/02_rusty_products.sql` | ✅ 2026-05-28 | 4 productos Rusty placeholder + 6 variantes. **Marcados `[PH]`** — reemplazar con data real. |
| `seeds/03_vulk_day_light.sql` | ✅ 2026-05-28 | **PRIMER PRODUCTO REAL**: Vulk Day Light (sol), slug `vulk-day-light`, variante única SKU 194185 (Carey Brillo / Verde), precio $88.037, stock 3. + 3 imágenes en bucket `products` con path `vulk-day-light/{01-lateral,02-frontal,03-medidas}.jpg`. Confirmado por founder: "Las fotos ya estan en el bucket y aplicado el sql de daylight". El archivo en disco fue actualizado después con copy V2 + callouts V2 + 2da variante para mantener consistencia futura. |
| `seeds/04_vulk_day_light_fixes.sql` | ✅ 2026-05-28 | UPDATE paths imágenes (`vulk-day-light/` → `vulk-day-light-sol/`) + cleanup JSONB attributes (sacar `interchangeable_lenses`, fix `frame_shape: rectangular`). Aplicado por founder. |
| `seeds/05_vulk_day_light_seo_polish.sql` | ✅ 2026-05-28 | UPDATE copy + meta v2 con keywords de Ubersuggest (cluster Vulk en SEO_STRATEGY.md). meta_title arranca con "Lentes de Sol Vulk" (1.300 vol/mes). Aplicado por founder. |
| `seeds/06_vulk_day_light_callouts.sql` | ✅ 2026-05-28 | UPDATE attributes.callouts con 3 callouts validados por optical-expert (info / recommendation / tip), cada uno con `position` y ~250 chars (tweet length). Aplicado por founder. |
| `seeds/07_vulk_day_light_variant_rosa.sql` | ✅ 2026-05-28 | UPDATE description del modelo a genérica (sin colores) + UPDATE variant_id de fotos viejas a la variante Carey + INSERT 2da variante Rosa Pálido (SKU 194180, $88.037, stock 3 confirmado por founder) + INSERT 2 imágenes nuevas. Aplicado por founder. ⚠️ **Verificar que founder subió `04-lateral-rosa.jpg` y `05-frontal-rosa.jpg` al bucket Storage** — sin esos archivos las imágenes de la variante rosa devuelven 404. |
| `seeds/09_brands_seo_text.sql` | ✅ 2026-05-29 (confirmado por founder) | UPDATE 5 marcas con copy SEO largo: `seo_intro` (150-300 palabras, render bajo H1) + `seo_outro` (80-150 palabras, render al pie). Aplicado junto con migración `20260529100000` vía bootstrap concatenado. |
| `seeds/10_rusty_yau.sql` | ✅ 2026-05-29 (confirmado por founder) | Primer producto importado desde Mercado Libre (MLA1432137395 Tienda Oficial OPTICACARBALLO 260502). Rusty Yau anteojos deportivos 2 en 1 (lentes polarizadas + amarillas intercambiables). 1 producto + 1 variante SKU 126080 (Negro Mate) + 3 imágenes en bucket `products/rusty-yau/`. frame_shape='wraparound' (nuevo valor agregado a FRAME_SHAPE_LABELS), measurements completas (135/66/45/16/120mm). GAP pendiente: weight_grams. Item ML mapeado vía `mercadolibre_item_id='MLA1432137395'`. Slug refactoreado pre-apply de `rusty-yau-polarizado` → `rusty-yau` para mantener compatibilidad con variantes futuras (espejadas, otros colores). Slug zombie eliminado del cloud con DELETE explícito tras refactor. |
| `seeds/11_vulk_day_light_ml_mapping.sql` | ✅ 2026-05-29 (confirmado por founder) | UPDATE de las 2 variantes Vulk Day Light con `mercadolibre_item_id='MLA2726903920'` + `mercadolibre_variation_code` distinto (Carey 194185 → SDEMI/DRWG15C3, Rosa 194180 → LPINK/DRT25). Requirió migration `20260529300000_ml_variation_support.sql` aplicada antes (DROP UNIQUE individual + UNIQUE composite). Sin este mapping, Sprint 2b ML no puede sincronizar stock de Vulk Day Light. |
| `seeds/12_vulk_day_light_variants_mblk_brown.sql` + ad-hoc fixes | ✅ 2026-05-30 (confirmado por founder) | INSERT 2 variantes nuevas Vulk Day Light: SKU 194182 (MBLK Negro mate, 5 stock) + SKU 194187 (BROWN Marrón, 0 stock) + 5 imágenes (3 MBLK incluyendo modelo + 2 BROWN). mercadolibre_variation_code parseado del DESIGN attribute (no seller_custom_field que era null). Después múltiples UPDATEs ad-hoc para fixear iters: (a) swap primary lateral/frontal en MBLK/BROWN, (b) sort_order modelo 2→3 para que quede en posición 4 oculta, (c) normalizar sort_order Rosa 3→0 y 4→1 para que algoritmo simplificado de sorting funcione correctamente. Orden final visual: Carey/Rosa/BROWN = lateral/frontal/medidas, MBLK = lateral/frontal/medidas + flecha → modelo. |
| `seeds/14_coupons_iniciales.sql` | ✅ 2026-05-30 (confirmado por founder) | 3 cupones iniciales del Sprint 4: `BIENVENIDA10` (10% percentage, cap descuento $10.000, per_user_limit 1) + `NEWSLETTER5K` ($5.000 fixed_amount, mínimo subtotal $50.000) + `ENVIOGRATIS` (type free_shipping). Aplicado vía bootstrap junto con migrations 20260530000000 + 20260530100000. Founder puede editar/agregar/desactivar desde Supabase Dashboard → Table Editor → coupons. |
| `seeds/15_rusty_yau_mblue_revo_green_pol.sql` | ✅ 2026-05-30 (confirmado por founder) | Variante nueva Rusty Yau SKU 126082 (MBLUE/R. GREEN POL - YELLOW). UPDATE producto con adaptador receta. Verificado vía curl: fotos 06-revo-green-lateral.jpg y 07-revo-green-frontal.jpg presentes en HTML producción. |
| `seeds/16_vulk_yamain.sql` | ✅ 2026-05-30 (VERIFICADO vía MCP) | Vulk Yamain (sol) — 3 variantes (Cry, MBLK, SBLK) + 7 imágenes (6 variante + 1 medidas modelo). Verificación MCP: producto activo, variants=3, images=7. |
| `seeds/17_vulk_brand_includes_image.sql` | ✅ 2026-05-30 (VERIFICADO vía MCP) | UPDATE brands SET includes_image_path para marca `vulk` → `vulk-estuche-franela.jpg`. Habilita auto-inyección de imagen del kit en galería PDP de todos los productos Vulk. Verificación MCP: `vulk.includes_image_path='vulk-estuche-franela.jpg'`. |
| `seeds/18_fix_vulk_brand_image_path.sql` | ✅ 2026-05-30 (confirmado vía MCP) | Fix path imagen brand vulk si quedó con prefijo erróneo. Idempotente, sin efecto si seed 17 quedó correcto. |
| `seeds/19_vulk_yamain_frame_shape_cat_eye.sql` | ✅ 2026-05-30 (confirmado por founder) | UPDATE attributes.frame_shape Vulk Yamain → `cat_eye`. Forma específica del modelo (no rectangular como decía seed 16). |
| `seeds/20_vulk_stray.sql` | ✅ 2026-05-30 (VERIFICADO vía MCP) | Vulk Stray (sol) — producto base + variantes iniciales. Producto multi-variante. |
| `seeds/21_vulk_stray_complete.sql` | ✅ 2026-05-30 (VERIFICADO vía MCP) | Completado Vulk Stray con variantes + imágenes finales. Resultado: 5 variantes + 11 imágenes en cloud. |
| `seeds/22_vulk_stray_rename_variants_callouts.sql` | ✅ 2026-05-30 (confirmado por founder) | UPDATE nombres de variantes Stray + reescritura callouts post-feedback founder. |
| `seeds/23_rusty_feeled_mblk_tennis.sql` | ✅ 2026-05-31 (VERIFICADO vía MCP) | Rusty Feeled MBLK TENNIS (sol deportivo tenis). Single variant SKU 960161 ($75.010,75, stock 12) + 3 imágenes en bucket `products/rusty-feeled/`. Discrepancia medidas resuelta: 50mm según sitio oficial Rusty (vs 63mm que decía ML). Verificación MCP: producto activo, variants=1, images=3. |
| `seeds/24_rusty_dearly.sql` | ✅ 2026-05-31 (VERIFICADO vía MCP) | Rusty Dearly (cuadrado femenino G-Flex). 3 variantes (SKU 960202 rosa caramelo $75.010,75 stock 8, 960203 marrón brillo $75.010,75 stock 14, 960200 negro brillo POL $85.904,01 stock 6) + 7 imágenes en bucket `products/rusty-dearly/` (6 variante + 1 esquema técnico). Datos extraídos por MCP/asistente vía `/api/admin/ml-import-preview/` (2 ítems ML: MLA1930366688 multi-variation + MLA2086807302 single). Verificación MCP: producto activo, variants=3, images=7, 7 fotos en bucket. |
| `seeds/25_rusty_dearly_description_fix.sql` | ✅ 2026-05-31 (VERIFICADO vía MCP) | UPDATE description del producto `rusty-dearly`: (1) bisagras honestas (sacar "sin tornillos diminutos que se aflojan" — el Dearly SÍ tiene tornillos, regla dura negocio #3) + (2) formato bullets variantes (separar título de cuerpo con `\n` + mayúscula inicial). Verificación MCP: `bisagras_check='OK_HONESTO'`, `bullets_check='OK_MAYUSCULA'`, `updated_at='2026-05-31 13:10:01 UTC'`. |
| `seeds/16_vulk_yamain.sql` | ✅ 2026-05-30 (confirmado por founder) | NUEVO producto Vulk Yamain con 3 variantes (CRY 127100, MBLK 127101, SBLK 127104 polarizada). Verificado vía curl: aparece en `/anteojos-de-sol/vulk` + 7 fotos en bucket. |
| `seeds/17_vulk_brand_includes_image.sql` | ✅ 2026-05-30 (aplicado pero path desactualizado tras crear bucket separado) | Versión original con path `brands-shared/vulk-estuche-franela.jpg` asumiendo carpeta dentro del bucket `products`. Founder creó BUCKET SEPARADO `brands-shared` y subió ahí. Path superseded por seed 18 que pone solo el filename. |
| `seeds/18_fix_vulk_brand_image_path.sql` | ✅ 2026-05-30 (confirmado por founder, verificado vía curl HTML producción muestra `brands-shared/vulk-estuche-franela.jpg`) | UPDATE correctivo: `brands.includes_image_path = 'vulk-estuche-franela.jpg'` (solo filename, sin prefijo). Frontend construye URL apuntando al bucket `brands-shared`. |
| `seeds/19_vulk_yamain_frame_shape_cat_eye.sql` | ✅ 2026-05-30 (confirmado por founder) | UPDATE attributes.frame_shape de Vulk Yamain de `oval` → `cat_eye`. Solo en DB local. |
| `seeds/20_vulk_stray.sql` | ✅ 2026-05-30 (confirmado founder, verificado curl HTML producción muestra vulk-stray + 8 fotos bucket HTTP 200) | NUEVO producto Vulk Stray (categoría anteojos-de-receta). 4 variantes iniciales: MBLK 126890, SBLK 126891, 663 126898, MDEMI-MBLK 126899. Precio $93.000 uniforme. ML lista como filtro luz azul pero vendemos solo armazón. |
| `seeds/21_vulk_stray_complete.sql` | ✅ 2026-05-30 (confirmado founder, verificado fotos CRY 10/11 HTTP 200) | UPDATE producto con measurements 144/50/46/20/145 + attributes completos + INSERT 5ta variante CRY 126892. Total final: 5 variantes, 11 fotos. |
| `seeds/22_vulk_stray_rename_variants_callouts.sql` | ✅ 2026-05-30 (confirmado founder, verificado curl HTML producción: negro-brillo + carey-mate + 3 callouts) | 2 cambios Vulk Stray: (a) Rename frame_color de 2 variantes — SBLK 126891 negro-satinado→negro-brillo, MDEMI-MBLK 126899 demi-negro-mate→carey-mate-y-negro-mate. SOLO display local — NO afecta sync ML. (b) UPDATE producto: agregar 3 callouts variados (info G-Flex origen / recommendation color por estilo / tip cuidado cristales). |

## Cleanups aplicados a cloud

| Archivo | Aplicada al cloud | Notas |
|---|---|---|
| `cleanup/20260530_delete_rusty_placeholders.sql` | ✅ 2026-05-30 (confirmado por founder) | Eliminados los 4 productos `[PH]` placeholder de Rusty del seed 02 viejo: `rusty-wayfarer-classic-sol`, `rusty-aviator-pilot-sol`, `rusty-redondo-vintage-rx`, `rusty-square-modern-rx`. FK CASCADE se encargó de variants/images/alerts. order_items.product_id queda SET NULL si alguien compró un PH (no debería). Único producto Rusty real post-cleanup: `rusty-yau`. |
| `cleanup/20260530_wraparound_to_envolvente.sql` | ✅ 2026-05-30 (confirmado por founder) | Completar normalización ES iniciada en migration `20260530100000`: UPDATE rusty-yau `frame_shape: wraparound` → `envolvente` (término argentino correcto). Enum FRAME_SHAPES expandido para incluir 'envolvente'. Labels actualizados en `product-attributes.tsx`, `frame-shape-filters.tsx`, `face-shape/copy.ts`. DO block verifica que todos los frame_shape estén dentro del enum tras el cleanup. |

---

## Cómo actualizar este registro

Cuando se crea una migración nueva:

1. Se desarrolla y aplica en local (`supabase db reset` para validar smoke tests).
2. Cuando está verde, se regenera un bootstrap derivado:
   ```bash
   cp supabase/migrations/<timestamp>_<nombre>.sql supabase/cloud-bootstrap.sql
   ```
   (O concatena varios si se aplican juntos.)
3. Founder pega `supabase/cloud-bootstrap.sql` en el SQL Editor del Dashboard.
4. Founder dice "cloud aplicado".
5. Asistente:
   - Agrega fila a la tabla de arriba (✅ con fecha + nombre del archivo).
   - **Borra** `supabase/cloud-bootstrap.sql` (es derivado, se regenera).
6. Commit.

`supabase/cloud-bootstrap.sql` está en `.gitignore` precisamente porque es
derivado, transitorio, y se borra después de aplicar.

## Cómo verificar manualmente qué hay en cloud

Desde el Dashboard:
- SQL Editor → consulta `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`
- Comparar con la lista esperada de las migraciones aplicadas arriba.

Vía CLI (requiere `supabase link --project-ref tuddpfspnbnmafsqdvat`):
- `supabase db diff` muestra diferencias entre local y cloud.
