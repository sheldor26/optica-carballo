-- ============================================
-- Seed 206: Vulk CRIMSON (sol, unisex, cuadrado de doble puente, G-Flex), 4 variantes: 3 polarizadas + 1 no
-- Fecha: 2026-11-17
-- ============================================
-- 4 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-17 (las creó el founder; se ignoran los duplicados de catálogo MLA1575861137 y MLA3242264224):
--   194174  MBLK/DRT-25 POL        MLA1470841299  $98.223   stock 2  negro mate, lente gris degradé, POLARIZADA, cat 3
--   194177  MBLK/DR75 POL          MLA1632607965  $98.223   stock 0 (pausada)  negro mate, lente amarilla, POLARIZADA
--   194172  SDEMI/DRWG15C3 POL     MLA2297603973  $103.135  stock 2  frente carey brillo + patillas negro brillo, lente verde oscuro, POLARIZADA, cat 3
--   194178  BROWN/G.BLUE           MLA4209887356  $98.364   stock 2  marrón brillo, lente celeste degradé, NO polarizada
-- DATOS DEL FOUNDER (2026-11-17): unisex; cuadrado de doble puente; G-Flex; bisagras plásticas SIN flex; UV400; "cat 3" para el modelo; peso 28,1 g; medidas 54-18-144, altura total 43 (tal cual en lens_height_mm), ancho total 146.
--   🔬 La categoría 3 se carga SÓLo en la gris y la verde. El optical-expert marcó que un celeste degradé claro y un amarillo no son verosímiles como cat 3 (suelen ser 1-2): en esas dos NO se carga `lens_category` hasta que el founder confirme con la etiqueta. Sin "liviano"/"flexible"; sin promesas de manejo ni de contraste; la cat 1-2 no se afirma.
--   ⚠️ En ML la SDEMI dice material Acetato; el founder dijo G-Flex para el modelo: se carga G-Flex y queda en DATOS_PENDIENTES.md para confirmar.
-- 🎯 SEO (seo-strategist + CSV): slug `vulk-crimson`; meta_title SIN "cuadrados"/"doble puente"/"polarizados"/"unisex" (The Sil, Harry, The Trial, Raven, The Phone, Day Light); primaria "lentes de sol vulk" (1.300/8) en el title; "lentes de sol amarillos" (110/18) una vez; frase de vuelta sólo desde The Sil; cross-links a The Sil, The Trial, Harry y el hub.
-- ⚠️ model_code con "POL" SÓLO en las 3 polarizadas (\bPOL\b las mete en /polarizados); la variante con sort_order 1 es polarizada. `frame_shape` = cuadrado (no existe "doble puente": sólo va en el copy). `lens_color` amarillo es slug NUEVO en variant-label.ts.
-- 📸 `pnpm fotos:subir --slug vulk-crimson --sufijo -<variante>`. Primaria = perfil de la gris. Fotos: gris y amarilla = oficiales de Vulk (900×442) pasadas por el generador; verde = copia generada en la app de Gemini a partir de la foto de catálogo y fotos reales del founder (Vulk ya no la lista); marrón = oficial de Vulk con las patillas igualadas al color del frente (edición en Gemini a pedido del founder).
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-crimson', 'Vulk Crimson',
  'Anteojos de sol Vulk Crimson unisex: cuadrados con doble puente, de G-Flex y con bisagras plásticas. Tres colores con lente polarizado y uno sin polarizar, todos con UV400.',
  E'Los **lentes de sol Vulk Crimson** son **cuadrados con doble puente**, de diseño **unisex**, con frente y patillas de **G-Flex** y **bisagras plásticas**. Un frente ancho y recto que se nota, con presencia en la cara. Pesan 28,1 gramos.\n\nLas cuatro versiones tienen protección **UV400** (bloquean los rayos UVA y UVB) y lente de policarbonato. Tres son **polarizadas** y una **no es polarizada**.\n\nMedidas: frente 146 mm · lente 54 mm · puente 18 mm · varilla 144 mm · alto total 43 mm.\n\nDisponible en 4 versiones:\n\n• MBLK/DRT-25 POL (SKU 194174): negro mate con lente gris degradé, **polarizada**, categoría 3.\n• MBLK/DR75 POL (SKU 194177): negro mate con lente amarilla, **polarizada**. Hoy sin stock.\n• SDEMI/DRWG15C3 POL (SKU 194172): frente carey brillo con patillas negro brillo y lente verde oscuro, **polarizada**, categoría 3.\n• BROWN/G.BLUE (SKU 194178): marrón brillo con lente celeste degradé, **no polarizada**.\n\nLas versiones polarizadas reducen los reflejos del agua, el asfalto y las superficies brillantes. Tené en cuenta una cosa: como toda lente polarizada, las pantallas LCD (celular, GPS, tablero del auto, cajeros) pueden verse oscuras o con patrones de colores según el ángulo. No recomendamos usar anteojos de sol para manejar de noche ni con poca luz. El polarizado y el UV400 son cosas distintas: el polarizado reduce el reflejo y el UV400 bloquea los rayos UVA y UVB. La BROWN/G.BLUE no es polarizada: tiene protección UV400 y lente degradé.\n\nSi te gustan los cuadrados de Vulk, mirá también los [Vulk The Sil](/anteojos-de-sol/vulk/vulk-the-sil). Y si buscás un doble puente en otra forma, los [Vulk The Trial](/anteojos-de-sol/vulk/vulk-the-trial) y los [Vulk Harry](/anteojos-de-sol/vulk/vulk-harry). También podés ver [todos los anteojos de sol Vulk](/anteojos-de-sol/vulk).\n\nIncluye estuche, franela de microfibra y garantía de 1 año contra defectos de fabricación.',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "cuadrado",
    "gender": "unisex",
    "line": "urbana",
    "hinge_system": "plastica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "has_polarized_variant": true,
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 54, "lens_height_mm": 43, "bridge_mm": 18, "temple_length_mm": 144},
    "weight_grams": 28.1,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-17",
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado con doble puente", "body": "Frente ancho y recto de G-Flex, con doble puente y bisagras plásticas. Un diseño unisex con presencia, en cuatro versiones de color."},
      {"type": "tip", "position": "middle", "title": "Tres polarizadas, una no", "body": "MBLK/DRT-25, MBLK/DR75 y SDEMI/DRWG15C3 son polarizadas: reducen los reflejos del agua, el asfalto y las superficies brillantes, y pueden hacer que se vean oscuras o con patrones de colores algunas pantallas (celular, GPS, tablero). BROWN/G.BLUE no es polarizada."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 en las cuatro", "body": "Todas bloquean los rayos UVA y UVB (UV400), independiente del polarizado y del color. Para el uso diurno; no recomendamos anteojos de sol para manejar de noche."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Crimson | 4 Colores, UV400',
  'Lentes de sol Vulk Crimson: cuadrados de doble puente en G-Flex, 4 colores, 3 polarizados y 1 sin polarizar, UV400. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes, items simples de ML (variation_code NULL). Precio y stock de ML (2026-11-17). Las polarizadas primero.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), '194174',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro-degrade","model_code":"MBLK/DRT-25 POL","polarized":true,"lens_category":3}'::jsonb,
   9822300, 2, true, 1, 'MLA1470841299', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), '194177',
   '{"frame_color":"negro-mate","lens_color":"amarillo","model_code":"MBLK/DR75 POL","polarized":true}'::jsonb,
   9822300, 0, true, 2, 'MLA1632607965', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), '194172',
   '{"frame_color":"carey-brillo-patillas-negro-brillo","lens_color":"verde-oscuro","model_code":"SDEMI/DRWG15C3 POL","polarized":true,"lens_category":3}'::jsonb,
   10313500, 2, true, 3, 'MLA2297603973', NULL),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), '194178',
   '{"frame_color":"marron-brillo","lens_color":"celeste-degrade","model_code":"BROWN/G.BLUE","polarized":false,"lens_treatment":["gradient"]}'::jsonb,
   9836400, 2, true, 4, 'MLA4209887356', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de la gris.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194174'),
   'vulk-crimson/perfil-gris.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista lateral, armazón negro mate con lente gris degradé polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194174'),
   'vulk-crimson/frente-gris.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista frontal, armazón negro mate con lente gris degradé polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194177'),
   'vulk-crimson/perfil-amarillo.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista lateral, armazón negro mate con lente amarilla polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194177'),
   'vulk-crimson/frente-amarillo.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista frontal, armazón negro mate con lente amarilla polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194172'),
   'vulk-crimson/perfil-sdemi.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista lateral, frente carey brillo con patillas negro brillo y lente verde oscuro polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194172'),
   'vulk-crimson/frente-sdemi.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista frontal, frente carey brillo con patillas negro brillo y lente verde oscuro polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194178'),
   'vulk-crimson/perfil-brown.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista lateral, armazón marrón brillo con lente celeste degradé', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), (SELECT id FROM public.product_variants WHERE sku='194178'),
   'vulk-crimson/frente-brown.jpg', 'Lentes de sol Vulk Crimson cuadrados con doble puente, vista frontal, armazón marrón brillo con lente celeste degradé', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='vulk-crimson'), NULL,
   'vulk-crimson/medidas-gris.jpg', 'Esquema técnico de medidas Vulk Crimson: lente 54mm, puente 18mm, varilla 144mm, alto total 43mm, ancho total 146mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en The Sil (el cuadrado unisex de Vulk, vecino directo).
UPDATE public.products
SET description = description || E'\n\nSi te gustan los cuadrados de Vulk con doble puente, mirá también los [Vulk Crimson](/anteojos-de-sol/vulk/vulk-crimson).', updated_at = now()
WHERE slug = 'vulk-the-sil' AND description NOT LIKE '%vulk-crimson%';

COMMIT;
