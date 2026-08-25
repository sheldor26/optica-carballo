-- ============================================
-- Seed 96: Rusty Blozon SOL — cuadrado masculino, G-Flex, 4 colorways (3 polarizadas)
-- Fecha: 2026-08-25
-- ============================================
-- Segundo producto del cruce `pnpm ml:faltantes`. 46 unidades publicadas en ML y sin cargar,
-- con 55 ventas acumuladas.
--
-- ⚠️ 7 PUBLICACIONES PERO 4 COLORES. Deduplicado por `user_product_id`, que es la clave del pozo
-- de stock: MLAU364239693 (MBLK/S10, 23 u), MLAU364241493 (SBLK/S10, 15 u), MLAU3055447018
-- (MBLK/REVO RED, 4 u) y MLAU3240740069 (MBLU/REVO BLUE, 4 u). Contar por publicación daba 88.
--
-- 📸 LAS FOTOS SALIERON DE LAS PROPIAS PUBLICACIONES DE ML, no del fabricante ni del founder.
-- El Blozon no está en rustyoptical.com (se revisó el índice completo de sol). Pero las galerías
-- de ML tienen fotos limpias sobre fondo blanco, de perfil y de frente, de las cuatro colorways.
-- **Cómo bajarlas en resolución usable**: el `secure_url` de `/items/{id}` sirve 500 px aunque la
-- URL termine en `-O`. Hay que pedir `GET /pictures/{picture_id}` y quedarse con la variación más
-- grande de `variations[]`, que ahí sí trae las de 1100-1200 px. Sin ese paso las placas salen
-- pixeladas.
-- ⚠️ Ojo con cuál foto es el frente: en MBLK/S10 y SBLK/S10 la segunda foto de la galería es otra
-- toma de tres cuartos, y el frente real está en la #5 y la #3. Hay que mirarlas, no asumir que la
-- 1 es perfil y la 2 es frente.
--
-- 📏 EL ANCHO DEL FRENTE SALIÓ DE UNA PLACA DE MEDIDAS DENTRO DE LA GALERÍA DE ML. La foto #4 de
-- MLA1755867522 es la placa vieja del founder y dice **142 mm**, dato que no está en ningún
-- atributo. Conviene mirar las galerías completas antes de pedirle medidas al founder.
-- ⚠️ Esa placa dice además **alto 48** y **varilla 137**, contra los atributos de ML que dicen
-- `LENS_HEIGHT = 4.2 cm` y `TEMPLE_LENGTH = 14 cm`. El 48 no es contradicción: como en el Bruice,
-- es la altura del ARMAZÓN, no la del cristal. La varilla sí: 137 vs 140. Se cargó **140**, que es
-- lo que declaran 3 de las 4 publicaciones, y el desempate quedó en DATOS_PENDIENTES.md.
--
-- ⚠️ BISAGRAS PLÁSTICAS, no metálicas. Lo dice el callout de la placa vieja del founder en la
-- galería de ML. Es distinto del Bruice y del Malice, que son metálicas — no asumir por marca.
--
-- HONESTIDAD: 3 de 4 polarizadas → NO se afirma "polarizados" para el modelo entero en title/H1
-- (criterio Play/Patien/Yeah). La que no polariza es la azul mate con lente espejada azul, y se
-- nombra explícitamente en el callout `warning`.
--
-- frame_shape "cuadrado" y gender "male": los atributos de ML dicen "Cuadrada"/"Cuadrado"/
-- "Rectangular" según la publicación, y dos de las cuatro declaran `GENDER = Hombre`. Mismo
-- criterio que en el Malice, que el founder confirmó. Recordar que **"cuadrado" no tiene faceta de
-- forma en el sitio** (`brand-filters.ts` sólo expone wayfarer, aviador, cat-eye y rectangular).
--
-- SEO — ⚠️ COMPARTE FORMA Y GÉNERO CON EL MALICE, así que hubo que separarlos. Se aplicó el mismo
-- criterio que ya usa el cluster para Yeah vs The Take (SEO_STRATEGY.md): **el carril se parte entre
-- la variante "lentes" y la variante "anteojos"**.
--   Malice → `lentes de sol cuadrados hombre` (90/mes)
--   Blozon → `anteojos de sol cuadrados hombre` (70/mes)
-- Ninguno toma `lentes de sol cuadrados` (390, es de Zinz, unisex) ni `lentes de sol hombre rusty`
-- (480, es de Play, marca+género sin forma). Diferenciadores físicos reales para el copy: Blozon
-- tiene bisagras PLÁSTICAS, calibre 53 y 4 colores con dos espejadas; Malice tiene bisagras
-- METÁLICAS, calibre 59 y 3 colores. Cross-link obligatorio Blozon ↔ Malice ↔ Zinz ↔ Play.
--
-- FALTA: el peso. Anotado en DATOS_PENDIENTES.md.
-- `pnpm auditar:encuadre --todas`: las 8 fotos en 92% con scale 1.00, banda de la grilla de sol.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-blozon', 'Rusty Blozon',
  'Anteojos de sol Rusty Blozon: cuadrados masculinos, armazón G-Flex con bisagras plásticas. Lente de policarbonato con 100% protección UV (UV400, categoría 3). Polarizados en 3 de los 4 colores.',
  E'Los **Rusty Blozon** son **anteojos de sol cuadrados, de línea masculina**, con frente y patillas de **G-Flex** y **bisagras plásticas**.\n\nLa **lente es de policarbonato**, con **100% protección UV (UV400) y categoría 3** en los cuatro colores.\n\nDisponible en 4 colores:\n\n• **Negro mate, lente gris oscuro** — **polarizada**.\n• **Negro brillo, lente gris oscuro** — **polarizada**.\n• **Negro mate, lente espejada roja** — **polarizada**.\n• **Azul mate, lente espejada azul** — no polarizada.\n\n**El filtro polarizado lo tienen 3 de los 4 colores.** Los cuatro filtran el 100% de la radiación UV, pero sólo los polarizados cortan los reflejos del asfalto y del agua. El azul mate con lente espejada azul es el que no lo lleva.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cuadrado",
    "hinge_system": "plastica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "male",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado masculino en G-Flex", "body": "Frente y patillas de G-Flex, con bisagras plásticas. Forma cuadrada de línea masculina, en cuatro combinaciones de armazón y lente: dos negras, una azul mate y una con lente espejada roja."},
      {"type": "warning", "position": "middle", "title": "El filtro polarizado lo tienen 3 de los 4 colores", "body": "El azul mate con lente espejada azul NO es polarizado. Filtra el 100% de la radiación UV igual que los otros tres, pero no corta los reflejos del asfalto ni del agua."},
      {"type": "tip", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Los cuatro colores llevan la misma lente de policarbonato: 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1755673526", "MLA1755867522", "MLA2123522902", "MLA2025464396"], "imported_at": "2026-08-25"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Blozon Cuadrados Hombre | Carballo',
  'Anteojos de sol Rusty Blozon: cuadrados de hombre, armazón G-Flex y lente de policarbonato UV400 categoría 3. Polarizados en 3 de 4 colores. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Las cuatro son items SIMPLES de ML (0 variaciones) → variation_code NULL en las cuatro.
-- Se mapea una publicación por pozo de stock; la gemela de cada par queda sin vincular porque no
-- se puede (un `mercadolibre_item_id` por variante).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), 'BLOZON-MBLK-S10-POL',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   8946800, 23, true, 1, 'MLA1755673526', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), 'BLOZON-SBLK-S10-POL',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   8946800, 15, true, 2, 'MLA1755867522', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), 'BLOZON-MBLK-REVO-RED',
   '{"frame_color":"negro-mate","lens_color":"espejado-rojo","model_code":"MBLK/REVO RED POL","polarized":true}'::jsonb,
   9226600, 4, true, 3, 'MLA2025464396', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), 'BLOZON-MBLU-REVO-BLUE',
   '{"frame_color":"azul-mate","lens_color":"azul-espejado","model_code":"MBLU/REVO BLUE","polarized":false}'::jsonb,
   8666100, 4, true, 4, 'MLA2123522902', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- ⚠️ Tres archivos llevan sufijo `-v2`. Los dos frentes, porque los primeros que se subieron eran
