-- ============================================
-- Seed 170: Reef 219 Pupukea SOL, decimocuarto producto de la marca Reef. Cuadrado de hombre con patillas de trama y logo Reef, UV400 cat 3, bisagras metálicas sin flex. 3 versiones, todas con AR interno: C01 frente negro brillo y patillas negras (lente gris, NO pol), C03 frente negro mate y patillas rojas (lente gris, POLARIZADA), C05 frente negro mate y patillas azules (lente espejado azul, NO pol)
-- Fecha: 2026-10-08
-- ============================================
-- 3 variantes en 3 publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples: `variation_code` NULL), verificadas por API el 2026-10-08. El founder no pasó los links: se buscaron en su cuenta. Las 3 están PAUSADAS y con stock 0 (se cargan igual y se sincronizan solas al reactivarlas):
--   C01 MLA1423063411 (MLAU361943169, $111.190, GTIN 7790394207705) · C03 MLA1749154764 (MLAU361765639, $142.700, GTIN 7790394207729; su gemela de catálogo MLA1480577895 se ignora) · C05 MLA1438018327 (MLAU406229333, $109.990, GTIN 7790394207743)
-- Precios de publicaciones pausadas: confirmar antes de reactivar. Existe además una C02 polarizada (MLA1749180790, pausada) que el founder NO pidió: no se carga.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-08): cuadrado, hombre, cat 3, UV400, bisagras metálicas sin flex, inyección; 58-16-139, altura total 49, ancho total 145. C05 espejado azul con AR interno (sin pol), patillas azules; C03 frente negro mate, patillas rojas, AR interno, polarizado; C01 frente negro brillo, patillas negras, AR interno (no pol).
-- La marca (calibre 58, puente 16, alto 42, patilla 139, "No Flex", BTR600, CRX/policarbonato) no gana contra el founder en altura; marco neutro `injected` (NO BTR600). Lente de policarbonato (ML). ML titula la C05 "semiespejado"; el founder dice espejado azul: se sigue al founder ("lente espejado azul", término neutro, optical-expert).
-- POLARIZADO PARCIAL: `polarized` por variante (sólo C03 true); `lens_treatment` del producto sólo ["uv400"]; AR interno por variante en las 3. Sin "polarizado" en title/H1/short/meta.
-- 📷 FOTOS: de la marca (reefeyewear.com ids 665=C01, 5653=C03, 667=C05; ficha id_product 262, modelo viejo con una sola foto por color). Sin `medidas.jpg` por ahora. Sin placas de ML (publicaciones ya cargadas).
-- 🎯 SEO (seo-strategist) + óptica (optical-expert): slug reef-219-pupukea, descriptor "anteojos de sol negros" (110/14, ningún otro Reef lo usa; las 3 versiones tienen frente negro), sin "polarizado" en title/meta, sin Risky/BTR600/flexible/grande/deportivo, "patillas con trama y el logo Reef" (no "en relieve"), bisagras metálicas sin flex dichas de forma moderada.
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-219-pupukea', 'Reef 219 Pupukea',
  'Anteojos de sol negros Reef 219 Pupukea para hombre: frente cuadrado, patillas con trama y el logo Reef, UV400, categoría 3 y bisagras metálicas.',
  E'Los **Reef 219 Pupukea** son **anteojos de sol negros para hombre**, de frente cuadrado y patillas con trama y el logo Reef. El armazón es inyectado, con bisagras metálicas fijas, sin sistema flex. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**. Las tres versiones llevan antirreflejo en la cara interna, y la C03 y la C05 suman patillas de color (roja y azul).\n\n**Polarizado y espejado.** La versión de patillas rojas (C03) trae [lentes polarizados](/anteojos-de-sol/polarizados); las otras dos no. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas, o que cueste leerlas, según el ángulo. La C05 lleva lente espejado azul: una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. La protección UV la da el UV400, no el polarizado, el espejado ni el antirreflejo.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y sirve para manejar de día. Como cualquier lente de sol, no es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 58 mm de ancho · puente 16 mm · varilla 139 mm · ancho total 145 mm · alto 49 mm. Son de tamaño medio.\n\nLas bisagras son metálicas y fijas: la patilla queda firme en su posición. Con los años una bisagra metálica puede aflojarse, y se ajusta en la óptica.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi preferís un frente semi-envolvente con lente polarizado, mirá los [Reef 299 Pier](/anteojos-de-sol/reef/reef-299-pier); si buscás un cuadrado más ancho, los [Reef 193 Tortuga](/anteojos-de-sol/reef/reef-193-tortuga).',
  '{
    "frame_material": "injected",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo", "oblongo"],
    "gender": "male",
    "hinge_system": "metalica",
    "measurements": {"frame_width_mm": 145, "lens_width_mm": 58, "bridge_mm": 16, "temple_length_mm": 139, "lens_height_mm": 49},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-08",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras metálicas", "body": "Armazón inyectado de frente cuadrado, con patillas con trama y el logo Reef, y bisagras metálicas sin sistema flex."},
      {"type": "warning", "position": "middle", "title": "Una versión polarizada, las tres con antirreflejo interno", "body": "Sólo la C03 (patillas rojas) es polarizada. Las tres tienen antirreflejo interno, UV400 y categoría 3; la C05 tiene lente espejado azul."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1423063411", "MLA1749154764", "MLA1438018327"], "imported_at": "2026-10-08"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Negros Reef 219 Pupukea | Óptica Carballo',
  'Anteojos de sol negros Reef 219 Pupukea para hombre: frente cuadrado, armazón inyectado, UV400 y categoría 3. Envío a todo el país, estuche y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes: items simples de ML (variation_code NULL), las 3 con stock 0 (publicaciones pausadas). Primaria = C03 (la más reconocible por las patillas rojas).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-219-pupukea'), 'REEF219-C03',
   '{"frame_color":"negro-mate-patillas-rojas","lens_color":"gris","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C03","gtin":"7790394207729"}'::jsonb,
   14270000, 0, true, 1, 'MLA1749154764', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-219-pupukea'), 'REEF219-C01',
   '{"frame_color":"negro-brillo","lens_color":"gris","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C01","gtin":"7790394207705"}'::jsonb,
   11119000, 0, true, 2, 'MLA1423063411', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-219-pupukea'), 'REEF219-C05',
   '{"frame_color":"negro-mate-patillas-azules","lens_color":"azul-espejado","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C05","gtin":"7790394207743"}'::jsonb,
   10999000, 0, true, 3, 'MLA1438018327', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 3 imágenes: el perfil de cada versión (sin placa de medidas todavía).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-219-pupukea'), (SELECT id FROM public.product_variants WHERE sku='REEF219-C03'),
   'reef-219-pupukea/perfil-c03.jpg', 'Anteojos de sol Reef 219 Pupukea C03 de perfil, frente negro mate con patillas rojas con trama y el logo Reef y lente gris polarizado', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-219-pupukea'), (SELECT id FROM public.product_variants WHERE sku='REEF219-C01'),
   'reef-219-pupukea/perfil-c01.jpg', 'Anteojos de sol Reef 219 Pupukea C01 de perfil, frente negro brillo con patillas negras con trama y el logo Reef y lente gris', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-219-pupukea'), (SELECT id FROM public.product_variants WHERE sku='REEF219-C05'),
   'reef-219-pupukea/perfil-c05.jpg', 'Anteojos de sol Reef 219 Pupukea C05 de perfil, frente negro mate con patillas azules con trama y el logo Reef y lente espejado azul', 2000, 1333, 2, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: sólo en el 299 (el cuadrado de hombre más parecido; todavía sin saturar).
UPDATE public.products
SET description = description || E'\n\nSi te gusta el frente cuadrado pero con un diseño más sobrio, mirá los [Reef 219 Pupukea](/anteojos-de-sol/reef/reef-219-pupukea).', updated_at = now()
WHERE slug = 'reef-299-pier' AND description NOT LIKE '%reef-219-pupukea%';

COMMIT;
