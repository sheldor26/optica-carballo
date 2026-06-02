-- ============================================
-- Seed 42: Rusty Dapper (sol) — G-Flex, bisagra metálica Flex
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol unisex casual. Frente y patillas de G-Flex (termoplástico
-- flexible), bisagra metálica Flex. Lentes de policarbonato, 100% protección
-- UVA/UVB, categoría 3. Liviano (30,7 g).
--
-- 4 variantes en 4 MLAs (todas publicaciones simples, sin variaciones).
-- 1 de 4 polarizada (solo SBLK/S10) → producto lens_treatment ["uv400"].
-- Stock = ML (regla founder: cargar todas aunque estén en 0):
--
--   SKU 958072 — SBH/6208     marrón.                      MLA1387893041. $81.090,33, stock 4 (active, mayor stock → primary).
--   SKU 958070 — SBLK/S10 POL negro brillo + gris oscuro.  MLA1387942969. $93.628,98, stock 1 (active). POLARIZADA.
--   SKU 958071 — GREY/UVS17   gris oscuro transparente.     MLA1866325356. $81.416, stock 0 (paused).
--   SKU 958073 — ORANGE/118   negro + lente naranja.        MLA1564448740. $81.416, stock 0 (paused).
--
-- Medidas: 137 / 48x49 / 21 / 130 mm. Peso 30,7 g.
-- ⚠️ frame_shape "redondo" tentativo (títulos ML dicen redondo/ovalado) —
--    pendiente confirmación visual del founder.
--
-- 📸 FOTOS (bucket products/rusty-dapper/, nombres ASCII URL-safe, verificados HTTP 200):
--   DAPPER_SBH_6208_p.jpg / _f.jpg          (SBH/6208 — perfil primary del modelo)
--   DAPPER_SBLK_S10POL_p.jpg / _f.jpg
--   DAPPER_GREY_UVS17_p.jpg / _f.jpg
--   DAPPER_ORANGE_118_p.jpg / _f.jpg
--   medidas.jpg
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-dapper', 'Rusty Dapper',
  'Anteojos de sol unisex Rusty Dapper: armazón y patillas de G-Flex con bisagra metálica Flex, lentes de policarbonato con protección UV400 categoría 3. Livianos (30,7 g) y resistentes.',
  E'Los Rusty Dapper son anteojos de sol unisex de uso diario, pensados para durar. El armazón y las patillas son de G-Flex —un termoplástico flexible que aguanta golpes y torsiones sin deformarse— con bisagra metálica Flex para una apertura suave y firme. Con solo 30,7 gramos son livianos y cómodos para todo el día.\n\nLas lentes son de policarbonato con 100% de protección contra rayos UVA y UVB (categoría 3), ideal para sol fuerte.\n\nDisponible en 4 variantes:\n\n• SBH/6208 (SKU 958072): armazón y lente en tono marrón, clásico y versátil.\n• SBLK/S10 POL (SKU 958070): negro brillo con lente gris oscuro POLARIZADA — elimina los reflejos del asfalto, el agua y la nieve.\n• GREY/UVS17 (SKU 958071): gris oscuro transparente con lente gris, look moderno.\n• ORANGE/118 (SKU 958073): negro con lente naranja, la opción más audaz.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
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
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 48, "lens_height_mm": 49, "bridge_mm": 21, "temple_length_mm": 130},
    "weight_grams": 31,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "G-Flex: flexible y resistente", "body": "El armazón y las patillas son de G-Flex, un material que se dobla sin romperse. Con la bisagra metálica Flex, soportan el uso diario mejor que un acetato común."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar, la playa o la montaña, la SBLK/S10 es la única POLARIZADA (elimina reflejos). Las demás (marrón, gris transparente, naranja) son elección de estilo."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1387893041", "MLA1387942969", "MLA1866325356", "MLA1564448740"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Rusty Dapper Anteojos de Sol Unisex G-Flex Polarizado | Óptica Carballo',
  'Anteojos Rusty Dapper unisex: armazón G-Flex, bisagra metálica Flex, policarbonato UV400. 4 variantes (una polarizada). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), '958072',
   '{"frame_color":"marron","lens_color":"marron","model_code":"SBH/6208","polarized":false}'::jsonb,
   8109033, 4, true, 1, 'MLA1387893041', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), '958070',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10","polarized":true}'::jsonb,
   9362898, 1, true, 2, 'MLA1387942969', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), '958071',
   '{"frame_color":"gris-oscuro-transparente","lens_color":"gris","model_code":"GREY/UVS17","polarized":false}'::jsonb,
   8141600, 0, true, 3, 'MLA1866325356', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), '958073',
   '{"frame_color":"negro","lens_color":"naranja","model_code":"ORANGE/118","polarized":false}'::jsonb,
   8141600, 0, true, 4, 'MLA1564448740', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: SBH/6208 perfil (mayor stock). Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958072'),
   'rusty-dapper/DAPPER_SBH_6208_p.jpg', 'Anteojo de sol Rusty Dapper vista lateral, armazón G-Flex color marrón', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958072'),
   'rusty-dapper/DAPPER_SBH_6208_f.jpg', 'Anteojo de sol Rusty Dapper vista frontal, armazón G-Flex color marrón', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958070'),
   'rusty-dapper/DAPPER_SBLK_S10POL_p.jpg', 'Anteojo de sol Rusty Dapper vista lateral, negro brillo con lente gris oscuro polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958070'),
   'rusty-dapper/DAPPER_SBLK_S10POL_f.jpg', 'Anteojo de sol Rusty Dapper vista frontal, negro brillo con lente gris oscuro polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958071'),
   'rusty-dapper/DAPPER_GREY_UVS17_p.jpg', 'Anteojo de sol Rusty Dapper vista lateral, armazón gris oscuro transparente con lente gris', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958071'),
   'rusty-dapper/DAPPER_GREY_UVS17_f.jpg', 'Anteojo de sol Rusty Dapper vista frontal, armazón gris oscuro transparente con lente gris', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958073'),
   'rusty-dapper/DAPPER_ORANGE_118_p.jpg', 'Anteojo de sol Rusty Dapper vista lateral, armazón negro con lente naranja', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), (SELECT id FROM public.product_variants WHERE sku='958073'),
   'rusty-dapper/DAPPER_ORANGE_118_f.jpg', 'Anteojo de sol Rusty Dapper vista frontal, armazón negro con lente naranja', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-dapper'), NULL,
   'rusty-dapper/medidas.jpg', 'Esquema técnico de medidas Rusty Dapper: frente 137mm, lente 48x49mm, puente 21mm, varilla 130mm', 1500, 1500, 8, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
