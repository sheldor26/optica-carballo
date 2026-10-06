-- ============================================
-- Seed 161: Reef 193 Tortuga SOL, sexto producto de la marca Reef. Cuadrado de frente ancho, hombre, UV400 cat 3, bisagras metálicas sin flex. 3 versiones con antirreflejo interno: C11 y C12 polarizadas, C2 espejado azul NO polarizada
-- Fecha: 2026-10-05
-- ============================================
-- 3 variantes en 3 publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples: `variation_code` NULL), verificadas por API el 2026-10-05:
-- C11 MLA2155221487 (MLAU5407268258, $157.690, stock 2, GTIN 7795394256791), C12 MLA2155221489 (MLAU5365342587, $157.690, stock 2, GTIN 7795394256807) y C2 MLA4032299650 (MLAU5407286488, $142.890, stock 2, GTIN 7791394273622;
-- su gemela de catálogo MLA2155267463 se ignora). Stock y precio mandan desde ML. ML marca la C2 "Grilamid / Rectangular / Sin género" y su título dice "deportivos": no se copia; manda el founder (hombre, cuadrado, inyectado).
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-05): cuadrado, hombre, UV400, categoría 3, bisagras metálicas SIN flex; medidas 59-17-131, ancho total 144, altura de lente 52 (se carga tal cual en lens_height_mm).
-- Las 3 versiones llevan antirreflejo interno. C11 negro mate polarizada; C12 armazón marrón con lente marrón polarizada; C2 negro mate con lente espejado azul NO polarizada.
-- Marco: la marca dice "Inyección BTR600" y ML "Inyección": se carga el valor neutro `injected`; NO se usa BTR600 ni Grilamid. Ficha de la marca (calibre 59, puente 18, alto 50, patilla 142) NO gana contra los datos del founder.
--
-- POLARIZADO PARCIAL (criterio Vulk The Guardian, Reef 177/188/196): `polarized` explícito por variante; `lens_treatment` del producto SÓLO ["uv400"]; el antirreflejo interno va por variante.
-- Ni title, H1, short_description ni meta dicen "polarizado" (la C2 no lo es).
-- 📷 FOTOS: de la marca (reefeyewear.com ids 3742=C11, 3743=C12, 3741=C2). La marca NO tiene foto del negro MATE: la del C11 es la del negro BRILLO (0007); el founder ya la usa así en su publicación de ML (placas con esa foto).
-- 🎯 SEO (seo-strategist): slug reef-193-tortuga, descriptor "Hombre" con "Anteojos de Sol" (el 196 es dueño de "Lentes de Sol Cuadrados"); NO "wayfarer" (lo usa el 196), NO "envolvente".
-- 🏷️ SKU de casa REEF193-<color>. `gtin` dentro de attributes. Altura/medidas sólo las del founder.
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-193-tortuga', 'Reef 193 Tortuga',
  'Anteojos de sol cuadrados para hombre, de frente ancho, con armazón inyectado y lente de policarbonato UV400 categoría 3.',
  E'Los **Reef 193 Tortuga** son **anteojos de sol para hombre, de armazón cuadrado y frente ancho**. El armazón es inyectado, con bisagras metálicas y una placa de metal con el logo de Reef en las patillas, que por dentro llevan una textura en relieve. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, **categoría 3** y antirreflejo en la cara interna.\n\n**Polarizado según la versión.** Las versiones negro mate y marrón tienen lente polarizada; la de lente espejado azul no es polarizada. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas según el ángulo. El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. El espejado es una capa reflectiva que se ve por fuera y reduce algo de luz; no es lo mismo que el polarizado. Ni el polarizado ni el espejado cambian la protección UV: la da el UV400 en todas las versiones.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 59 mm de ancho · puente 17 mm · varilla 131 mm · ancho total 144 mm · alto de lente 52 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi preferís un envolvente, mirá los [Reef 128 Yin](/anteojos-de-sol/reef/reef-128-yin), [Reef 129 Yang](/anteojos-de-sol/reef/reef-129-yang) o [Reef 188 Octopus](/anteojos-de-sol/reef/reef-188-octopus); para el deporte, el [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial); y si buscás un cuadrado unisex, el [Reef 196 Reunión](/anteojos-de-sol/reef/reef-196-reunion). Si buscás un cuadrado de estilo deportivo con lente espejado azul, mirá los [Reef 183 Bolero](/anteojos-de-sol/reef/reef-183-bolero).',
  '{
    "frame_material": "injected",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo", "oblongo"],
    "gender": "male",
    "hinge_system": "metalica",
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 59, "bridge_mm": 17, "temple_length_mm": 131, "lens_height_mm": 52},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-05",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras metálicas", "body": "Armazón cuadrado inyectado con bisagras metálicas y una placa de metal con el logo de Reef en las patillas."},
      {"type": "warning", "position": "middle", "title": "Polarizado según la versión", "body": "Polarizado: negro mate y marrón. La de lente espejado azul no es polarizada. Todas tienen antirreflejo interno, UV400 y categoría 3."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2155221487", "MLA2155221489", "MLA4032299650"], "imported_at": "2026-10-05"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Hombre Reef 193 Tortuga | Óptica Carballo',
  'Anteojos de sol Reef 193 Tortuga para hombre: armazón cuadrado ancho, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes: items simples de ML (variation_code NULL). Primaria = C11 (empate de stock en 2, el negro mate abre el grid).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-193-tortuga'), 'REEF193-C11',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C11","gtin":"7795394256791"}'::jsonb,
   15769000, 2, true, 1, 'MLA2155221487', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-193-tortuga'), 'REEF193-C12',
   '{"frame_color":"marron","lens_color":"marron","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C12","gtin":"7795394256807"}'::jsonb,
   15769000, 2, true, 2, 'MLA2155221489', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-193-tortuga'), 'REEF193-C2',
   '{"frame_color":"negro-mate","lens_color":"azul-espejado","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C2","gtin":"7791394273622"}'::jsonb,
   14289000, 2, true, 3, 'MLA4032299650', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 4 imágenes: el perfil de cada color + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-193-tortuga'), (SELECT id FROM public.product_variants WHERE sku='REEF193-C11'),
   'reef-193-tortuga/perfil-c11.jpg', 'Anteojos de sol cuadrados Reef 193 Tortuga negro mate para hombre con lente polarizada, vista de perfil', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-193-tortuga'), (SELECT id FROM public.product_variants WHERE sku='REEF193-C12'),
   'reef-193-tortuga/perfil-c12.jpg', 'Anteojos de sol cuadrados Reef 193 Tortuga marrón para hombre con lente polarizada, vista de perfil', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-193-tortuga'), (SELECT id FROM public.product_variants WHERE sku='REEF193-C2'),
   'reef-193-tortuga/perfil-c2.jpg', 'Anteojos de sol cuadrados Reef 193 Tortuga negro mate para hombre con lente espejado azul, vista de perfil', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-193-tortuga'), NULL,
   'reef-193-tortuga/medidas.jpg', 'Esquema técnico de medidas Reef 193 Tortuga: ancho total 144mm, lente 59mm, alto 52mm, puente 17mm, varilla 131mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
