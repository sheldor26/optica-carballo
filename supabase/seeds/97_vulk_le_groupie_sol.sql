-- ============================================
-- Seed 97: Vulk Le Groupie SOL — cat eye unisex, G-Flex, 4 colorways (1 polarizada)
-- Fecha: 2026-08-25
-- ============================================
-- Tercer producto del cruce `pnpm ml:faltantes`. 34 unidades publicadas en ML y sin cargar, con 95
-- ventas acumuladas entre las 8 publicaciones.
--
-- ⚠️ 8 PUBLICACIONES PERO 4 COLORES. Deduplicado por `user_product_id`: MLAU180201119 (MBLK/S10 POL,
-- 9 u), MLAU3251681255 (388/CH74, 12 u), MLAU167065810 (M0 445/907, 8 u) y MLAU163138992
-- (SBLK/S15, 5 u). Contar por publicación daba 68.
--
-- 📸 FOTOS: del sitio del fabricante, vulkeyewear.com. El founder pasó la URL de una variante y de
-- ahí salió el patrón: `/eyewear/sunglasses/g-flex/le-groupie<CODIGO>/`, con los códigos
-- `388--ch74`, `m0445--907`, `mblk--s10-pol` y `sblk--s15`. Las imágenes están en
-- `/img/productos/<hash>.jpg` a 900x442.
-- ⚠️ Cada página trae 6 hashes pero **4 son compartidos entre las 4 páginas**: ésos son las
-- miniaturas del selector de variantes (el FRENTE de cada colorway). El que aparece sólo en una
-- página es su PERFIL. El pareo se confirmó por dos vías: la unicidad del hash y el color de la
-- foto.
--
-- 📏 MEDIDAS: 141 / 50 x 50 / 14 / 140 mm y 20 g — pasadas por el founder, única fuente válida
-- (regla dura 7 de CLAUDE.md). Geometría: 50x2 + 14 = 114 ≤ 141. ✓ Es el más liviano del catálogo.
-- El fabricante publica su propia placa y ML declara los atributos, pero ninguna de esas dos
-- fuentes es admisible para medidas.
--
-- ⚠️ DOS DECISIONES DEL FOUNDER, porque sus fuentes se contradecían:
--   · **Forma = `cat_eye`**. Los atributos de sus 8 publicaciones dicen "Ojo de gato" pero uno de
--     sus títulos dice "Redondo", y las fotos parecen redondas con un leve levante. Eligió cat eye.
--     Dato que pesó en la decisión: la faceta `/anteojos-de-sol/cat-eye` existía y estaba **vacía**
--     — ningún producto usaba el valor `cat_eye`. Este lo estrena. Verificado en producción.
--   · **388/CH74 = `marron-transparente`**. En la foto del fabricante el armazón se ve rosa/salmón
--     translúcido, pero eligió el nombre que declara su publicación.
--
-- HONESTIDAD: sólo 1 de 4 polarizada (la MBLK/S10) → NO se afirma "polarizados" para el modelo en
-- title/H1, y el callout `warning` dice explícitamente que es una sola.
--
-- SEO: primaria `anteojos de sol cat eye` (40/mes) + `lentes de sol cat eye` (50). Volumen chico
-- pero es un carril **enteramente libre**: ningún producto del catálogo usaba la forma. Head de
-- marca de soporte: `lentes de sol vulk` (1.300) y `anteojos de sol vulk` (880), que los pelea el
-- hub de marca. NO tomar `anteojos cat eye` (320): es intención de armazón de receta, no de sol.
--
-- `pnpm auditar:encuadre --todas`: las 8 fotos en 92% con scale 1.00. Sin overrides.
--
-- 🐛 Al crear el producto, la PDP devolvió 404 durante ~5 minutos aunque la faceta ya lo listaba.
-- Era un 404 cacheado por ISR (`revalidate = 300`) de la primera request, hecha apenas terminado el
-- INSERT. No hay que tocar nada: se destraba solo al vencer el TTL.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-le-groupie', 'Vulk Le Groupie',
  'Anteojos de sol Vulk Le Groupie: cat eye unisex de G-Flex, con lente de policarbonato y 100% protección UV (UV400, categoría 3). Disponible en 4 colores, uno de ellos polarizado.',
  E'Los **Vulk Le Groupie** son **anteojos de sol cat eye, unisex**, con frente y patillas de **G-Flex**.\n\nLa **lente es de policarbonato**, con **100% protección UV (UV400) y categoría 3** en los cuatro colores.\n\nMedidas: frente 141 mm · lente 50 mm de ancho × 50 mm de alto · puente 14 mm · varilla 140 mm. Pesan 20 g.\n\nDisponible en 4 colores:\n\n• **Negro mate, lente gris oscuro** — **polarizada**.\n• **Negro brillo, lente gris oscuro.**\n• **Marrón transparente, lente marrón degradé.**\n• **Carey, lente marrón degradé.**\n\n**El filtro polarizado lo tiene sólo el negro mate.** Los cuatro filtran el 100% de la radiación UV, pero únicamente el polarizado corta los reflejos del asfalto y del agua. Los otros tres no lo llevan.\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cat_eye",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 20,
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 50, "lens_height_mm": 50, "bridge_mm": 14, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cat eye unisex en G-Flex", "body": "Frente y patillas de G-Flex. Forma cat eye, con el borde superior levemente levantado, en cuatro combinaciones: dos negras, una marrón transparente y una carey."},
      {"type": "warning", "position": "middle", "title": "El filtro polarizado lo tiene sólo 1 de los 4 colores", "body": "Únicamente el negro mate con lente gris oscuro es polarizado. Los otros tres filtran el 100% de la radiación UV igual, pero no cortan los reflejos del asfalto ni del agua."},
      {"type": "tip", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Los cuatro colores llevan la misma lente de policarbonato: 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1382286207", "MLA1563834906", "MLA1506698031", "MLA1529887450"], "imported_at": "2026-08-25"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Vulk Le Groupie Cat Eye | Óptica Carballo',
  'Anteojos de sol Vulk Le Groupie: cat eye unisex de G-Flex, lente de policarbonato UV400 categoría 3, en 4 colores. Envío a todo el país con estuche y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Las cuatro son items SIMPLES de ML → variation_code NULL. Se mapea una publicación por pozo de
-- stock; la gemela de cada par queda sin vincular (un `mercadolibre_item_id` por variante).
-- SKUs reales del fabricante, pasados por el founder: ninguna publicación declara `SELLER_SKU`.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), '125265',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   10014100, 9, true, 1, 'MLA1382286207', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), '125263',
   '{"frame_color":"marron-transparente","lens_color":"marron-degrade","model_code":"388/CH74","polarized":false}'::jsonb,
   8942700, 12, true, 2, 'MLA1506698031', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), '125264',
   '{"frame_color":"carey","lens_color":"marron-degrade","model_code":"M0 445/907","polarized":false}'::jsonb,
   8942700, 8, true, 3, 'MLA1529887450', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), '125261',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S15","polarized":false}'::jsonb,
   8942700, 5, true, 4, 'MLA1563834906', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la MBLK/S10 POL, la única polarizada y la de más ventas.
