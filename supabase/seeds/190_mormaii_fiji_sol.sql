-- ============================================
-- Seed 190: Mormaii FIJI SOL (unisex, redondo/panto, frente de poliamida, patillas de metal, bisagras metálicas con flex Visyfit), 5 variantes
-- Fecha: 2026-10-26
-- ============================================
-- UNA publicación multivariante de ML (`MLA1392353341`, catalog_listing:false, MLA417128, 4 vendidas, título congelado "…Fiji Polarizado Espejado Estilo Erika"). El founder agregó las
-- variaciones nuevas por API (hecho por mí el 2026-10-26, respaldo en marketing/ml-backups/). var_ids verificados por API:
--   Col 09  120105909  180255790475  stock 3  negro brillo, patillas gun con celeste, lente espejada celeste
--   Col 13  120105913  208132980793  stock 2  negro mate, patillas negras con punta gris, lente verde oscuro
--   Col 15  120105915  208132980795  stock 3  degradé marrón a gris, patillas doradas, lente marrón
--   Col 20  120105920  208132980797  stock 2  negro mate, patillas gun con rojo, lente gris
--   Col 11  (sin SKU en ML; SKU de la casa FIJI-COL11-BEIGE)  180255790473  stock 0 (el founder lo dejó en 0 en el panel el 2026-10-26)  beige translúcido, patillas doradas, lente espejada rosada — la "reingresa" que pidió el founder
-- Precio de ML hoy: $116.890 en las 5 (había $111.390 antes del cambio del 2026-10-26; lo cambió ML/el founder, no el script).
-- DATOS DEL FOUNDER: lente 53, puente 19, varilla 134, ancho total 146, alto total 51; unisex; cat 3, polarizados todos, UV400; "se pueden adaptar lentes graduadas"; frente de poliamida, patillas de metal, bisagras metálicas con flex "Visyfit".
--   Fabricante (Interoptica `fiji`): "Frente Inyectado en Grilamid con patilla metálica delgada, bisagra flex y endtip de goma"; base 6. "Ultraliviano" NO se repite (sin peso).
-- 🔬 optical-expert: "poliamida (Grilamid)" ok; "bisagras metálicas con flex Visyfit" ok; sin "ultraliviano"; graduación sin prometer potencias ni polarizado graduado; espejado = acabado.
-- 🎯 SEO: `Mormaii Fiji`, slug `mormaii-fiji`, redondo (alto/lente 51/53), meta_title con sufijo (53) y cierre "Vintage"; NO "Erika" (marca ajena); cross-link Fortaleza (frase de vuelta sólo ahí), Sevilha receta y hub.
-- 📸 Fotos oficiales de Mormaii (Interoptica) por `pnpm placas --tipo sol --sin-vision` + `pnpm fotos:subir --sufijo -c09/-c13/-c15/-c20/-c11`. Primaria = perfil de Col 09.
-- ============================================

BEGIN;

