-- ============================================
-- Seed 184: Rusty Exile SOL (envolvente deportivo unisex), G-Flex, 2 colores x (polarizado | no polarizado con antirreflex) = 4 variantes
-- Fecha: 2026-10-19
-- ============================================
-- 2 PUBLICACIONES TRADICIONALES de ML (multivariantes de 2 colores, `catalog_listing:false`, categoría MLA417128), ACTIVAS, verificadas por API el 2026-10-19:
--   POLARIZADA     MLA1584762450  $104.885 → 10488500c  (5 vendidas)
--     MBLK/S10 POL  SKU 100045  var `179348872558`  stock 5  negro mate / lente gris oscuro
--     SBLK/S10 POL  SKU 100044  var `179348872560`  stock 2  negro brillo / lente gris oscuro
--   NO POLARIZADA  MLA1584506290  $89.166 → 8916600c  (31 vendidas)
--     MBLK/S10      SKU (pendiente)  var `180893051291`  stock 0  negro mate / lente gris oscuro, con antirreflex
--     SBLK/S10      SKU (pendiente)  var `180893837675`  stock 1  negro brillo / lente gris oscuro, con antirreflex
--   ⚠️ El founder no tiene los SKU de las 2 no polarizadas (2026-10-19): `sku` es NOT NULL, así que van con un código descriptivo (`EXILE-MBLK-S10` / `EXILE-SBLK-S10`, mismo criterio que Moorea Rx) y quedan anotadas en DATOS_PENDIENTES.md. Stock y precio mandan desde ML. Sin peso (no lo pasó): se carga sin `weight_grams`.
--
-- DATOS DEL FOUNDER (2026-10-19): unisex, "envolventes deportivos", G-Flex (frente y patillas; ML decía Grilamid: gana el founder), bisagras de plástico reforzadas (sin flex), cat 3, UV400, lente gris oscuro, **67-22-145** (el 67 está medido SOBRE LA CURVA del envolvente: en plano no cierra con el ancho total), **ancho total 137, alto total 44**. **NO se pueden adaptar lentes graduadas.** La no polarizada viene con antirreflex (no dijo en qué cara: no se afirma "interno"). Policarbonato = default del proyecto (no lo dijo).
-- 🔬 optical-expert: "envolvente" = forma ("cubre más del costado"), nunca "protección total"; UV400 = "100% UVA y UVB a través de la lente"; 2 de 4 polarizadas → "polarizados" NO va en title/H1/meta, sí en descripción/callout/variante; el polarizado y el UV400 son cosas distintas; sin "liviano" (sin peso), sin "flexible"/"flex", sin "fatiga ocular"/"durabilidad"/"protección óptima"; cat 3: no sirve para manejar de noche; talle "mediano" sin `size_fit`.
-- 🎯 SEO (seo-strategist): slug `rusty-exile`, name `Rusty Exile` (sin Optics); no queda keyword con volumen libre: carril branded + forma (`anteojos de sol rusty envolventes`); "deportivos" sólo en copy (es de And Now); `lens_treatment` de producto ["uv400"], `polarized` true/false por variante; links a Esvep (gemelo, frase de vuelta sólo ahí), And Now, CCCP, y facetas `/anteojos-de-sol/{rusty,deportivos,polarizados}`.
-- 📸 FOTOS: no existen en la web de Rusty (modelo discontinuado): salieron de las publicaciones de ML del founder (originales de Rusty a 1200 px), pasadas por `pnpm placas --tipo sol` y subidas con `pnpm fotos:subir --sufijo`: `rusty-exile/perfil|frente-mblk|sblk.jpg` (variantes polarizadas) y copias `-mblk-np` / `-sblk-np` (variantes no polarizadas: la misma foto, el UNIQUE(product_id, storage_path) impide atar un archivo a 2 variantes; mismo patrón que Rusty CCCP seed 54) + `medidas-mblk.jpg`. El frente trae el sticker "RUSTY POLARIZED" en la lente (es lo que hay). Scale 1.0 por defecto: revisar con `pnpm auditar:encuadre` (el grid de deportivos es el más chico).
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-exile', 'Rusty Exile',
  'Anteojos de sol Rusty Exile: envolventes deportivos unisex, con frente y patillas de G-Flex y bisagras de plástico reforzadas. Lente de policarbonato UV400, categoría 3, en versión polarizada o no polarizada con antirreflex.',
  E'Los **Rusty Exile** son **anteojos de sol envolventes deportivos, unisex**, con frente y patillas de **G-Flex** y **bisagras de plástico reforzadas**. El diseño envolvente curva hacia las sienes y cubre más del costado que un armazón plano.\n\nLas lentes son de **policarbonato** gris oscuro, con **100% de protección UVA y UVB a través de la lente (UV400)** y **categoría 3**, pensada para sol fuerte (no sirve para manejar de noche). Cada color viene en dos versiones: **polarizada**, que reduce los reflejos del agua, el asfalto y la nieve, y **no polarizada, con antirreflex**. El polarizado y el UV400 son cosas distintas: las cuatro versiones filtran el 100% de UVA y UVB.\n\nMedidas: frente 137 mm · lente 67 mm (medida sobre la curva) · puente 22 mm · varilla 145 mm · alto total 44 mm. Es un tamaño mediano.\n\nDisponible en 2 colores, cada uno con o sin polarizado:\n\n• **Negro mate.**\n• **Negro brillo.**\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\n**Estos anteojos no admiten lentes graduadas.**\n\nSi buscás otro envolvente de la línea, mirá los [Rusty And Now](/anteojos-de-sol/rusty/rusty-and-now), los [Rusty Esvep](/anteojos-de-sol/rusty/rusty-esvep) o los [Rusty CCCP](/anteojos-de-sol/rusty/rusty-cccp). También podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty), [los deportivos](/anteojos-de-sol/deportivos) y [los polarizados](/anteojos-de-sol/polarizados).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "envolvente",
    "hinge_system": "plastica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 67, "lens_height_mm": 44, "bridge_mm": 22, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-19",
    "callouts": [
      {"type": "info", "position": "top", "title": "Envolvente deportivo y unisex", "body": "Frente y patillas de G-Flex, con bisagras de plástico reforzadas. Diseño envolvente que cubre más del costado que un armazón plano. En negro mate o negro brillo."},
      {"type": "tip", "position": "middle", "title": "Polarizado o no, siempre UV400 y categoría 3", "body": "Las cuatro versiones filtran el 100% de UVA y UVB a través de la lente, categoría 3 para sol fuerte (no sirve para manejar de noche). La polarizada además reduce los reflejos del agua, el asfalto y la nieve; la no polarizada viene con antirreflex."},
      {"type": "recommendation", "position": "bottom", "title": "No admiten lentes graduadas", "body": "Este modelo no se puede adaptar con lentes graduadas."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1584762450", "MLA1584506290"], "imported_at": "2026-10-19"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Rusty Exile Envolventes | Óptica Carballo',
  'Anteojos de sol Rusty Exile envolventes y unisex: G-Flex, UV400 y categoría 3. En negro mate y negro brillo, con o sin polarizado. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes en 2 publicaciones multivariantes. Primaria = MBLK polarizada (perfil).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), '100045',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true}'::jsonb,
   10488500, 5, true, 1, 'MLA1584762450', '179348872558'),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), '100044',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   10488500, 2, true, 2, 'MLA1584762450', '179348872560'),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), 'EXILE-MBLK-S10',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10","polarized":false}'::jsonb,
   8916600, 0, true, 3, 'MLA1584506290', '180893051291'),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), 'EXILE-SBLK-S10',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10","polarized":false}'::jsonb,
   8916600, 1, true, 4, 'MLA1584506290', '180893837675')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente (las no polarizadas con la copia `-np` de la misma foto). medidas-mblk.jpg SIEMPRE última (sort 99), variant_id NULL.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='100045'),
   'rusty-exile/perfil-mblk.jpg', 'Anteojos de sol Rusty Exile envolventes polarizados, vista lateral, negro mate con lente gris oscuro', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='100045'),
   'rusty-exile/frente-mblk.jpg', 'Anteojos de sol Rusty Exile envolventes polarizados, vista frontal, negro mate con lente gris oscuro', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='100044'),
   'rusty-exile/perfil-sblk.jpg', 'Anteojos de sol Rusty Exile envolventes polarizados, vista lateral, negro brillo con lente gris oscuro', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='100044'),
   'rusty-exile/frente-sblk.jpg', 'Anteojos de sol Rusty Exile envolventes polarizados, vista frontal, negro brillo con lente gris oscuro', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='EXILE-MBLK-S10'),
   'rusty-exile/perfil-mblk-np.jpg', 'Anteojos de sol Rusty Exile envolventes con antirreflex, vista lateral, negro mate con lente gris oscuro', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='EXILE-MBLK-S10'),
   'rusty-exile/frente-mblk-np.jpg', 'Anteojos de sol Rusty Exile envolventes con antirreflex, vista frontal, negro mate con lente gris oscuro', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='EXILE-SBLK-S10'),
   'rusty-exile/perfil-sblk-np.jpg', 'Anteojos de sol Rusty Exile envolventes con antirreflex, vista lateral, negro brillo con lente gris oscuro', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), (SELECT id FROM public.product_variants WHERE sku='EXILE-SBLK-S10'),
   'rusty-exile/frente-sblk-np.jpg', 'Anteojos de sol Rusty Exile envolventes con antirreflex, vista frontal, negro brillo con lente gris oscuro', 2000, 1333, 7, false),
  ((SELECT id FROM public.products WHERE slug='rusty-exile'), NULL,
   'rusty-exile/medidas-mblk.jpg', 'Esquema técnico de medidas Rusty Exile: frente 137mm, lente 67mm sobre la curva, alto total 44mm, puente 22mm, varilla 145mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en Esvep (el gemelo más cercano).
UPDATE public.products
SET description = description || E'\n\nSi buscás otro envolvente de la línea, también con versión sin polarizar, mirá los [Rusty Exile](/anteojos-de-sol/rusty/rusty-exile).', updated_at = now()
WHERE slug = 'rusty-esvep' AND description NOT LIKE '%rusty-exile%';

COMMIT;
