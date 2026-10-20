-- ============================================
-- Seed 186: Rusty CALLED SOL (wayfarer / rectangular clásico, unisex), G-Flex, bisagras metálicas con flex, 3 variantes
-- Fecha: 2026-10-20
-- ============================================
-- ⚠️ SIN APLICAR: se aplica a Cloud sólo con el "aplicá" del founder.
-- 3 PUBLICACIONES TRADICIONALES de ML (`catalog_listing:false`, MLA417128), ACTIVAS, items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-10-20 (stock y precio de ML, se sincronizan solos):
--   128891  MBLK/S15        MLA1430094777  $82.482  stock 2  (25 vendidas)  negro mate, lente gris oscuro, NO polarizada, antirreflex en la cara interna
--   128894  MDBLU/REVO GREEN MLA1441302753 $85.429  stock 2  (9 vendidas)   azul oscuro mate, lente ESPEJADA VERDE (no polarizada), antirreflex en la cara interna
--   128896  SBLK/S10 POL    MLA2589224000  $88.339  stock 3  (0 vendidas)   negro brillo, lente gris oscuro POLARIZADA (antirreflex: sin dato, no se afirma)
-- DATOS DEL FOUNDER (2026-10-20): medidas 54-19-145, alto total 46, ancho total 144; G-Flex; bisagras metálicas con flex; categoría 3; UV400 (UVA y UVB); "diseño rectangular, para hombre especialmente";
--   policarbonato (default). Sin peso. ADMITE lentes graduadas (confirmado por el founder 2026-10-20): se deja la FAQ genérica y hay callout de graduación. GÉNERO: "cargalo como unisex nomás" (founder). La 128896 (polarizada) NO lleva antirreflex (confirmado). Azul: se nombra "azul oscuro mate" (el armazón medido da RGB ~41,48,72: navy, de frente se confunde con negro).
-- 🔬 optical-expert (2026-10-20): espejada = acabado, NO polarizada; polarizado sólo en la 3ª (va en descripción/callout/variante, NO en title/H1/meta); antirreflex SIEMPRE "en la cara interna"; "bisagras metálicas con flex" describe el mecanismo
--    (no "reforzadas", no "flexible", no durabilidad); gris = tono neutro (sin "colores reales"); "para hombre" = "pensados sobre todo para hombre", sin claim anatómico ni "unisex"; manejar sólo de día.
-- 🎯 SEO (seo-strategist): name `Rusty Called` (sin Optics), slug `rusty-called`, title (53) con "Lentes de Sol … Wayfarer" (lentes wayfarer 590 / diff 14; "Anteojos" ya es del Zaedit), meta (151) sin polarizados/espejados/rectangulares/hombre;
--    `frame_shape` wayfarer (rectangulares ya es de Rew y Reef 155 Ali), `hinge_system` flex, `gender` unisex (decisión final del founder); links a Rew (gemelo), Play, Terdey, hub; frase de vuelta sólo en Rew.
-- 📸 FOTOS: oficiales del distribuidor Cacic (portal mkt.cacicsv.com), 900×442, por `pnpm placas --tipo sol` y `pnpm fotos:subir --sufijo`. Las publicaciones de ML ya tienen sus placas: no se rehicieron.
-- ============================================

BEGIN;

WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM rusty), (SELECT id FROM sol), 'rusty-called', 'Rusty Called',
  'Lentes de sol Rusty Called: estilo wayfarer clásico con 4 remaches por lado, armazón de G-Flex y bisagras metálicas con flex. Policarbonato UV400, categoría 3. En 3 colores; sólo el negro brillo es polarizado.',
  E'Los **Rusty Called** son **lentes de sol de estilo wayfarer**, de línea rectangular clásica y con **4 remaches por lado**. El armazón es de **G-Flex**, con **bisagras metálicas con flex**.\n\nLas lentes son de **policarbonato**, con **100% de protección UVA y UVB a través de la lente (UV400)** y **categoría 3**, pensada para sol fuerte: sirven para manejar de día, no de noche. Vienen en tres versiones:\n\n• **Negro mate**, con lente gris oscuro y **antirreflex en la cara interna**, que reduce los reflejos que rebotan desde atrás hacia tus ojos. No es polarizada.\n• **Azul oscuro mate**, con lente **espejada verde** y antirreflex en la cara interna. El espejado es un acabado de la lente: no es polarizada.\n• **Negro brillo**, con lente gris oscuro **polarizada**, que reduce los reflejos del agua, el asfalto y la nieve.\n\nEl polarizado y el UV400 son cosas distintas: las tres versiones filtran el 100% de UVA y UVB. El gris oscuro es un tono neutro.\n\nMedidas: frente 144 mm · lente 54 mm · puente 19 mm · varilla 145 mm · alto total 46 mm.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi te gusta esta línea, mirá también los [Rusty Rew](/anteojos-de-sol/rusty/rusty-rew), los [Rusty Play](/anteojos-de-sol/rusty/rusty-play) y los [Rusty Terdey](/anteojos-de-sol/rusty/rusty-terdey). También podés ver [todos los anteojos de sol Rusty](/anteojos-de-sol/rusty).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "wayfarer",
    "hinge_system": "flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "unisex",
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 54, "lens_height_mm": 46, "bridge_mm": 19, "temple_length_mm": 145},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-20",
    "callouts": [
      {"type": "info", "position": "top", "title": "Wayfarer clásico y unisex", "body": "Armazón de G-Flex con bisagras metálicas con flex. Diseño rectangular tipo wayfarer, con 4 remaches por lado, de línea clásica. En negro mate, azul oscuro mate y negro brillo."},
      {"type": "tip", "position": "middle", "title": "UV400 y categoría 3 en las tres; polarizado en una", "body": "Las tres versiones filtran el 100% de UVA y UVB a través de la lente, categoría 3 para sol fuerte (sirve para manejar de día, no de noche). La versión negro brillo es polarizada y reduce los reflejos del agua, el asfalto y la nieve. La azul oscuro mate tiene lente espejada verde: es un acabado de la lente, no polarizado. Las versiones negro mate y azul oscuro mate llevan antirreflex en la cara interna, que reduce los reflejos que rebotan desde atrás hacia tus ojos."},
      {"type": "recommendation", "position": "bottom", "title": "¿Lo querés con tu graduación?", "body": "Admite lentes graduadas. Escribinos por WhatsApp con una foto de tu receta y lo vemos caso por caso."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1430094777", "MLA1441302753", "MLA2589224000"], "imported_at": "2026-10-20"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rusty Called Wayfarer | Óptica Carballo',
  'Lentes de sol Rusty Called de estilo wayfarer: armazón de G-Flex, bisagras metálicas con flex, UV400 y categoría 3. En 3 colores. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes, items simples de ML (variation_code NULL). Precio y stock de ML (2026-10-20). Primaria = la negro mate (la más vendida).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-called'), '128891',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK/S15","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   8248200, 2, true, 1, 'MLA1430094777', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), '128894',
   '{"frame_color":"azul-oscuro-mate","lens_color":"verde-espejado","model_code":"MDBLU/REVO GREEN","polarized":false,"lens_treatment":["antirreflejo-interno"]}'::jsonb,
   8542900, 2, true, 2, 'MLA1441302753', NULL),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), '128896',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK/S10 POL","polarized":true}'::jsonb,
   8833900, 3, true, 3, 'MLA2589224000', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de la negro mate.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='rusty-called'), (SELECT id FROM public.product_variants WHERE sku='128891'),
   'rusty-called/perfil-mblk.jpg', 'Lentes de sol Rusty Called estilo wayfarer, vista lateral, armazón negro mate con lente gris oscuro', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), (SELECT id FROM public.product_variants WHERE sku='128891'),
   'rusty-called/frente-mblk.jpg', 'Lentes de sol Rusty Called estilo wayfarer, vista frontal, armazón negro mate con 4 remaches por lado y lente gris oscuro', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), (SELECT id FROM public.product_variants WHERE sku='128894'),
   'rusty-called/perfil-mdblu.jpg', 'Lentes de sol Rusty Called estilo wayfarer, vista lateral, armazón azul oscuro mate con lente espejada verde', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), (SELECT id FROM public.product_variants WHERE sku='128894'),
   'rusty-called/frente-mdblu.jpg', 'Lentes de sol Rusty Called estilo wayfarer, vista frontal, armazón azul oscuro mate con 4 remaches por lado y lente espejada verde', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), (SELECT id FROM public.product_variants WHERE sku='128896'),
   'rusty-called/perfil-sblk.jpg', 'Lentes de sol Rusty Called estilo wayfarer, vista lateral, armazón negro brillo con lente gris oscuro polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), (SELECT id FROM public.product_variants WHERE sku='128896'),
   'rusty-called/frente-sblk.jpg', 'Lentes de sol Rusty Called estilo wayfarer, vista frontal, armazón negro brillo con 4 remaches por lado y lente gris oscuro polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='rusty-called'), NULL,
   'rusty-called/medidas-mblk.jpg', 'Esquema técnico de medidas Rusty Called: frente 144mm, lente 54mm, puente 19mm, varilla 145mm, alto total 46mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en el Rew (gemelo, 37 ventas; su descripción hoy no tiene links).
UPDATE public.products
SET description = description || E'\n\nSi te gusta esta línea pero con 4 remaches por lado, mirá los [Rusty Called](/anteojos-de-sol/rusty/rusty-called).', updated_at = now()
WHERE slug = 'rusty-rew' AND description NOT LIKE '%rusty-called%';

COMMIT;
