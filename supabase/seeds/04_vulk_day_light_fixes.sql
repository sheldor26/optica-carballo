-- ============================================
-- Seed 04: Fixes en Vulk Day Light tras feedback visual del founder
-- Fecha: 2026-05-28
-- ============================================
-- Problemas detectados al ver el producto LIVE:
-- (1) Imágenes rotas: bucket tiene carpeta `vulk-day-light-sol/` pero el
--     seed 03 inserta paths `vulk-day-light/`. Fix: alinear los paths
--     en product_images con la realidad del bucket.
-- (2) Founder pide sacar "Las lentes son intercambiables" — frase mal
--     formulada. Fix: regenerar description sin esa frase y sin las
--     medidas en el párrafo (van en tabla aparte ahora).
-- (3) Founder pide attributes.frame_shape = "rectangular" (era
--     "rectangular-small") para que matchee con el mapping de labels.
-- (4) Sacar attributes.interchangeable_lenses (no era preciso).
-- ============================================

BEGIN;

-- Fix 1: corregir paths de imágenes (alinear con bucket real)
UPDATE public.product_images
SET storage_path = REPLACE(storage_path, 'vulk-day-light/', 'vulk-day-light-sol/'),
    updated_at = now()
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'vulk-day-light')
  AND storage_path LIKE 'vulk-day-light/%';

-- Fix 2: regenerar description sin "intercambiables" y sin medidas en párrafo
-- Fix 3: frame_shape → "rectangular"
-- Fix 4: sacar interchangeable_lenses del JSONB
UPDATE public.products
SET
  description = E'Los Vulk Day Light son anteojos de sol unisex de estilo rectangular pequeño, pensados para uso diario en ciudad, manejo y exteriores. El armazón y las patillas están fabricados en G-Flex, un termoplástico flexible patentado por Vulk: liviano, resistente a torsiones y se adapta mejor al rostro sin perder forma. Pesan apenas 26.1 gramos.\n\nLas lentes son polarizadas, lo que reduce los reflejos molestos del agua, la ruta y superficies vidriadas, e implica protección UV total. Tener en cuenta: con lentes polarizadas algunas pantallas LCD (GPS, tableros de auto, cajeros) pueden verse oscurecidas o con patrones de colores según el ángulo.\n\nLas bisagras son de plástico reforzado. Variante disponible: armazón Carey Brillo con lentes verdes.',
  attributes = (attributes - 'interchangeable_lenses') || '{"frame_shape": "rectangular"}'::jsonb,
  updated_at = now()
WHERE slug = 'vulk-day-light';

COMMIT;
