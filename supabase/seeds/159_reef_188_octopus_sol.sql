-- ============================================
-- Seed 159: Reef 188 Octopus SOL, cuarto producto de la marca Reef. Envolvente, hombre, UV400 cat 3, 3 colores (2 polarizados con antirreflejo interno + 1 sin polarizar ni antirreflejo)
-- Fecha: 2026-10-05
-- ============================================
-- 3 variantes en 3 publicaciones TRADICIONALES de ML (`catalog_listing:false`, items simples: `variation_code` NULL, igual que Vesubio y el 177), verificadas por API el 2026-10-05:
-- C14 MLA1504917413 ($154.370,04, stock 2), C08 MLA1382267525 ($154.370,04, stock 1) y C09 MLA2154432869 ($154.370, stock 1; su gemela de catálogo MLA4031298022 se ignora). Stock y precio mandan desde ML.
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-05): envolvente, hombre, bisagras plásticas reforzadas, categoría 3 y UV400 (UVA y UVB) en todos; C08 negro brillo y C09 marrón brillo con lente polarizada y
-- antirreflejo interno; C14 negro mate con lente gris oscuro NO polarizada y SIN antirreflejo; medidas 66-14-134, alto de lente 47, ancho total 141 (2x66+14=146 no cierra con 141 por la curva envolvente, igual que el 143 del 177).
-- GTIN de las 3 (ML). Lente de policarbonato (ML). Marco: la marca dice "Inyección BTR600", ML dice Grilamid o BTR600 según la publicación: se carga el valor neutro `injected` y el copy dice "inyectado". NO se usa BTR600 ni Grilamid.
--
-- POLARIZADO PARCIAL (criterio Vulk The Guardian y Reef 177): `polarized` explícito por variante; `lens_treatment` del producto SÓLO ["uv400"]; el antirreflejo interno va por variante (precedente seed 103).
-- Ni title, H1, short_description ni meta dicen "polarizado". `line` omitido: el founder sólo dijo envolvente (seo-strategist prohíbe "deportivo").
-- 📷 FOTOS: de la marca (reefeyewear.com ids 2955=C08, 632=C09, 6711=C14). DECISIÓN DEL FOUNDER: la foto de la marca de la C14 muestra el lente azulado; se usa igual y NO se dice "revo", "espejado" ni "azul" para el lente
-- en ningún texto, label, alt ni atributo (lente gris oscuro). Sólo perfiles; medidas compartida sort 99.
-- 🎯 SEO (seo-strategist): slug reef-188-octopus, descriptor único "envolventes", title y meta distintos de 128/129/177. Copy validado por optical-expert (ajustes aplicados: categoría 3 puede usarse de día, antirreflejo
-- redactado sin absolutos, UV400 explicado, el polarizado no cambia la protección UV). "Bisagras plásticas reforzadas" es el dato del founder (la marca las llama "No Flex": no se usa "flex" ni "flexible").
-- 🏷️ SKU de casa REEF188-<color>. `gtin` dentro de attributes.
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-188-octopus', 'Reef 188 Octopus',
  'Lentes de sol envolventes Reef 188 Octopus para hombre, con armazón inyectado, UV400 y categoría 3.',
  E'Los **Reef 188 Octopus** son **lentes de sol de diseño envolvente, para hombre**. El armazón es inyectado, con bisagras plásticas reforzadas y una placa metálica con el logo de Reef en las patillas. Las lentes son de policarbonato, con **protección UV400**, que bloquea la radiación UVA y UVB hasta los 400 nm, y **categoría 3**.\n\n**Polarizado y antirreflejo según la versión.** No todas las versiones tienen lente polarizada ni antirreflejo en la cara interna: el aviso de la ficha y el selector indican cuáles. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado, y puede dificultar la lectura de algunas pantallas, como las del celular, según el ángulo. El antirreflejo en la cara interna reduce los reflejos de la luz que llega desde atrás o de costado y rebota en la lente hacia tus ojos. El polarizado no cambia la protección UV: la da el UV400 en todas las versiones.\n\n**Categoría 3.** La categoría 3 indica cuánta luz filtra la lente: es el filtro habitual para sol intenso y se puede usar para manejar de día. No es para usar de noche, al atardecer ni en túneles o lugares con poca luz.\n\nMedidas: lente 66 mm de ancho · puente 14 mm · varilla 134 mm · ancho total 141 mm · alto de lente 47 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás un envolvente con frente de metal, mirá los [Reef 128 Yin](/anteojos-de-sol/reef/reef-128-yin) y los [Reef 129 Yang](/anteojos-de-sol/reef/reef-129-yang). Si preferís bisagras metálicas y estética deportiva, mirá los [Reef 177 Aerial](/anteojos-de-sol/reef/reef-177-aerial).',
  '{
    "frame_material": "injected",
    "frame_shape": "envolvente",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "male",
    "hinge_system": "plastica reforzada",
    "measurements": {"frame_width_mm": 141, "lens_width_mm": 66, "bridge_mm": 14, "temple_length_mm": 134, "lens_height_mm": 47},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-05",
    "callouts": [
      {"type": "info", "position": "top", "title": "Armazón inyectado, bisagras plásticas reforzadas", "body": "Armazón inyectado con bisagras plásticas reforzadas y una placa metálica con el logo de Reef en las patillas."},
      {"type": "warning", "position": "middle", "title": "Polarizado y antirreflejo según la versión", "body": "Polarizado y antirreflejo interno: C08 y C09. La C14 no es polarizada ni tiene antirreflejo. Las tres tienen UV400 y categoría 3."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1504917413", "MLA1382267525", "MLA2154432869"], "imported_at": "2026-10-05"}
  }'::jsonb,
  true, false,
  'Lentes de Sol Envolventes Reef 188 Octopus | Óptica Carballo',
  'Lentes de sol envolventes Reef 188 Octopus para hombre: armazón inyectado, lente de policarbonato, UV400 y categoría 3. Envío a todo el país y garantía.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes: items simples de ML (variation_code NULL). Primaria = C14 (mayor stock); C08 antes que C09 por el desempate del clásico.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-188-octopus'), 'REEF188-C14',
   '{"frame_color":"negro-mate-patillas-azules","lens_color":"gris-oscuro","polarized":false,"model_code":"C14","gtin":"7790394233278"}'::jsonb,
   15437004, 2, true, 1, 'MLA1504917413', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-188-octopus'), 'REEF188-C08',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C08","gtin":"7790394181715"}'::jsonb,
   15437004, 1, true, 2, 'MLA1382267525', NULL),
  ((SELECT id FROM public.products WHERE slug='reef-188-octopus'), 'REEF188-C09',
   '{"frame_color":"marron-brillo-patillas-marron-crema","lens_color":"marron","polarized":true,"lens_treatment":["antirreflejo-interno"],"model_code":"C09","gtin":"7790394181722"}'::jsonb,
   15437000, 1, true, 3, 'MLA2154432869', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 4 imágenes: el perfil de cada color + la placa de medidas compartida (sort 99).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-188-octopus'), (SELECT id FROM public.product_variants WHERE sku='REEF188-C14'),
   'reef-188-octopus/perfil-c14.jpg', 'Lentes de sol envolventes Reef 188 Octopus para hombre, vista lateral, negro mate con patillas azules y lente gris oscuro', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-188-octopus'), (SELECT id FROM public.product_variants WHERE sku='REEF188-C08'),
   'reef-188-octopus/perfil-c08.jpg', 'Lentes de sol envolventes Reef 188 Octopus para hombre, vista lateral, negro brillo con lente gris oscuro polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-188-octopus'), (SELECT id FROM public.product_variants WHERE sku='REEF188-C09'),
   'reef-188-octopus/perfil-c09.jpg', 'Lentes de sol envolventes Reef 188 Octopus para hombre, vista lateral, marrón brillo con patillas marrón y crema y lente marrón polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-188-octopus'), NULL,
   'reef-188-octopus/medidas.jpg', 'Esquema técnico de medidas Reef 188 Octopus: ancho total 141mm, lente 66mm, alto 47mm, puente 14mm, varilla 134mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
