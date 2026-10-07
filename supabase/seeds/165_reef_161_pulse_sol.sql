-- ============================================
-- Seed 165: Reef 161 Pulse SOL, noveno producto de la marca Reef. AVIADOR metálico de doble puente, UNISEX, UV400 cat 3, bisagras metálicas con sistema flex. 5 versiones con stock: C08 espejado azul (no pol), C13/C14/C16/C12 polarizadas
-- Fecha: 2026-10-07
-- ============================================
-- 5 variantes en 5 publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples: `variation_code` NULL), ACTIVAS, verificadas por API el 2026-10-07 (los links del founder llevan `pdp_filters=item_id:...`; se usan los items tradicionales de cada User Product, las gemelas de catálogo se ignoran):
--   C08 MLA1543877016 ($137.447,01, stock 2, GTIN 7790394190106) · C13 MLA1389495787 ($154.370,04, stock 3, GTIN 7790394199802) · C14 MLA1389535369 ($154.370,04, stock 1)
--   C16 MLA1543903996 ($154.370,04, stock 1, GTIN 7790394214833) · C12 MLA1389507959 ($154.370,04, stock 3, GTIN 7790394199796). Stock y precio mandan desde ML.
-- GTIN de la C14: ML tiene 7894563230706 (placeholder, no sigue el patrón de Reef); el founder pasó el correcto: 7790394200867 (2026-10-07) y es el que se carga.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-07): aviador, unisex, metálico, bisagras metálicas con sistema flex, doble puente; medidas 60-14-132, altura total 49, ancho total 140. Todas con AR interno menos la C16.
-- C08 espejado azul con AR, no polarizado. Polarizadas: C13, C14, C16, C12 (por el título de cada publicación y el ML). La marca (calibre 61, puente 15, alto 45, patilla 132, CRX/policarbonato) no gana contra los datos del founder.
-- Lentes: C13 gris oscuro, C14 y C12 gris verdoso (confirmado por el founder; ML decía negro y verde), C16 verde G15; lente de policarbonato por default del repo (la marca dice CRX/policarbonato).
-- POLARIZADO PARCIAL (criterio 177/183/155): `polarized` por variante; `lens_treatment` del producto sólo ["uv400"]; AR interno por variante (todas menos la C16). Sin "polarizado" en title/H1/short/meta.
-- 📷 FOTOS: de la marca (reefeyewear.com ids 614=C08, 616=C13, 617=C14, 5206=C16, 615=C12; ficha activa id_product 240), 1000-1300 px. El founder avisó que NO hacen falta placas de ML (ya las tiene cargadas).
-- 🎯 SEO (seo-strategist): slug reef-161-pulse, descriptor "Aviador Metálico" como modificador (las demás formas ya están tomadas); sin "doble puente" en title (Bruice), sin "lentes de sol reef"; "flex" sólo como "bisagras con sistema flex".
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-161-pulse', 'Reef 161 Pulse',
  'Lentes de sol aviador metálico Reef 161 Pulse, unisex, con doble puente. Bisagras metálicas con sistema flex, UV400 y categoría 3.',
  E'Los **Reef 161 Pulse** son **lentes de sol aviador metálico, unisex, con doble puente**: un modelo para mujer y para hombre. El armazón es de metal y las bisagras son metálicas, con sistema flex. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**. Casi todas las versiones llevan antirreflejo en la cara interna.\n\n**Polarizado según la versión.** El polarizado depende de la versión: la de lente espejado azul no es polarizada y las demás llevan lente polarizada. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas según el ángulo. El espejado es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. La protección UV la da el UV400, no el polarizado ni el espejado.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 60 mm de ancho · puente 14 mm · varilla 132 mm · ancho total 140 mm · alto 49 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás el mismo frente de metal en formato envolvente, mirá los [Reef 128 Yin](/anteojos-de-sol/reef/reef-128-yin) y los [Reef 129 Yang](/anteojos-de-sol/reef/reef-129-yang). Para un armazón inyectado de línea clásica, tenés los [Reef 155 Ali](/anteojos-de-sol/reef/reef-155-ali). Y si querés comparar con otros modelos de la forma, mirá todos los [lentes de sol aviador](/anteojos-de-sol/aviador).',
  '{
    "frame_material": "metal",
    "frame_shape": "aviador",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "cuadrado", "corazon"],
    "gender": "unisex",
    "hinge_system": "flex",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 60, "bridge_mm": 14, "temple_length_mm": 132, "lens_height_mm": 49},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-07",
    "callouts": [
      {"type": "info", "position": "top", "title": "Aviador de metal con doble puente", "body": "Armazón aviador de metal con doble puente. Las bisagras son metálicas y llevan sistema flex."},
      {"type": "warning", "position": "middle", "title": "Polarizado según la versión", "body": "La versión de lente espejado azul no es polarizada; las demás sí. Todas tienen UV400 y categoría 3."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1543877016", "MLA1389495787", "MLA1389535369", "MLA1543903996", "MLA1389507959"], "imported_at": "2026-10-07"}
  }'::jsonb,
  true, false,
  'Aviador Metálico Reef 161 Pulse | Lentes de Sol Unisex',
  'Lentes de sol aviador metálico Reef 161 Pulse, unisex: doble puente, bisagras con sistema flex, UV400 y categoría 3. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 5 variantes: items simples de ML (variation_code NULL). Orden por stock (C13 y C12 con 3, C08 con 2, C14 y C16 con 1); primaria = C13 (perfil de la variante con mayor stock).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), 'REEF161-C08',
   '{"frame_color":"dorado-detalles-azules","lens_color":"azul-espejado","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C08","gtin":"7790394190106"}'::jsonb,
   13744701, 2, true, 3, 'MLA1543877016', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), 'REEF161-C13',
   '{"frame_color":"plateado-terminales-blancas","lens_color":"gris-oscuro","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C13","gtin":"7790394199802"}'::jsonb,
   15437004, 3, true, 1, 'MLA1389495787', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), 'REEF161-C14',
   '{"frame_color":"plateado-terminales-negras","lens_color":"gris-verdoso","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C14","gtin":"7790394200867"}'::jsonb,
   15437004, 1, true, 4, 'MLA1389535369', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), 'REEF161-C16',
   '{"frame_color":"dorado-detalles-ocre","lens_color":"verde-g15","polarized":true,"model_code":"C16","gtin":"7790394214833"}'::jsonb,
   15437004, 1, true, 5, 'MLA1543903996', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), 'REEF161-C12',
   '{"frame_color":"peltre-terminales-azules","lens_color":"gris-verdoso","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C12","gtin":"7790394199796"}'::jsonb,
   15437004, 3, true, 2, 'MLA1389507959', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 6 imágenes: el perfil de cada versión + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), (SELECT id FROM public.product_variants WHERE sku='REEF161-C08'),
   'reef-161-pulse/perfil-c08.jpg', 'Lentes de sol aviador Reef 161 Pulse C08, armazón dorado con detalles azules y lente espejado azul, vista de perfil', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), (SELECT id FROM public.product_variants WHERE sku='REEF161-C13'),
   'reef-161-pulse/perfil-c13.jpg', 'Lentes de sol aviador Reef 161 Pulse C13, armazón plateado con terminales blancas y lente gris oscuro polarizada, vista de perfil', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), (SELECT id FROM public.product_variants WHERE sku='REEF161-C14'),
   'reef-161-pulse/perfil-c14.jpg', 'Lentes de sol aviador Reef 161 Pulse C14, armazón plateado con terminales negras y lente gris verdoso polarizada, vista de perfil', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), (SELECT id FROM public.product_variants WHERE sku='REEF161-C16'),
   'reef-161-pulse/perfil-c16.jpg', 'Lentes de sol aviador Reef 161 Pulse C16, armazón dorado con detalles ocre y lente verde G15 polarizada, vista de perfil', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), (SELECT id FROM public.product_variants WHERE sku='REEF161-C12'),
   'reef-161-pulse/perfil-c12.jpg', 'Lentes de sol aviador Reef 161 Pulse C12, armazón peltre con terminales azules y lente gris verdoso polarizada, vista de perfil', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-161-pulse'), NULL,
   'reef-161-pulse/medidas.jpg', 'Esquema técnico de medidas Reef 161 Pulse: ancho total 140mm, lente 60mm, alto 49mm, puente 14mm, varilla 132mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
