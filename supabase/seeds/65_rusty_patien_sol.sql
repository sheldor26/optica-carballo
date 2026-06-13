-- ============================================
-- Seed 65: Rusty Patien SOL — wayfarer unisex, G-Flex, 4 colores (1 polarizado)
-- Fecha: 2026-06-13
-- ============================================
-- Anteojos de SOL wayfarer UNISEX. Frente G-Flex, BISAGRAS METÁLICAS FLEX (≠ Play/
-- Terdey que eran plásticas → al callout), lentes policarbonato UV400 cat 3. 4 MLAs
-- SEPARADOS (items simples → variation_code NULL, item_id=MLA). Precio/stock de ML
-- (scripts/ml-item.ts):
--   SBLK/S15        SKU 126092 MLA1430081541 $73.661,17 stock 17 (PRIMARY, +stock; negro brillo, lente gris oscuro ANTIRREFLEJO interno, no pol)
--   MBLK/REVO BLUE  SKU 126091 MLA1388056869 $79.373,23 stock 13 (negro mate, espejada azul, no pol)
--   MBLK/S10 POL    SKU 126099 MLA1456406247 $85.924,92 stock 6  (negro mate, gris oscuro, POLARIZADO → /polarizados)
--   669K-SBLK/SG91 POL SKU 126093 MLA1430185017 $86.011,19 stock 0 (frente gris transparente + patillas negro brillo,
--                   lente gris DEGRADÉ POLARIZADA → /polarizados. Founder corrigió 2026-06-13 el nombre/atributo (antes
--                   se había puesto "669K/SBLK sin polarizar" por error). Se carga stock 0 + is_active=true por la regla
--                   "cargar todas las variantes aunque estén en 0, se sincronizan solas". → ahora 2 de 4 polarizadas.)
--
-- Default global SOL (founder 2026-06-13): TODO modelo de sol = cat 3 + policarbonato
-- + 100% UV (UVA/UVB), salvo que el founder aclare lo contrario.
--
-- frame_shape="wayfarer" (enum + ruta + brand-filters). gender="unisex". weight_grams
-- OMITIDO (ML no da → lista de pesos pendientes en BACKLOG).
--
-- Medidas: 140 / 49x40 / 21 / 145 mm (de la FOTO medidas.webp).
--
-- 📸 FOTOS (bucket products/rusty-patien/, 9 en storage; frente/perfil explícitos por
-- variante, 1200×589; medidas.webp). Primaria = perfil SBLK/S15. Cada variante con
-- perfil+frente propio → NO CCCP. Scale perfil 1.2 / frente 1.05 (fotos 1200×589 con
-- anteojo ~70% del frame, como My Crew/Tour 81 que aterrizaron en ~1.2/1.05; NO 1.3/
-- 1.15 que el founder reportó "grande"). medidas.webp en 1.0 (no grid).
-- ============================================

BEGIN;

WITH
  rusty   AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-patien', 'Rusty Patien',
  'Anteojos de sol Rusty unisex modelo Patien: armazón wayfarer en policarbonato con filtro UV400 categoría 3 y varillas flexibles G-Flex. Disponible en variantes antirreflex, espejada y polarizada (la versión MBLK/S10 suma lente polarizado que reduce el reflejo en agua, asfalto y nieve).',
  E'Los **Rusty Patien** son anteojos de sol **wayfarer unisex**, con frente de **G-Flex** —flexible y resistente— **bisagras metálicas flex** y **lentes de policarbonato con protección UV400 (categoría 3)**.\n\nMedidas: frente 140 mm · lente 49 mm de ancho × 40 mm de alto · puente 21 mm · varilla 145 mm.\n\nDisponible en 4 versiones:\n\n• SBLK/S15 — negro brillo, lente gris oscuro con antirreflejo en la cara interna.\n• MBLK/Revo Blue — negro mate, lente espejada azul.\n• MBLK/S10 POL — negro mate, lente gris **polarizada**.\n• 669K-SBLK/SG91 POL — frente gris transparente con patillas negro brillo, lente gris degradé **polarizada**.\n\nLas versiones polarizadas (MBLK/S10 y 669K-SBLK) reducen el reflejo del agua, la nieve y el asfalto. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "line": "urbana",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 49, "lens_height_mm": 40, "bridge_mm": 21, "temple_length_mm": 145},
    "weight_grams": 23.6,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer unisex en G-Flex", "body": "Frente de G-Flex flexible y resistente con bisagras metálicas flex. Forma wayfarer clásica, lentes de policarbonato UV400 categoría 3 para sol intenso."},
      {"type": "tip", "position": "middle", "title": "4 versiones a elección", "body": "SBLK/S15 con antirreflejo interno, MBLK/Revo Blue espejada azul, MBLK/S10 polarizada y 669K/SBLK en gris transparente. La versión polarizada corta el reflejo del agua, la nieve y el asfalto."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Todas las versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1430081541", "MLA1388056869", "MLA1456406247", "MLA1430185017"], "imported_at": "2026-06-13"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Patien Unisex | Óptica Carballo',
  'Anteojos de sol Rusty Patien unisex, modelo wayfarer con protección UV400. Originales, envíos a toda Argentina y asesoramiento de técnico óptico. Comprá ya.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = SBLK/S15 (primary, +stock). 4 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), '126092',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S15","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   7366117, 17, true, 1, 'MLA1430081541', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), '126091',
   '{"frame_color":"negro-mate","lens_color":"espejado-azul","model_code":"MBLK/REVO BLUE","polarized":false,"lens_treatment":["espejado"]}'::jsonb,
   7937323, 13, true, 2, 'MLA1388056869', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), '126099',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   8592492, 6, true, 3, 'MLA1456406247', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), '126093',
   '{"frame_color":"gris-transparente-negro","lens_color":"gris-degrade","model_code":"669K-SBLK/SG91 POL","polarized":true}'::jsonb,
   8601119, 0, true, 4, 'MLA1430185017', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Primary = SBLK/S15 perfil. medidas SIEMPRE última.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126092'),
   'rusty-patien/PATIEN-SBLK---S15-perfil.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista lateral, negro brillo lente gris con antirreflejo', 1200, 589, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126092'),
   'rusty-patien/PATIEN-SBLK---S15-frente.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista frontal, negro brillo lente gris con antirreflejo', 1200, 589, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126091'),
   'rusty-patien/PATIEN-MBLK---R-BLUE-perfil.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista lateral, negro mate lente espejada azul', 1200, 589, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126091'),
   'rusty-patien/PATIEN-MBLK---R-BLUE-frente.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista frontal, negro mate lente espejada azul', 1200, 589, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126099'),
   'rusty-patien/PATIEN MBLK S10 POL.-p.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista lateral, negro mate lente polarizada gris', 1200, 589, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126099'),
   'rusty-patien/PATIEN MBLK S10 POL.-f.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista frontal, negro mate lente polarizada gris', 1200, 589, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126093'),
   'rusty-patien/PATIEN-669K-SBLK---G91-POL-perfil.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista lateral, frente gris transparente patillas negro brillo', 1200, 589, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), (SELECT id FROM public.product_variants WHERE sku='126093'),
   'rusty-patien/PATIEN-669K-SBLK---G91-POL-frente.jpg', 'Anteojos de sol Rusty Patien wayfarer unisex vista frontal, frente gris transparente patillas negro brillo', 1200, 589, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-patien'), NULL,
   'rusty-patien/medidas.webp', 'Esquema técnico de medidas Rusty Patien: frente 140mm, lente 49x40mm, puente 21mm, varilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
