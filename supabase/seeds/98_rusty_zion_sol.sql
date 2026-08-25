-- ============================================
-- Seed 98: Rusty Zion SOL — redondo unisex, grilamid + patillas de metal, 4 colorways (todas pol)
-- Fecha: 2026-08-25
-- ============================================
-- Cuarto producto del cruce `pnpm ml:faltantes`.
--
-- ⚠️ EL CRUCE DECÍA 8 COLORES Y 52 UNIDADES. SON 4 Y 26. Es un patrón de duplicación NUEVO, distinto
-- al de los anteriores: acá el mismo producto está publicado **una vez como item multi-variación**
-- (MLA2007517918, 4 variaciones) **y otra vez como 4 items simples sueltos** (MLA2311394646,
-- MLA2312226560, MLA1895193345, MLA1894184025), con los mismos stocks (8, 4, 3, 11).
-- `pnpm ml:faltantes` NO lo detecta: deduplica por `user_product_id`, y en este caso las
-- variaciones y los items simples tienen UPs distintos aunque compartan el inventario físico.
-- Señal para reconocerlo a ojo: un modelo que aparece con un item multi-variación Y items simples,
-- con la misma lista de stocks. Anotado como mejora pendiente del script.
--
-- Se mapea el item MULTI-VARIACIÓN, que cubre las 4 en un solo `mercadolibre_item_id` con
-- `variation_code` real — es lo que necesita `syncStockFromMLItem`. Los 4 simples quedan sin
-- vincular (no se puede: un item por variante).
--
-- 📏 MEDIDAS: 145 / 50 x 50 / 19 / 142 mm y 26,9 g — pasadas por el founder, única fuente válida
-- (regla dura 7 de CLAUDE.md). Su "altura total" mapea a `lens_height_mm`, como en los demás.
-- Geometría: 50x2 + 19 = 119 ≤ 145. ✓
--
-- 📸 FOTOS del fabricante (rustyoptical.com/sunglasses/ss24/zion), que tiene 6 colorways — 2 más de
-- las que el founder vende. Tres de las cuatro salieron de ahí:
--   SBLK/D.GUN S10 → sku 128740 · F223/J.GOLD DRT02 → sku 128720 · 0292/J.GOLD DRT04 → sku 128749
-- ⚠️ La cuarta, **SDEMI-D.GUN/DRT15**, NO está en el fabricante: el que él publica es
-- SDEMI-D.GUN/**UB14** (sku 128746), mismo armazón pero otro lente. Usar esa foto habría mostrado
-- un color de cristal que no es el que se vende. Sus fotos salieron de la publicación de ML
-- (MLA2311394646), bajadas por `GET /pictures/{id}` para tener resolución. Su SKU quedó sintético.
-- ⚠️ En esa publicación las fotos 1 y 2 venían INVERTIDAS respecto de la convención (la 1 era el
-- frente y la 2 el perfil). Hay que mirarlas siempre.
--
-- ⚠️ LOS ATRIBUTOS DE ML DICEN QUE EL LENTE ES "GRILAMID". Es falso: grilamid es un polímero de
-- armazón, no de lente. Se cargó `lens_material: policarbonato`, que es el default documentado del
-- proyecto para anteojos de sol (memoria `default-sol-cat3-policarbonato-uv`).
-- `temple_material` NO se carga: los atributos dicen grilamid pero en las fotos las patillas son
-- claramente metálicas, y no hay fuente confiable para el dato. Anotado en DATOS_PENDIENTES.
-- `frame_material: grilamid` es un valor NUEVO en el catálogo (los demás usan g-flex, metal o
-- acetate); se agregó su etiqueta a `components/product/product-attributes.tsx`.
--
-- forma `redondo`: los atributos dicen "Ovalada" pero el título del founder dice "Redondos" y las
-- fotos son claramente redondas. A confirmar con él.
--
-- HONESTIDAD AL REVÉS QUE EN LOS OTROS: acá **las 4 colorways son polarizadas**, así que sí se
-- afirma "polarizados" para el modelo entero en title/H1 (criterio Terdey/The Sil 3/3, no el de
-- Play 2/4). Por eso `lens_treatment` incluye "polarized", que en Malice/Blozon/Le Groupie no.
--
-- SEO: `anteojos de sol redondos` (210) / `lentes de sol redondos` (320). ⚠️ Verificar contra el
-- cluster antes de dar por bueno: Rusty Blinded ya es el redondo de sol de la marca según
-- SEO_STRATEGY.md. Diferenciador real del Zion: es el único redondo POLARIZADO y con patillas de
-- metal. Pendiente de resolver con seo-strategist.
--
-- `pnpm auditar:encuadre --todas`: las 8 fotos en 92% con scale 1.00. Sin overrides.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-zion', 'Rusty Zion',
  'Anteojos de sol Rusty Zion: redondos unisex con frente de grilamid y patillas de metal. Lente de policarbonato polarizada, con 100% protección UV (UV400, categoría 3). Los cuatro colores polarizan.',
  E'Los **Rusty Zion** son **anteojos de sol redondos, unisex**, con frente de **grilamid** —un polímero liviano y resistente— y **patillas de metal** finas, que es lo que les da el aire clásico.\n\n**Los cuatro colores son polarizados.** La lente es de policarbonato, con **100% protección UV (UV400) y categoría 3**, y el filtro polarizado corta los reflejos del asfalto y del agua.\n\nMedidas: frente 145 mm · lente 50 mm de ancho × 50 mm de alto · puente 19 mm · varilla 142 mm. Pesan 26,9 g.\n\nDisponible en 4 colores:\n\n• **Negro brillo con patillas gun, lente gris oscuro.**\n• **Carey con patillas doradas, lente marrón degradé.**\n• **Rosa pálido translúcido con patillas doradas, lente verde degradé.**\n• **Carey oscuro con patillas gun, lente marrón.**\n\nIncluye estuche, franela de microfibra y garantía oficial de 1 año del fabricante.',
  '{
    "frame_material": "grilamid",
    "frame_shape": "redondo",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 26.9,
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 50, "lens_height_mm": 50, "bridge_mm": 19, "temple_length_mm": 142},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-09-25",
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex, frente de grilamid y patillas de metal", "body": "El frente es de grilamid, un polímero liviano y resistente; las patillas son de metal fino, que es lo que le da el aire clásico. Cuatro combinaciones de armazón y lente."},
      {"type": "tip", "position": "middle", "title": "Los cuatro colores son polarizados", "body": "A diferencia de otros modelos donde el filtro polarizado está sólo en algunas variantes, acá lo llevan los cuatro. Corta los reflejos del asfalto y del agua, además del 100% de la radiación UV."},
      {"type": "recommendation", "position": "bottom", "title": "Policarbonato UV400 categoría 3", "body": "Lente de policarbonato con 100% de protección UVA y UVB, categoría 3, pensada para sol fuerte. Categoría 3 no sirve para manejar de noche."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2007517918"], "imported_at": "2026-08-25"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Zion Redondos Polarizados | Carballo',
  'Anteojos de sol Rusty Zion: redondos unisex, frente de grilamid y patillas de metal. Lente de policarbonato polarizada UV400 categoría 3, en 4 colores. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Item MULTI-VARIACIÓN: las cuatro llevan `variation_code` real. SKUs del fabricante salvo la
-- SDEMI, que no figura en su catálogo (ver cabecera).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), '128749',
   '{"frame_color":"rosa-transparente","temple_color":"dorado","lens_color":"verde-degrade","model_code":"0292/J.GOLD DRT04 POL","polarized":true}'::jsonb,
   11247900, 11, true, 1, 'MLA2007517918', '189768345739'),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), '128740',
   '{"frame_color":"negro-brillo","temple_color":"gun","lens_color":"gris-oscuro","model_code":"SBLK/D.GUN S10 POL","polarized":true}'::jsonb,
   11247900, 8, true, 2, 'MLA2007517918', '182831395592'),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), '128720',
   '{"frame_color":"carey","temple_color":"dorado","lens_color":"marron-degrade","model_code":"F223/J.GOLD DRT02 POL","polarized":true}'::jsonb,
   11247900, 4, true, 3, 'MLA2007517918', '182831395594'),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), 'ZION-SDEMI-DGUN-DRT15',
   '{"frame_color":"carey-oscuro","temple_color":"gun","lens_color":"marron","model_code":"SDEMI-D.GUN/DRT15 POL","polarized":true}'::jsonb,
   11247900, 3, true, 4, 'MLA2007517918', '182831395596')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Primaria = perfil de la 0292, que es la de más stock. La placa de medidas va con variant_id
-- NULL y sort 99, como en todos los productos.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='128749'),
   'rusty-zion/perfil-0292.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista lateral, armazón rosa pálido translúcido patillas doradas lente verde degradé polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='128749'),
   'rusty-zion/frente-0292.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista frontal, armazón rosa pálido translúcido patillas doradas lente verde degradé polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='128740'),
   'rusty-zion/perfil-sblk.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista lateral, armazón negro brillo patillas gun lente gris oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='128740'),
   'rusty-zion/frente-sblk.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista frontal, armazón negro brillo patillas gun lente gris oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='128720'),
   'rusty-zion/perfil-f223.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista lateral, armazón carey patillas doradas lente marrón degradé polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='128720'),
   'rusty-zion/frente-f223.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista frontal, armazón carey patillas doradas lente marrón degradé polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='ZION-SDEMI-DGUN-DRT15'),
   'rusty-zion/perfil-sdemi.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista lateral, armazón carey oscuro patillas gun lente marrón polarizada', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), (SELECT id FROM public.product_variants WHERE sku='ZION-SDEMI-DGUN-DRT15'),
   'rusty-zion/frente-sdemi.jpg', 'Anteojos de sol Rusty Zion redondos unisex vista frontal, armazón carey oscuro patillas gun lente marrón polarizada', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-zion'), NULL,
   'rusty-zion/medidas.jpg', 'Esquema técnico de medidas Rusty Zion: frente 145mm, lente 50x50mm, puente 19mm, varilla 142mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
