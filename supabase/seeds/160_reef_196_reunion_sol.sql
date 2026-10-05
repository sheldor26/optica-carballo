-- ============================================
-- Seed 160: Reef 196 Reunión SOL, quinto producto de la marca Reef. Cuadrado tipo wayfarer, unisex, UV400 cat 3, 3 colores (2 polarizados con antirreflejo interno + 1 sin polarizar con antirreflejo interno)
-- Fecha: 2026-10-05
-- ============================================
-- 3 variantes en 2 publicaciones TRADICIONALES de ML (`catalog_listing:false`), verificadas por API el 2026-10-05:
-- MLA2107860210 (2 variaciones, $157.059,24): C10 var 188333348311 stock 1, C11 var 188333348313 stock 3 (su gemela de catálogo MLA2190640076 se ignora).
-- MLA4031305848 (item simple, `variation_code` NULL, $132.690, stock 2, GTIN 7790394181371): C02. Stock y precio mandan desde ML.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-05): cuadrado tipo "wayfarer", unisex, bisagras plásticas reforzadas, categoría 3 y UV400; medidas 56-19-137, ancho total 144, altura total 49.
-- C10 negro brillo y C11 negro mate con lente polarizada y antirreflejo interno; C02 negro mate con lente NO polarizada y antirreflejo interno. Lente gris oscuro en las 3 (ML).
-- Marco: la marca dice "Inyección BTR600" y ML dice Grilamid TR90: se carga el valor neutro `injected` y el copy dice "inyectado". NO se usa BTR600 ni Grilamid. ML marca el modelo "Hombre": manda el founder (unisex).
-- GTIN: sólo el de la C02 (ML no devuelve el de las variaciones C10/C11).
--
-- POLARIZADO PARCIAL (criterio Vulk The Guardian, Reef 177 y 188): `polarized` explícito por variante; `lens_treatment` del producto SÓLO ["uv400"]; el antirreflejo interno va por variante.
-- Ni title, H1, short_description ni meta dicen "polarizado".
-- 📷 FOTOS: de la marca (reefeyewear.com ids 2959=C10, 2960=C11; la C02 usa la foto de la C11 por pedido del founder). Sólo perfiles + medidas compartida sort 99.
-- 🏷️ SKU de casa REEF196-<color>.
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-196-reunion', 'Reef 196 Reunión',
  'Lentes de sol cuadrados unisex Reef 196 Reunión, de estilo wayfarer, con armazón inyectado, lente de policarbonato UV400 y categoría 3.',
  E'Los **Reef 196 Reunión** son **lentes de sol unisex de armazón cuadrado, con estética tipo wayfarer**. El armazón es inyectado, con bisagras plásticas reforzadas y un logo de Reef en metal en las patillas. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**.\n\n**Polarizado y antirreflejo según la versión.** Las tres versiones llevan antirreflejo en la cara interna, pero no todas tienen lente polarizada: el aviso de la ficha y el selector indican cuáles. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede hacer que algunas pantallas (celular, GPS, tablero del auto) se vean más oscuras o con manchas según el ángulo. El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. El polarizado no cambia la protección UV: la da el UV400 en todas las versiones.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 56 mm de ancho · puente 19 mm · varilla 137 mm · ancho total 144 mm · alto 49 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás una forma más envolvente, mirá los [Reef 128 Yin](/anteojos-de-sol/reef/reef-128-yin) y [Reef 129 Yang](/anteojos-de-sol/reef/reef-129-yang), el deportivo [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial) o el [Reef 188 Octopus](/anteojos-de-sol/reef/reef-188-octopus). Si buscás un cuadrado para hombre con lente más ancho, mirá el [Reef 193 Tortuga](/anteojos-de-sol/reef/reef-193-tortuga).',
  '{
    "frame_material": "injected",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "recommended_face_shapes": ["ovalado", "redondo", "triangular"],
    "gender": "unisex",
    "hinge_system": "plastica reforzada",
    "measurements": {"frame_width_mm": 144, "lens_width_mm": 56, "bridge_mm": 19, "temple_length_mm": 137, "lens_height_mm": 49},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-05",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras plásticas reforzadas", "body": "Armazón cuadrado inyectado con bisagras plásticas reforzadas y un logo de Reef en metal en las patillas."},
      {"type": "warning", "position": "middle", "title": "Polarizado según la versión", "body": "Polarizado: C10 y C11. La C02 no es polarizada. Las tres tienen antirreflejo interno, UV400 y categoría 3."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA2107860210", "MLA4031305848"], "imported_at": "2026-10-05"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Cuadrados Reef 196 Reunión | Óptica Carballo',
  'Lentes de sol cuadrados Reef 196 Reunión, unisex: armazón inyectado, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes. C10/C11 comparten item de ML (variation_code real); la C02 es un item simple (NULL). Primaria = C11 (mayor stock).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-196-reunion'), 'REEF196-C11',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C11"}'::jsonb,
   15705924, 3, true, 1, 'MLA2107860210', '188333348313'),
  ((SELECT id FROM public.products WHERE slug='reef-196-reunion'), 'REEF196-C10',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C10"}'::jsonb,
   15705924, 1, true, 3, 'MLA2107860210', '188333348311'),
  ((SELECT id FROM public.products WHERE slug='reef-196-reunion'), 'REEF196-C02',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","polarized":false,"lens_treatment":["antirreflejo-interno"],"model_code":"C02","gtin":"7790394181371"}'::jsonb,
   13269000, 2, true, 2, 'MLA4031305848', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 4 imágenes: el perfil de cada color + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-196-reunion'), (SELECT id FROM public.product_variants WHERE sku='REEF196-C11'),
   'reef-196-reunion/perfil-c11.jpg', 'Anteojos de sol Reef 196 Reunión cuadrados, vista lateral, negro mate con lente gris oscuro polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-196-reunion'), (SELECT id FROM public.product_variants WHERE sku='REEF196-C10'),
   'reef-196-reunion/perfil-c10.jpg', 'Anteojos de sol Reef 196 Reunión cuadrados, vista lateral, negro brillo con lente gris oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-196-reunion'), (SELECT id FROM public.product_variants WHERE sku='REEF196-C02'),
   'reef-196-reunion/perfil-c02.jpg', 'Anteojos de sol Reef 196 Reunión cuadrados, vista lateral, negro mate con lente gris oscuro', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-196-reunion'), NULL,
   'reef-196-reunion/medidas.jpg', 'Esquema técnico de medidas Reef 196 Reunión: ancho total 144mm, lente 56mm, alto 49mm, puente 19mm, varilla 137mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
