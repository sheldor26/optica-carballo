-- ============================================
-- Seed 203: Vulk THE PHONE (sol, mujer, redondo, G-Flex), 4 variantes: 3 polarizadas + 1 no
-- Fecha: 2026-11-16
-- ============================================
-- 4 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-16 (las creó el founder; $89.615 y stock 3 en las cuatro):
--   107113  STEELBLUE/DRT-03 POL   MLA2294653879  gris azulado transparente, lente gris oscuro degradé, POLARIZADA
--   107111  SBLK / DRWG15C3 POL    MLA4204447852  negro brillo, lente verde oscuro, POLARIZADA
--   107112  L.PINK/DRT-04 POL      MLA4204508782  rosa pálido / caramelo, lente verde oscuro degradé, POLARIZADA
--   107110  BROWN/HD-GG47          MLA4204509064  marrón brillo, lente verde claro degradé, NO polarizada (publicación aparte en ML)
--   SKU = los del founder (107110-107113); la ficha de Vulk lista 960050-960053.
-- DATOS DEL FOUNDER (2026-11-16): mujer; redondo; G-Flex; policarbonato; UV400; categoría 3; bisagras plásticas sin flex; detalles metálicos (tachones) a los costados de las lentes; se pueden adaptar lentes graduadas; medidas 51-24-143, altura total 54 (se carga tal cual en lens_height_mm), ancho total 154 (2×51+24 = 126: plausible por los aros anchos; anotado para confirmar).
--   Vulk (ficha): G-Flex frente y patillas, 25,2 g, "Polarizada" en SBLK/L.PINK/STEELBLUE. Se carga el peso de la ficha.
-- 🔬 Sin "flexible" ni "liviano"; "polarizado" sólo en las tres polarizadas; graduación: se deja la FAQ de la PDP por defecto ("Sí, escribinos por WhatsApp"), sin nombrar tipos de lente.
-- 🎯 SEO (seo-strategist + CSV Ubersuggest): slug `vulk-the-phone`; primaria "lentes de sol vulk" (1.300/8) en el primer párrafo; meta_title con "Polarizados" (3 de 4) y SIN "Mujer" (lo reclama Vulk Anima), "redondos" sólo en copy y alt (Blinded/Etiquet lo lideran), sin "femeninos"/"cuadrados"; "anteojos de sol redondos mujer" (110/18) libre; cross-links a Etiquet, Lady Piny, Bennie 51, Cinema, Anima y al hub de Vulk; frase de vuelta sólo desde Lady Piny.
-- ⚠️ model_code con "POL" SÓLO en las 3 polarizadas (\bPOL\b las mete en /polarizados); la marrón no lo lleva. `lens_treatment` del producto sin "polarized" (marcaría todas las variantes).
-- 📸 Fotos oficiales de Vulk (variante por variante desde el selector), `pnpm placas --tipo sol --sin-vision`, `pnpm fotos:subir --slug vulk-the-phone --sufijo -<variante>`. Primaria = perfil de la STEELBLUE.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-the-phone', 'Vulk The Phone',
  'Lentes de sol Vulk The Phone: diseño redondo para mujer, armazón de G-Flex con bisagras plásticas y detalles metálicos a los costados de las lentes. Policarbonato UV400 categoría 3, tres de las cuatro versiones polarizadas. Se pueden adaptar lentes graduadas.',
  E'Los **lentes de sol Vulk The Phone** tienen un **diseño redondo para mujer**, con frente y patillas de **G-Flex**, **bisagras plásticas** y pequeños **detalles metálicos a los costados de las lentes**.\n\nLas lentes son de **policarbonato**, con protección **UV400** (bloquean los rayos UVA y UVB) y **categoría 3**, pensada para mucha luz. Tres de las cuatro versiones son **polarizadas**: reducen los reflejos del agua, el asfalto y las superficies brillantes, sirven para manejar de día (de noche no) y pueden dificultar ver algunas pantallas (celular, GPS, tablero digital). El polarizado y el UV400 son cosas distintas.\n\nMedidas: frente 154 mm · lente 51 mm · puente 24 mm · varilla 143 mm · alto total 54 mm.\n\nDisponible en 4 versiones:\n\n• STEELBLUE/DRT-03 POL (SKU 107113): armazón gris azulado transparente con lente gris oscuro degradé, polarizada.\n• SBLK / DRWG15C3 POL (SKU 107111): negro brillo con lente verde oscuro, polarizada.\n• L.PINK/DRT-04 POL (SKU 107112): rosa pálido con caramelo y lente verde oscuro degradé, polarizada.\n• BROWN/HD-GG47 (SKU 107110): marrón brillo con lente verde claro degradé, **no polarizada**.\n\nSe les pueden adaptar lentes graduadas: consultanos por WhatsApp.\n\nSi te gustan los redondos, mirá también los [Rusty Etiquet](/anteojos-de-sol/rusty/rusty-etiquet), los [Vulk Lady Piny](/anteojos-de-sol/vulk/vulk-lady-piny), los [Vulk Bennie 51](/anteojos-de-sol/vulk/vulk-bennie-51) o los [Vulk Cinema](/anteojos-de-sol/vulk/vulk-cinema). Y podés ver [todos los anteojos de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "redondo",
    "gender": "female",
    "line": "urbana",
    "hinge_system": "plastica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "has_polarized_variant": true,
    "measurements": {"frame_width_mm": 154, "lens_width_mm": 51, "lens_height_mm": 54, "bridge_mm": 24, "temple_length_mm": 143},
    "weight_grams": 25.2,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-16",
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo con detalles metálicos", "body": "Frente y patillas de G-Flex, con bisagras plásticas y pequeños detalles metálicos a los costados de las lentes."},
      {"type": "tip", "position": "middle", "title": "Tres versiones polarizadas, una no", "body": "El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes (de día sí, de noche no) y puede dificultar ver algunas pantallas (celular, GPS, tablero digital). La versión BROWN/HD-GG47 no es polarizada."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 y categoría 3", "body": "Las lentes bloquean los rayos UVA y UVB (UV400), independiente del polarizado y del color. Categoría 3, pensada para mucha luz. Se pueden adaptar lentes graduadas."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk The Phone Polarizados | UV400',
  'Lentes de sol Vulk The Phone para mujer: diseño redondo, G-Flex, UV400 cat. 3. 4 versiones, 3 polarizadas. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes, items simples de ML (variation_code NULL). Precio y stock de ML (2026-11-16).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), '107113',
   '{"frame_color":"gris-azulado-transparente","lens_color":"gris-oscuro-degrade","model_code":"STEELBLUE/DRT-03 POL","polarized":true,"lens_treatment":["gradient"]}'::jsonb,
   8961500, 3, true, 1, 'MLA2294653879', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), '107111',
   '{"frame_color":"negro-brillo","lens_color":"verde-oscuro","model_code":"SBLK / DRWG15C3 POL","polarized":true}'::jsonb,
   8961500, 3, true, 2, 'MLA4204447852', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), '107112',
   '{"frame_color":"rosa-palido-caramelo","lens_color":"verde-oscuro-degrade","model_code":"L.PINK/DRT-04 POL","polarized":true,"lens_treatment":["gradient"]}'::jsonb,
   8961500, 3, true, 3, 'MLA4204508782', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), '107110',
   '{"frame_color":"marron-brillo","lens_color":"verde-claro-degrade","model_code":"BROWN/HD-GG47","polarized":false,"lens_treatment":["gradient"]}'::jsonb,
   8961500, 3, true, 4, 'MLA4204509064', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de la STEELBLUE.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107113'),
   'vulk-the-phone/perfil-steelblue.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista lateral, armazón gris azulado transparente con lente gris oscuro degradé polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107113'),
   'vulk-the-phone/frente-steelblue.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista frontal, armazón gris azulado transparente con lente gris oscuro degradé polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107111'),
   'vulk-the-phone/perfil-sblk.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista lateral, armazón negro brillo con lente verde oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107111'),
   'vulk-the-phone/frente-sblk.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista frontal, armazón negro brillo con lente verde oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107112'),
   'vulk-the-phone/perfil-lpink.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista lateral, armazón rosa pálido con caramelo y lente verde oscuro degradé polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107112'),
   'vulk-the-phone/frente-lpink.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista frontal, armazón rosa pálido con caramelo y lente verde oscuro degradé polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107110'),
   'vulk-the-phone/perfil-brown.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista lateral, armazón marrón brillo con lente verde claro degradé', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), (SELECT id FROM public.product_variants WHERE sku='107110'),
   'vulk-the-phone/frente-brown.jpg', 'Lentes de sol Vulk The Phone redondos para mujer, vista frontal, armazón marrón brillo con lente verde claro degradé', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-the-phone'), NULL,
   'vulk-the-phone/medidas-steelblue.jpg', 'Esquema técnico de medidas Vulk The Phone: lente 51mm, puente 24mm, varilla 143mm, alto total 54mm, ancho total 154mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Lady Piny (redondo femenino de Vulk, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi buscás un redondo de Vulk con detalles metálicos y versiones polarizadas, mirá los [Vulk The Phone](/anteojos-de-sol/vulk/vulk-the-phone).', updated_at = now()
WHERE slug = 'vulk-lady-piny' AND description NOT LIKE '%vulk-the-phone%';

COMMIT;
