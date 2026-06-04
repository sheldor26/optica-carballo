-- ============================================
-- Seed 54: Rusty CCCP (sol) — deportivo envolvente, G-Flex, 2 pol + 2 antirreflex
-- Fecha: 2026-06-04
-- ============================================
-- Anteojo de sol deportivo envolvente (wraparound), unisex. Armazón + patillas
-- G-Flex. Lentes de policarbonato 100% protección UV. 2 variantes polarizadas +
-- 2 con antirreflex interno (mismo modelo, distinto tratamiento de lente).
-- 2 de 4 pol → producto lens_treatment ["uv400"] (entra a /polarizados).
--
-- 4 variantes en 3 MLAs. Stock=ML:
--   SKU 1118   — SBLK/S10 POL  negro brillo + gris oscuro POLARIZADA.  MLA1506966188 (simple). $93.631,97 stock 4 (primary).
--   SKU 001120 — MBLK/S10 POL  negro mate + gris oscuro POLARIZADA.    MLA1424009769 (simple). $93.631,97 stock 2.
--   SKU 100    — MBLK/S10      negro mate + gris oscuro; antirreflex.   MLA1468677535 var 188468060561. $81.416 stock 2.
--   SKU 101    — SBLK/S10      negro brillo + gris oscuro; antirreflex. MLA1468677535 var 182612309796. $81.416 stock 0.
--
-- Medidas: 139 / 68x45 / 16 / 108 mm (varilla corta, típico de envolvente deportivo).
--
-- 📸 FOTOS (bucket products/rusty-cccp/, verificadas HTTP 200). Founder subió solo
-- 2 pares (SBLK POL + MBLK) porque el modelo es el mismo y solo varía pol/no-pol.
-- El constraint UNIQUE(product_id, storage_path) impide atar un mismo archivo a 2
-- variantes → founder pidió (2026-06-04) que el MBLK-AR use las fotos del MBLK y el
-- SBLK-AR las del SBLK (mismo armazón). Solución: se COPIARON los 2 pares en el bucket
-- con sufijo "AR" (storage API /object/copy) y se ataron a las variantes AR. Así cada
-- variante muestra la foto de su color de frente (vars_sin_foto=0).
--   CCCP SBLK-S10 POL perfil.jpg / CCCP SBLK-S10 POL frente.jpg  (primary; var SBLK POL)
--   CCCP MBLK S10 perfil.jpg / CCCP MBLK S10 frente.jpg          (var MBLK POL)
--   CCCP MBLK S10 AR perfil.jpg / CCCP MBLK S10 AR frente.jpg    (COPIA de MBLK; var MBLK AR)
--   CCCP SBLK-S10 AR perfil.jpg / CCCP SBLK-S10 AR frente.jpg    (COPIA de SBLK; var SBLK AR)
--   medidas.webp
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-cccp', 'Rusty CCCP',
  'Anteojos de sol Rusty CCCP: diseño envolvente deportivo unisex, armazón y patillas de G-Flex y lentes de policarbonato con 100% protección UV. Variantes polarizadas y con antirreflex.',
  E'Los Rusty CCCP son anteojos de sol de **diseño envolvente deportivo**, unisex, pensados para correr, andar en bici o cualquier actividad al aire libre. El armazón y las patillas son de **G-Flex** —flexible, liviano y resistente—, con un calce envolvente que sujeta firme y protege de la luz lateral.\n\nLas lentes son de policarbonato (resistente a impactos) con **100% de protección UV**. Hay dos versiones de lente:\n\n• **Polarizadas** (MBLK/S10 POL y SBLK/S10 POL): eliminan los reflejos del asfalto, el agua y la nieve para una visión más nítida y descansada.\n• **Con antirreflejo interno** (MBLK/S10 y SBLK/S10): reducen los reflejos que llegan desde atrás.\n\nDisponible en 4 variantes:\n\n• SBLK/S10 POL (SKU 1118): negro brillo con lente gris oscuro POLARIZADA.\n• MBLK/S10 POL (SKU 001120): negro mate con lente gris oscuro POLARIZADA.\n• MBLK/S10 (SKU 100): negro mate con lente gris oscuro y antirreflejo interno.\n• SBLK/S10 (SKU 101): negro brillo con lente gris oscuro y antirreflejo interno.\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "envolvente",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "deportiva",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {"frame_width_mm": 139, "lens_width_mm": 68, "lens_height_mm": 45, "bridge_mm": 16, "temple_length_mm": 108},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Envolvente deportivo en G-Flex", "body": "Diseño envolvente (wraparound) en G-Flex flexible: sujeta firme para correr, andar en bici o manejar, y protege de la luz que entra por los costados."},
      {"type": "recommendation", "position": "middle", "title": "¿Polarizada o antirreflex?", "body": "Para manejar, la playa o la nieve, elegí una POLARIZADA (MBLK/S10 POL o SBLK/S10 POL): eliminan los reflejos. Las versiones con antirreflejo interno (MBLK/S10 y SBLK/S10) reducen los reflejos de atrás y son más económicas."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalas en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalas con agua dulce antes de guardarlas."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1506966188", "MLA1424009769", "MLA1468677535"], "imported_at": "2026-06-04"}
  }'::jsonb,
  true, false,
  'Rusty CCCP Anteojos de Sol Deportivos Envolventes Unisex | Óptica Carballo',
  'Anteojos Rusty CCCP envolventes deportivos unisex: G-Flex, policarbonato 100% UV. 4 variantes (2 polarizadas). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), '1118',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   9363197, 4, true, 1, 'MLA1506966188', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), '001120',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   9363197, 2, true, 2, 'MLA1424009769', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), '100',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   8141600, 2, true, 3, 'MLA1468677535', '188468060561'),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), '101',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   8141600, 0, true, 4, 'MLA1468677535', '182612309796')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: SBLK/S10 POL perfil. Cada variante muestra la foto