WITH
  mormaii AS (SELECT id FROM public.brands WHERE slug = 'mormaii'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM mormaii), (SELECT id FROM sol), 'mormaii-fiji', 'Mormaii Fiji',
  'Anteojos de sol Mormaii Fiji: redondeados unisex con frente de poliamida, patillas de metal y bisagras metálicas con flex Visyfit. Lentes polarizadas, UV400 y categoría 3.',
  E'Los **Mormaii Fiji** son **anteojos de sol unisex de forma redondeada**, con puente tipo ojo de cerradura y estilo clásico. El frente es de **poliamida (Grilamid)** inyectado, con **patillas de metal** y **terminal de goma**, y **bisagras metálicas con flex Visyfit**.\n\nLas lentes son **polarizadas**: filtran los reflejos que rebotan en el agua, el asfalto o el capot y reducen el deslumbramiento (sirven para manejar de día, no de noche; el polarizado puede dificultar ver algunas pantallas, como el celular o el tablero). Tienen protección **UV400** (bloquean los rayos UVA y UVB) y **categoría 3**, pensada para mucha luz. En dos colores el cristal además es **espejado**: es un acabado estético, no es lo que polariza ni lo que da la protección UV.\n\nDisponible en 5 colores: negro brillo con patillas gun y celeste y lente espejada celeste, negro mate con lente verde oscuro, degradé marrón con patillas doradas y lente marrón, negro mate con patillas gun y rojo y lente gris, y beige translúcido con patillas doradas y lente espejada rosada.\n\nMedidas: frente 146 mm · lente 53 mm · puente 19 mm · varilla 134 mm · alto total 51 mm.\n\nSe puede armar con tus lentes graduadas: cargás la receta vigente y la óptica valida que el armazón sirva para tu graduación. Al graduarlo se reemplazan los cristales de fábrica, así que el color, el polarizado y el espejado del cristal nuevo se definen aparte.\n\nIncluye estuche semi rígido, franela de Mormaii y garantía oficial de 1 año del fabricante.\n\nSi te gusta lo clásico en otra forma, mirá los [Mormaii Fortaleza](/anteojos-de-sol/mormaii/mormaii-fortaleza), también unisex, en aviador. La misma forma redonda como armazón de receta está en los [Mormaii Sevilha](/anteojos-de-receta/mormaii/mormaii-sevilha-receta). También podés ver [todos los anteojos de sol Mormaii](/anteojos-de-sol/mormaii).',
  '{
    "frame_material": "poliamida",
    "temple_material": "metal",
    "frame_shape": "redondo",
    "gender": "unisex",
    "line": "sol",
    "hinge_system": "flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 146, "lens_width_mm": 53, "lens_height_mm": 51, "bridge_mm": 19, "temple_length_mm": 134},
    "includes": ["estuche-semi-rigido", "franela-mormaii"],
    "warranty_months": 12,
    "new_until": "2026-11-26",
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondeados, unisex", "body": "Frente de poliamida (Grilamid) con patillas de metal y terminal de goma. Bisagras metálicas con flex Visyfit."},
      {"type": "tip", "position": "middle", "title": "Lentes polarizadas", "body": "Filtran los reflejos del agua, el asfalto y el capot (de día sí, de noche no). En dos colores el cristal además es espejado, un acabado que no polariza ni da protección UV."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 y categoría 3", "body": "Las lentes bloquean los rayos UVA y UVB (UV400), independiente del polarizado y del color. Categoría 3, pensada para mucha luz."}
    ]
  }'::jsonb,
  true, false,
  'Anteojos de Sol Mormaii Fiji Vintage | Óptica Carballo',
  'Anteojos de sol Mormaii Fiji unisex: frente redondeado con patillas de metal, UV400 y categoría 3. 5 colores, envío a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 5 variantes de UNA publicación multivariante (variation_code real). Precio y stock de ML (2026-10-26).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), '120105909',
   '{"frame_color":"negro-brillo-patillas-gun-celeste","lens_color":"espejado-celeste","model_code":"Col. 09","polarized":true}'::jsonb,
   11689000, 3, true, 1, 'MLA1392353341', '180255790475'),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), '120105913',
   '{"frame_color":"negro-mate-patillas-negras-punta-gris","lens_color":"verde-oscuro","model_code":"Col. 13","polarized":true}'::jsonb,
   11689000, 2, true, 2, 'MLA1392353341', '208132980793'),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), '120105915',
   '{"frame_color":"marron-degrade-patillas-doradas","lens_color":"marron","model_code":"Col. 15","polarized":true}'::jsonb,
   11689000, 3, true, 3, 'MLA1392353341', '208132980795'),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), '120105920',
   '{"frame_color":"negro-mate-patillas-gun-rojo","lens_color":"gris-oscuro","model_code":"Col. 20","polarized":true}'::jsonb,
   11689000, 2, true, 4, 'MLA1392353341', '208132980797'),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), 'FIJI-COL11-BEIGE',
   '{"frame_color":"beige-translucido-patillas-doradas","lens_color":"espejado-rosado","model_code":"Col. 11","polarized":true}'::jsonb,
   11689000, 0, true, 5, 'MLA1392353341', '180255790473')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de Col 09.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105909'),
   'mormaii-fiji/perfil-c09.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista lateral, frente negro brillo con patillas gun y celeste y lente espejada celeste', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105909'),
   'mormaii-fiji/frente-c09.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista frontal, frente negro brillo con lente espejada celeste', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105913'),
   'mormaii-fiji/perfil-c13.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista lateral, frente negro mate con patillas negras y lente verde oscuro', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105913'),
   'mormaii-fiji/frente-c13.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista frontal, frente negro mate con lente verde oscuro', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105915'),
   'mormaii-fiji/perfil-c15.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista lateral, frente degradé marrón con patillas doradas y lente marrón', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105915'),
   'mormaii-fiji/frente-c15.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista frontal, frente degradé marrón con lente marrón', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105920'),
   'mormaii-fiji/perfil-c20.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista lateral, frente negro mate con patillas gun y rojo y lente gris', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='120105920'),
   'mormaii-fiji/frente-c20.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista frontal, frente negro mate con lente gris', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='FIJI-COL11-BEIGE'),
   'mormaii-fiji/perfil-c11.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista lateral, frente beige translúcido con patillas doradas y lente espejada rosada', 2000, 1333, 8, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), (SELECT id FROM public.product_variants WHERE sku='FIJI-COL11-BEIGE'),
   'mormaii-fiji/frente-c11.jpg', 'Anteojos de sol Mormaii Fiji redondos unisex, vista frontal, frente beige translúcido con lente espejada rosada', 2000, 1333, 9, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-fiji'), NULL,
   'mormaii-fiji/medidas-c09.jpg', 'Esquema técnico de medidas Mormaii Fiji: lente 53mm, puente 19mm, varilla 134mm, alto total 51mm, ancho total 146mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Fortaleza (el otro Mormaii unisex).
UPDATE public.products
SET description = description || E'\n\nSi te gusta lo clásico en forma redondeada, mirá los [Mormaii Fiji](/anteojos-de-sol/mormaii/mormaii-fiji).', updated_at = now()
WHERE slug = 'mormaii-fortaleza' AND description NOT LIKE '%mormaii-fiji%';

COMMIT;
