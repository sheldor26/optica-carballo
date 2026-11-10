-- ============================================
-- Seed 198: Mormaii FOZ SOL (hombre, cuadrado de bordes gruesos, poliamida, polarizado), 3 variantes
-- Fecha: 2026-11-10
-- ============================================
-- 3 PUBLICACIONES TRADICIONALES de ML (MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-11-10 (las creó el founder; ML las muestra juntas por compartir `family_name`):
--   120110001  C01  MLA2278430569  $112.190  stock 2  gris muy oscuro (casi negro) mate, lente verde G15 polarizada
--   120110003  C03  MLA2278443519  $112.190  stock 2  azul oscuro mate con terminaciones turquesa en las patillas, lente gris oscuro polarizada
--   120110005  C05  MLA2278456403  $112.190  stock 2  gris translúcido mate con logo celeste en la patilla, lente semi espejada plateada polarizada
-- DATOS DEL FOUNDER (2026-11-10): medidas 51-23-137, altura total 50 (se carga tal cual en lens_height_mm), ancho total 148; armazón de poliamida; para hombre; cuadrado de bordes gruesos; bisagras plásticas reforzadas (sin flex); polarizadas UV400 cat 3 en las 3.
--   Distribuidor (interoptica.com.ar `foz`): inyección, bisagra inyectada reforzada, barniz mate, nosepad antideslizante, base 4; NO informa medidas, peso, categoría ni accesorios.
-- 🔬 optical-expert: sin "liviano" (no hay peso), sin "flexible", sin graduación (sin dato => hide_prescription_faq), sin "Grilamid/TR90" (sin confirmar), garantía = "1 año contra defectos de fabricación" (política), C01 descripta "gris muy oscuro".
-- 🎯 SEO (seo-strategist + CSV Ubersuggest): name `Mormaii Foz`, slug `mormaii-foz`, meta_title sin sufijo (el sitio lo agrega), "cuadrados" NO va en el title (lo reclaman Curazao/Daito/The Sil), cross-link a Curazao y Daito + hub; frase de vuelta sólo en Curazao.
-- 📸 Fotos oficiales de Mormaii (Interoptica), `pnpm placas --tipo sol --sin-vision` + `pnpm fotos:subir --sufijo -c01/-c03/-c05`. Primaria = perfil de C01 (stock 2 en las tres).
-- ============================================

BEGIN;

WITH
  mormaii AS (SELECT id FROM public.brands WHERE slug = 'mormaii'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM mormaii), (SELECT id FROM sol), 'mormaii-foz', 'Mormaii Foz',
  'Anteojos de sol Mormaii Foz: cuadrados de bordes gruesos para hombre, con armazón de poliamida, bisagras plásticas reforzadas y lentes polarizadas UV400 categoría 3.',
  E'Los **Mormaii Foz** son **anteojos de sol para hombre** de forma **cuadrada y bordes gruesos**, de presencia marcada. El armazón es de **poliamida**, con **bisagras plásticas reforzadas**.\n\nLas lentes son **polarizadas**: reducen los reflejos del agua, el asfalto y las superficies brillantes, y sirven para manejar de día, no de noche. Pueden dificultar ver algunas pantallas (celular, GPS, tablero digital). Tienen protección **UV400** (bloquean los rayos UVA y UVB) y **categoría 3**, pensada para mucha luz. El polarizado y el UV400 son cosas distintas.\n\nMedidas: frente 148 mm · lente 51 mm · puente 23 mm · varilla 137 mm · alto total 50 mm.\n\nIncluye estuche, franela y garantía de 1 año contra defectos de fabricación.\n\nSi preferís un cuadrado de bordes más redondeados, mirá los [Mormaii Curazao](/anteojos-de-sol/mormaii/mormaii-curazao); si buscás uno unisex, los [Mormaii Daito](/anteojos-de-sol/mormaii/mormaii-daito). También podés ver [todos los anteojos de sol Mormaii](/anteojos-de-sol/mormaii).',
  '{
    "frame_material": "poliamida",
    "frame_shape": "cuadrado",
    "gender": "male",
    "line": "sol",
    "hinge_system": "plastica reforzada",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 148, "lens_width_mm": 51, "lens_height_mm": 50, "bridge_mm": 23, "temple_length_mm": 137},
    "includes": ["estuche-semi-rigido", "franela-mormaii"],
    "warranty_months": 12,
    "new_until": "2026-12-10",
    "hide_prescription_faq": true,
    "callouts": [
      {"type": "info", "position": "top", "title": "Cuadrado de bordes gruesos, para hombre", "body": "Diseño cuadrado de bordes gruesos, con armazón de poliamida y bisagras plásticas reforzadas."},
      {"type": "tip", "position": "middle", "title": "Lentes polarizadas", "body": "El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes (de día sí, de noche no). Puede dificultar ver algunas pantallas (celular, GPS, tablero digital)."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 y categoría 3", "body": "Las lentes bloquean los rayos UVA y UVB (UV400), independiente del polarizado y del color. Categoría 3, pensada para mucha luz."}
    ]
  }'::jsonb,
  true, false,
  'Anteojos de Sol Mormaii Foz Hombre',
  'Anteojos de sol Mormaii Foz para hombre: cuadrados, bordes gruesos, polarizados y UV400 cat. 3. 3 colores, envío a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes, items simples de ML (variation_code NULL). Precio y stock de ML (2026-11-10).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), '120110001',
   '{"frame_color":"gris-muy-oscuro-mate","lens_color":"verde-g15","model_code":"Col. 01","polarized":true}'::jsonb,
   11219000, 2, true, 1, 'MLA2278430569', NULL),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), '120110003',
   '{"frame_color":"azul-oscuro-mate-patillas-turquesa","lens_color":"gris-oscuro","model_code":"Col. 03","polarized":true}'::jsonb,
   11219000, 2, true, 2, 'MLA2278443519', NULL),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), '120110005',
   '{"frame_color":"gris-translucido-mate","lens_color":"plateado-semi-espejado","model_code":"Col. 05","polarized":true}'::jsonb,
   11219000, 2, true, 3, 'MLA2278456403', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de C01.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), (SELECT id FROM public.product_variants WHERE sku='120110001'),
   'mormaii-foz/perfil-c01.jpg', 'Anteojos de sol Mormaii Foz cuadrados para hombre, vista lateral, armazón gris muy oscuro mate con lente verde G15 polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), (SELECT id FROM public.product_variants WHERE sku='120110001'),
   'mormaii-foz/frente-c01.jpg', 'Anteojos de sol Mormaii Foz cuadrados para hombre, vista frontal, armazón gris muy oscuro mate con lente verde G15 polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), (SELECT id FROM public.product_variants WHERE sku='120110003'),
   'mormaii-foz/perfil-c03.jpg', 'Anteojos de sol Mormaii Foz cuadrados para hombre, vista lateral, armazón azul oscuro mate con patillas turquesa y lente gris oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), (SELECT id FROM public.product_variants WHERE sku='120110003'),
   'mormaii-foz/frente-c03.jpg', 'Anteojos de sol Mormaii Foz cuadrados para hombre, vista frontal, armazón azul oscuro mate con patillas turquesa y lente gris oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), (SELECT id FROM public.product_variants WHERE sku='120110005'),
   'mormaii-foz/perfil-c05.jpg', 'Anteojos de sol Mormaii Foz cuadrados para hombre, vista lateral, armazón gris translúcido mate con lente plateada semi espejada polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), (SELECT id FROM public.product_variants WHERE sku='120110005'),
   'mormaii-foz/frente-c05.jpg', 'Anteojos de sol Mormaii Foz cuadrados para hombre, vista frontal, armazón gris translúcido mate con lente plateada semi espejada polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-foz'), NULL,
   'mormaii-foz/medidas-c01.jpg', 'Esquema técnico de medidas Mormaii Foz: lente 51mm, puente 23mm, varilla 137mm, alto total 50mm, ancho total 148mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Curazao (vecino directo: cuadrado, hombre, poliamida).
UPDATE public.products
SET description = description || E'\n\nSi preferís un cuadrado de bordes más gruesos, mirá los [Mormaii Foz](/anteojos-de-sol/mormaii/mormaii-foz).', updated_at = now()
WHERE slug = 'mormaii-curazao' AND description NOT LIKE '%mormaii-foz%';

COMMIT;
