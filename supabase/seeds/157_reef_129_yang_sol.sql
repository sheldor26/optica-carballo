-- ============================================
-- Seed 157: Reef 129 Yang SOL, segundo producto de la marca Reef. Hombre, envolvente, polarizado UV400 cat 3, 6 colores
-- Fecha: 2026-10-03
-- ============================================
-- Publicación de ML: MLA1423304199, tradicional (`catalog_listing:false`), $157.955,64 uniforme, 6 variaciones con
-- `variation_id` reales (verificados por API el 2026-10-03; la 014 la agregó el founder ese día). Stock = el de ML.
-- NOMBRE: "Reef 129 Yang" (la marca lo llama "129 Reef"); hermano del 128 Yin (seed 156).
--
-- DATOS CONFIRMADOS POR EL FOUNDER (2026-10-03): envolvente, UV400 (como todos los sol Reef), categoría 3, bisagras
-- metálicas con sistema flex, género HOMBRE, medidas 66-16-110, alto de lente 43, ancho total 140.
-- Lente TAC y frente de metal con patillas de aluminio (ficha de la marca y de ML).
-- SIN `weight_grams` ni GTIN (no hay dato). `line` omitido: el founder no lo llamó deportivo.
--
-- COLORES: ML cargó el código en los campos de color; el nombre descriptivo (frente + patillas) sale de las fotos de la
-- marca (marketing/fotos/reef-129/) y es una DEDUCCIÓN VISUAL (catalog-loader revisó cada foto): el founder debe confirmarlo,
-- sobre todo 013 vs 014 (se ven casi iguales; ML dice 014 = frente gris oscuro mate). Se reutilizan 4 slugs ya existentes del 128.
-- Orden por stock descendente; el clásico (patillas negras) sólo desempata iguales. Primaria del grid = perfil de la 014.
-- 🏷️ SKU de casa REEF129-<color> (ML no declara seller_sku). `polarized:true` explícito en las 6.
-- SEO (seo-strategist, 2026-10-03): primaria `reef 129 yang` (modelo); familia léxica "anteojos de sol" (el 128 es "lentes de sol"); las cabeceras
-- genéricas `lentes/anteojos de sol reef` son del hub; envolvente sólo en copy y alt. Copy y claims validados con optical-expert para el 128 (sin liviano/flexible/policarbonato/"armazón de aluminio"/colores/cantidad).
-- ============================================

BEGIN;

WITH
  reef AS (SELECT id FROM public.brands WHERE slug = 'reef'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM reef), (SELECT id FROM sol), 'reef-129-yang', 'Reef 129 Yang',
  'Anteojos de sol Reef 129 Yang envolventes, polarizados, con frente de metal.',
  E'Los **Reef 129 Yang** son **anteojos de sol envolventes para hombre**, con frente de metal. Las lentes son **polarizadas, de material TAC, con protección UV400 y categoría 3**. Las patillas son de aluminio y las bisagras son metálicas con sistema flex.\n\n**Lentes polarizadas y UV400.** La protección UV400 filtra la radiación ultravioleta y la categoría 3 corresponde a un filtro solar para días de mucha luz. El filtro polarizado reduce el deslumbramiento que producen superficies planas como el agua o el asfalto mojado. Como cualquier lente de sol, no es para manejar de noche. Además, el polarizado puede dificultar la lectura de algunas pantallas, como las del celular o las de un tablero digital.\n\n**Metal y aluminio.** El frente es de metal y las patillas son de aluminio.\n\nMedidas: lente 66 mm de ancho · puente 16 mm · varilla 110 mm · ancho total 140 mm · alto de lente 43 mm.\n\nPara limpiarlos usá el paño y un líquido para lentes, nunca en seco ni con la remera.\n\nIncluye estuche, franela y garantía oficial de 1 año.\n\nSi buscás otro modelo envolvente de la marca, mirá también los Reef 128 Yin.',
  '{
    "frame_material": "metal",
    "temple_material": "aluminio",
    "frame_shape": "envolvente",
    "lens_material": "tac",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "gender": "male",
    "hinge_system": "flex",
    "measurements": {"frame_width_mm": 140, "lens_width_mm": 66, "bridge_mm": 16, "temple_length_mm": 110, "lens_height_mm": 43},
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-11-03",
    "callouts": [
      {"type": "info", "position": "top", "title": "Frente de metal, patillas de aluminio", "body": "Frente de metal envolvente. Patillas de aluminio, con bisagras metálicas con sistema flex."},
      {"type": "tip", "position": "middle", "title": "Polarizadas, TAC, UV400 y categoría 3", "body": "Lente polarizada de material TAC, con buena calidad óptica, protección UV400 y categoría 3. El polarizado reduce el deslumbramiento del agua y del asfalto mojado."},
      {"type": "recommendation", "position": "bottom", "title": "¿Dudas con el color?", "body": "Escribinos por WhatsApp y te asesoramos con un técnico óptico matriculado antes de comprar."}
    ],
    "imported_from": {"marketplace": "mercadolibre", "item_ids": ["MLA1423304199"], "imported_at": "2026-10-03"}
  }'::jsonb,
  true, false,
  'Anteojos de Sol Reef 129 Yang Polarizados | Óptica Carballo',
  'Anteojos de sol Reef 129 Yang polarizados UV400, con frente de metal y patillas de aluminio. Lente de 66 x 43 mm. Envío a todo el país y garantía oficial.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 6 variantes de la publicación MLA1423304199 con su variation_id real (un NULL en una multi-variación es un skip silencioso del sync).
