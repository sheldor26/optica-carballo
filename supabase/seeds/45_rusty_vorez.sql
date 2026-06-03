-- ============================================
-- Seed 45: Rusty Vorez (sol) — cuadrado femenino, G-Flex
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol femenino de diseño cuadrado. Armazón G-Flex, bisagras
-- plásticas. Lentes de policarbonato UV400 categoría 3. Liviano (25,5 g).
-- 1 de 2 variantes polarizada (solo SBLK/S10) → producto lens_treatment ["uv400"].
--
-- 2 variantes en 2 MLAs (publicaciones simples). Stock=ML:
--   SKU 128861 — M.ROSE/HGB1  rosa pálido translúcido + lente marrón degradé. MLA2052436076. $69.808,65, stock 5 (activa, mayor stock → primary).
--   SKU 128862 — SBLK/S10 POL negro brillo + gris oscuro.                      MLA2007542724. $76.500, stock 0 (pausada). POLARIZADA.
--
-- Medidas: 141 / 51x52 / 17 / 145 mm. Peso 25,5 g.
--
-- 📸 FOTOS (bucket products/rusty-vorez/, nombres reales verificados HTTP 200,
-- prefijo AGALERIA en los frentes + casing inconsistente respetados):
--   VOREZ GALERIA-WEB-MROSE-HGB1 Perfil.jpg / VOREZ AGALERIA-WEB-MROSE-HGB1 frente.jpg  (M.ROSE — perfil primary del modelo)
--   VOREZ GALERIA-WEB-SBLK-S10-POL perfil.jpg / VOREZ AGALERIA-WEB-SBLK-S10-POL frente.jpg
--   medidas.jpg
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-vorez', 'Rusty Vorez',
  'Anteojos de sol femeninos Rusty Vorez: diseño cuadrado, armazón G-Flex liviano con bisagras plásticas y lentes de policarbonato UV400 categoría 3.',
  E'Los Rusty Vorez son anteojos de sol femeninos de diseño cuadrado, modernos y favorecedores. El armazón es de G-Flex —un material liviano y flexible que no marca ni lastima— con bisagras plásticas. Con solo 25,5 gramos son cómodos para todo el día.\n\nLas lentes son de policarbonato con protección UV400 categoría 3 (100% contra rayos UVA y UVB), ideales para días de sol fuerte.\n\nDisponible en 2 variantes:\n\n• M.ROSE/HGB1 (SKU 128861): armazón rosa pálido translúcido con lente marrón degradé.\n• SBLK/S10 POL (SKU 128862): negro brillo con lente gris oscuro POLARIZADA — elimina los reflejos del asfalto y el agua.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "female",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 51, "lens_height_mm": 52, "bridge_mm": 17, "temple_length_mm": 145},
    "weight_grams": 26,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado femenino y liviano", "body": "El diseño cuadrado estiliza y es tendencia. El armazón de G-Flex es liviano (25,5 g) y flexible, con bisagras plásticas."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la SBLK/S10 es la POLARIZADA (elimina reflejos). La M.ROSE rosa pálido translúcido con lente marrón degradé es la opción más delicada y de moda."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2052436076", "MLA2007542724"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Vorez Anteojos de Sol Cuadrados Mujer G-Flex | Óptica Carballo',
  'Anteojos Rusty Vorez femeninos cuadrados: armazón G-Flex liviano, policarbonato UV400. 2 variantes (una polarizada). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-vorez'), '128861',
   '{"frame_color":"rosa-palido-translucido","lens_color":"marron-degrade","model_code":"M.ROSE/HGB1","polarized":false}'::jsonb,
   6980865, 5, true, 1, 'MLA2052436076', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-vorez'), '128862',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10","polarized":true}'::jsonb,
   7650000, 0, true, 2, 'MLA2007542724', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: M.ROSE perfil (mayor stock). Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-vorez'), (SELECT id FROM public.product_variants WHERE sku='128861'),
   'rusty-vorez/VOREZ GALERIA-WEB-MROSE-HGB1 Perfil.jpg', 'Anteojo de sol Rusty Vorez cuadrado vista lateral, armazón rosa pálido translúcido con lente marrón degradé', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-vorez'), (SELECT id FROM public.product_variants WHERE sku='128861'),
   'rusty-vorez/VOREZ AGALERIA-WEB-MROSE-HGB1 frente.jpg', 'Anteojo de sol Rusty Vorez cuadrado vista frontal, armazón rosa pálido translúcido con lente marrón degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-vorez'), (SELECT id FROM public.product_variants WHERE sku='128862'),
   'rusty-vorez/VOREZ GALERIA-WEB-SBLK-S10-POL perfil.jpg', 'Anteojo de sol Rusty Vorez cuadrado vista lateral, negro brillo con lente gris oscuro polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-vorez'), (SELECT id FROM public.product_variants WHERE sku='128862'),
   'rusty-vorez/VOREZ AGALERIA-WEB-SBLK-S10-POL frente.jpg', 'Anteojo de sol Rusty Vorez cuadrado vista frontal, negro brillo con lente gris oscuro polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-vorez'), NULL,
   'rusty-vorez/medidas.jpg', 'Esquema técnico de medidas Rusty Vorez: frente 141mm, lente 51x52mm, puente 17mm, varilla 145mm', 1500, 1500, 4, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
