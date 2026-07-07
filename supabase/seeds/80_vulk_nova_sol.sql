-- ============================================
-- Seed 80: Vulk Nova SOL — OVALADO mujer, metal dorado, 3 colores (3/3 POLARIZADAS)
-- Fecha: 2026-07-07
-- ============================================
-- Anteojos de SOL OVALADOS para MUJER, talle large, 35,8g. Frente de metal; patilla de metal
-- con terminal de acetato. Lentes policarbonato POLARIZADAS 100% UVA/UVB (UV400, categoría 3).
-- 1 MLA con 3 VARIACIONES (multi-variation → cada variante lleva su var_id en
-- mercadolibre_variation_code, comparten mercadolibre_item_id='MLA2197866182'). Precio/stock API ML:
--   C1 POL  SKU 968320  var 189163990683  $128.299  stock 5  (dorado/carey, lente marrón) PRIMARY
--   C2 POL  SKU 968321  var 189163990685  $128.299  stock 5  (dorado, lente verde)
--   C3 POL  SKU 968322  var 204932326043  $128.299  stock 5  (dorado, lente marrón degradé)
--
-- frame_shape="ovalado" (canónico español, schema §4; primer OVALADO del grid de SOL — los
-- ovalados previos Clems/My Crew son de receta). NO existe faceta /ovalados → el peso SEO lo
-- llevan marca + mujer + polarizados + metal (seo-strategist). Fix asociado en product-page.tsx
-- (frameShapeToSpanish: agregada key 'ovalado' — antes solo 'oval', el subtítulo daba null).
--
-- 3/3 polarizadas → lens_treatment incluye "polarized" a NIVEL PRODUCTO (dispara faceta
-- /anteojos-de-sol/polarizados vía brand-filters.ts) + "polarized":true en las 3 variantes
-- (badge POLARIZADO en VariantList). Default sol: policarbonato / cat 3.
-- weight_grams=35.8 (ML lo da → NO a pesos pendientes). PRIMARY = C1 (hero del listado ML).
--
-- Medidas (de medidas.png): frente 144 / lente 55x41 / puente 19 / patilla 145 mm.
--
-- HONESTIDAD (BUSINESS_POLICIES §6/§8): las 3 SON polarizadas → meta/H1 SÍ puede afirmar
-- "polarizados" del modelo. Descripción genérica del modelo (sin color de variante en prosa).
--
-- SEO por seo-strategist: primaria de MARCA `lentes de sol vulk` (1.300, CSV real) + carriles
-- mujer + polarizados (1.700) + metal. Branded `anteojos de sol vulk nova` (0 vol, dif 4) en
-- name/alt. Anti-canibalización: Nova lidera ángulo mujer/metal/ovalado femenino; no compite
-- con Raven (wayfarer unisex) ni Bennie (redondo unisex).
--
-- 📸 FOTOS: YA SUBIDAS al bucket vulk-nova/ (7 archivos, verificados HTTP 200 el 2026-07-07).
-- Se usan los nombres CRUDOS del founder verbatim (espacios/puntos/plural "perfiles" — NO se
-- renombró para no divergir del bucket; storage_path == objeto real). 3 var × (perfil + frente)
-- + medidas.png = 7. Grid primary = PERFIL de C1 (NOVA C1 POL.-perfiles.jpg). Scale 1.1/1.0
-- PROVISIONAL (punto medio Raven 1.0 / Terdey 1.15 — 900×442 igual que Bennie/Raven) →
-- reverificar vs grid al aplicar (regla 15).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-nova', 'Vulk Nova',
  'Lentes de sol Vulk Nova: ovalados para mujer, talle large. Armazón de metal dorado y patillas de metal con terminal de acetato. Lentes polarizadas de policarbonato con UV400 categoría 3. Tres versiones de color.',
  E'Los **Vulk Nova** son **lentes de sol ovalados para mujer**, de talle large y solo **35,8 g**. **Frente de metal** en tono dorado y **patillas de metal con terminal de acetato** para mayor confort. **Lentes polarizadas de policarbonato con 100% protección UVA y UVB (UV400, categoría 3)**.\n\nMedidas: frente 144 mm · lente 55 mm de ancho × 41 mm de alto · puente 19 mm · patilla 145 mm.\n\nDisponible en 3 versiones de color, todas polarizadas.\n\nEl filtro polarizado corta el reflejo del agua, la nieve y el asfalto, y reduce el cansancio visual al manejar o al aire libre. Incluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "metal",
    "frame_shape": "ovalado",
    "temple_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "gender": "female",
    "weight_grams": 35.8,
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 55, "lens_height_mm": 41, "bridge_mm": 19, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "recommended_face_shapes": ["redonda", "cuadrada", "corazon"],
    "callouts": [
      {"type": "info", "position": "top", "title": "Ovalados de mujer, metal liviano", "body": "Diseño ovalado femenino de talle large, solo 35,8 g. Frente de metal dorado y patillas de metal con terminal de acetato. Lentes de policarbonato con 100% protección UV (UV400, categoría 3)."},
      {"type": "tip", "position": "middle", "title": "Las 3 versiones son polarizadas", "body": "El filtro polarizado corta el reflejo del agua, la nieve y el asfalto. Ideal para manejar y para actividades al aire libre, con menos cansancio visual."},
      {"type": "recommendation", "position": "bottom", "title": "100% protección UVA y UVB", "body": "Las 3 versiones bloquean el 100% de los rayos UV (UV400). Si dudás cuál color te conviene, escribinos por WhatsApp y te asesoramos."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2197866182"], "imported_at": "2026-07-07"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Nova Ovalados Mujer | Óptica Carballo',
  'Lentes de sol Vulk Nova ovalados para mujer, armazón de metal dorado y lentes polarizados con UV400. Envíos a todo el país y asesoramiento de técnico óptico.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variantes. sort 1 = C1 (primary). 1 MLA multi-variation → mismo item_id, var_id distinto.
-- SKUs 968320/21/22 únicos entre sí (sin colisión, sin sufijar). Las 3 polarized:true.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), '968320',
   '{"frame_color":"dorado-carey","lens_color":"marron","model_code":"Dorado - C1","polarized":true}'::jsonb,
   12829900, 5, true, 1, 'MLA2197866182', '189163990683'),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), '968321',
   '{"frame_color":"dorado","lens_color":"verde","model_code":"Dorado - C2","polarized":true}'::jsonb,
   12829900, 5, true, 2, 'MLA2197866182', '189163990685'),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), '968322',
   '{"frame_color":"dorado","lens_color":"marron-degradado","model_code":"DORADO - C3","polarized":true}'::jsonb,
   12829900, 5, true, 3, 'MLA2197866182', '204932326043')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Imágenes. Por variante: perfil (grid) + frente. Primary = C1 perfil. medidas última.
