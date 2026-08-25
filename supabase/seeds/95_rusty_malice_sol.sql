-- ============================================
-- Seed 95: Rusty Malice SOL — cuadrado masculino, G-Flex, 3 colorways (2 polarizadas)
-- Fecha: 2026-08-25
-- ============================================
-- Primer producto cargado a partir del cruce `pnpm ml:faltantes`: el founder tenía 54 unidades del
-- Malice publicadas en Mercado Libre y sin cargar en el sitio, con 64 ventas acumuladas — la
-- demanda mejor validada que tenía sin catalogar.
--
-- ⚠️ MEDIDAS PENDIENTES. El founder no las tenía a mano y las mide él (ver la regla de siempre: la
-- ficha del fabricante no gana contra su medición). De sus propios atributos de ML salen calibre 59,
-- puente 16, varilla 155 y alto de lente 41 — pero **falta el ancho total del frente y el peso**, y
-- hay que desempatar el alto: dos publicaciones dicen 4.1 cm y una dice 5.9 cm, que es casi seguro
-- un copy-paste del ancho. Por eso este seed NO carga `measurements` todavía: mejor sin el bloque
-- que con un número inventado. Anotado en BACKLOG. Cuando lleguen, agregar `measurements` y generar
-- la placa de medidas (`pnpm placas --solo 4`), que hoy tampoco está.
--
-- ⚠️ 6 PUBLICACIONES PERO 3 COLORES. Cada colorway está publicada dos veces con títulos distintos.
-- Se confirmó con el `user_product_id`, que se repite de a pares — mismo User Product = mismo pozo
-- de stock. Contar por publicación daba 108 unidades cuando son 54. Se mapea la publicación que
-- indicó el founder de cada par; la gemela queda sin vincular (no se puede: un `mercadolibre_item_id`
-- por variante). Ver MISTAKES 2026-08-25 sobre el conteo inflado.
--
-- VARIANTES:
--   MALICE-MBLK-S10-POL     MLA1529925840  $96.205  stock 18  negro mate  / gris oscuro POLARIZADA
--   MALICE-SBLK-S10-POL     MLA1430095941  $96.205  stock 25  negro brillo/ gris oscuro POLARIZADA
--   MALICE-MBLK-REVO-BLUE   MLA1507015278  $92.810  stock 11  negro mate  / azul espejada, NO pol
--   El SKU es sintético: ninguna de las tres publicaciones declara `SELLER_SKU` y el founder no
--   pasó códigos de fabricante. Si aparecen los reales, renombrar.
--   Precio distinto entre variantes: las polarizadas valen más, como en el Bruice.
--
-- HONESTIDAD: 2 de 3 polarizadas → NO se afirma "polarizados" para el modelo entero en title/H1
-- (criterio Play/Patien/Yeah). Se acota en copy y en un callout `warning` que nombra cuál sí y
-- cuál no.
--
-- frame_shape "cuadrado" y gender "male" — los dio el founder explícitamente ("diseño cuadrado para
-- hombre"). ⚠️ Sus publicaciones declaran `GENDER = "Sin género"` y dos de tres `FRAME_SHAPE =
-- "Rectangular"`; gana él, que tiene el producto en la mano, pero conviene alinear ML después.
-- Ojo que "cuadrado" NO tiene faceta de forma en el sitio: `lib/catalog/brand-filters.ts` sólo
-- expone wayfarer, aviador, cat-eye y rectangular. El Malice no entra a ninguna faceta de forma.
--
-- SEO: primaria `lentes de sol cuadrados hombre` (90/mes, CSV de KEYWORDS OPTICA). Es forma+género,
-- un carril que no pisa a nadie del cluster: **Zinz** tiene `lentes de sol cuadrados` (390) pero es
-- unisex y no pelea género; **Play** tiene `lentes de sol hombre rusty` (480) pero es marca+género y
-- no pelea forma. Malice se queda con la combinación. Variante hermana:
-- `anteojos de sol cuadrados hombre` (70). NO tomar `anteojos de sol hombre` (3.600) ni
-- `lentes de sol hombre` (5.400): son head genéricos, fuera de alcance para nuestra DA.
-- Cross-link esperado: Malice ↔ Zinz ↔ Play (los cuadrados/masculinos de Rusty sol).
--
-- 📸 FOTOS: 6 archivos en products/rusty-malice/, 2000×1333, generados con `pnpm placas` desde las
-- fotos que dejó el founder en `marketing/fotos/malice/` y subidos con `pnpm fotos:subir`.
-- ⚠️ El Malice NO está en rustyoptical.com — se revisó el índice completo de sol — así que esas
-- fotos son la única fuente. Convención de nombres del founder: `AGALERIA-*` es el FRENTE y
-- `GALERIA-*` el PERFIL.
-- Primaria = perfil de la MBLK/S10 POL, que es la de más ventas del trío.
-- `pnpm auditar:encuadre --todas`: las 6 en 92% con scale 1.00, que es la banda de la grilla de sol
-- (89-93%). Sin overrides.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-malice', 'Rusty Malice',
  'Anteojos de sol Rusty Malice: cuadrados masculinos, armazón G-Flex con bisagras metálicas flex. Lente de policarbonato con 100% protección UV (UV400, categoría 3). Polarizados en 2 de los 3 colores.',
  E'Los **Rusty Malice** son **anteojos de sol cuadrados, de línea masculina**. Frente y patillas de **G-Flex**, con **bisagras metálicas con sistema flex**.\n\nLa **lente es de policarbonato**, con **100% protección UV (UV400) y categoría 3** en los tres colores.\n\nDisponible en 3 colores:\n\n• **Negro mate, lente gris oscuro** — **polarizada**.\n• **Negro brillo, lente gris oscuro** — **polarizada**.\n• **Negro mate, lente azul espejada** — no polarizada.\n\n**El filtro polarizado lo tienen 2 de los 3 colores.** Los tres filtran el 100% de la radiación UV, pero sólo los polarizados cortan los reflejos del asfalto y del agua. Fijate cuál elegís, y si tenés dudas escribinos.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cuadrado",
    "hinge_system": "metalica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "male",
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado masculino en G-Flex", "body": "Frente y patillas de G-Flex con bisagras metálicas de sistema flex. Forma cuadrada, de línea masculina, en tres combinaciones de armazón y lente."},
      {"type": "warning", "position": "middle", "title": "El filtro polarizado lo tienen 2 de los 3 colores", "body": "Los dos de lente gris oscuro son polarizados. El de lente azul espejada NO lo es: filtra el 100% de la radiación UV igual, pero no corta los reflejos del asfalto ni del agua."},
      {"type": "tip", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Los tres colores llevan la misma lente de policarbonato: 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1529925840", "MLA1507015278", "MLA1430095941"], "imported_at": "2026-08-25"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Malice Cuadrados Hombre | Carballo',
  'Anteojos de sol Rusty Malice: cuadrados de hombre, armazón G-Flex y lente de policarbonato UV400 categoría 3. Polarizados en 2 de 3 colores. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Las tres son items SIMPLES de ML (0 variaciones) → variation_code NULL en las tres.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), 'MALICE-MBLK-S10-POL',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   9620500, 18, true, 1, 'MLA1529925840', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), 'MALICE-SBLK-S10-POL',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   9620500, 25, true, 2, 'MLA1430095941', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), 'MALICE-MBLK-REVO-BLUE',
   '{"frame_color":"negro-mate","lens_color":"azul-espejado","model_code":"MBLK/REVO BLUE","polarized":false}'::jsonb,
   9281000, 11, true, 3, 'MLA1507015278', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Sin fila de medidas todavía: la placa no se generó porque faltan datos (ver cabecera).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), (SELECT id FROM public.product_variants WHERE sku='MALICE-MBLK-S10-POL'),
   'rusty-malice/perfil-mblk-s10.jpg', 'Anteojos de sol Rusty Malice cuadrados hombre vista lateral, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), (SELECT id FROM public.product_variants WHERE sku='MALICE-MBLK-S10-POL'),
   'rusty-malice/frente-mblk-s10.jpg', 'Anteojos de sol Rusty Malice cuadrados hombre vista frontal, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), (SELECT id FROM public.product_variants WHERE sku='MALICE-SBLK-S10-POL'),
   'rusty-malice/perfil-sblk-s10.jpg', 'Anteojos de sol Rusty Malice cuadrados hombre vista lateral, armazón negro brillo lente gris oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), (SELECT id FROM public.product_variants WHERE sku='MALICE-SBLK-S10-POL'),
   'rusty-malice/frente-sblk-s10.jpg', 'Anteojos de sol Rusty Malice cuadrados hombre vista frontal, armazón negro brillo lente gris oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), (SELECT id FROM public.product_variants WHERE sku='MALICE-MBLK-REVO-BLUE'),
   'rusty-malice/perfil-revoblue.jpg', 'Anteojos de sol Rusty Malice cuadrados hombre vista lateral, armazón negro mate lente azul espejada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-malice'), (SELECT id FROM public.product_variants WHERE sku='MALICE-MBLK-REVO-BLUE'),
   'rusty-malice/frente-revoblue.jpg', 'Anteojos de sol Rusty Malice cuadrados hombre vista frontal, armazón negro mate lente azul espejada', 2000, 1333, 5, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
