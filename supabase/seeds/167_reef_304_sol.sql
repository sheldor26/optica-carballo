-- ============================================
-- Seed 167: Reef 304 SOL, undécimo producto de la marca Reef. Lentes grandes de hombre, diseño deportivo cuadrado/rectangular, UV400 cat 3, bisagras plásticas reforzadas. 3 versiones, todas con AR interno y NO polarizadas: C01 negro mate, C02 negro y turquesa degradé con lente semiespejado azul, C06 negro brillo
-- Fecha: 2026-10-08
-- ============================================
-- 3 variantes en UNA publicación TRADICIONAL de ML con 3 variaciones (`catalog_listing:false`), verificada por API el 2026-10-08: MLA1587276537 ($137.338,44 todas, activa):
--   C01 `187251623370` (stock 2) · C02 `187251623372` (stock 1) · C06 `187251623374` (stock 3). Stock y precio mandan desde ML. (MLA1602083811 es de catálogo y se ignora.)
-- Sin GTIN (ML no lo da por variación). El link de la marca que pasó el founder es la ficha general del 304 (color 003 polarizado y superhidrofóbico: NO es de las 3 que tiene).
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-08): cuadrado/rectangular deportivo, armazón de inyección, bisagras plásticas reforzadas, hombre, cat 3; 62-18-118, altura total 46, ancho total 145; las 3 con AR interno.
-- Polarización: el founder no la mencionó y ML marca el item "No": se carga `polarized:false` en las 3 (confirmar). La marca (calibre 62, puente 18, alto 39, patilla 118, "No Flex", Grilamid TR90) no gana contra los datos del founder; marco neutro `injected` (NO Grilamid).
-- Lente de policarbonato (default del repo y ficha de la marca). Color de lente: C01 y C06 gris (foto de la marca), C02 azul semiespejado (founder: "lentes semiespejadas azules").
-- 📷 FOTOS: de la marca (reefeyewear.com ids 6944=C01, 6946=C02, 6954=C06; ficha activa id_product 1640). El founder avisó que NO hacen falta placas de ML (publicación ya cargada).
-- 🎯 SEO (seo-strategist): slug reef-304, descriptor "grandes" (`lentes de sol grandes` 90/19; el lente de 62 mm es el más ancho de Reef), `frame_shape:"rectangular"`, sin "calados" (307), sin "deportivo" en title/short, sin "polarizado"; "hombre" en meta y short, no en el title (193).
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-304', 'Reef 304',
  'Lentes de sol grandes Reef 304 para hombre: frente ancho rectangular, patillas con el logo REEF grabado, UV400 y categoría 3.',
  E'Los **Reef 304** son **lentes de sol grandes para hombre**, de diseño deportivo, con frente ancho rectangular y el logo REEF grabado en las patillas. El armazón es inyectado, con bisagras plásticas reforzadas. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**. Las tres versiones llevan antirreflejo en la cara interna.\n\n**Antirreflejo y semiespejado.** El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. La versión de lente azul es semiespejada: lleva una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. Estas lentes no son polarizadas. La protección UV la da el UV400, no el antirreflejo ni el espejado.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 62 mm de ancho · puente 18 mm · varilla 118 mm · ancho total 145 mm · alto 46 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nSon de tamaño grande: están pensados para rostros medianos a anchos. Si tenés la cara chica, consultanos antes de comprar.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás un diseño deportivo con frente envolvente y un lente algo más chico, mirá los [Reef 307](/anteojos-de-sol/reef/reef-307). Para un frente rectangular más clásico y angosto, están los [Reef 155 Ali](/anteojos-de-sol/reef/reef-155-ali).',
  '{
    "frame_material": "injected",
    "frame_shape": "rectangular",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo"],
    "gender": "male",
    "hinge_system": "plastica reforzada",
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 62, "bridge_mm": 18, "temple_length_mm": 118, "lens_height_mm": 46},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-08",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras plásticas reforzadas", "body": "Armazón inyectado de diseño deportivo, con frente ancho rectangular y el logo REEF grabado en las patillas."},
      {"type": "warning", "position": "middle", "title": "Antirreflejo interno, no polarizadas", "body": "Las tres versiones tienen antirreflejo interno, UV400 y categoría 3. Ninguna es polarizada; la de lente azul es semiespejada."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1587276537"], "imported_at": "2026-10-08"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Grandes Reef 304 | Óptica Carballo',
  'Lentes de sol grandes Reef 304 para hombre: armazón inyectado, lente de 62 mm de ancho, UV400 y categoría 3. Envío a todo el país, estuche y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes de UN item de ML con variation_code real. Orden por stock: C06 (3), C01 (2), C02 (1); primaria = C06 (mayor stock).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-304'), 'REEF304-C06',
   '{"frame_color":"negro-brillo","lens_color":"gris","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C06"}'::jsonb,
   13733844, 3, true, 1, 'MLA1587276537', '187251623374'),
  ((SELECT id FROM public.products WHERE slug='reef-304'), 'REEF304-C01',
   '{"frame_color":"negro-mate","lens_color":"gris","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C01"}'::jsonb,
   13733844, 2, true, 2, 'MLA1587276537', '187251623370'),
  ((SELECT id FROM public.products WHERE slug='reef-304'), 'REEF304-C02',
   '{"frame_color":"negro-turquesa-degrade","lens_color":"azul-semi-espejado","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C02"}'::jsonb,
   13733844, 1, true, 3, 'MLA1587276537', '187251623372')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 4 imágenes: el perfil de cada versión + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-304'), (SELECT id FROM public.product_variants WHERE sku='REEF304-C06'),
   'reef-304/perfil-c06.jpg', 'Perfil de los lentes de sol grandes Reef 304 en negro brillo, con el logo REEF grabado en la patilla', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-304'), (SELECT id FROM public.product_variants WHERE sku='REEF304-C01'),
   'reef-304/perfil-c01.jpg', 'Perfil de los lentes de sol grandes Reef 304 en negro mate, con el logo REEF grabado en la patilla', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-304'), (SELECT id FROM public.product_variants WHERE sku='REEF304-C02'),
   'reef-304/perfil-c02.jpg', 'Perfil de los lentes de sol grandes Reef 304 en negro y turquesa degradé, con lente semiespejado azul', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-304'), NULL,
   'reef-304/medidas.jpg', 'Esquema técnico de medidas Reef 304: ancho total 145mm, lente 62mm, alto 46mm, puente 18mm, varilla 118mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
