-- ============================================
-- Seed 208: Vulk VOICES (sol, unisex, ovalado, polarizado cat 3), 2 variantes
-- Fecha: 2026-11-17
-- ============================================
-- 2 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-17 (las creó el founder, 2 items separados, stock 3 en cada una):
--   969380  MBLK/B30 POL  MLA2298365551  $107.727  frente negro mate + patillas negro brillo con interior transparente, lente gris oscuro, POLARIZADA, cat 3
--   969381  SBLK/G16 POL  MLA2298365549  $107.727  frente negro brillo + patillas negro brillo con interior transparente, lente verde oscuro, POLARIZADA, cat 3
-- DATOS DEL FOUNDER (2026-11-17): ovalado, unisex, cat 3, polarizados, UV400, bisagras de acero inoxidable (sin flex), 27,8 g, frente de G-Flex y patillas de ACETATO, medidas 49-22-141, altura total 39 (tal cual en lens_height_mm), ancho total 145. Confirmado contra la ficha de Vulk (frente G-Flex, patilla acetato, bisagras acero inoxidable, 27,8 g).
-- 🔬 Sin "liviano"/"flexible"; "acero inoxidable" sólo en el copy (el despiece sólo lee hinge_material 'metal'); `temple_material` = 'acetato' (sin "e", es lo que lee el despiece).
-- 🎯 SEO (seo-strategist + CSV): slug `vulk-voices`; "Polarizados" en el title (2 de 2); "ovalados" sólo en meta/copy/alt (Nova y Rusty Eysy ya lo tienen en el title); frase de vuelta sólo en Nova; cross-links a Nova, Cinema y el hub.
-- ⚠️ `polarized:true` y model_code con "POL" en las dos variantes (\bPOL\b las mete en /polarizados); `lens_category` a nivel producto porque es igual en las dos. `lens_material policarbonato` por la regla de sol.
-- 📸 `pnpm fotos:subir --slug vulk-voices --sufijo -<variante>`. Primaria = perfil de la MBLK. Fotos oficiales de Vulk (1024×1024) pasadas por el generador. Pendiente del founder: comparar el logo de la patilla (la foto oficial tiene coronita).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-voices', 'Vulk Voices',
  'Lentes de sol Vulk Voices: ovalados unisex con frente de G-Flex y patillas de acetato, bisagras de acero inoxidable. Lente polarizada con 100% protección UV (UV400, categoría 3). Las dos versiones polarizan.',
  E'Los **lentes de sol Vulk Voices** son **ovalados**, de diseño **unisex**, con **frente de G-Flex**, **patillas de acetato** con detalle transparente por dentro y **bisagras de acero inoxidable**. Pesan 27,8 gramos.\n\n**Las dos versiones son polarizadas.** La lente es de policarbonato, con **protección UV400** (bloquea los rayos UVA y UVB) y **categoría 3**. El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo. De día sí; de noche no recomendamos usar anteojos de sol para manejar.\n\nMedidas: frente 145 mm · lente 49 mm · puente 22 mm · varilla 141 mm · alto total 39 mm.\n\nDisponible en 2 versiones:\n\n• MBLK/B30 POL (SKU 969380): frente negro mate con patillas negro brillo e interior transparente, lente gris oscuro.\n• SBLK/G16 POL (SKU 969381): frente negro brillo con patillas negro brillo e interior transparente, lente verde oscuro.\n\nSi te gustan los ovalados, mirá también los [Vulk Nova](/anteojos-de-sol/vulk/vulk-nova). Y si buscás un unisex polarizado de otra forma, los [Vulk Cinema](/anteojos-de-sol/vulk/vulk-cinema), redondos. También podés ver [todos los anteojos de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "g-flex",
    "temple_material": "acetato",
    "frame_shape": "ovalado",
    "gender": "unisex",
    "line": "urbana",
    "hinge_system": "estandar",
    "hinge_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 49, "lens_height_mm": 39, "bridge_mm": 22, "temple_length_mm": 141},
    "weight_grams": 27.8,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-17",
    "callouts": [
      {"type": "info", "position": "top", "title": "Ovalado con frente de G-Flex y patillas de acetato", "body": "El frente es de G-Flex y las patillas de acetato, con un detalle transparente por dentro. Las bisagras son de acero inoxidable."},
      {"type": "tip", "position": "middle", "title": "Las dos versiones son polarizadas", "body": "Reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). Aparte, la lente bloquea el 100% de la radiación UV (UV400)."},
      {"type": "recommendation", "position": "bottom", "title": "Categoría 3 para el uso diurno", "body": "Lente de policarbonato categoría 3, pensada para mucha luz. De día sí; de noche no recomendamos usar anteojos de sol para manejar."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Voices Polarizados Unisex',
  'Lentes de sol Vulk Voices ovalados unisex: frente de G-Flex, lentes polarizados UV400 categoría 3. Los dos colores polarizan. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-voices'), '969380',
   '{"frame_color":"negro-mate-patillas-negro-brillo-interior-transparente","lens_color":"gris-oscuro","model_code":"MBLK/B30 POL","polarized":true}'::jsonb,
   10772700, 3, true, 1, 'MLA2298365551', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-voices'), '969381',
   '{"frame_color":"negro-brillo-patillas-interior-transparente","lens_color":"verde-oscuro","model_code":"SBLK/G16 POL","polarized":true}'::jsonb,
   10772700, 3, true, 2, 'MLA2298365549', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-voices'), (SELECT id FROM public.product_variants WHERE sku='969380'),
   'vulk-voices/perfil-mblk.jpg', 'Lentes de sol Vulk Voices ovalados unisex, vista lateral, frente negro mate con patillas negro brillo y lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-voices'), (SELECT id FROM public.product_variants WHERE sku='969380'),
   'vulk-voices/frente-mblk.jpg', 'Lentes de sol Vulk Voices ovalados unisex, vista frontal, frente negro mate con lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-voices'), (SELECT id FROM public.product_variants WHERE sku='969381'),
   'vulk-voices/perfil-sblk.jpg', 'Lentes de sol Vulk Voices ovalados unisex, vista lateral, frente negro brillo con patillas negro brillo y lente verde oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-voices'), (SELECT id FROM public.product_variants WHERE sku='969381'),
   'vulk-voices/frente-sblk.jpg', 'Lentes de sol Vulk Voices ovalados unisex, vista frontal, frente negro brillo con lente verde oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-voices'), NULL,
   'vulk-voices/medidas-mblk.jpg', 'Esquema técnico de medidas Vulk Voices: lente 49mm, puente 22mm, varilla 141mm, alto total 39mm, ancho total 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Nova (el ovalado de Vulk, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi te gustan los ovalados de Vulk en versión unisex y polarizada, mirá también los [Vulk Voices](/anteojos-de-sol/vulk/vulk-voices).', updated_at = now()
WHERE slug = 'vulk-nova' AND description NOT LIKE '%vulk-voices%';

COMMIT;
