-- ============================================
-- Seed 205: Vulk GLORY BOX (sol, mujer, rectangular, G-Flex, patillas anchas), 4 variantes: 2 polarizadas (cat 3) + 2 no (cat 2)
-- Fecha: 2026-11-17
-- ============================================
-- 4 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-17 (las creó el founder; stock 3 en las cuatro):
--   116380  SBLK/S10 POL           MLA2295470321  $104.892  negro brillo, lente gris oscuro, POLARIZADA, cat 3
--   116383  SDEMI-SBLK/BROWN POL   MLA4205822890  $104.892  frente carey brillo + patillas negro brillo, lente marrón, POLARIZADA, cat 3
--   116384  WALNUT/G.BROWN         MLA4205824002  $96.384   marrón brillo, lente marrón degradé, NO polarizada, cat 2
--   116382  L.PINK/L.BROWN         MLA2295430421  $96.384   rosa pálido / caramelo, lente marrón claro, NO polarizada, cat 2
-- DATOS DEL FOUNDER (2026-11-17): mujer; rectangular; UV400; bisagras plásticas reforzadas; G-Flex; patillas anchas; polarizadas cat 3 / no polarizadas cat 2; medidas 50-23-146, altura total 46 (se carga tal cual en lens_height_mm), ancho total 145.
--   La ficha de Vulk dice "Polarizada" en las 4, pero está mal cargada (confirmado por el founder). Peso 27,3 g de la ficha de Vulk (igual en las 4).
-- 🔬 Sin "liviano"/"flexible" (en ML los títulos de las dos no polarizadas dicen "Livianas": decisión del founder, no se replica acá); polarizado y categoría por VARIANTE: no hay `lens_category` ni `polarized` a nivel producto (la PDP no lo lee, pero captions/despiece sí) y la honestidad va en el copy.
-- 🎯 SEO (seo-strategist + CSV): slug `vulk-glory-box`; meta_title SIN "Mujer"/"Rectangulares"/"Polarizados" (Anima, Platz, Day Light); primaria "lentes de sol vulk" (1.300/8) en el title; "anteojos de sol rectangulares mujer" (110/11) en meta y copy una vez; frase de vuelta sólo desde Platz; cross-links a Platz, Day Light, Katleen y el hub.
-- ⚠️ model_code con "POL" SÓLO en las 2 polarizadas (\bPOL\b las mete en /polarizados); la variante con sort_order 1 es polarizada (la card de /polarizados toma la primera polarizada).
-- 🧩 `lens_material policarbonato` por la regla de sol (la ficha de Vulk no lo dice; pendiente de confirmar).
-- 📸 `pnpm fotos:subir --slug vulk-glory-box --sufijo -<variante>`. Primaria = perfil de la SBLK/S10.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-glory-box', 'Vulk Glory Box',
  'Anteojos de sol Vulk Glory Box para mujer: rectangulares de G-Flex con patillas anchas y bisagras plásticas reforzadas. Dos colores con lente polarizado categoría 3 y dos sin polarizar, categoría 2. Todos con UV400.',
  E'Los **lentes de sol Vulk Glory Box** tienen un diseño **rectangular para mujer**, con **patillas anchas**, frente y patillas de **G-Flex** y **bisagras plásticas reforzadas**. Son anteojos de presencia, de esos que se notan en la cara.\n\nLas cuatro versiones tienen protección **UV400** (bloquean los rayos UVA y UVB) y lente de policarbonato. Dos son **polarizadas** y de **categoría 3**, pensada para mucha luz; las otras dos **no son polarizadas** y son de **categoría 2**, para el uso de todos los días.\n\nMedidas: frente 145 mm · lente 50 mm · puente 23 mm · varilla 146 mm · alto total 46 mm.\n\nDisponible en 4 versiones:\n\n• SBLK/S10 POL (SKU 116380): negro brillo con lente gris oscuro, **polarizada**, categoría 3.\n• SDEMI-SBLK/BROWN POL (SKU 116383): frente carey brillo con patillas negro brillo y lente marrón, **polarizada**, categoría 3.\n• WALNUT/G.BROWN (SKU 116384): marrón brillo con lente marrón degradé, **no polarizada**, categoría 2.\n• L.PINK/L.BROWN (SKU 116382): rosa pálido con caramelo y lente marrón claro, **no polarizada**, categoría 2.\n\nLas versiones polarizadas reducen los reflejos del agua, el asfalto y las superficies brillantes, sirven para manejar de día (de noche no) y pueden dificultar ver algunas pantallas (celular, GPS, tablero digital). El polarizado y el UV400 son cosas distintas.\n\nSi te gustan los rectangulares, mirá también los [Vulk Platz](/anteojos-de-sol/vulk/vulk-platz), los [Vulk Day Light](/anteojos-de-sol/vulk/vulk-day-light) o los [Vulk Katleen](/anteojos-de-sol/vulk/vulk-katleen). Y podés ver [todos los anteojos de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "rectangular",
    "gender": "female",
    "line": "urbana",
    "hinge_system": "plastica reforzada",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "has_polarized_variant": true,
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 50, "lens_height_mm": 46, "bridge_mm": 23, "temple_length_mm": 146},
    "weight_grams": 27.3,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-17",
    "callouts": [
      {"type": "info", "position": "top", "title": "Rectangular de patillas anchas", "body": "Frente y patillas de G-Flex, con bisagras plásticas reforzadas. Las patillas anchas le dan presencia al diseño."},
      {"type": "tip", "position": "middle", "title": "Dos polarizadas, dos no", "body": "SBLK/S10 y SDEMI-SBLK/BROWN son polarizadas: reducen los reflejos del agua, el asfalto y las superficies brillantes (de día sí, de noche no) y pueden dificultar ver algunas pantallas (celular, GPS, tablero digital). WALNUT/G.BROWN y L.PINK/L.BROWN no son polarizadas."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 en las cuatro", "body": "Todas bloquean los rayos UVA y UVB (UV400), independiente del polarizado y del color. Las polarizadas son categoría 3, pensada para mucha luz; las no polarizadas, categoría 2, para el uso de todos los días."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Glory Box | 4 Colores, UV400',
  'Lentes de sol Vulk Glory Box para mujer: rectangulares de G-Flex en 4 colores, 2 polarizados y 2 sin polarizar, UV400. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes, items simples de ML (variation_code NULL). Precio y stock de ML (2026-11-17). Las polarizadas primero.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), '116380',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true,"lens_category":3}'::jsonb,
   10489200, 3, true, 1, 'MLA2295470321', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), '116383',
   '{"frame_color":"carey-brillo-patillas-negro-brillo","lens_color":"marron","model_code":"SDEMI-SBLK/BROWN POL","polarized":true,"lens_category":3}'::jsonb,
   10489200, 3, true, 2, 'MLA4205822890', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), '116384',
   '{"frame_color":"marron-brillo","lens_color":"marron-degrade","model_code":"WALNUT/G.BROWN","polarized":false,"lens_category":2,"lens_treatment":["gradient"]}'::jsonb,
   9638400, 3, true, 3, 'MLA4205824002', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), '116382',
   '{"frame_color":"rosa-palido-caramelo","lens_color":"marron-claro","model_code":"L.PINK/L.BROWN","polarized":false,"lens_category":2}'::jsonb,
   9638400, 3, true, 4, 'MLA2295430421', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de la SBLK/S10.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116380'),
   'vulk-glory-box/perfil-sblk.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista lateral, armazón negro brillo con lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116380'),
   'vulk-glory-box/frente-sblk.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista frontal, armazón negro brillo con lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116383'),
   'vulk-glory-box/perfil-sdemi.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista lateral, frente carey brillo con patillas negro brillo y lente marrón polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116383'),
   'vulk-glory-box/frente-sdemi.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista frontal, frente carey brillo con patillas negro brillo y lente marrón polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116384'),
   'vulk-glory-box/perfil-walnut.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista lateral, armazón marrón brillo con lente marrón degradé', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116384'),
   'vulk-glory-box/frente-walnut.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista frontal, armazón marrón brillo con lente marrón degradé', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116382'),
   'vulk-glory-box/perfil-lpink.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista lateral, armazón rosa pálido con caramelo y lente marrón claro', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), (SELECT id FROM public.product_variants WHERE sku='116382'),
   'vulk-glory-box/frente-lpink.jpg', 'Lentes de sol Vulk Glory Box rectangulares para mujer, vista frontal, armazón rosa pálido con caramelo y lente marrón claro', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-glory-box'), NULL,
   'vulk-glory-box/medidas-sblk.jpg', 'Esquema técnico de medidas Vulk Glory Box: lente 50mm, puente 23mm, varilla 146mm, alto total 46mm, ancho total 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Platz (rectangular de mujer de Vulk, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi te gustan los rectangulares de Vulk para mujer, mirá también los [Vulk Glory Box](/anteojos-de-sol/vulk/vulk-glory-box).', updated_at = now()
WHERE slug = 'vulk-platz' AND description NOT LIKE '%vulk-glory-box%';

COMMIT;