-- Nombres CRUDOS del founder verbatim (ya en bucket, verificados HTTP 200 el 2026-07-07).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), (SELECT id FROM public.product_variants WHERE sku='968320'),
   'vulk-nova/NOVA C1 POL.-perfiles.jpg', 'Anteojos de sol Vulk Nova ovalados para mujer vista lateral, armazón de metal dorado con carey y lente marrón polarizada', 900, 442, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), (SELECT id FROM public.product_variants WHERE sku='968320'),
   'vulk-nova/NOVA C1 POL.-frente.jpg', 'Anteojos de sol Vulk Nova ovalados para mujer vista frontal, armazón de metal dorado con carey y lente marrón polarizada', 900, 442, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), (SELECT id FROM public.product_variants WHERE sku='968321'),
   'vulk-nova/NOVA C2 POL._PERFIL.jpg', 'Anteojos de sol Vulk Nova ovalados para mujer vista lateral, armazón de metal dorado y lente verde polarizada', 900, 442, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), (SELECT id FROM public.product_variants WHERE sku='968321'),
   'vulk-nova/NOVA C2 POL._FRENTE.jpg', 'Anteojos de sol Vulk Nova ovalados para mujer vista frontal, armazón de metal dorado y lente verde polarizada', 900, 442, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), (SELECT id FROM public.product_variants WHERE sku='968322'),
   'vulk-nova/NOVA_C3_PERFIL.jpg', 'Anteojos de sol Vulk Nova ovalados para mujer vista lateral, armazón de metal dorado y lente marrón degradé polarizada', 900, 442, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), (SELECT id FROM public.product_variants WHERE sku='968322'),
   'vulk-nova/NOVA_C3_FRENTE.jpg', 'Anteojos de sol Vulk Nova ovalados para mujer vista frontal, armazón de metal dorado y lente marrón degradé polarizada', 900, 442, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-nova'), NULL,
   'vulk-nova/medidas.png', 'Esquema técnico de medidas Vulk Nova: frente 144mm, lente 55x41mm, puente 19mm, patilla 145mm', 1500, 1500, 9, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
