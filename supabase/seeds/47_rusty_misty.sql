-- ============================================
-- Seed 47: Rusty Misty (sol) — redondo unisex, TALLE CHICO, G-Flex
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol REDONDO unisex de TALLE CHICO (armazón pequeño, para rostros
-- chicos — el founder pidió énfasis fuerte por reclamos de talle). Frente y
-- patillas de G-Flex con bisagras metálicas Flex customizadas. Liviano (17,8 g).
-- Lentes de policarbonato. 2 de 3 variantes polarizadas → producto
-- lens_treatment ["uv400"] (igual entra a /polarizados por las 2 variantes pol).
--
-- 3 variantes en 3 MLAs (publicaciones simples). Stock=ML:
--   SKU 125739 — L.ROSE/GS9B    rosa transparente + verde degradé. MLA1441238733. $73.661,17, stock 13 (mayor → primary). NO polarizada.
--   SKU 127032 — BROWN/UB18 POL marrón transparente + marrón.      MLA1866499228. $85.924,92, stock 6. POLARIZADA.
--   SKU 127030 — MBLK/S10 POL   negro mate + gris oscuro.          MLA1432131885. $81.804,47, stock 4. POLARIZADA.
--
-- Medidas: 132 / 44x42 / 22 / 145 mm. Peso 17,8 g. size_fit="chico".
--
-- 📸 FOTOS (bucket products/rusty-misty/, nombres reales verificados HTTP 200,
-- inconsistencias respetadas: `Pol_P` mayúscula, `POL-p` con guión, `-pefil` typo):
--   MISTY_L.ROSEGS9B-pefil.jpg / MISTY_L.ROSEGS9B-frente.jpg  (L.ROSE — perfil primary del modelo)
--   MISTY_BROWN_UB18_POL-p.jpg / MISTY_BROWN_UB18_POL_f.jpg
--   MISTY_MBLK_S10_Pol_P.jpg / MISTY_MBLK_S10_Pol_f.jpg
--   medidas.jpg
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-misty', 'Rusty Misty',
  'Anteojos de sol redondos unisex Rusty Misty de TALLE CHICO (armazón pequeño, ideal para rostros chicos). Frente y patillas de G-Flex con bisagras metálicas Flex, lentes de policarbonato UV400 categoría 3. Muy livianos (17,8 g).',
  E'Son anteojos de sol REDONDOS unisex, con frente y patillas de G-Flex y **bisagras metálicas Flex customizadas** para una apertura firme y durable. Con solo 17,8 gramos son de los más livianos del catálogo.\n\nLas lentes son de policarbonato con protección UV400 categoría 3 (100% UVA/UVB).\n\nDisponible en 3 variantes:\n\n• L.ROSE/GS9B (SKU 125739): armazón rosa transparente con lente verde degradé.\n• BROWN/UB18 POL (SKU 127032): marrón transparente con lente marrón POLARIZADA.\n• MBLK/S10 POL (SKU 127030): negro mate con lente gris oscuro POLARIZADA.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "redondo",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "size_fit": "chico",
    "measurements": {"frame_width_mm": 132, "lens_width_mm": 44, "lens_height_mm": 42, "bridge_mm": 22, "temple_length_mm": 145},
    "weight_grams": 18,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "warning", "position": "top", "title": "Talle chico — para rostros chicos", "body": "Es un armazón PEQUEÑO (frente 132 mm). Ideal para rostros chicos o angostos. Si tu rostro es mediano o grande, probablemente te quede chico — revisá las medidas antes de comprar."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la BROWN/UB18 y la MBLK/S10 son POLARIZADAS (eliminan reflejos). La L.ROSE rosa transparente con verde degradé es la más delicada y de moda."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1441238733", "MLA1866499228", "MLA1432131885"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Misty Anteojos de Sol Redondos Unisex Talle Chico | Óptica Carballo',
  'Anteojos Rusty Misty redondos unisex de talle chico (rostros pequeños): G-Flex, policarbonato UV400, livianos 17,8g. 3 variantes (dos polarizadas). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), '125739',
   '{"frame_color":"rosa-transparente","lens_color":"verde-degrade","model_code":"L.ROSE/GS9B","polarized":false}'::jsonb,
   7366117, 13, true, 1, 'MLA1441238733', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), '127032',
   '{"frame_color":"marron-transparente","lens_color":"marron","model_code":"BROWN/UB18 POL","polarized":true}'::jsonb,
   8592492, 6, true, 2, 'MLA1866499228', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), '127030',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   8180447, 4, true, 3, 'MLA1432131885', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: L.ROSE perfil (mayor stock). Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), (SELECT id FROM public.product_variants WHERE sku='125739'),
   'rusty-misty/MISTY_L.ROSEGS9B-pefil.jpg', 'Anteojo de sol Rusty Misty redondo talle chico vista lateral, armazón rosa transparente con lente verde degradé', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), (SELECT id FROM public.product_variants WHERE sku='125739'),
   'rusty-misty/MISTY_L.ROSEGS9B-frente.jpg', 'Anteojo de sol Rusty Misty redondo talle chico vista frontal, armazón rosa transparente con lente verde degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), (SELECT id FROM public.product_variants WHERE sku='127032'),
   'rusty-misty/MISTY_BROWN_UB18_POL-p.jpg', 'Anteojo de sol Rusty Misty redondo talle chico vista lateral, marrón transparente con lente marrón polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), (SELECT id FROM public.product_variants WHERE sku='127032'),
   'rusty-misty/MISTY_BROWN_UB18_POL_f.jpg', 'Anteojo de sol Rusty Misty redondo talle chico vista frontal, marrón transparente con lente marrón polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), (SELECT id FROM public.product_variants WHERE sku='127030'),
   'rusty-misty/MISTY_MBLK_S10_Pol_P.jpg', 'Anteojo de sol Rusty Misty redondo talle chico vista lateral, negro mate con lente gris oscuro polarizada', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), (SELECT id FROM public.product_variants WHERE sku='127030'),
   'rusty-misty/MISTY_MBLK_S10_Pol_f.jpg', 'Anteojo de sol Rusty Misty redondo talle chico vista frontal, negro mate con lente gris oscuro polarizada', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-misty'), NULL,
   'rusty-misty/medidas.jpg', 'Esquema técnico de medidas Rusty Misty: frente 132mm, lente 44x42mm, puente 22mm, varilla 145mm', 1500, 1500, 6, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
