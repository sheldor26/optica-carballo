-- ============================================
-- Seed 187: Rusty SOCIETY SOL (redondo con puente tipo llave, unisex), G-Flex, bisagras metálicas con flex, 2 variantes
-- Fecha: 2026-10-20
-- ============================================
-- APLICADO a Cloud el 2026-10-20 ("aplicá el society"); el stock de la azul se ajustó a 8 por UPDATE absoluto tras reactivarla en ML.
-- 2 PUBLICACIONES TRADICIONALES de ML (`catalog_listing:false`, MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-10-20:
--   113114  MBLK/S10 POL      MLA1432066237  $88.348  ACTIVA, stock 3 (23 vendidas)  negro mate, lente gris oscuro POLARIZADA (GTIN 7894563230850)
--   113115  MBLK/REVO BLUE    MLA1432092557  $85.429  estaba PAUSADA y el founder la REACTIVÓ el 2026-10-20 (ML: activa, stock 8)  negro mate, lente ESPEJADA AZUL con antirreflex interno (no polarizada)
-- DATOS DEL FOUNDER (2026-10-20): medidas 48-20-140, alto total 46, ancho total 136; armazón G-Flex, "ovalado", puente en forma de llave, unisex, bisagras metálicas con flex. SKU 113114 y 113115 (los mismos del fabricante).
--   Del fabricante (rustyoptical.com/sunglasses/ss24/society): peso 22,7 g, frente y patilla G-Flex, lentilla de policarbonato "polarizadas con coating REVO", "100% protección UVA y UVB". Cat 3 por default del catálogo (no hay dato en contra).
--   SIN dato de graduación (no lo contestó): no se afirma y se oculta la FAQ genérica (`hide_prescription_faq`) hasta que confirme. Sin dato de antirreflex en la polarizada: no se afirma.
-- 🔬 optical-expert (2026-10-20): la polarizada = "lente gris oscuro polarizada" (SIN "coating revo": no verificable, podría confundirse con espejado); espejada azul = acabado, no polariza, no agrega UV; "antirreflex" siempre "en la cara interna" y sólo para la azul;
--    "bisagras metálicas con flex" (sin "customizadas", "reforzadas" ni "flexible"); puente "en forma de llave (ojo de cerradura)" sin claims anatómicos; peso: sólo el dato "Pesa 22,7 g" (sin "liviano"); manejar "de día sí, de noche no" SOLO para la gris polarizada (la azul no);
--    polarizado puede dificultar ver algunas pantallas (BUSINESS_POLICIES §89). Polarizado/espejado NO en title/H1/meta (1 de 2 cada uno).
-- 🎯 SEO (seo-strategist): name `Rusty Society`, slug `rusty-society`, title A (52) `Lentes de Sol Rusty Society Unisex | Óptica Carballo` (la forma "redondos" ya la reclaman Blinded/Zion/Misty/Etiquet: "redondo" sólo en copy/alt), meta (150), `frame_shape` redondo, `hinge_system` flex,
--    links a Ardigan (gemelo de silueta), Blinded, hub; frase de vuelta sólo en Ardigan. ⚠️ El peso 22,7 g es idéntico al de Blinded: coincidencia posible del fabricante (la página de Rusty lo dice), confirmar con la balanza si se quiere.
-- 📸 FOTOS: oficiales de Rusty (las mismas del portal del distribuidor Cacic), 740×300 aprox, por `pnpm placas --tipo sol` y `pnpm fotos:subir --sufijo`. La frontal de la polarizada trae el sticker "POLARIZED" en la lente (es polarizada: es verdad).
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-society', 'Rusty Society',
  'Lentes de sol Rusty Society: redondos unisex de G-Flex con puente en forma de llave y bisagras metálicas con flex. Policarbonato UV400, categoría 3. En lente gris oscuro polarizada o espejada azul.',
  E'Los **Rusty Society** son **lentes de sol redondos y unisex**, con armazón de **G-Flex** en el frente y las patillas, **puente en forma de llave** (ojo de cerradura), un detalle de aire retro, y **bisagras metálicas con flex**. Pesa 22,7 g.\n\nLas lentes son de **policarbonato**, con **100% de protección UVA y UVB a través de la lente (UV400)** y **categoría 3**, pensada para sol fuerte. Vienen en dos versiones, las dos en negro mate:\n\n• **Lente gris oscuro polarizada**: el polarizado reduce los reflejos del agua, el asfalto y la nieve, y sirve para manejar de día, no de noche. Puede dificultar ver algunas pantallas (celular, GPS, tablero).\n• **Lente espejada azul**: el espejado es un acabado de la lente, no es polarizada. Lleva antirreflex en la cara interna, que reduce los reflejos que rebotan desde atrás hacia tus ojos.\n\nEl polarizado y el UV400 son cosas distintas: las dos versiones filtran el 100% de UVA y UVB.\n\nMedidas: frente 136 mm · lente 48 mm · puente 20 mm · varilla 140 mm · alto total 46 mm.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi te gusta el redondo con puente tipo llave, mirá también los [Rusty Ardigan](/anteojos-de-sol/rusty/rusty-ardigan) y los [Rusty Blinded](/anteojos-de-sol/rusty/rusty-blinded). También podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "redondo",
    "hinge_system": "flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "weight_grams": 22.7,
    "measurements": {"frame_width_mm": 136, "lens_width_mm": 48, "lens_height_mm": 46, "bridge_mm": 20, "temple_length_mm": 140},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-20",
    "hide_prescription_faq": true,
    "callouts": [
      {"type": "info", "position": "top", "title": "Redondo con puente tipo llave, unisex", "body": "Armazón de G-Flex con bisagras metálicas con flex y puente en forma de llave (ojo de cerradura). En negro mate, con lente gris oscuro polarizada o espejada azul."},
      {"type": "tip", "position": "middle", "title": "UV400 y categoría 3 en las dos; polarizado en una", "body": "Las dos versiones filtran el 100% de UVA y UVB a través de la lente, categoría 3 para sol fuerte. La de lente gris oscuro es polarizada y reduce los reflejos del agua, el asfalto y la nieve (sirve para manejar de día, no de noche). La espejada azul no es polarizada: el espejado es un acabado de la lente, y lleva antirreflex en la cara interna."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1432066237", "MLA1432092557"], "imported_at": "2026-10-20"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Society Unisex | Óptica Carballo',
  'Lentes de sol Rusty Society, redondos unisex de G-Flex con puente tipo llave y bisagras metálicas con flex. UV400, categoría 3. Envíos a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 2 variantes, items simples de ML (variation_code NULL). Precio de ML (2026-10-20). Stock de ML (la azul se reactivó el 2026-10-20: 8).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-society'), '113114',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S10 POL","polarized":true,"gtin":"7894563230850"}'::jsonb,
   8834800, 3, true, 1, 'MLA1432066237', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-society'), '113115',
   '{"frame_color":"negro-mate","lens_color":"azul-espejado","model_code":"MBLK/REVO BLUE","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   8542900, 8, true, 2, 'MLA1432092557', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de la polarizada.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-society'), (SELECT id FROM public.product_variants WHERE sku='113114'),
   'rusty-society/perfil-pol.jpg', 'Lentes de sol Rusty Society redondos, vista lateral, armazón negro mate con lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-society'), (SELECT id FROM public.product_variants WHERE sku='113114'),
   'rusty-society/frente-pol.jpg', 'Lentes de sol Rusty Society redondos, vista frontal, armazón negro mate con puente tipo llave y lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-society'), (SELECT id FROM public.product_variants WHERE sku='113115'),
   'rusty-society/perfil-revo.jpg', 'Lentes de sol Rusty Society redondos, vista lateral, armazón negro mate con lente espejada azul', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-society'), (SELECT id FROM public.product_variants WHERE sku='113115'),
   'rusty-society/frente-revo.jpg', 'Lentes de sol Rusty Society redondos, vista frontal, armazón negro mate con puente tipo llave y lente espejada azul', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-society'), NULL,
   'rusty-society/medidas-pol.jpg', 'Esquema técnico de medidas Rusty Society: lente 48mm, puente 20mm, varilla 140mm, alto total 46mm, ancho total 136mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en el Ardigan (gemelo de silueta; su descripción hoy no tiene links).
UPDATE public.products
SET description = description || E'\n\nSi te gusta el redondo con puente tipo llave pero con lente de 48 mm, mirá los [Rusty Society](/anteojos-de-sol/rusty/rusty-society).', updated_at = now()
WHERE slug = 'rusty-ardigan' AND description NOT LIKE '%rusty-society%';

COMMIT;
