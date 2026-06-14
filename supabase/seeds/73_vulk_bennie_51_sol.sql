-- ============================================
-- Seed 73: Vulk Bennie 51 SOL — REDONDO unisex, G-Flex + patillas metal flex, 3 colores (1 pol)
-- Fecha: 2026-06-14
-- ============================================
-- Anteojos de SOL REDONDOS unisex, talle small, livianos (18,9g). Frente G-Flex; patillas de
-- metal con barra metálica, sistema flex y terminales de goma. Lentes policarbonato 100% UV.
-- 3 MLAs SEPARADOS (items simples → variation_code NULL). Precio/stock de la API ML:
--   MBLK-BLK-GUN/S10 POL  SKU 123600 MLA1904009566 $95.306,25 stock 3 (PRIMARY, negro mate, patillas peltre, gris oscuro, POLARIZADO)
--   MBLK-GUN/G.GREY       SKU 123609 MLA1463014195 $86.573,31 stock 2 (negro mate, patillas peltre, gris DEGRADÉ, NO pol)
--   MBLK-BLK/GREEN        SKU 123760 MLA1866791268 $86.573,31 stock 7 (negro mate, varillas negras, verde + AR interno, NO pol)
--
-- frame_shape="round" (→/anteojos-de-sol/round; comparte shape con Rusty Blinded, OK — la
-- diferenciación es por SEO/marca, no por enum). 1 polarized:true (S10) → /polarizados.
-- G.GREY degradé → lens_color "gris-degradado" (no meto "gradient" en lens_treatment: ningún
-- filtro lo consume; lens_color comunica el degradé). GREEN: AR interno → callout/descripción
-- (NO es valor del enum lens_treatment, igual criterio que espejado/AR previos). lens_color
-- por variante (gris-oscuro / gris-degradado / verde). Default sol: policarbonato / ["uv400"] / cat 3.
-- weight_grams=18.9 (ML lo da → NO a pesos pendientes). PRIMARY = S10 POL (la polarizada es el
-- hero unisex; el stock NO ordena — fluctúa por webhook; criterio catalog-loader).
--
-- Medidas (de la FOTO): frente 135 / lente 51x37 / puente 18 / varilla 140 mm.
--
-- HONESTIDAD (BUSINESS_POLICIES §6/§8): solo 1/3 polarizada → meta_title/H1 NO afirma
-- "polarizados" del modelo (destaca "Redondos"). El claim polarizado va en la variante S10.
-- Descripción genérica del modelo (sin colores en prosa).
--
-- SEO por seo-strategist: primaria de MARCA `lentes de sol vulk` (1.300) + carril `lentes de sol
-- redondos` (320) como secundaria. Anti-canibalización vs Rusty Blinded (redondo): Bennie lidera
-- por marca, Blinded por forma; cross-link "redondos similares" + ambos → /anteojos-de-sol/redondos.
--
-- 📸 FOTOS: CARGA ABIERTA — bucket vulk-bennie-51/ VACÍO al seed (founder pasó nombres, falta subir).
-- 3 var × (perfil + frente) + medidas.png = 7. Grid primary = PERFIL de S10 POL. Scale 1.0 baseline
-- (como Raven; redondo small PODRÍA necesitar 1.15 si se ve chico → reverificar vs grid al subir, regla 15).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-bennie-51', 'Vulk Bennie 51',
  'Lentes de sol Vulk Bennie 51: redondos unisex, ultralivianos (18,9g). Frente G-Flex y patillas de metal con sistema flex y terminales de goma. Lentes de policarbonato UV400 categoría 3. Una versión polarizada.',
  E'Los **Vulk Bennie 51** son **lentes de sol redondos unisex**, de talle small y muy livianos (**18,9 g**). Frente de **G-Flex** y **patillas de metal** con barra metálica, sistema flex y terminales de goma para mejor agarre. **Lentes de policarbonato con 100% protección UV (UV400, categoría 3)**.\n\nMedidas: frente 135 mm · lente 51 mm de ancho × 37 mm de alto · puente 18 mm · varilla 140 mm.\n\nDisponible en 3 versiones:\n\n• MBLK-BLK-GUN/S10 — negro mate con patillas peltre, lente gris **polarizada**.\n• MBLK-GUN/G.Grey — negro mate con patillas peltre, lente gris degradé.\n• MBLK-BLK/Green — negro mate con varillas negras, lente verde con antirreflejo en la cara interna.\n\nLa versión polarizada corta el reflejo del agua, la nieve y el asfalto. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "round",
    "temple_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 18.9,
    "measurements": {"frame_width_mm": 135, "lens_width_mm": 51, "lens_height_mm": 37, "bridge_mm": 18, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex liviano", "body": "Diseño redondo unisex de talle small, solo 18,9 g. Frente de G-Flex y patillas de metal con sistema flex y terminales de goma. Lentes de policarbonato con 100% protección UV (UV400, categoría 3)."},
      {"type": "tip", "position": "middle", "title": "Tres versiones de lente", "body": "La S10 es polarizada (corta el reflejo del agua, la nieve y el asfalto). La G.Grey tiene lente gris degradé. La Green es verde con antirreflejo en la cara interna para reducir reflejos."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UV", "body": "Las 3 versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1904009566", "MLA1463014195", "MLA1866791268"], "imported_at": "2026-06-14"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Bennie 51 Redondos | Óptica Carballo',
  'Lentes de sol Vulk Bennie 51 redondos unisex, ultralivianos 18,9g con UV400 categoría 3. Asesoramiento de técnico óptico y envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = S10 POL (primary). 3 MLAs simples → variation_code NULL.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), '123600',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK-BLK-GUN/S10 POL","polarized":true}'::jsonb,
   9530625, 3, true, 1, 'MLA1904009566', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), '123609',
   '{"frame_color":"negro-mate","lens_color":"gris-degradado","model_code":"MBLK-GUN/G.GREY","polarized":false}'::jsonb,
   8657331, 2, true, 2, 'MLA1463014195', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), '123760',
   '{"frame_color":"negro-mate","lens_color":"verde","model_code":"MBLK-BLK/GREEN","polarized":false}'::jsonb,
   8657331, 7, true, 3, 'MLA1866791268', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = S10 POL perfil. medidas última.
