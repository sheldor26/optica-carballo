-- ============================================
-- Seed 168: Reef 299 Pier SOL, duodécimo producto de la marca Reef. Cuadrado semi-envolvente deportivo de hombre, TODAS POLARIZADAS, UV400 cat 3, bisagras plásticas reforzadas. 3 versiones: C03 gris mate con lente verde, C04 negro con patillas rojas y lente gris, C05 lente "Raised" (polarizada + espejado azul + AR interno)
-- Fecha: 2026-10-08
-- ============================================
-- ML verificado por API el 2026-10-08, publicaciones TRADICIONALES activas (las gemelas de catálogo MLA2584204722 y MLA2584270236 se ignoran):
--   MLA2583781810 (MULTIVARIANTE, $148.095,24, "Anteojos Lentes De Sol Polarizados Reef 299 Pier Gafas Moda"): var `193185435351` = "C03 - Gris Mate con Lentes Verdes" (stock 2) y var `193185435353` = "Cuadrado Semi-envolvente" (stock 1; temple "Negro/Rojo" => es la C04: CONFIRMADO por el founder el 2026-10-08, "Negro | Negro/rojo | Cuadrado Semi-envolvente es la C04").
--   MLA2584101628 (item simple, `variation_code` NULL, $167.616,84, stock 1, GTIN 7791394265221): la C05 (espejada azul, gris/celeste).
-- Stock y precio mandan desde ML.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-08): cuadrado, hombre, deportivo, bisagra plástica reforzada, cat 3; medidas 58-20-134, altura total 49, ancho total 148; TODOS polarizados; la C05 tiene lentes "Raised": polarizado + espejado azul + AR interno.
-- AR de C03 y C04: el founder sólo lo afirmó para la C05; NO se afirma en las otras (confirmar). La marca (calibre 58, puente 20, alto 44, patilla 134, "No Flex", Grilamid TR90) no gana contra el founder; marco neutro `injected` (NO Grilamid).
-- Lente: ML y la marca dicen TAC/policarbonato; igual que el 128/129 se carga `lens_material:"tac"` (ML: LENS_MATERIAL=TAC en las dos publicaciones).
-- POLARIZADO: las 3 versiones lo son => `lens_treatment` del producto ["uv400","polarized"] y "polarizados" SÍ va en title/meta/short (ver SEO_STRATEGY: habilitado mientras no haya una versión no polarizada). `polarized` true por variante; AR interno sólo en la C05.
-- 📷 FOTOS: de la marca (reefeyewear.com ids 6898=C03, 6900=C04, 6902=C05; ficha activa id_product 1635). Sin placas de ML (publicaciones ya cargadas).
-- 🎯 SEO (seo-strategist): slug reef-299-pier, `frame_shape:"cuadrado"` (no existe semi-envolvente), descriptor "hombre + polarizados" (`lentes de sol hombre polarizados` 50/35, sin la cabecera contigua del hub), sin sufijo de marca en el title, link al hub `/anteojos-de-sol/polarizados` con anchor "lentes polarizados".
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-299-pier', 'Reef 299 Pier',
  'Lentes de sol Reef 299 Pier para hombre: frente cuadrado semi-envolvente, lentes polarizados, UV400 y categoría 3. Patillas con diseño interior estampado.',
  E'Los **Reef 299 Pier** son **lentes de sol polarizados para hombre**, de frente cuadrado semi-envolvente y estilo deportivo. El armazón es inyectado, con bisagras plásticas reforzadas, el logo REEF en la patilla y un diseño interior estampado en las patillas. Las lentes son **polarizadas, de material TAC, con protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**.\n\n**Polarizadas.** Las tres versiones llevan [lentes polarizados](/anteojos-de-sol/polarizados): el filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas, o que cueste leerlas, según el ángulo. La protección UV la da el UV400, no el polarizado.\n\n**Versión C05.** Es la de lente espejada: polarizada, con espejado azul y antirreflejo en la cara interna (Reef la llama lente Raised). El espejado es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y sirve para manejar de día. Como cualquier lente de sol, no es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 58 mm de ancho · puente 20 mm · varilla 134 mm · ancho total 148 mm · alto 49 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás un cuadrado para hombre con el lente más alto, mirá los [Reef 193 Tortuga](/anteojos-de-sol/reef/reef-193-tortuga); si preferís un envolvente más cerrado, los [Reef 188 Octopus](/anteojos-de-sol/reef/reef-188-octopus), y si querés uno de estilo deportivo, los [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial).\n\nSi querés un lente único tipo máscara de 130 mm, mirá los [Reef 295 AI Design](/anteojos-de-sol/reef/reef-295-ai-design).',
  '{
    "frame_material": "injected",
    "frame_shape": "cuadrado",
    "lens_material": "tac",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo", "oblongo"],
    "gender": "male",
    "hinge_system": "plastica reforzada",
    "measurements": {"frame_width_mm": 148, "lens_width_mm": 58, "bridge_mm": 20, "temple_length_mm": 134, "lens_height_mm": 49},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-08",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras plásticas reforzadas", "body": "Armazón inyectado de frente cuadrado semi-envolvente, con el logo REEF en la patilla y diseño interior estampado en las patillas."},
      {"type": "tip", "position": "middle", "title": "Polarizadas, TAC y UV400", "body": "Las tres versiones son polarizadas, de material TAC, con UV400 y categoría 3. La C05 suma espejado azul y antirreflejo interno."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2583781810", "MLA2584101628"], "imported_at": "2026-10-08"}
  }'::jsonb,
  true, false,
  'Reef 299 Pier | Lentes de Sol Hombre Polarizados',
  'Lentes de sol Reef 299 Pier para hombre: polarizados UV400, frente cuadrado semi-envolvente y armazón inyectado. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes: C03 y C04 son 2 variaciones de MLA2583781810 (variation_code real); C05 es un item simple (NULL). Primaria = C03 (mayor stock).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-299-pier'), 'REEF299-C03',
   '{"frame_color":"gris-oscuro-mate-patillas-verdes","lens_color":"verde","polarized":true,"model_code":"C03"}'::jsonb,
   14809524, 2, true, 1, 'MLA2583781810', '193185435351'),
  ((SELECT id FROM public.products WHERE slug='reef-299-pier'), 'REEF299-C04',
   '{"frame_color":"negro-patillas-rojas","lens_color":"gris","polarized":true,"model_code":"C04"}'::jsonb,
   14809524, 1, true, 2, 'MLA2583781810', '193185435353'),
  ((SELECT id FROM public.products WHERE slug='reef-299-pier'), 'REEF299-C05',
   '{"frame_color":"gris-celeste-degrade","lens_color":"azul-espejado","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C05","gtin":"7791394265221"}'::jsonb,
   16761684, 1, true, 3, 'MLA2584101628', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 4 imágenes: el perfil de cada versión + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-299-pier'), (SELECT id FROM public.product_variants WHERE sku='REEF299-C03'),
   'reef-299-pier/perfil-c03.jpg', 'Lentes de sol Reef 299 Pier C03 de perfil, armazón gris oscuro mate con patillas verdes, logo REEF en relieve y lente verde polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-299-pier'), (SELECT id FROM public.product_variants WHERE sku='REEF299-C04'),
   'reef-299-pier/perfil-c04.jpg', 'Lentes de sol Reef 299 Pier C04 de perfil, armazón negro con patillas rojas, logo REEF en relieve y lente gris polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-299-pier'), (SELECT id FROM public.product_variants WHERE sku='REEF299-C05'),
   'reef-299-pier/perfil-c05.jpg', 'Lentes de sol Reef 299 Pier C05 de perfil, armazón degradé gris y celeste con lente polarizada espejada azul', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-299-pier'), NULL,
   'reef-299-pier/medidas.jpg', 'Esquema técnico de medidas Reef 299 Pier: ancho total 148mm, lente 58mm, alto 49mm, puente 20mm, varilla 134mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