-- Precio $157.955,64 = 15795564 centavos. Stock de ML al 2026-10-03.
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), 'REEF129-014',
   '{"frame_color":"gris-oscuro-mate-patillas-plateadas","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 014"}'::jsonb,
   15795564, 2, true, 1, 'MLA1423304199', '207644455301'),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), 'REEF129-016',
   '{"frame_color":"plateado-patillas-negras-logo-naranja","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 016"}'::jsonb,
   15795564, 1, true, 2, 'MLA1423304199', '182580521481'),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), 'REEF129-013',
   '{"frame_color":"peltre-patillas-plateadas","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 013"}'::jsonb,
   15795564, 1, true, 3, 'MLA1423304199', '182580521479'),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), 'REEF129-012',
   '{"frame_color":"plateado-mate-patillas-plateadas","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 012"}'::jsonb,
   15795564, 1, true, 4, 'MLA1423304199', '182580521477'),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), 'REEF129-011',
   '{"frame_color":"dorado-mate-patillas-plateadas","lens_color":"marron","polarized":true,"model_code":"Col. 011"}'::jsonb,
   15795564, 1, true, 5, 'MLA1423304199', '182580521475'),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), 'REEF129-015',
   '{"frame_color":"peltre-patillas-negras","lens_color":"gris-oscuro","polarized":true,"model_code":"Col. 015"}'::jsonb,
   15795564, 0, true, 6, 'MLA1423304199', '182580521483')
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- 7 imágenes: el perfil de cada color + la placa de medidas compartida (sort 99). Primaria = perfil de la 014.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), (SELECT id FROM public.product_variants WHERE sku='REEF129-014'),
   'reef-129-yang/perfil-c014.jpg', 'Anteojos de sol Reef 129 Yang polarizados, vista lateral, gris oscuro mate con patillas plateadas', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), (SELECT id FROM public.product_variants WHERE sku='REEF129-016'),
   'reef-129-yang/perfil-c016.jpg', 'Anteojos de sol Reef 129 Yang polarizados, vista lateral, plateado con patillas negras y logo naranja', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), (SELECT id FROM public.product_variants WHERE sku='REEF129-013'),
   'reef-129-yang/perfil-c013.jpg', 'Anteojos de sol Reef 129 Yang polarizados, vista lateral, peltre con patillas plateadas', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), (SELECT id FROM public.product_variants WHERE sku='REEF129-012'),
   'reef-129-yang/perfil-c012.jpg', 'Anteojos de sol Reef 129 Yang polarizados, vista lateral, plateado mate con patillas plateadas', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), (SELECT id FROM public.product_variants WHERE sku='REEF129-011'),
   'reef-129-yang/perfil-c011.jpg', 'Anteojos de sol Reef 129 Yang polarizados, vista lateral, dorado mate con patillas plateadas', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), (SELECT id FROM public.product_variants WHERE sku='REEF129-015'),
   'reef-129-yang/perfil-c015.jpg', 'Anteojos de sol Reef 129 Yang polarizados, vista lateral, peltre con patillas negras', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='reef-129-yang'), NULL,
   'reef-129-yang/medidas.jpg', 'Esquema técnico de medidas Reef 129 Yang: ancho total 140mm, lente 66mm, alto 43mm, puente 16mm, varilla 110mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
