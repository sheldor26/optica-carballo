-- ============================================
-- Seed 17: UPDATE brand Vulk con includes_image_path
-- Fecha: 2026-05-30
-- ============================================
-- Asocia la imagen brand-wide del kit Vulk (estuche cuero + franela
-- microfibra + stickers de marca) a la marca Vulk. La imagen se renderiza
-- automáticamente al final de la galería de PDP de TODOS los productos
-- Vulk.
--
-- PREREQUISITO: migration `20260530200000_brands_includes_image.sql`
-- aplicada al cloud (ALTER TABLE brands ADD includes_image_path,
-- includes_image_alt).
--
-- PREREQUISITO: founder subió la imagen al bucket `products` con path:
--   brands-shared/vulk-estuche-franela.jpg
--
-- Verificar antes de aplicar:
--   SELECT name FROM storage.objects
--   WHERE bucket_id='products' AND name='brands-shared/vulk-estuche-franela.jpg';
-- ============================================

UPDATE public.brands
SET
  includes_image_path = 'brands-shared/vulk-estuche-franela.jpg',
  includes_image_alt  = 'Vulk kit incluido: estuche de cuero, franela de microfibra y stickers de marca',
  updated_at          = now()
WHERE slug = 'vulk';

-- Verificación:
-- SELECT slug, includes_image_path, includes_image_alt FROM brands WHERE slug='vulk';
