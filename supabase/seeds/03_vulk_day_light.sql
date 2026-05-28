-- ============================================
-- Seed 03: 1er producto REAL de Óptica Carballo — Vulk Day Light (sol)
-- Fecha: 2026-05-28
-- ============================================
-- Datos confirmados por founder. Copy generado por content-writer-medical,
-- meta_title + meta_description optimizados por seo-strategist
-- (60 chars title con keyword frase, description con trust signal de
-- técnico óptico matriculado en vez de "G-Flex" sin volumen).
-- Slug definitivo: vulk-day-light (sin sufijo -sol redundante con
-- la categoría parent).
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base
-- =====================================================================
WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (
    SELECT id FROM public.categories
    WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL
  )
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM vulk),
  (SELECT id FROM sol),
  'vulk-day-light',
  'Vulk Day Light',
  'Anteojos de sol unisex con armazón rectangular pequeño en G-Flex, lentes polarizadas verdes y bisagras reforzadas. Livianos: 26.1 gramos.',
  E'Los Vulk Day Light son anteojos de sol unisex de estilo rectangular pequeño, pensados para uso diario en ciudad, manejo y exteriores. El armazón y las patillas están fabricados en G-Flex, un termoplástico flexible patentado por Vulk: liviano, resistente a torsiones y se adapta mejor al rostro sin perder forma. Pesan apenas 26.1 gramos.\n\nLas lentes son polarizadas, lo que reduce los reflejos molestos del agua, la ruta y superficies vidriadas, e implica protección UV total. Tener en cuenta: con lentes polarizadas algunas pantallas LCD (GPS, tableros de auto, cajeros) pueden verse oscurecidas o con patrones de colores según el ángulo.\n\nLas lentes son intercambiables y las bisagras son de plástico reforzado. Medidas: frente 140mm, lente 51x31mm, puente 20mm, varilla 140mm. Variante disponible: armazón Carey Brillo con lentes verdes.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "rectangular-small",
    "lens_treatment": ["polarized", "uv400"],
    "gender": "unisex",
    "weight_grams": 26.1,
    "interchangeable_lenses": true,
    "hinge_material": "reinforced-plastic",
    "measurements": {
      "frame_width_mm": 140,
      "lens_width_mm": 51,
      "lens_height_mm": 31,
      "bridge_mm": 20,
      "temple_length_mm": 140
    }
  }'::jsonb,
  true,
  true,
  'Anteojos de Sol Vulk Day Light Polarizados | Óptica Carballo',
  'Anteojos de sol Vulk Day Light unisex con lentes polarizadas verdes. Stock real, asesoramiento de técnico óptico matriculado y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  short_description = EXCLUDED.short_description,
  description       = EXCLUDED.description,
  attributes        = EXCLUDED.attributes,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  is_featured       = EXCLUDED.is_featured,
  updated_at        = now();

-- =====================================================================
-- Variante única (Carey Brillo / Verde) — datos REALES del founder
-- precio: $88.037 → 8803700 centavos
-- stock: 3 unidades
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
  '194185',
  '{
    "frame_color": "carey-brillo",
    "lens_color": "verde",
    "reference_code": "SDEMI-DRWG 15C3 POL."
  }'::jsonb,
  8803700,
  3,
  true,
  1
)
ON CONFLICT (sku) DO UPDATE SET
  attributes  = EXCLUDED.attributes,
  price_cents = EXCLUDED.price_cents,
  stock_qty   = EXCLUDED.stock_qty,
  updated_at  = now();

-- =====================================================================
-- Imágenes (3 archivos en el bucket "products")
-- Path canónico: vulk-day-light/<filename>
-- ⚠️ Founder sube los 3 archivos vía Supabase Dashboard antes de
--    aplicar este seed (sino los Image components devuelven 404).
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    NULL,
    'vulk-day-light/01-lateral.jpg',
    'Vulk Day Light anteojos de sol vista lateral 3/4, armazón carey brillo con patilla negra',
    1500, 1500, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    NULL,
    'vulk-day-light/02-frontal.jpg',
    'Vulk Day Light anteojos de sol vista frontal, armazón rectangular pequeño carey brillo',
    1500, 1500, 1, false
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    NULL,
    'vulk-day-light/03-medidas.jpg',
    'Esquema técnico de medidas Vulk Day Light: frente 140mm, lente 51x31mm, puente 20mm, varilla 140mm',
    1500, 1500, 2, false
  )
ON CONFLICT DO NOTHING;

COMMIT;
