-- ============================================
-- Seed 164: Reef 155 Ali SOL, octavo producto de la marca Reef. Rectangular clásico, hombre, UV400 cat 3, bisagras plásticas. 7 versiones (hoy sólo la C25 tiene 1 unidad; el resto SIN STOCK y con publicación pausada: el founder las reactiva después y se sincronizan solas)
-- Fecha: 2026-10-06
-- ============================================
-- 7 variantes en 7 publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples: `variation_code` NULL), verificadas por API el 2026-10-06, TODAS pausadas:
--   C25 MLA1388774515 (pausada con stock 1, $130.990, GTIN 7791394253501; ML la llama "024 polarizado": el GTIN es el siguiente al de la C24 ...495, y la marca marca el 0025 como polarizado => es la C25)
--   C24 MLA1749201862 ($116.390, GTIN 7791394253495) · C14 MLA1388773671 ($125.000, 7790394182132) · C07 MLA1437948473 ($105.790, 7790394145878)
--   C01 MLA1422998727 ($105.790, 7790394145892) · C18 MLA1388774187 ($130.990, 7790394199789) · C20 MLA1422986079 ($114.290, 7790394202946; el founder la nombró "C02 marrón brillo polarizado": es la 0020)
-- Stock y precio mandan desde ML (se sincronizan). Las gemelas de catálogo se ignoran.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-06): clásico cuadrado/rectangular de hombre, bisagras plásticas, UV400, cat 3; medidas 55-18-136, altura total 44, ancho total 139; armazón de inyección, lentes de policarbonato.
-- C25 negro mate polarizada con AR; C24 negro mate con AR (no pol); C14 espejado azul con AR (no pol); C07 frente negro brillo / patillas rojas con AR (no pol); C01 negro brillo con AR sin pol (por el título de su publicación);
-- C18 negro brillo polarizada; C20 marrón brillo lente marrón polarizada. Lente gris oscuro salvo el espejado y la marrón. AR en C18 y C20: SIN DATO, no se afirma.
-- La marca (calibre 55, puente 18, alto 36, patilla 136, "No Flex", BTR600) no gana contra los datos del founder. Marco: valor neutro `injected`.
-- `frame_shape:"rectangular"` (seo-strategist: "cuadrado" ya es de 196 y 193 en el filtro); el founder dijo "clásico cuadrado": cambiar a `cuadrado` si prefiere.
-- POLARIZADO PARCIAL: `polarized` por variante (C25, C18, C20 true); `lens_treatment` del producto sólo ["uv400"]; AR interno por variante. Sin "polarizado" en title/H1/short/meta.
-- 📷 FOTO C07 (cambiada 2026-10-06 por pedido del founder, "se ve mejor"): la de Paesani `anteojos-reef-ali-patillas-rojo` (id 5231, product_zoom 1200 px) en vez de la de su publicación de ML: `perfil-c07-pae.jpg`.
-- 📷 FOTOS: de la marca (reefeyewear.com ids 4531=C25, 4530=C24, 3786=C14, 4525=C01, 3787=C18, 3788=C20); la C07 (patillas rojas) NO está en la marca: foto de su publicación vieja de ML en tamaño completo (-F, 1200 px).
-- 🎯 SEO (seo-strategist): slug reef-155-ali, descriptor "Rectangulares" (cuadrados=196, hombre=193, espejados=183, deportivos=177, envolventes=188). Sin color ni cantidad de versiones en el copy.
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-155-ali', 'Reef 155 Ali',
  'Lentes de sol rectangulares Reef 155 Ali: línea clásica para hombre. UV400, categoría 3 y armazón inyectado con bisagras plásticas.',
  E'Los **Reef 155 Ali** son **lentes de sol rectangulares para hombre, de línea clásica**. El armazón es inyectado, con bisagras plásticas. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**.\n\n**Polarizado según la versión.** El polarizado depende de la versión: algunas llevan lente polarizada, otras lente oscura sin polarizar y una tiene lente espejada azul, que no es polarizada. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas según el ángulo. El espejado es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. Las versiones con antirreflejo lo llevan en la cara interna de la lente: reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. La protección UV la da el UV400, no el polarizado ni el espejado.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 55 mm de ancho · puente 18 mm · varilla 136 mm · ancho total 139 mm · alto 44 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi preferís un frente más cuadrado y unisex, mirá los [Reef 196 Reunión](/anteojos-de-sol/reef/reef-196-reunion); y si buscás un lente más ancho para hombre, el [Reef 193 Tortuga](/anteojos-de-sol/reef/reef-193-tortuga).',
  '{
    "frame_material": "injected",
    "frame_shape": "rectangular",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo"],
    "gender": "male",
    "hinge_system": "plastica",
    "measurements": {"frame_width_mm": 139, "lens_width_mm": 55, "bridge_mm": 18, "temple_length_mm": 136, "lens_height_mm": 44},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-06",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras plásticas", "body": "Armazón rectangular de línea clásica, inyectado, con bisagras plásticas."},
      {"type": "warning", "position": "middle", "title": "Polarizado según la versión", "body": "Algunas versiones son polarizadas y otras no; la de lente espejada azul no es polarizada. Todas tienen UV400 y categoría 3. Varias versiones están sin stock hasta que reingresen."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1388774515", "MLA1749201862", "MLA1388773671", "MLA1437948473", "MLA1422998727", "MLA1388774187", "MLA1422986079"], "imported_at": "2026-10-06"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Rectangulares Reef 155 Ali | Óptica Carballo',
  'Lentes de sol rectangulares Reef 155 Ali para hombre: armazón inyectado, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 7 variantes: items simples de ML (variation_code NULL). Primaria = C25 (única con stock).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), 'REEF155-C25',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C25","gtin":"7791394253501"}'::jsonb,
   13099000, 1, true, 1, 'MLA1388774515', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), 'REEF155-C24',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C24","gtin":"7791394253495"}'::jsonb,
   11639000, 0, true, 2, 'MLA1749201862', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), 'REEF155-C14',
   '{"frame_color":"negro-mate","lens_color":"azul-espejado","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C14","gtin":"7790394182132"}'::jsonb,
   12500000, 0, true, 3, 'MLA1388773671', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), 'REEF155-C07',
   '{"frame_color":"negro-brillo-patillas-rojas","lens_color":"gris-oscuro","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C07","gtin":"7790394145878"}'::jsonb,
   10579000, 0, true, 4, 'MLA1437948473', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), 'REEF155-C01',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C01","gtin":"7790394145892"}'::jsonb,
   10579000, 0, true, 5, 'MLA1422998727', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), 'REEF155-C18',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","polarized":true,"model_code":"C18","gtin":"7790394199789"}'::jsonb,
   13099000, 0, true, 6, 'MLA1388774187', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), 'REEF155-C20',
   '{"frame_color":"marron-transparente","lens_color":"marron","polarized":true,"model_code":"C20","gtin":"7790394202946"}'::jsonb,
   11429000, 0, true, 7, 'MLA1422986079', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 8 imágenes: el perfil de cada versión + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), (SELECT id FROM public.product_variants WHERE sku='REEF155-C25'),
   'reef-155-ali/perfil-c25.jpg', 'Lentes de sol rectangulares Reef 155 Ali en negro mate con lente polarizada, vista de perfil', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), (SELECT id FROM public.product_variants WHERE sku='REEF155-C24'),
   'reef-155-ali/perfil-c24.jpg', 'Lentes de sol rectangulares Reef 155 Ali en negro mate, vista de perfil', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), (SELECT id FROM public.product_variants WHERE sku='REEF155-C14'),
   'reef-155-ali/perfil-c14.jpg', 'Lentes de sol rectangulares Reef 155 Ali en negro mate con lente espejada azul, vista de perfil', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), (SELECT id FROM public.product_variants WHERE sku='REEF155-C07'),
   'reef-155-ali/perfil-c07-pae.jpg', 'Lentes de sol rectangulares Reef 155 Ali con frente negro brillante y patillas rojas, vista de perfil', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), (SELECT id FROM public.product_variants WHERE sku='REEF155-C01'),
   'reef-155-ali/perfil-c01.jpg', 'Lentes de sol rectangulares Reef 155 Ali en negro brillante, vista de perfil', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), (SELECT id FROM public.product_variants WHERE sku='REEF155-C18'),
   'reef-155-ali/perfil-c18.jpg', 'Lentes de sol rectangulares Reef 155 Ali en negro brillante con lente polarizada, vista de perfil', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), (SELECT id FROM public.product_variants WHERE sku='REEF155-C20'),
   'reef-155-ali/perfil-c20.jpg', 'Lentes de sol rectangulares Reef 155 Ali en marrón translúcido con lente marrón polarizada, vista de perfil', 2000, 1333, 6, false),
  ((SELECT id FROM public.products WHERE slug='reef-155-ali'), NULL,
   'reef-155-ali/medidas.jpg', 'Esquema técnico de medidas Reef 155 Ali: ancho total 139mm, lente 55mm, alto 44mm, puente 18mm, varilla 136mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
