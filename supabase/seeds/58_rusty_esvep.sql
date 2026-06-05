-- ============================================
-- Seed 58: Rusty Esvep (sol) — envolvente deportivo, G-Flex, polarizado
-- Fecha: 2026-06-05
-- ============================================
-- Anteojo de sol envolvente deportivo, unisex. Armazón G-Flex con bisagras
-- plásticas reforzadas. Lentes de policarbonato UV400 cat 3.
--
-- ⚠️ Carga PARCIAL: se cargan las 2 variantes POLARIZADAS (datos limpios). La 3ª
-- (SBLK/S10 sin polarizar, MLA1397700103, stock 0 paused) queda PENDIENTE: el
-- founder pasó SKU 112881 DUPLICADO (mismo que la SBLK POL) y hay 2 archivos
-- "SBLK S10 perfil" sin frente claro. Esperando SKU real + mapeo de fotos.
--
-- 2 variantes (de 3) en MLAs simples. Stock=ML. Ambas $76.194:
--   SKU 112884 — MBLK/S10 POL  negro mate + gris oscuro POLARIZADA.  MLA1440100603. stock 7 (primary).
--   SKU 112881 — SBLK/S10 POL  negro brillo + gris oscuro POLARIZADA. MLA1586125612. stock 5.
-- (pendiente) SBLK/S10 no-pol — MLA1397700103 $66.724 stock 0 paused.
--
-- Medidas: 140 / 60x46 / 10 / 130 mm. Envolvente, cat 3, UV400.
-- 1 de 2 cargadas pol... ambas pol → /polarizados por toPolarizedCatalog. frame_shape
-- "envolvente" → aparece en /anteojos-de-sol/deportivos.
--
-- 📸 FOTOS (bucket products/rusty-esvep/, verificadas HTTP 200; naming con guiones
-- múltiples inconsistentes del founder):
--   ESVEP-MBLK--S10-POL---perfil.jpg / ESVEP-MBLK--S10-POL---frente.jpg  (primary del modelo)
--   ESVEP-SBLK--S10-POL---perfil.jpg / ESVEP-SBLK--S10-POL---frente.jpg
--   medidas.jpg
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-esvep', 'Rusty Esvep',
  'Anteojos de sol Rusty Esvep: diseño envolvente deportivo unisex, armazón de G-Flex con bisagras plásticas reforzadas y lentes de policarbonato polarizadas UV400 categoría 3.',
  E'Los Rusty Esvep son anteojos de sol de **diseño envolvente deportivo**, unisex, pensados para correr, andar en bici o cualquier actividad al aire libre. El armazón es de **G-Flex** —flexible, liviano y resistente— con **bisagras plásticas reforzadas**, y un calce envolvente que sujeta firme y protege de la luz lateral.\n\nLas lentes son de policarbonato **polarizado** con protección UV400 categoría 3 (100% UVA/UVB): eliminan los reflejos del asfalto, el agua y la nieve para una visión más nítida y descansada.\n\nDisponible en 2 variantes:\n\n• MBLK/S10 POL (SKU 112884): negro mate con lente gris oscuro POLARIZADA.\n• SBLK/S10 POL (SKU 112881): negro brillo con lente gris oscuro POLARIZADA.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "envolvente",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "line": "deportiva",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 60, "lens_height_mm": 46, "bridge_mm": 10, "temple_length_mm": 130},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Envolvente deportivo polarizado", "body": "Diseño envolvente (wraparound) en G-Flex flexible con bisagras plásticas reforzadas: sujeta firme para correr, andar en bici o manejar. Lentes polarizadas que eliminan los reflejos."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalas en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalas con agua dulce antes de guardarlas."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1440100603", "MLA1586125612"], "imported_at": "2026-06-05"}
  }'::jsonb,
  true, false,
  'Rusty Esvep Anteojos de Sol Deportivos Envolventes Polarizados | Óptica Carballo',
  'Anteojos Rusty Esvep envolventes deportivos polarizados: G-Flex, bisagras reforzadas, policarbonato UV400. Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-esvep'), '112884',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   7619400, 7, true, 1, 'MLA1440100603', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-esvep'), '112881',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   7619400, 5, true, 2, 'MLA1586125612', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: MBLK/S10 POL perfil. medidas SIEMPRE última (sort 9).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-esvep'), (SELECT id FROM public.product_variants WHERE sku='112884'),
   'rusty-esvep/ESVEP-MBLK--S10-POL---perfil.jpg', 'Anteojo de sol Rusty Esvep envolvente deportivo vista lateral, negro mate con lente gris oscuro polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-esvep'), (SELECT id FROM public.product_variants WHERE sku='112884'),
   'rusty-esvep/ESVEP-MBLK--S10-POL---frente.jpg', 'Anteojo de sol Rusty Esvep envolvente deportivo vista frontal, negro mate con lente gris oscuro polarizada', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-esvep'), (SELECT id FROM public.product_variants WHERE sku='112881'),
   'rusty-esvep/ESVEP-SBLK--S10-POL---perfil.jpg', 'Anteojo de sol Rusty Esvep envolvente deportivo vista lateral, negro brillo con lente gris oscuro polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-esvep'), (SELECT id FROM public.product_variants WHERE sku='112881'),
   'rusty-esvep/ESVEP-SBLK--S10-POL---frente.jpg', 'Anteojo de sol Rusty Esvep envolvente deportivo vista frontal, negro brillo con lente gris oscuro polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-esvep'), NULL,
   'rusty-esvep/medidas.jpg', 'Esquema técnico de medidas Rusty Esvep: frente 140mm, lente 60x46mm, puente 10mm, varilla 130mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
