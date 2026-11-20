-- ============================================
-- Seed 212: Vulk MERGE (sol, unisex, frente de metal dorado + patillas de acetato, rectangular), 2 variantes POLARIZADAS
-- Fecha: 2026-11-20
-- ============================================
-- 2 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-20 (las creó el founder, 2 items separados, $133.245 c/u, stock 3):
--   969911  C2 POL  MLA4223903936  frente dorado, patillas de acetato negras, lente verde oscuro, POLARIZADA, cat 3
--   969912  C3 POL  MLA4223903938  frente dorado, patillas de acetato carey,  lente marrón degradé, POLARIZADA, cat 2
-- DATOS DEL FOUNDER (2026-11-18/20): unisex, rectangular, frente de metal, patillas de acetato, bisagras de acero inoxidable (sin flex), UV400, polarizados, medidas 59-15-145, peso 24,9 g. El founder escribió "altura total 145 / ancho total 43" AL REVÉS: se cargan ancho total 145 / alto total 43 (diagrama de Vulk 145-43 y 2×59+15 = 133). Talle Large y "fabricado en Italia": de la ficha de Vulk.
-- 🔬 Sin "liviano"/"flexible"/"ultra". "acero inoxidable" sólo en el copy (el despiece sólo lee hinge_material 'metal'); `temple_material` = 'acetato' (sin "e").
-- 🎯 SEO (seo-strategist 2026-11-18 + CSV KEYWORDS OPTICA): slug `vulk-merge`; title `Lentes de Sol Vulk Merge Polarizados | Metal y Acetato` SIN "rectangulares" (lo reclaman Día Light y Platz); "rectangular" una sola vez en el copy; UNA frase de vuelta, en Dieven; cross-links a Dieven, The Trial y Día Light + hub Vulk.
-- ⚠️ `lens_category` POR VARIANTE (3 y 2), nunca a nivel producto; `lens_treatment` de producto ['uv400','polarized'] porque las 2 polarizan (alimenta /polarizados). model_code "C2 POL" / "C3 POL" (códigos reales de Vulk).
-- 📸 `pnpm fotos:subir --slug vulk-merge --sufijo -c2/-c3`. Primaria = perfil (3/4 oficial) de la C2; frente = foto oficial de la home de Vulk (640 px ampliada); medidas una sola.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-merge', 'Vulk Merge',
  'Lentes de sol unisex polarizados con frente de metal dorado y patillas de acetato, de forma rectangular ancha y talle large. Lente con protección UV400: verde oscuro categoría 3 o marrón degradé categoría 2. Bisagras de acero inoxidable. Fabricados en Italia. Incluye estuche y franela.',
  E'Los **lentes de sol Vulk Merge** son **unisex**, con **frente de metal dorado** de silueta amplia y líneas angulosas, **patillas de acetato** pulidas a mano y **bisagras de acero inoxidable**. Se fabrican en Italia. Son de talle large y pesan 24,9 gramos.\n\n**Las dos versiones son polarizadas.** La lente es de policarbonato, con **protección UV400** (bloquea los rayos UVA y UVB). El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo. Una versión es **categoría 3**, pensada para mucha luz, y la otra **categoría 2**, un filtro medio. De día sí; de noche no recomendamos usar anteojos de sol para manejar.\n\nMedidas: frente 145 mm · lente 59 mm · puente 15 mm · varilla 145 mm · alto total 43 mm.\n\nDisponible en 2 versiones:\n\n• C2 POL (SKU 969911): frente dorado, patillas de acetato negras, lente verde oscuro, categoría 3.\n• C3 POL (SKU 969912): frente dorado, patillas de acetato carey, lente marrón degradé, categoría 2.\n\nSi preferís el mismo cuadro unisex en plástico, mirá los [Vulk Dieven](/anteojos-de-sol/vulk/vulk-dieven). Para un aviador con patillas de acetato, los [Vulk The Trial](/anteojos-de-sol/vulk/vulk-the-trial), y para otro rectangular polarizado, los [Vulk Day Light](/anteojos-de-sol/vulk/vulk-day-light). Podés ver [todos los lentes de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "metal",
    "temple_material": "acetato",
    "frame_shape": "rectangular",
    "gender": "unisex",
    "line": "urbana",
    "hinge_system": "estandar",
    "hinge_material": "metal",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 59, "lens_height_mm": 43, "bridge_mm": 15, "temple_length_mm": 145},
    "weight_grams": 24.9,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-20",
    "callouts": [
      {"type": "info", "position": "top", "title": "Frente de metal dorado y patillas de acetato", "body": "Frente de metal de silueta amplia, patillas de acetato pulidas a mano y bisagras de acero inoxidable. Talle large, fabricados en Italia."},
      {"type": "tip", "position": "middle", "title": "Las dos versiones son polarizadas", "body": "Reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). Aparte, la lente bloquea el 100% de la radiación UV (UV400)."},
      {"type": "recommendation", "position": "bottom", "title": "Categoría 3 en la verde, categoría 2 en la marrón", "body": "La lente verde oscuro es categoría 3, pensada para mucha luz; la marrón degradé es categoría 2, un filtro medio. De día sí; de noche no recomendamos usar anteojos de sol para manejar."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Merge Polarizados | Metal y Acetato',
  'Lentes de sol Vulk Merge polarizados: frente de metal dorado y patillas de acetato, fabricados en Italia. 2 colores, UV400. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-merge'), '969911',
   '{"frame_color":"dorado-patillas-negras","lens_color":"verde-oscuro","model_code":"C2 POL","polarized":true,"lens_category":3}'::jsonb,
   13324500, 3, true, 1, 'MLA4223903936', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-merge'), '969912',
   '{"frame_color":"dorado-patillas-carey","lens_color":"marron-degrade","model_code":"C3 POL","polarized":true,"lens_category":2,"lens_treatment":["gradient"]}'::jsonb,
   13324500, 3, true, 2, 'MLA4223903938', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-merge'), (SELECT id FROM public.product_variants WHERE sku='969911'),
   'vulk-merge/perfil-c2.jpg', 'Lentes de sol Vulk Merge polarizados, vista lateral, frente dorado con patillas de acetato negras y lente verde oscuro', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-merge'), (SELECT id FROM public.product_variants WHERE sku='969911'),
   'vulk-merge/frente-c2.jpg', 'Lentes de sol Vulk Merge polarizados, vista frontal, armazón dorado con lente verde oscuro', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-merge'), (SELECT id FROM public.product_variants WHERE sku='969912'),
   'vulk-merge/perfil-c3.jpg', 'Lentes de sol Vulk Merge polarizados, vista lateral, frente dorado con patillas de acetato carey y lente marrón degradé', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-merge'), (SELECT id FROM public.product_variants WHERE sku='969912'),
   'vulk-merge/frente-c3.jpg', 'Lentes de sol Vulk Merge polarizados, vista frontal, armazón dorado con lente marrón degradé', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-merge'), NULL,
   'vulk-merge/medidas-c2.jpg', 'Medidas de los lentes de sol Vulk Merge: lente 59mm, puente 15mm, varilla 145mm, alto total 43mm, ancho total 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Dieven (el rectangular unisex de Vulk en plástico, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi preferís el frente de metal, mirá también los [Vulk Merge](/anteojos-de-sol/vulk/vulk-merge).', updated_at = now()
WHERE slug = 'vulk-dieven' AND description NOT LIKE '%vulk-merge%';

COMMIT;