-- otra toma de tres cuartos y no un frente. Y el perfil de la MBLK/S10 —que es la foto PRIMARIA del
-- producto— porque el founder pasó una toma mejor después (`marketing/fotos/blozon/`). El nombre
-- nuevo es obligatorio al reemplazar: la imagen optimizada de Next se cachea 31 días POR PATH, así
-- que pisar el archivo dejaría la vieja a la vista. Los archivos anteriores quedaron en el bucket
-- sin referenciar.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-MBLK-S10-POL'),
   'rusty-blozon/perfil-mblk-s10-v2.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista lateral, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-MBLK-S10-POL'),
   'rusty-blozon/frente-mblk-s10-v2.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista frontal, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-SBLK-S10-POL'),
   'rusty-blozon/perfil-sblk-s10.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista lateral, armazón negro brillo lente gris oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-SBLK-S10-POL'),
   'rusty-blozon/frente-sblk-s10-v2.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista frontal, armazón negro brillo lente gris oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-MBLK-REVO-RED'),
   'rusty-blozon/perfil-mblk-revo-red.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista lateral, armazón negro mate lente espejada roja polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-MBLK-REVO-RED'),
   'rusty-blozon/frente-mblk-revo-red.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista frontal, armazón negro mate lente espejada roja polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-MBLU-REVO-BLUE'),
   'rusty-blozon/perfil-mblu-revo-blue.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista lateral, armazón azul mate lente espejada azul', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-blozon'), (SELECT id FROM public.product_variants WHERE sku='BLOZON-MBLU-REVO-BLUE'),
   'rusty-blozon/frente-mblu-revo-blue.jpg', 'Anteojos de sol Rusty Blozon cuadrados hombre vista frontal, armazón azul mate lente espejada azul', 2000, 1333, 7, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