-- La placa de medidas va con variant_id NULL y sort 99, como en todos los productos.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125265'),
   'vulk-le-groupie/perfil-mblk-s10.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista lateral, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125265'),
   'vulk-le-groupie/frente-mblk-s10.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista frontal, armazón negro mate lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125263'),
   'vulk-le-groupie/perfil-388-ch74.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista lateral, armazón marrón transparente lente marrón degradé', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125263'),
   'vulk-le-groupie/frente-388-ch74.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista frontal, armazón marrón transparente lente marrón degradé', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125264'),
   'vulk-le-groupie/perfil-m0445-907.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista lateral, armazón carey lente marrón degradé', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125264'),
   'vulk-le-groupie/frente-m0445-907.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista frontal, armazón carey lente marrón degradé', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125261'),
   'vulk-le-groupie/perfil-sblk-s15.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista lateral, armazón negro brillo lente gris oscuro', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), (SELECT id FROM public.product_variants WHERE sku='125261'),
   'vulk-le-groupie/frente-sblk-s15.jpg', 'Anteojos de sol Vulk Le Groupie cat eye unisex vista frontal, armazón negro brillo lente gris oscuro', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-le-groupie'), NULL,
   'vulk-le-groupie/medidas.jpg', 'Esquema técnico de medidas Vulk Le Groupie: frente 141mm, lente 50x50mm, puente 14mm, varilla 140mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