-- ⚠️ nombres del founder copiados tal cual (CARGA ABIERTA, sin verificar HTTP aún).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), (SELECT id FROM public.product_variants WHERE sku='123600'),
   'vulk-bennie-51/BENNIE 51 MBLK-BLK P.jpg', 'Lentes de sol Vulk Bennie 51 redondos unisex vista lateral, negro mate patillas peltre lente polarizada gris', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), (SELECT id FROM public.product_variants WHERE sku='123600'),
   'vulk-bennie-51/BENNIE 51 MBLK-BLK frente.jpg', 'Lentes de sol Vulk Bennie 51 redondos unisex vista frontal, negro mate patillas peltre lente polarizada gris', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), (SELECT id FROM public.product_variants WHERE sku='123609'),
   'vulk-bennie-51/BENNIE 51 MBLK-GUN G.GREY - p.jpg', 'Lentes de sol Vulk Bennie 51 redondos unisex vista lateral, negro mate patillas peltre lente gris degradé', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), (SELECT id FROM public.product_variants WHERE sku='123609'),
   'vulk-bennie-51/BENNIE 51 MBLK-GUN G.GREY - F.jpg', 'Lentes de sol Vulk Bennie 51 redondos unisex vista frontal, negro mate patillas peltre lente gris degradé', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), (SELECT id FROM public.product_variants WHERE sku='123760'),
   'vulk-bennie-51/BENNIE 51 MBLK GREEN P.jpg', 'Lentes de sol Vulk Bennie 51 redondos unisex vista lateral, negro mate lente verde antirreflejo interno', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), (SELECT id FROM public.product_variants WHERE sku='123760'),
   'vulk-bennie-51/BENNIE 51 MBLK GREEN F.jpg', 'Lentes de sol Vulk Bennie 51 redondos unisex vista frontal, negro mate lente verde antirreflejo interno', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-bennie-51'), NULL,
   'vulk-bennie-51/medidas.png', 'Esquema técnico de medidas Vulk Bennie 51: frente 135mm, lente 51x37mm, puente 18mm, varilla 140mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
