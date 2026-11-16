-- ============================================
-- Seed 200: Vulk SUICIDAL TREND SBLK / S10 (sol, envolvente deportivo, unisex, G-Flex), 1 variante
-- Fecha: 2026-11-10
-- ============================================
-- PUBLICACIÓN TRADICIONAL de ML (MLA417128), item SIMPLE (0 variaciones => `variation_code` NULL), verificada por API el 2026-11-10 (la creó el founder):
--   958590  SBLK/S10  MLA4185091300  $95.377  stock 3  negro brillo, lente gris oscuro NO polarizada
--   Se ignora el item de catálogo MLA4185103184 (catalog_listing:true), mismo SKU y misma página de producto (MLAU5821885839).
-- DATOS DEL FOUNDER (2026-11-10): medidas 65-12-116 (se cargan tal cual; 2×65+12 = 142 > 136 de ancho total: es envolvente, queda anotado en DATOS_PENDIENTES), alto total 44 (se carga tal cual en lens_height_mm), ancho total 136; G-Flex en frente y patillas; UV400; categoría 3; bisagras plásticas; NO polarizada; antirreflex en la cara interna de la lente.
--   Vulk (ficha): policarbonato, 100% UVA y UVB, 29,6 g. No menciona antirreflex ni categoría. El peso se carga (la regla de medidas del founder no aplica al peso).
-- 🔬 Sin "flexible" ni "liviano" (G-Flex no los autoriza), sin polarizado, sin colores de variante en el copy, sin graduación (hide_prescription_faq).
-- 🎯 SEO (seo-strategist + CSV Ubersuggest): slug `vulk-suicidal-trend`, primaria "lentes de sol vulk" (1.300/8) en title y primer párrafo; "deportivo" una sola vez (los deportivos los reclama Rusty And Now); sin "negros" (carril del Vulk Guardian); cross-link a Rusty Exile y al hub de Vulk. Sin frase de vuelta (no hay otro Vulk envolvente).
-- ⚠️ model_code SIN "POL": `isPolarizedVariant` usa \bPOL\b y lo metería en /polarizados.
-- 📸 Fotos oficiales de Vulk (900×442), `pnpm placas --tipo sol --sin-vision` + `pnpm fotos:subir --slug vulk-suicidal-trend`. lens_treatment sin antirreflex (no está en el enum): sólo en copy y en el atributo de la variante.
-- ============================================

BEGIN;

WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM vulk), (SELECT id FROM sol), 'vulk-suicidal-trend', 'Vulk Suicidal Trend',
  'Anteojos de sol Vulk Suicidal Trend: envolventes unisex de G-Flex, en negro brillo con lente gris oscuro UV400 categoría 3 y antirreflex en la cara interna.',
  E'Los **lentes de sol Vulk Suicidal Trend** son **envolventes**: el marco rodea la cara y la lente ancha da mucha cobertura. Son unisex, de un diseño deportivo con presencia. Frente y patillas de **G-Flex** (29,6 g), con **bisagras plásticas**.\n\nLa lente es de policarbonato, de color gris oscuro, con protección **UV400** (bloquea los rayos UVA y UVB) y **categoría 3**, pensada para días de mucha luz. En la cara interna tiene un tratamiento **antirreflex**, que reduce los reflejos que rebotan desde atrás hacia el ojo. **No es polarizada**.\n\nMedidas: frente 136 mm · lente 65 mm · puente 12 mm · varilla 116 mm · alto total 44 mm. Es un armazón grande: compará el ancho total y el largo de varilla con un anteojo tuyo que te quede cómodo.\n\nIncluye estuche, franela y garantía de 1 año contra defectos de fabricación.\n\nSi te gustan los envolventes, mirá también los [Rusty Exile](/anteojos-de-sol/rusty/rusty-exile). Y podés ver [todos los anteojos de sol Vulk](/anteojos-de-sol/vulk).',
  '{
    "frame_material": "g-flex",
    "temple_material": "g-flex",
    "frame_shape": "envolvente",
    "gender": "unisex",
    "line": "deportiva",
    "hinge_system": "plastica",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 136, "lens_width_mm": 65, "lens_height_mm": 44, "bridge_mm": 12, "temple_length_mm": 116},
    "weight_grams": 29.6,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "new_until": "2026-12-10",
    "hide_prescription_faq": true,
    "callouts": [
      {"type": "info", "position": "top", "title": "Envolvente unisex", "body": "Diseño envolvente de lente ancha, con frente y patillas de G-Flex y bisagras plásticas."},
      {"type": "tip", "position": "middle", "title": "Antirreflex en la cara interna", "body": "El tratamiento de la cara interna de la lente reduce los reflejos que rebotan desde atrás hacia el ojo. La lente no es polarizada."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 y categoría 3", "body": "La lente bloquea los rayos UVA y UVB (UV400) y es categoría 3, pensada para mucha luz. Sirve para manejar de día, no de noche."}
    ]
  }'::jsonb,
  true, false,
  'Lentes de Sol Vulk Suicidal Trend Envolventes',
  'Lentes de sol Vulk Suicidal Trend: envolventes unisex de G-Flex, UV400 categoría 3, lente gris oscuro con antirreflex interno. Envío a todo el país.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- Variante única, item simple de ML (variation_code NULL). Precio y stock de ML (2026-11-10).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-suicidal-trend'), '958590',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK / S10","polarized":false,"lens_coating":"antirreflejo-cara-interna"}'::jsonb,
   9537700, 3, true, 1, 'MLA4185091300', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: perfil primaria, frente, medidas SIEMPRE última (sort 99, variant_id NULL).
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='vulk-suicidal-trend'), (SELECT id FROM public.product_variants WHERE sku='958590'),
   'vulk-suicidal-trend/perfil.jpg', 'Lentes de sol Vulk Suicidal Trend envolventes, vista lateral, armazón negro brillo con lente gris oscuro', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='vulk-suicidal-trend'), (SELECT id FROM public.product_variants WHERE sku='958590'),
   'vulk-suicidal-trend/frente.jpg', 'Lentes de sol Vulk Suicidal Trend envolventes, vista frontal, armazón negro brillo con lente gris oscuro', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='vulk-suicidal-trend'), NULL,
   'vulk-suicidal-trend/medidas.jpg', 'Esquema técnico de medidas Vulk Suicidal Trend: lente 65mm, puente 12mm, varilla 116mm, alto total 44mm, ancho total 136mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

COMMIT;
