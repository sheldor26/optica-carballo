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

## Seeds aplicados a cloud

| Archivo | Aplicada al cloud | Notas |
|---|---|---|
| `seeds/01_categories_brands.sql` | ✅ 2026-05-28 | 2 categorías top-level + 5 marcas reales. |
| `seeds/02_rusty_products.sql` | ✅ 2026-05-28 | 4 productos Rusty placeholder + 6 variantes. **Marcados `[PH]`** — reemplazar con data real. |
| `seeds/03_vulk_day_light.sql` | ✅ 2026-05-28 | **PRIMER PRODUCTO REAL**: Vulk Day Light (sol), slug `vulk-day-light`, variante única SKU 194185 (Carey Brillo / Verde), precio $88.037, stock 3. + 3 imágenes en bucket `products` con path `vulk-day-light/{01-lateral,02-frontal,03-medidas}.jpg`. Confirmado por founder: "Las fotos ya estan en el bucket y aplicado el sql de daylight". El archivo en disco fue actualizado después con copy V2 + callouts V2 + 2da variante para mantener consistencia futura. |
| `seeds/04_vulk_day_light_fixes.sql` | ⏳ pendiente | UPDATE paths imágenes (`vulk-day-light/` → `vulk-day-light-sol/`) + cleanup JSONB attributes (sacar `interchangeable_lenses`, fix `frame_shape: rectangular`). Founder aplica en SQL Editor. |
| `seeds/05_vulk_day_light_seo_polish.sql` | ⏳ pendiente | UPDATE copy + meta v2 con keywords de Ubersuggest (cluster Vulk en SEO_STRATEGY.md). meta_title arranca con "Lentes de Sol Vulk" (1.300 vol/mes). |
| `seeds/06_vulk_day_light_callouts.sql` | ⏳ pendiente | UPDATE attributes.callouts con 3 callouts validados por optical-expert (info / recommendation / tip), cada uno con `position` y ~250 chars (tweet length). |
| `seeds/07_vulk_day_light_variant_rosa.sql` | ⏳ pendiente | UPDATE description del modelo a genérica (sin colores) + UPDATE variant_id de fotos viejas a la variante Carey + INSERT 2da variante Rosa Pálido (SKU 194180, $88.037, stock 3 placeholder) + INSERT 2 imágenes nuevas. Founder debe subir `04-lateral-rosa.jpg` y `05-frontal-rosa.jpg` al bucket ANTES de aplicar. |

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
