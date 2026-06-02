-- ============================================
-- Seed 41: Vulk Biller (sol) — hexagonal G-Flex/Monel, apto receta
-- Fecha: 2026-06-02
-- ============================================
-- Hexagonal unisex liviano (13g). Frente G-Flex, patillas Monel con terminales
-- de acetato hechos a mano, bisagra integrada. Policarbonato UV400 cat 3. APTO
-- para colocar lentes recetados (prescription_adapter=true).
--
-- 5 variantes en 4 MLAs (MLA1904276470 es MULTI-VARIACIÓN: 669k + AQ31).
-- 1 de 5 polarizada (solo MBLK/S10) → producto lens_treatment ["uv400"].
-- Stock = ML (regla founder: cargar todas aunque estén en 0):
--
--   SKU 125181 — 663-056 / AQ31    gris oscuro + verde osc degradé. MLA1904276470 var 193275243101. $74.250,81, stock 6 (default, mayor stock).
--   SKU 125187 — MBLK-046 / S10 POL negro mate + gris oscuro pol.    MLA2493352472.                   $86.087,27, stock 1. POLARIZADA.
--   SKU 125188 — 669k-068 / CH79    semi espejada verde degradé.     MLA1904276470 var 186030898413. $74.250,81, stock 1.
--   SKU 125189 — SBLK-206 / 118     negro brillo + gris degradé.     MLA2683652154.                   $70.975, stock 0 (pausado).
--   SKU 125180 — SBLK-068 / 902 LTD negro brillo + rojiza espejada.  MLA1957668976.                   $70.975, stock 0 (pausado).
--
-- Medidas: 143 / 51x44 / 21 / 145 mm. Peso 13g. Talle mediano.
--
-- 📸 FOTOS (bucket products/vulk-biller/, nombres reales verificados HTTP 200,
-- casing/espacios inconsistentes respetados; AQ31 en .webp):
--   BILLER AQ31 PERFIL.webp / FRENTE.webp           (AQ31 — perfil primary del modelo)
--   Biller MBLK 046 S10 perfil.jpg / 046  S10 Frontal.jpg (doble espacio)
--   BILLER 669k 068 PERFIL.jpg / FRONTAL.jpg
--   Biller SBLK 206 118 perfil.jpg / 118  Lateral.jpg (doble espacio)
--   Biller SBLK 068 902 perfil.jpg                  (solo perfil)
--   medidas.jpg
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-biller', 'Vulk Biller',
  'Anteojos de sol hexagonales unisex Vulk Biller: frente G-Flex, patillas de Monel con terminales de acetato, livianos (13g) y aptos para lentes recetados. Policarbonato UV400 categoría 3.',
  E'Los Vulk Biller combinan estilo moderno y comodidad diaria en un diseño hexagonal unisex que se destaca a simple vista. Son livianos (solo 13 gramos), no presionan y se sienten cómodos incluso después de varias horas de uso.\n\nEl frente es de G-Flex (termoplástico flexible patentado por Rusty/Vulk) y las patillas son de Monel —un metal resistente a la corrosión— con terminales de acetato hechos a mano y bisagra integrada para mayor durabilidad. Las lentes son de policarbonato con protección UV400 categoría 3.\n\nSon **aptos para colocar lentes recetados**, así que podés usarlos como anteojos de sol comunes o con tu graduación.\n\nDisponible en 5 variantes:\n\n• 663-056 / AQ31 (SKU 125181): armazón gris oscuro con lente verde oscuro degradé y detalle dorado.\n• MBLK-046 / S10 POL (SKU 125187): negro mate con lente gris oscuro POLARIZADA — elimina reflejos del asfalto y el agua.\n• 669k-068 / CH79 (SKU 125188): lente verde degradé semi espejada con antirreflex.\n• SBLK-206 / 118 (SKU 125189): negro brillo con lente gris degradé.\n• SBLK-068 / 902 LTD (SKU 125180): negro brillo con lente rojiza semi espejada (edición limitada).\n\nIncluye estuche original, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "hexagonal",
    "temple_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": true,
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 51, "lens_height_mm": 44, "bridge_mm": 21, "temple_length_mm": 145},
    "weight_grams": 13,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Hexagonal, liviano y apto para receta", "body": "Con solo 13 gramos es de los más livianos del catálogo: no presiona la nariz ni las orejas. Y como es apto para lentes recetados, lo podés usar de sol o con tu graduación."},
      {"type": "recommendation", "position": "middle", "title": "¿Cuál elegir?", "body": "Para manejar o la playa, la MBLK/S10 es la única POLARIZADA (elimina reflejos). El resto son antirreflex/espejadas/degradé: elección de estilo (la AQ31 verde degradé y la 902 rojiza son las más llamativas)."},
      {"type": "tip", "position": "bottom", "title": "Para que duren", "body": "Guardalos en el estuche y limpiá solo con la franela de microfibra. Si vas al mar o la pileta, enjuagalos con agua dulce antes de guardarlos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2493352472", "MLA1904276470", "MLA2683652154", "MLA1957668976"], "imported_at": "2026-06-02"}
  }'::jsonb,
  true, false,
  'Vulk Biller Anteojos de Sol Hexagonales Unisex G-Flex | Óptica Carballo',
  'Anteojos Vulk Biller hexagonales unisex: G-Flex + Monel, 13g, aptos para receta, policarbonato UV400. 5 variantes (una polarizada). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), '125181',
   '{"frame_color":"gris-oscuro","lens_color":"verde-oscuro-degrade","model_code":"663-056 / AQ31","polarized":false}'::jsonb,
   7425081, 6, true, 1, 'MLA1904276470', '193275243101'),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), '125187',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK-046 / S10 POL","polarized":true}'::jsonb,
   8608727, 1, true, 2, 'MLA2493352472', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), '125188',
   '{"frame_color":"negro","lens_color":"verde-degrade-espejada","model_code":"669k-068 / CH79","polarized":false}'::jsonb,
   7425081, 1, true, 3, 'MLA1904276470', '186030898413'),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), '125189',
   '{"frame_color":"negro-brillo","lens_color":"gris-degrade","model_code":"SBLK-206 / 118","polarized":false}'::jsonb,
   7097500, 0, true, 4, 'MLA2683652154', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), '125180',
   '{"frame_color":"negro-brillo","lens_color":"rojiza-espejada","model_code":"SBLK-068 / 902 LTD","polarized":false}'::jsonb,
   7097500, 0, true, 5, 'MLA1957668976', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary del modelo: AQ31 perfil (mayor stock). Perfil = primaria de cada variante.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125181'),
   'vulk-biller/BILLER AQ31 PERFIL.webp', 'Vulk Biller hexagonal vista lateral, armazón gris oscuro G-Flex con lente verde oscuro degradé', 1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125181'),
   'vulk-biller/BILLER AQ31 FRENTE.webp', 'Vulk Biller hexagonal vista frontal, armazón gris oscuro con lente verde oscuro degradé', 1500, 1000, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125187'),
   'vulk-biller/Biller MBLK 046 S10 perfil.jpg', 'Vulk Biller hexagonal vista lateral, armazón negro mate G-Flex con lente gris oscuro polarizada', 1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125187'),
   'vulk-biller/Biller MBLK 046  S10 Frontal.jpg', 'Vulk Biller hexagonal vista frontal, armazón negro mate con lente gris oscuro polarizada', 1500, 1000, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125188'),
   'vulk-biller/BILLER 669k 068 PERFIL.jpg', 'Vulk Biller hexagonal vista lateral, lente verde degradé semi espejada', 1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125188'),
   'vulk-biller/BILLER 669k 068 FRONTAL.jpg', 'Vulk Biller hexagonal vista frontal, lente verde degradé semi espejada', 1500, 1000, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125189'),
   'vulk-biller/Biller SBLK 206 118 perfil.jpg', 'Vulk Biller hexagonal vista lateral, armazón negro brillo con lente gris degradé', 1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125189'),
   'vulk-biller/Biller SBLK 206 118  Lateral.jpg', 'Vulk Biller hexagonal otra vista lateral, armazón negro brillo con lente gris degradé', 1500, 1000, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), (SELECT id FROM public.product_variants WHERE sku='125180'),
   'vulk-biller/Biller SBLK 068 902 perfil.jpg', 'Vulk Biller hexagonal vista lateral, armazón negro brillo con lente rojiza semi espejada edición limitada', 1500, 1000, 8, false),
  ((SELECT id FROM public.products WHERE slug='vulk-biller'), NULL,
   'vulk-biller/medidas.jpg', 'Esquema técnico de medidas Vulk Biller: frente 143mm, lente 51x44mm, puente 21mm, varilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
