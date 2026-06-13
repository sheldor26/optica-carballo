-- ============================================
-- Seed 64: Rusty Terdey SOL — wayfarer unisex, G-Flex, 3 colores (TODOS polarizados)
-- Fecha: 2026-06-13
-- ============================================
-- Anteojos de SOL wayfarer UNISEX. Frente G-Flex, lentes policarbonato UV400 cat 3,
-- bisagras plásticas reforzadas (al callout, no es campo del schema). LAS 3 VARIANTES
-- POLARIZADAS (polarized:true → entran a /polarizados). 3 MLAs SEPARADOS (items
-- simples → mercadolibre_variation_code NULL, item_id=MLA; patrón Play/Lady Piny).
-- Precio/stock de la API ML (scripts/ml-item.ts):
--   SBLK/S10 POL  SKU 128821  MLA1387932823  $77.375,25  stock 21 (PRIMARY, +stock, negro brillo)
--   MBLK/S10 POL  SKU 128820  MLA1679617223  $77.375,25  stock 16 (negro mate)
--   MBLK/REVO RED POL SKU 128823 MLA1499129431 $82.380,15 stock 1 (negro mate, espejada roja)
--
-- Convención SOL (vs seed 63 Play): producto lens_treatment=["uv400"]/lens_material=
-- policarbonato/lens_category=3; por VARIANTE polarized:true. La Revo Red además
-- lens_treatment ["espejado"] + lens_color "espejado-rojo". frame_shape="wayfarer",
-- gender="unisex". weight_grams OMITIDO (ML no da → BACKLOG).
--
-- Medidas: 145 / 54x47 / 16 / 140 mm (de la FOTO medidas.png; regla founder).
--
-- 📸 FOTOS (bucket products/rusty-terdey/, 9 en storage; GALERIA=perfil, AGALERIA=
-- frente (verificado visualmente); Revo Red usa -p/-f explícito). Primaria = perfil
-- SBLK. Cada variante tiene perfil+frente propios → NO hay CCCP. Scale perfil 1.15/
-- frente 1.0 (encuadre GALERIA-WEB estándar). medidas.png en 1.0 (no grid).
-- 4ª variante MBLUE/REVO BLUE (SKU 128824, MLA1518722044, $82.711, ML stock 6, ML
-- paused) agregada 2026-06-13 PERO is_active=FALSE: el founder tiene que corroborar
-- stock (avisa el martes para activar). Founder indicó "(no polarizados)" para esta
-- → polarized:false (⚠️ el título de ML dice "polarizados"; se respeta al founder).
-- Frame azul mate, lente espejada azul. Fotos GALERIA/AGALERIA-WEB-MBLUE-REVOBLUE.
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-terdey', 'Rusty Terdey',
  'Anteojos de sol Rusty Terdey: wayfarer unisex con las 3 variantes polarizadas y protección UV400. Montura G-Flex en policarbonato y categoría 3 de filtro solar, ideales para uso diario y al aire libre.',
  E'Los **Rusty Terdey** son anteojos de sol **wayfarer unisex**, con frente de **G-Flex** —flexible y resistente— y **lentes polarizadas de policarbonato con protección UV400 (categoría 3)**. Las **3 versiones son polarizadas**: cortan el reflejo del agua, la nieve y el asfalto, y descansan la vista al manejar o al aire libre. Bisagras plásticas reforzadas.\n\nMedidas: frente 145 mm · lente 54 mm de ancho × 47 mm de alto · puente 16 mm · varilla 140 mm.\n\nDisponible en 3 versiones:\n\n• SBLK/S10 POL — negro brillo, lente gris polarizada.\n• MBLK/S10 POL — negro mate, lente gris polarizada.\n• MBLK/Revo Red POL — negro mate, lente espejada roja polarizada.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 54, "lens_height_mm": 47, "bridge_mm": 16, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer unisex en G-Flex", "body": "Frente de G-Flex flexible y resistente con bisagras plásticas reforzadas. Forma wayfarer clásica, lentes de policarbonato UV400 categoría 3 para sol intenso."},
      {"type": "tip", "position": "middle", "title": "Las 3 versiones polarizadas", "body": "Todas las variantes tienen lente polarizada: cortan el reflejo del agua, la nieve y el asfalto, y descansan la vista al manejar o al aire libre. La Revo Red suma lente espejada roja."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Todas las versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1387932823", "MLA1679617223", "MLA1499129431"], "imported_at": "2026-06-13"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Terdey Polarizados | Óptica Carballo',
  'Anteojos de sol Rusty Terdey wayfarer unisex, las 3 variantes polarizadas con protección UV400. Envíos a toda Argentina. Comprá con asesoramiento óptico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK (primary, +stock). 3 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), '128821',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   7737525, 21, true, 1, 'MLA1387932823', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), '128820',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   7737525, 16, true, 2, 'MLA1679617223', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), '128823',
   '{"frame_color":"negro-mate","lens_color":"espejado-rojo","model_code":"MBLK/REVO RED POL","polarized":true,"lens_treatment":["espejado"]}'::jsonb,
   8238015, 1, true, 3, 'MLA1499129431', NULL),
  -- 4ª variante DESACTIVADA (founder corrobora stock el martes). polarized:false (founder).
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), '128824',
   '{"frame_color":"azul-mate","lens_color":"espejado-azul","model_code":"MBLUE/REVO BLUE","polarized":false,"lens_treatment":["espejado"]}'::jsonb,
   8271100, 6, false, 4, 'MLA1518722044', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = SBLK perfil (GALERIA). medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128821'),
   'rusty-terdey/TERDEY GALERIA-WEB-SBLK-S10-POL.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista lateral, negro brillo lente polarizada', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128821'),
   'rusty-terdey/TERDEY AGALERIA-WEB-SBLK-S10-POL.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista frontal, negro brillo lente polarizada', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128820'),
   'rusty-terdey/TERDEY GALERIA-WEB-MBLK-S10-POL.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista lateral, negro mate lente polarizada', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128820'),
   'rusty-terdey/TERDEY AGALERIA-WEB-MBLK-S10-POL.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista frontal, negro mate lente polarizada', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128823'),
   'rusty-terdey/TERDEY MBLKREVO RED POL.-p.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista lateral, negro mate lente espejada roja polarizada', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128823'),
   'rusty-terdey/TERDEY MBLKREVO RED POL.-f.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista frontal, negro mate lente espejada roja polarizada', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128824'),
   'rusty-terdey/TERDEY GALERIA-WEB-MBLUE-REVOBLUE.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista lateral, azul mate lente espejada azul', 900, 442, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), (SELECT id FROM public.product_variants WHERE sku='128824'),
   'rusty-terdey/TERDEY AGALERIA-WEB-MBLUE-REVOBLUE.jpg', 'Anteojos de sol Rusty Terdey wayfarer unisex vista frontal, azul mate lente espejada azul', 900, 442, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-terdey'), NULL,
   'rusty-terdey/medidas.png', 'Esquema técnico de medidas Rusty Terdey: frente 145mm, lente 54x47mm, puente 16mm, varilla 140mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
