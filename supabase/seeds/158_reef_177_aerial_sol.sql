-- ============================================
-- Seed 158: Reef 177 Aerial SOL, tercer producto de la marca Reef. Envolvente deportivo, hombre, UV400 cat 3, 4 colores (3 polarizados + 1 espejado NO polarizado)
-- Fecha: 2026-10-05
-- ============================================
-- 4 variantes en 3 publicaciones TRADICIONALES de ML (`catalog_listing:false`, verificadas por API el 2026-10-05): MLA1544239398 (C07 y C11, 2 variaciones, $156.362,04),
-- MLA1543879398 (C15, item simple, $142.690) y MLA1961794090 (C09, item simple, $131.900). Los items simples van con `variation_code` NULL (rama de item simple del sync, igual que Vesubio, seed 155).
-- 3 precios distintos: el precio va por variante y manda ML en el sync. Stock = el de ML.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-05): envolvente deportivo, hombre, UV400 y categoría 3 en todos, antirreflejo interno en todas, bisagras METÁLICAS sin flex, medidas 64-17-124 / alto de lente 47 /
-- ancho total 143 (la geometría plana 2x64+17=145 no cierra por la curva envolvente; confirmó que 143 es correcto). C07, C11 y C15 polarizados; C09 espejada azul NO polarizada. GTIN de las 4 (C07 y C11 no estaban en ML).
-- Marco: Grilamid inyectado (ML); NO se usa "BTR600". Lente de policarbonato (ML).
--
-- POLARIZADO PARCIAL (criterio Vulk The Guardian, seed 102): `polarized` explícito por variante; `lens_treatment` del producto SOLO ["uv400"]; ni title, H1, short_description ni meta dicen "polarizado".
-- /anteojos-de-sol/polarizados incluye el producto con sus 3 variantes polarizadas; /anteojos-de-sol/reef/polarizados NO (usa lens_treatment del producto).
-- 🎯 SEO (seo-strategist): slug reef-177-aerial, familia léxica "lentes de sol deportivos", H1 = name. Copy validado por optical-expert (espejado y polarizado son características aparte; categoría 3 coherente
-- con espejado; antirreflejo interno redactado sin sobreprometer; "deportivo" describe estética, no protección deportiva).
-- 📷 FOTOS (decisión del founder): C15 y C11 de Óptica Paesani (1200 px), C09 la original de la marca (id 626 en reefeyewear.com, producto desactivado con imágenes vivas), C07 comparte la foto de la C11 (la foto
-- muestra el armazón mate pero la etiqueta dice negro brillo, por pedido del founder). Sólo perfiles: no hay frentes. Medidas compartidas sort 99.
-- 🏷️ SKU de casa REEF177-<color> (ML no declara seller_sku). `gtin` va dentro de attributes.
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-177-aerial', 'Reef 177 Aerial',
  'Lentes de sol deportivos Reef 177 Aerial para hombre, envolventes, con UV400 y categoría 3.',
  E'Los **Reef 177 Aerial** son **lentes de sol de diseño envolvente y estética deportiva, para hombre**. El armazón es inyectado, de Grilamid, con bisagras metálicas. Las lentes son de policarbonato, con **protección UV400, categoría 3** y antirreflejo en la cara interna.\n\n**Polarizado según la versión.** Tres versiones tienen lente polarizada y la lente espejada azul no es polarizada: las polarizadas están marcadas en el selector. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede dificultar la lectura de algunas pantallas, como las del celular, según el ángulo.\n\n**Categoría 3.** La categoría indica cuánta luz filtra la lente: es el filtro habitual para sol intenso. El espejado y el polarizado son características aparte, y las cuatro versiones son categoría 3. No es apta para manejar de noche ni con poca luz.\n\n**Antirreflejo interno.** Reduce los reflejos de la luz que rebota en el interior de la lente hacia tus ojos, por ejemplo la que viene desde atrás tuyo.\n\nMedidas: lente 64 mm de ancho · puente 17 mm · varilla 124 mm · ancho total 143 mm · alto de lente 47 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi preferís un envolvente con frente de metal, mirá también los [Reef 128 Yin](/anteojos-de-sol/reef/reef-128-yin) y los [Reef 129 Yang](/anteojos-de-sol/reef/reef-129-yang).',
  '{
    "frame_material": "grilamid",
    "frame_shape": "envolvente",
    "line": "deportiva",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "male",
    "hinge_system": "metalica",
    "measurements": {"frame_width_mm": 143, "lens_width_mm": 64, "bridge_mm": 17, "temple_length_mm": 124, "lens_height_mm": 47},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-05",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras metálicas", "body": "Armazón inyectado de Grilamid con bisagras metálicas y placa metálica en las patillas."},
      {"type": "warning", "position": "middle", "title": "Polarizado según la versión", "body": "Las versiones polarizadas están marcadas en el selector. La C09, con lente espejada azul, no es polarizada."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1544239398", "MLA1543879398", "MLA1961794090"], "imported_at": "2026-10-05"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Deportivos Reef 177 Aerial | Óptica Carballo',
  'Lentes de sol deportivos Reef 177 Aerial para hombre, envolventes, UV400 y categoría 3. Lente de 64 x 47 mm. Envío a todo el país, estuche y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 4 variantes. C07 y C11 son variaciones de MLA1544239398 (variation_code real); C09 y C15 son items simples (variation_code NULL).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), 'REEF177-C07',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","polarized":true,"model_code":"C07","gtin":"7790394164299"}'::jsonb,
   15636204, 4, true, 1, 'MLA1544239398', '179047732462'),
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), 'REEF177-C11',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","polarized":true,"model_code":"C11","gtin":"7790394191141"}'::jsonb,
   15636204, 3, true, 2, 'MLA1544239398', '179047732460'),
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), 'REEF177-C09',
   '{"frame_color":"negro-mate","lens_color":"azul-espejado","polarized":false,"model_code":"C09","gtin":"7790394182163"}'::jsonb,
   13190000, 3, true, 3, 'MLA1961794090', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), 'REEF177-C15',
   '{"frame_color":"azul-mate-detalles-celestes","lens_color":"gris-oscuro","polarized":true,"model_code":"C15","gtin":"7790394208818"}'::jsonb,
   14269000, 2, true, 4, 'MLA1543879398', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 5 imágenes: el perfil de cada color + la placa de medidas compartida (sort 99). Primaria = perfil de la C07 (mayor stock).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), (SELECT id FROM public.product_variants WHERE sku='REEF177-C07'),
   'reef-177-aerial/perfil-c07.jpg', 'Lentes de sol deportivos Reef 177 Aerial para hombre, vista lateral, negro brillo con lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), (SELECT id FROM public.product_variants WHERE sku='REEF177-C11'),
   'reef-177-aerial/perfil-c11.jpg', 'Lentes de sol deportivos Reef 177 Aerial para hombre, vista lateral, negro mate con lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), (SELECT id FROM public.product_variants WHERE sku='REEF177-C09'),
   'reef-177-aerial/perfil-c09.jpg', 'Lentes de sol deportivos Reef 177 Aerial para hombre, vista lateral, negro mate con lente espejada azul', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), (SELECT id FROM public.product_variants WHERE sku='REEF177-C15'),
   'reef-177-aerial/perfil-c15.jpg', 'Lentes de sol deportivos Reef 177 Aerial para hombre, vista lateral, azul mate con detalles celestes y lente gris oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='reef-177-aerial'), NULL,
   'reef-177-aerial/medidas.jpg', 'Esquema técnico de medidas Reef 177 Aerial: ancho total 143mm, lente 64mm, alto 47mm, puente 17mm, varilla 124mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
