-- ============================================
-- Seed 18: Fix path imagen brand-wide kit Vulk
-- Fecha: 2026-05-30
-- ============================================
-- El seed 17 puso `includes_image_path = 'brands-shared/vulk-estuche-franela.jpg'`
-- asumiendo path dentro del bucket `products`. Pero founder creó un BUCKET
-- SEPARADO llamado `brands-shared` y subió la imagen ahí.
--
-- Nueva convención: `brands.includes_image_path` contiene SOLO el nombre del
-- archivo dentro del bucket `brands-shared`. El frontend construye la URL
-- completa apuntando explícitamente al bucket `brands-shared`.
--
-- Imagen verificada en producción:
--   https://tuddpfspnbnmafsqdvat.supabase.co/storage/v1/object/public/brands-shared/vulk-estuche-franela.jpg
--   → HTTP 200 ✓
-- ============================================

UPDATE public.brands
SET
  includes_image_path = 'vulk-estuche-franela.jpg',
  updated_at          = now()
WHERE slug = 'vulk';

-- Verificación:
-- SELECT slug, includes_image_path FROM brands WHERE slug='vulk';
-- Esperado: includes_image_path = 'vulk-estuche-franela.jpg'
