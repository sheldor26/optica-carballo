-- ============================================
-- Seed 63: Rusty Play SOL — wayfarer hombre, G-Flex, 4 colores (2 polarizados)
-- Fecha: 2026-06-13
-- ============================================
-- Anteojos de SOL wayfarer masculinos. Frente G-Flex, lentes de policarbonato
-- UV400 cat 3, bisagras plásticas (al callout, no es campo del schema). 4 variantes
-- en 4 MLAs SEPARADOS (items simples, sin variación interna → mercadolibre_variation_code
-- NULL, mercadolibre_item_id = el MLA; patrón Lady Piny). Precio/stock de la API ML
-- (scripts/ml-item.ts):
--   MBLK/S10 C1  SKU 100921  MLA1388044045  $81.090,33  stock 8  NO pol, ANTIRREFLEJO interno (PRIMARY, +stock)
--   SBLK/S10 POL SKU 100933  MLA1365605567  $93.631,97  stock 7  POLARIZADO
--   MBLK/REVO BLUE SKU 103473 MLA1388018195 $88.571,29  stock 5  ESPEJADO azul (revo), no pol
--   MBLK/S10 POL SKU 103472  MLA1382548759  $93.631,97  stock 4  POLARIZADO
--
-- Convención SOL (verificada vs seed 54 CCCP): a nivel PRODUCTO lens_treatment=["uv400"],
-- lens_material="policarbonato", lens_category=3. El tratamiento por variante va en la
-- VARIANTE: polarized:true (POL → entran a /polarizados vía lib/catalog/polarized.ts) o
-- polarized:false + lens_treatment ["antirreflejo-interno"]/["espejado"].
--
-- frame_shape="wayfarer" (enum válido; ruta /anteojos-de-sol/wayfarer + brand-filters.ts
-- mapea slug→frame_shape 'wayfarer'). gender="male". weight_grams OMITIDO (ML no lo da →
-- no inventamos; casillero "Peso" vacío → BACKLOG).
--
-- Medidas: 141 / 61x47 / 12 / 140 mm (de la FOTO de medidas.png; regla founder).
--
-- 📸 FOTOS (bucket products/rusty-play/, las 10 verificadas HTTP 200; naming MUY
-- inconsistente, .webp y .jpg mezclados). Primaria = perfil C1. CCCP: el C1 no tenía
-- perfil propio (comparte frame MBLK/S10) → se copió PLAY-MBLK-S10-PERFIL.jpg a
-- PLAY-MBLK-S10-C1-PERFIL.jpg vía storage API (UNIQUE(product_id,storage_path) impide
-- reusar el mismo path). SBLK tiene un perfil extra (PLAY-SBLK-PERFIL.jpg) → galería.
-- Scale: perfil 1.1 / frente 1.0 (comparación visual: el anteojo ya ocupa ~95% del
-- frame, más lleno que My Crew/Opposit → scale bajo). medidas.png en 1.0 (no grid).
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-play', 'Rusty Play',
  'Anteojos de sol Rusty Play: modelo wayfarer para hombre con lentes polarizados (en variantes seleccionadas), policarbonato UV400 categoría 3 y tecnología G-Flex. Originales, de óptica con 30+ años.',
  E'Los **Rusty Play** son anteojos de sol **wayfarer para hombre**, con frente de **G-Flex** —flexible y resistente— y **lentes de policarbonato con protección UV400 (categoría 3)**, ideales para sol intenso. Bisagras plásticas reforzadas.\n\nMedidas: frente 141 mm · lente 61 mm de ancho × 47 mm de alto · puente 12 mm · varilla 140 mm.\n\nDisponible en 4 versiones:\n\n• MBLK/S10 C1 — negro mate, lente gris con antirreflejo en la cara interna (no polarizado).\n• SBLK/S10 POL — negro brillo, lente gris **polarizada**.\n• MBLK/S10 POL — negro mate, lente gris **polarizada**.\n• MBLK/Revo Blue — negro mate, lente espejada azul.\n\nLas versiones polarizadas reducen el reflejo del agua, la nieve y el asfalto. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "male",
    "line": "urbana",
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 61, "lens_height_mm": 47, "bridge_mm": 12, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer de hombre en G-Flex", "body": "Frente de G-Flex flexible y resistente con bisagras plásticas reforzadas. Forma wayfarer clásica, lentes de policarbonato UV400 categoría 3 para sol intenso."},
      {"type": "tip", "position": "middle", "title": "Versiones polarizadas", "body": "Las variantes S10 POL tienen lente polarizada: cortan el reflejo del agua, la nieve y el asfalto, y descansan la vista al manejar o al aire libre. La C1 trae antirreflejo interno y la Revo Blue lente espejada azul."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Todas las versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388044045", "MLA1365605567", "MLA1388018195", "MLA1382548759"], "imported_at": "2026-06-13"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Play Polarizados | Óptica Carballo',
  'Anteojos de sol Rusty Play polarizados para hombre, montura wayfarer y protección UV400. Originales, con envíos a toda Argentina. Comprá online hoy.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = C1 (primary, +stock). 4 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-play'), '100921',
   '{"frame_color":"negro-mate","lens_color":"gris","model_code":"MBLK/S10 C1","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   8109033, 8, true, 1, 'MLA1388044045', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), '100933',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   9363197, 7, true, 2, 'MLA1365605567', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), '103473',
   '{"frame_color":"negro-mate","lens_color":"espejado-azul","model_code":"MBLK/REVO BLUE","polarized":false,"lens_treatment":["espejado"]}'::jsonb,
   8857129, 5, true, 3, 'MLA1388018195', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), '103472',
   '{"frame_color":"negro-mate","lens_color":"gris","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   9363197, 4, true, 4, 'MLA1382548759', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = C1 perfil (copia CCCP). medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='100921'),
   'rusty-play/PLAY-MBLK-S10-C1-PERFIL.jpg', 'Anteojos de sol Rusty Play wayfarer hombre vista lateral, negro mate lente gris C1', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='100921'),
   'rusty-play/PLAY MBLK C1 Frente.webp', 'Anteojos de sol Rusty Play wayfarer hombre vista frontal, negro mate lente gris con antirreflejo C1', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='100933'),
   'rusty-play/PLAY-SBLK-S10-POL-perfil.jpg', 'Anteojos de sol Rusty Play wayfarer hombre vista lateral, negro brillo lente polarizada gris', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='100933'),
   'rusty-play/rusty play sblk s10 frente.webp', 'Anteojos de sol Rusty Play wayfarer hombre vista frontal, negro brillo lente polarizada gris', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='100933'),
   'rusty-play/PLAY-SBLK-PERFIL.jpg', 'Anteojos de sol Rusty Play wayfarer hombre vista lateral detalle, negro brillo lente polarizada', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='103473'),
   'rusty-play/PLAY-MBLK-REVO-BLUE---PERFIL.jpg', 'Anteojos de sol Rusty Play wayfarer hombre vista lateral, negro mate lente espejada azul revo', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='103473'),
   'rusty-play/PLAY MBLK REVO BLUE FRENTE.jpg', 'Anteojos de sol Rusty Play wayfarer hombre vista frontal, negro mate lente espejada azul revo', 900, 442, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='103472'),
   'rusty-play/PLAY-MBLK-S10-PERFIL.jpg', 'Anteojos de sol Rusty Play wayfarer hombre vista lateral, negro mate lente polarizada gris', 900, 442, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), (SELECT id FROM public.product_variants WHERE sku='103472'),
   'rusty-play/MBLK S10 Frente.webp', 'Anteojos de sol Rusty Play wayfarer hombre vista frontal, negro mate lente polarizada gris', 900, 442, 8, false),
  ((SELECT id FROM public.products WHERE slug='rusty-play'), NULL,
   'rusty-play/medidas.png', 'Esquema técnico de medidas Rusty Play: frente 141mm, lente 61x47mm, puente 12mm, varilla 140mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