-- de su color de frente: MBLK POL + MBLK AR usan fotos MBLK; SBLK POL + SBLK AR usan
-- fotos SBLK (las "AR" son copias en bucket, ver nota arriba). vars_sin_foto=0.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='1118'),
   'rusty-cccp/CCCP SBLK-S10 POL perfil.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista lateral, negro brillo con lente gris oscuro polarizada', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='1118'),
   'rusty-cccp/CCCP SBLK-S10 POL frente.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista frontal, negro brillo con lente gris oscuro polarizada', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='001120'),
   'rusty-cccp/CCCP MBLK S10 perfil.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista lateral, negro mate con lente gris oscuro', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='001120'),
   'rusty-cccp/CCCP MBLK S10 frente.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista frontal, negro mate con lente gris oscuro', 1500, 1000, 3, false),
  -- MBLK AR (SKU 100): copias de las fotos MBLK (mismo armazón negro mate).
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='100'),
   'rusty-cccp/CCCP MBLK S10 AR perfil.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista lateral, negro mate con lente gris oscuro antirreflex', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='100'),
   'rusty-cccp/CCCP MBLK S10 AR frente.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista frontal, negro mate con lente gris oscuro antirreflex', 1500, 1000, 6, false),
  -- SBLK AR (SKU 101): copias de las fotos SBLK (mismo armazón negro brillo).
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='101'),
   'rusty-cccp/CCCP SBLK-S10 AR perfil.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista lateral, negro brillo con lente gris oscuro antirreflex', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), (SELECT id FROM public.product_variants WHERE sku='101'),
   'rusty-cccp/CCCP SBLK-S10 AR frente.jpg', 'Anteojo de sol Rusty CCCP envolvente deportivo vista frontal, negro brillo con lente gris oscuro antirreflex', 1500, 1000, 8, false),
  -- medidas SIEMPRE última (sort 9 > todas las fotos de variante) para que en la
  -- galería de cada variante quede al final, no primera (founder 2026-06-04).
  ((SELECT id FROM public.products WHERE slug='rusty-cccp'), NULL,
   'rusty-cccp/medidas.webp', 'Esquema técnico de medidas Rusty CCCP: frente 139mm, lente 68x45mm, puente 16mm, varilla 108mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
