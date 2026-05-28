-- ============================================================================
-- Migración 00005 — Products Storage Bucket + RLS policies
-- Fecha: 2026-05-28
-- ============================================================================
-- Crea bucket público `products` para imágenes de productos del catálogo.
-- Público porque:
--   - Las fotos de producto no son datos sensibles.
--   - Permite servirlas vía CDN/cache sin signed URLs.
--   - Compatible directo con `next/image` (URLs absolutas estables).
--
-- Path pattern sugerido (no enforced por DB):
--   <brand_slug>/<product_slug>/<variant_sku_o_seq>.<ext>
--
-- Acceso:
--   - Lectura: pública (cualquiera con la URL puede ver).
--   - Escritura/Update/Delete: solo service_role (admin server actions o
--     Supabase Studio del founder). Anon y authenticated NO pueden modificar.
-- ============================================================================

BEGIN;

-- =====================================================================
-- 1. Crear bucket (idempotente)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,                          -- público
  5 * 1024 * 1024,               -- 5 MB max por imagen (suficiente para fotos optimizadas)
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 2. RLS policies sobre storage.objects
-- =====================================================================
-- Lectura: pública. Aunque el bucket sea `public=true`, las policies de
-- storage.objects siguen aplicando — necesitamos una SELECT explícita para
-- todos los roles (anon + authenticated).
CREATE POLICY "products: anyone reads"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'products');

-- Escritura: NO se crea policy para INSERT/UPDATE/DELETE — sin policy,
-- ni anon ni authenticated pueden modificar. Solo service_role (que
-- bypassa RLS) puede subir/borrar, vía:
--   - Server actions con createAdminClient.
--   - Supabase Studio (Dashboard del founder).
-- Esto evita que un user logueado suba o borre imágenes desde el browser.

COMMIT;
