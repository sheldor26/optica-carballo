-- ============================================
-- Seed 166: Reef 307 SOL, décimo producto de la marca Reef. Deportivo de hombre con frente envolvente y protección lateral calada, UV400 cat 3, bisagras plásticas. 3 versiones: C01 negro brillo (lente gris, AR, no pol), C02 negro mate (lente marrón POLARIZADA, sin AR), C03 azul mate (espejado azul, AR, no pol)
-- Fecha: 2026-10-07
-- ============================================
-- 3 variantes en 3 publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples: `variation_code` NULL), ACTIVAS, publicadas por el founder el 2026-10-07, verificadas por API (las gemelas de catálogo MLA4040511812 y MLA4040499512 se ignoran):
--   C01 MLA4040499154 (MLAU5388356977, $121.500, stock 2, GTIN 7791394271857) · C02 MLA2161555871 (MLAU5431051430, $121.500, stock 2) · C03 MLA2161555873 (MLAU5388365747, $121.500, stock 2, GTIN 7791394271895)
-- ⚠️ GTIN: C02 y C03 tienen el MISMO (7791394271895) en ML; el título de la C02 dice "C3 Espejados Azules" y su atributo polarizado figura "No": la C02 se clonó de la C03 (el GTIN real es el de la C03, espejado azul). NO se carga el GTIN de la C02 hasta que el founder pase el correcto, y hay que corregirle el título y el atributo "con lente polarizada" en ML.
-- ML marca estas publicaciones con "Grilamid / Envolvente / Sin género" (C02, C03) y "Inyección / Rectangular / Hombre" (C01): manda el founder (hombre, inyección, deportivo). `frame_shape:"envolvente"` por la forma (protección lateral).
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-07): deportivo, hombre, bisagras plásticas, armazón de inyección, cat 3, UV400; medidas 58-17-133, altura total 47, ancho total 144. La marca (calibre 58, puente 17, alto 42, patilla 133, "No Flex", CR39/CRX/policarbonato) no gana contra los datos del founder; lente de policarbonato por default del repo.
-- C02 polarizada SIN antirreflejo interno. La marca marca 0001 (C01) y 0002 como polarizados; el founder dice que la C01 NO lo es (se sigue al founder).
-- POLARIZADO PARCIAL: `polarized` por variante (sólo C02 true); `lens_treatment` del producto sólo ["uv400"]; AR interno por variante (C01 y C03). Sin "polarizado" en title/H1/short/meta.
-- 📷 FOTOS: de la marca (reefeyewear.com ids 6051=C01, 6053=C02, 6055=C03; ficha activa id_product 1527). Placas de ML hechas para publicar (carpeta SUBIR-reef-307).
-- 🎯 SEO (seo-strategist) + óptica: slug reef-307; descriptor "con laterales calados" (el único rasgo propio; "protección lateral" lo corrigió optical-expert: sugiere proteger del viento/polvo y los laterales calados no sellan), sin sufijo de marca en el title (supera 60), sin "polarizado" ni "lentes de sol reef"; "deportivo" sólo como "de estilo deportivo" (es del 177).
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-307', 'Reef 307',
  'Lentes de sol Reef 307 para hombre, de estilo deportivo: frente envolvente con laterales calados y logo Reef calado en las patillas. UV400, categoría 3 y bisagras plásticas.',
  E'Los **Reef 307** son **lentes de sol para hombre, de estilo deportivo**, con frente envolvente, laterales calados y el logo de Reef calado en las patillas. El armazón es inyectado, con bisagras plásticas. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**.\n\n**Polarizado según la versión.** El polarizado depende de la versión: la de lente marrón es polarizada y las de lente gris y espejado azul no. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas según el ángulo. El espejado es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. Las versiones con antirreflejo lo llevan en la cara interna de la lente: reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. La protección UV la da el UV400, no el polarizado ni el espejado.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 58 mm de ancho · puente 17 mm · varilla 133 mm · ancho total 144 mm · alto 47 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás un deportivo con lente más grande y bisagras metálicas, mirá los [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial). Si querés otro envolvente de armazón inyectado, mirá los [Reef 188 Octopus](/anteojos-de-sol/reef/reef-188-octopus).',
  '{
    "frame_material": "injected",
    "frame_shape": "envolvente",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "cuadrado"],
    "gender": "male",
    "hinge_system": "plastica",
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 58, "bridge_mm": 17, "temple_length_mm": 133, "lens_height_mm": 47},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-07",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras plásticas", "body": "Armazón inyectado de estilo deportivo, con frente envolvente, laterales calados y logo Reef calado en las patillas. El diseño envolvente cubre parte del costado del ojo; los laterales calados no sellan, así que no es una protección contra viento ni polvo."},
      {"type": "warning", "position": "middle", "title": "Polarizado según la versión", "body": "Sólo la versión de lente marrón es polarizada. Las de lente gris y espejado azul no lo son y tienen antirreflejo interno. Todas tienen UV400 y categoría 3."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA4040499154", "MLA2161555871", "MLA2161555873"], "imported_at": "2026-10-07"}
  }'::jsonb,
  true, false,
  'Reef 307 | Lentes de Sol con Laterales Calados',
  'Lentes de sol Reef 307 para hombre: armazón inyectado con frente envolvente y laterales calados, UV400 y categoría 3. Envío a todo el país, estuche y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes: items simples de ML (variation_code NULL), todas con stock 2: primaria = C01.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-307'), 'REEF307-C01',
   '{"frame_color":"negro-brillo","lens_color":"gris","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C01","gtin":"7791394271857"}'::jsonb,
   12150000, 2, true, 1, 'MLA4040499154', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-307'), 'REEF307-C02',
   '{"frame_color":"negro-mate","lens_color":"marron","polarized":true,"model_code":"C02"}'::jsonb,
   12150000, 2, true, 2, 'MLA2161555871', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-307'), 'REEF307-C03',
   '{"frame_color":"azul-mate","lens_color":"azul-espejado","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C03","gtin":"7791394271895"}'::jsonb,
   12150000, 2, true, 3, 'MLA2161555873', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 4 imágenes: el perfil de cada versión + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-307'), (SELECT id FROM public.product_variants WHERE sku='REEF307-C01'),
   'reef-307/perfil-c01.jpg', 'Lentes de sol Reef 307 en negro brillo con lente gris, vista de perfil con laterales calados y logo Reef en la patilla', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-307'), (SELECT id FROM public.product_variants WHERE sku='REEF307-C02'),
   'reef-307/perfil-c02.jpg', 'Lentes de sol Reef 307 en negro mate con lente marrón polarizada, vista de perfil con laterales calados y logo Reef en la patilla', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-307'), (SELECT id FROM public.product_variants WHERE sku='REEF307-C03'),
   'reef-307/perfil-c03.jpg', 'Lentes de sol Reef 307 en azul mate con lente espejado azul, vista de perfil con laterales calados y logo Reef en la patilla', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-307'), NULL,
   'reef-307/medidas.jpg', 'Esquema técnico de medidas Reef 307: ancho total 144mm, lente 58mm, alto 47mm, puente 17mm, varilla 133mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
