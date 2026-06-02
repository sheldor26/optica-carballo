-- ============================================
-- Seed 43: Vulk Reporter (sol) — cuadrado G-Flex, apto receta
-- Fecha: 2026-06-02
-- ============================================
-- Anteojo de sol cuadrado amplio unisex. Armazón y patillas de G-Flex inyectado
-- (liviano, flexible), bisagras plásticas integradas. Lentes de policarbonato
-- UV400 categoría 3. APTO para colocar lentes recetados (prescription_adapter).
--
-- 3 variantes que pidió el founder. Stock=ML:
--   SKU 194165 — MBLK/G.GREEN      negro mate + verde degradé.  MLA2123541044 (simple).        $78.822,45, stock 5 (mayor stock → primary). NO polarizada.
--   SKU 194164 — MBLK/S10 POL      negro mate + gris oscuro.    MLA1866713114 var 183985833841. $84.894,06, stock 3. POLARIZADA.
--   SKU 129260 — LGREY/DRT03 POL   gris claro + lente degradé.  MLA1866713114 var 191901138681. $84.894,06, stock 4. POLARIZADA.
--
-- 2 de 3 polarizadas → producto lens_treatment ["uv400"].
-- ⚠️ NOTA: MLA1866713114 (multi-variación) tiene una 4ª variación NO cargada:
--    MBLK/S10 "Lentes Verde Degradé" (var 183985833839, stock 0) — el founder no
--    la incluyó en su lista de SKUs ni dio fotos. Pendiente: confirmar si va.
-- ⚠️ lens_color de LGREY/DRT03 = "degradé" tentativo (DRT03 es código de lente) —
--    pendiente confirmación de la tonalidad exacta del founder.
--
-- Medidas: 142 / 55x48 / 11 / 138 mm.
-- frame_shape "cuadrado" (ML dice Rectangular pero título + founder dicen cuadrado).
--
-- 📸 FOTOS (bucket products/vulk-reporter/, nombres reales con casing/espacios
-- inconsistentes respetados, verificados HTTP 200; medidas en .webp):
--   REPORTER MBLK G GREEN PERFIL.jpg / FRONTAL.jpg     (G.GREEN — perfil primary del modelo)
--   Reporter MBLK S10 Pol Perfil.jpg / frente.jpg
--   REPORTER L GREY DRT03 POL PERFIL.jpg / FRONTAL.jpg
--   medidas.webp
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-reporter', 'Vulk Reporter',
  'Anteojos de sol cuadrados unisex Vulk Reporter: armazón y patillas de G-Flex inyectado, livianos y flexibles, con lentes de policarbonato UV400 categoría 3. Aptos para lentes recetados.',
  E'Los Vulk Reporter son anteojos de sol de formato cuadrado amplio, modernos y llamativos, pensados para el uso diario. El armazón y las patillas son de G-Flex inyectado: un material muy liviano y flexible que no marca ni lastima, cómodo incluso después de varias horas de uso. Las bisagras son plásticas integradas, para mayor durabilidad.\n\nLas lentes son de policarbonato con protección UV400 categoría 3 (100% contra rayos UVA y UVB), ideales para uso urbano y días de sol fuerte.\n\nSon **aptos para colocar lentes recetados**, así que podés usarlos como anteojos de sol comunes o con tu graduación.\n\nDisponible en 3 variantes:\n\n• MBLK/G.GREEN (SKU 194165): negro mate con lente verde degradé.\n• MBLK/S10 POL (SKU 194164): negro mate con lente gris oscuro POLARIZADA — elimina los reflejos del asfalto y el agua.\n• LGREY/DRT03 POL (SKU 129260): gris claro con lente degradé POLARIZADA.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": true,
    "measurements": {"frame_width_mm": 142, "lens_width_mm": 55, "lens_height_mm": 48, "bridge_mm": 11, "temple_length_mm": 138},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "G-Flex liviano y apto para receta", "body": "El armazón y las patillas son de G-Flex inyectado: livianos, flexibles y no marcan la cara. Y como es apto para lentes recetados, lo podés usar de sol o con tu graduación."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la MBLK/S10 y la LGREY/DRT03 son POLARIZADAS (eliminan reflejos). La MBLK/G.GREEN (verde degradé) es elección de estilo, la más llamativa."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2123541044", "MLA1866713114"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Vulk Reporter Anteojos de Sol Cuadrados G-Flex Polarizado | Óptica Carballo',
  'Anteojos Vulk Reporter cuadrados unisex: armazón G-Flex, policarbonato UV400, aptos para receta. 3 variantes (dos polarizadas). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), '194165',
   '{"frame_color":"negro-mate","lens_color":"verde-degrade","model_code":"MBLK/G.GREEN","polarized":false}'::jsonb,
   7882245, 5, true, 1, 'MLA2123541044', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), '194164',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10","polarized":true}'::jsonb,
   8489406, 3, true, 2, 'MLA1866713114', '183985833841'),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), '129260',
   '{"frame_color":"gris-claro","lens_color":"degrade","model_code":"LGREY/DRT03","polarized":true}'::jsonb,
   8489406, 4, true, 3, 'MLA1866713114', '191901138681')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK/G.GREEN perfil (mayor stock). Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='194165'),
   'vulk-reporter/REPORTER MBLK G GREEN PERFIL.jpg', 'Anteojo de sol Vulk Reporter cuadrado vista lateral, armazón negro mate G-Flex con lente verde degradé', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='194165'),
   'vulk-reporter/REPORTER MBLK G GREEN FRONTAL.jpg', 'Anteojo de sol Vulk Reporter cuadrado vista frontal, armazón negro mate con lente verde degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='194164'),
   'vulk-reporter/Reporter MBLK S10 Pol Perfil.jpg', 'Anteojo de sol Vulk Reporter cuadrado vista lateral, armazón negro mate con lente gris oscuro polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='194164'),
   'vulk-reporter/Reporter MBLK S10 Pol frente.jpg', 'Anteojo de sol Vulk Reporter cuadrado vista frontal, armazón negro mate con lente gris oscuro polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='129260'),
   'vulk-reporter/REPORTER L GREY DRT03 POL PERFIL.jpg', 'Anteojo de sol Vulk Reporter cuadrado vista lateral, armazón gris claro con lente degradé polarizada', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), (SELECT id FROM public.product_variants WHERE sku='129260'),
   'vulk-reporter/REPORTER L GREY DRT03 POL FRONTAL.jpg', 'Anteojo de sol Vulk Reporter cuadrado vista frontal, armazón gris claro con lente degradé polarizada', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-reporter'), NULL,
   'vulk-reporter/medidas.webp', 'Esquema técnico de medidas Vulk Reporter: frente 142mm, lente 55x48mm, puente 11mm, varilla 138mm', 1500, 1500, 6, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
