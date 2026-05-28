-- ============================================
-- Seed 07: 2da variante Vulk Day Light — Rosa Pálido / Gris Degradé
-- Fecha: 2026-05-28
-- ============================================
-- Cambios:
-- 1. UPDATE products: descripción y short_description GENÉRICAS del
--    modelo (sin mencionar colores específicos de variantes).
--    Founder señaló que no podemos hablar de "carey brillo con
--    lentes verdes" en la descripción general porque ahora hay más
--    de una variante.
-- 2. UPDATE product_images: las 2 fotos existentes de Carey Brillo
--    (01-lateral.jpg, 02-frontal.jpg) pasan a tener variant_id de
--    la variante Carey (SKU 194185). El esquema técnico
--    (03-medidas.jpg) sigue con variant_id NULL porque aplica a
--    ambas variantes. Esto permite que la gallery filtre por
--    variante seleccionada.
-- 3. INSERT variante 2 (SKU 194180, Rosa Pálido + Caramelo / Gris
--    Oscuro Degradé). Precio: $88.037. Stock: 3 (placeholder,
--    confirmar con founder).
-- 4. INSERT 2 imágenes nuevas para la variante rosa (lateral 3/4 +
--    frontal). Founder sube los archivos al bucket en
--    vulk-day-light-sol/04-lateral-rosa.jpg y 05-frontal-rosa.jpg
--    antes de aplicar este seed.
-- ============================================

BEGIN;

-- =====================================================================
-- 1. Description y short_description genéricas del modelo
-- =====================================================================
UPDATE public.products
SET
  short_description = 'Anteojos de sol Vulk Day Light polarizados, armazón rectangular pequeño en G-Flex. Liviano, unisex, ideal para uso urbano.',
  description = E'Los lentes de sol Vulk Day Light son un rectangular pequeño pensado para quien busca un anteojo discreto, prolijo y con buen agarre al rostro. Diseño unisex, líneas limpias y un peso de 26,1 gramos que casi no se siente durante el día.\n\nEl armazón está hecho en G-Flex, el termoplástico patentado por Vulk: flexible, resistente a torsiones y a los apretones del bolsillo. Las patillas acompañan el movimiento sin perder firmeza, y las bisagras reforzadas aguantan el uso diario. Funciona tanto para manejar como para caminar la ciudad o moverte al aire libre.\n\nLas lentes polarizadas cortan los reflejos del asfalto, el agua y los vidrios, y suman protección UV total. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD del tablero del auto, GPS o cajeros pueden verse oscurecidas o con efecto arcoíris según el ángulo. Es propio del polarizado, no un defecto.\n\nSe entrega con su estuche original de Vulk. Stock real en Óptica Carballo, con asesoramiento técnico matriculado.',
  updated_at = now()
WHERE slug = 'vulk-day-light';

-- =====================================================================
-- 2. Las fotos existentes (carey) ahora pertenecen a la variante Carey
-- =====================================================================
UPDATE public.product_images
SET
  variant_id = (SELECT id FROM public.product_variants WHERE sku = '194185'),
  updated_at = now()
WHERE
  product_id = (SELECT id FROM public.products WHERE slug = 'vulk-day-light')
  AND storage_path IN (
    'vulk-day-light-sol/01-lateral.jpg',
    'vulk-day-light-sol/02-frontal.jpg'
  )
  AND variant_id IS NULL;
-- El esquema de medidas (03-medidas.jpg) mantiene variant_id NULL
-- porque aplica a las 2 variantes del modelo.

-- =====================================================================
-- 3. INSERT variante Rosa Pálido
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
  '194180',
  '{
    "frame_color": "rosa-palido-caramelo",
    "lens_color": "gris-oscuro-degrade",
    "reference_code": "L.PINK/DRT-25 POL."
  }'::jsonb,
  8803700,
  3,
  true,
  2
)
ON CONFLICT (sku) DO UPDATE SET
  attributes  = EXCLUDED.attributes,
  price_cents = EXCLUDED.price_cents,
  stock_qty   = EXCLUDED.stock_qty,
  updated_at  = now();

-- =====================================================================
-- 4. INSERT 2 imágenes nuevas para la variante Rosa Pálido
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194180'),
    'vulk-day-light-sol/04-lateral-rosa.jpg',
    'Vulk Day Light vista lateral 3/4, armazón rosa pálido y caramelo con lentes gris oscuro degradé',
    1500, 1500, 3, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194180'),
    'vulk-day-light-sol/05-frontal-rosa.jpg',
    'Vulk Day Light vista frontal, armazón rosa pálido transparente con lentes gris oscuro degradé',
    1500, 1500, 4, false
  )
ON CONFLICT DO NOTHING;

COMMIT;
