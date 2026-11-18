-- ============================================
-- Seed 210: Vulk YESTER (sol, unisex, redondo, poliamida TR90), 3 variantes POLARIZADAS cat 3
-- Fecha: 2026-11-18
-- ============================================
-- 3 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-18 (las creó el founder, 3 items separados, $102.058 cada uno):
--   969772  SBLK/S10 POL   MLA2300345537  stock 3  GTIN 7791709038045  frente negro brillo, lente gris oscuro, POLARIZADA
--   969773  MDEMI/B10 POL  MLA2300333241  stock 2  GTIN 7791709038052  frente carey mate,  lente marrón,     POLARIZADA
--   969771  MBLK/S10 POL   MLA2300370887  stock 3  GTIN 7791709038038  frente negro mate,  lente gris oscuro, POLARIZADA
-- DATOS DEL FOUNDER (2026-11-18): redondo, unisex, poliamida TR90, bisagras plásticas reforzadas (sin flex), UV400, policarbonato, polarizadas cat 3; medidas 53-19-140, altura total 52 (tal cual en lens_height_mm), ancho total 143. Peso 20 g: de la ficha de Vulk, NO lo pesó el founder (pendiente en DATOS_PENDIENTES).
-- 🔬 Sin "liviano"/"flexible"/"ultra". `frame_material` y `temple_material` = 'tr-90'. La ficha de Vulk dice "Grilamid": se usó "poliamida TR90" como lo pasó el founder.
-- 🎯 SEO (seo-strategist 2026-11-18 + CSV KEYWORDS OPTICA): slug `vulk-yester`; title SIN "redondos" ni "polarizados" (Cinema ya los reclama): 'Lentes de Sol Vulk Yester | 3 Colores, UV400' (con la CRY pasa a '4 Colores'); "redondos" y "polarizados" sólo en copy/alt/meta; UNA frase de vuelta, en Cinema; 4 links en la descripción (hub, Cinema, Bennie 51, Rusty Zion).
-- ⚠️ `polarized:true` y model_code con "POL" en las 3 (\bPOL\b las mete en /polarizados). `lens_category` 3 a NIVEL PRODUCTO porque hoy es igual en las 3: cuando entre la CRY (cat 2, no polarizada, item aparte) hay que sacarlo del producto y ponerlo por variante (como Dieven).
-- 📸 `pnpm fotos:subir --slug vulk-yester --sufijo -<variante>`. Primaria = perfil de la SBLK. Medidas = una sola (medidas-sblk). Fotos: oficiales de Vulk (1024×1024) pasadas por el generador.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-yester', 'Vulk Yester',
  'Lentes de sol redondos unisex con frente de poliamida TR90 y bisagra plástica reforzada. Lente de policarbonato con protección UV400, polarizada en negro brillo, negro mate y carey mate. Incluye estuche y franela.',
  E'Los **lentes de sol Vulk Yester** son **redondos**, de diseño **unisex**, con **frente y patillas de poliamida TR90** y **bisagras plásticas reforzadas**. Pesan 20 gramos.\n\n**Las tres versiones son polarizadas.** La lente es de policarbonato, con **protección UV400** (bloquea los rayos UVA y UVB) y **categoría 3**. El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo. De día sí; de noche no recomendamos usar anteojos de sol para manejar.\n\nMedidas: frente 143 mm · lente 53 mm · puente 19 mm · varilla 140 mm · alto total 52 mm.\n\nDisponible en 3 versiones:\n\n• SBLK/S10 POL (SKU 969772): frente negro brillo, lente gris oscuro.\n• MBLK/S10 POL (SKU 969771): frente negro mate, lente gris oscuro.\n• MDEMI/B10 POL (SKU 969773): frente carey mate, lente marrón. El carey mate es exclusivo del Yester.\n\nSi buscás otro redondo unisex y polarizado de [Vulk](/anteojos-de-sol/vulk), mirá los [Vulk Cinema](/anteojos-de-sol/vulk/vulk-cinema), con frente de G-Flex y lente más chica (48 mm). Para un redondo más chico de la marca, están los [Vulk Bennie 51](/anteojos-de-sol/vulk/vulk-bennie-51). Y si preferís un redondo de otra marca, los [Rusty Zion](/anteojos-de-sol/rusty/rusty-zion).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "tr-90",
    "temple_material": "tr-90",
    "frame_shape": "redondo",
    "gender": "unisex",
    "line": "urbana",
    "hinge_system": "plastica",
    "hinge_material": "plastico",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 53, "lens_height_mm": 52, "bridge_mm": 19, "temple_length_mm": 140},
    "weight_grams": 20,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-18",
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo unisex de poliamida TR90", "body": "Frente y patillas de poliamida TR90, con bisagras plásticas reforzadas. Pesan 20 gramos."},
      {"type": "tip", "position": "middle", "title": "Las tres versiones son polarizadas", "body": "Reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). Aparte, la lente bloquea el 100% de la radiación UV (UV400)."},
      {"type": "recommendation", "position": "bottom", "title": "Categoría 3 para el uso diurno", "body": "Lente de policarbonato categoría 3, pensada para mucha luz. De día sí; de noche no recomendamos usar anteojos de sol para manejar."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Yester | 3 Colores, UV400',
  'Lentes de sol Vulk Yester redondos unisex de poliamida, lente polarizada UV400 categoría 3. Los 3 colores polarizan. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), '969772',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   10205800, 3, true, 1, 'MLA2300345537', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), '969773',
   '{"frame_color":"carey-mate","lens_color":"marron","model_code":"MDEMI/B10 POL","polarized":true}'::jsonb,
   10205800, 2, true, 2, 'MLA2300333241', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), '969771',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   10205800, 3, true, 3, 'MLA2300370887', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969772'),
   'vulk-yester/perfil-sblk.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista lateral, frente negro brillo y lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969772'),
   'vulk-yester/frente-sblk.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista frontal, frente negro brillo con lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969773'),
   'vulk-yester/perfil-mdemi.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista lateral, frente carey mate y lente marrón polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969773'),
   'vulk-yester/frente-mdemi.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista frontal, frente carey mate con lente marrón polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969771'),
   'vulk-yester/perfil-mblk.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista lateral, frente negro mate y lente gris oscuro polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), (SELECT id FROM public.product_variants WHERE sku='969771'),
   'vulk-yester/frente-mblk.jpg', 'Lentes de sol Vulk Yester redondos unisex, vista frontal, frente negro mate con lente gris oscuro polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-yester'), NULL,
   'vulk-yester/medidas-sblk.jpg', 'Esquema técnico de medidas Vulk Yester: lente 53mm, puente 19mm, varilla 140mm, alto total 52mm, ancho total 143mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Cinema (el redondo unisex de Vulk, vecino directo). Sin "polarizado" para no romperse cuando entre la CRY.
UPDATE public.products
SET description = description || E'\n\nSi querés un redondo unisex con la lente más grande (53 mm) y frente de poliamida, mirá también los [Vulk Yester](/anteojos-de-sol/vulk/vulk-yester).', updated_at = now()
WHERE slug = 'vulk-cinema' AND description NOT LIKE '%vulk-yester%';

COMMIT;
