-- ============================================
-- Seed 189: Mormaii CARMEL 2 SOL (hombre, rectangular semi envolvente, deportivo, polarizado), 3 variantes
-- Fecha: 2026-10-26
-- ============================================
-- 3 PUBLICACIONES TRADICIONALES de ML (`catalog_listing:false`, MLA417128), items SIMPLES (0 variaciones => `variation_code` NULL), verificadas por API el 2026-10-26.
--   120110501  Col 01  MLA4128895890  $122.290  stock 2  negro mate, lente verde oscuro polarizada
--   120110503  Col 03  MLA4128895892  $122.290  stock 2  frente azul mate con tonos turquesa (patillas que degradan a celeste), lente gris oscuro polarizada
--   120110506  Col 06  MLA4128895894  $122.290  stock 3  negro mate que degrada a marrón, lente marrón polarizada
-- DATOS DEL FOUNDER (2026-10-26): medidas por imagen 58-16-128, alto 41, ancho 137; "semi envolvente, rectangular, deportivo, bisagras plásticas reforzadas, polarizadas, UV400, cat 3, para hombres".
--   Fabricante (interoptica.com.ar `carmel-2-sn`): base 8, polarizada, armazón/frente/patilla "inyección", bisagra "inyectada", detalle engomado en la punta. Grabado de la patilla: "Carmel 2 SN · Col. 0X · Cat.03 UV400".
-- 🔬 optical-expert: "base 8" = curvatura (sin "mayor protección" propia); "inyectado" sin nombrar material (ML dice Grilamid, NO se afirma); frame_shape rectangular (semi envolvente en copy); no hablar de graduación => hide_prescription_faq.
-- 🎯 SEO (seo-strategist): name `Mormaii Carmel 2`, slug `mormaii-carmel-2`, meta_title 48 sin sufijo (con sufijo pasaría de 60), cierre "Semi Envolvente"; cross-link a Macau (frase de vuelta sólo ahí) y Joaca 4 + hub.
-- ⚠️ ML tiene cargado TEMPLE_LENGTH=13,7 cm (es el ancho total; la varilla es 12,8) y TEMPLE_MATERIAL=Grilamid (no confirmado): corregirlo en las 3 publicaciones.
-- 📸 Fotos oficiales de Mormaii (Interoptica), `pnpm placas --tipo sol --sin-vision` + `pnpm fotos:subir --sufijo -c01/-c03/-c06`. Primaria = perfil de Col 06 (la de más stock).
-- ============================================

BEGIN;

WITH
  mormaii AS (SELECT id FROM public.brands WHERE slug = 'mormaii'),
  sol     AS (SELECT id FROM public.categories WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL)
INSERT INTO public.products (brand_id, category_id, slug, name, short_description, description, attributes, is_active, is_featured, meta_title, meta_description)
VALUES (
  (SELECT id FROM mormaii), (SELECT id FROM sol), 'mormaii-carmel-2', 'Mormaii Carmel 2',
  'Anteojos de sol Mormaii Carmel 2: rectangulares semi envolventes para hombre, de estilo deportivo, con lentes polarizadas de curvatura base 8, UV400 y categoría 3.',
  E'Los **Mormaii Carmel 2** son **anteojos de sol para hombre**, de diseño **rectangular semi envolvente** y estilo deportivo. El armazón es de **plástico inyectado**, con **bisagras plásticas reforzadas** y un **detalle engomado en la punta de las patillas**, práctico y seguro de llevar.\n\nLas lentes son **polarizadas**, con **curvatura base 8**: acompañan la forma de la cara y cubren más hacia los costados que un anteojo de curva plana. Tienen protección **UV400** (bloquea los rayos UVA y UVB) y **categoría 3**, pensada para mucha luz. El polarizado y el UV400 son cosas distintas: el polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes, y sirve para manejar de día, no de noche. Puede dificultar la lectura de algunas pantallas (celular, GPS, tablero digital).\n\nDisponible en 3 colores: negro mate con lente verde oscuro, azul mate con tonos turquesa y lente gris oscuro, y negro mate que degrada a marrón con lente marrón.\n\nMedidas: frente 137 mm · lente 58 mm · puente 16 mm · varilla 128 mm · alto total 41 mm.\n\nIncluye estuche semi rígido, franela de Mormaii y garantía oficial de 1 año del fabricante.\n\nSi preferís un frente rectangular más plano, mirá los [Mormaii Macau](/anteojos-de-sol/mormaii/mormaii-macau); si buscás un envolvente más marcado, los [Mormaii Joaca 4](/anteojos-de-sol/mormaii/mormaii-joaca-4). También podés ver [todos los anteojos de sol Mormaii](/anteojos-de-sol/mormaii).',
  '{
    "frame_material": "injected",
    "temple_material": "injected",
    "frame_shape": "rectangular",
    "gender": "male",
    "line": "sol",
    "hinge_system": "plastica reforzada",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400", "polarized"],
    "lens_category": 3,
    "measurements": {"frame_width_mm": 137, "lens_width_mm": 58, "lens_height_mm": 41, "bridge_mm": 16, "temple_length_mm": 128},
    "includes": ["estuche-semi-rigido", "franela-mormaii"],
    "warranty_months": 12,
    "new_until": "2026-11-26",
    "hide_prescription_faq": true,
    "callouts": [
      {"type": "info", "position": "top", "title": "Semi envolvente, para hombre", "body": "Diseño rectangular semi envolvente de estilo deportivo, con bisagras plásticas reforzadas y detalle engomado en la punta de las patillas."},
      {"type": "tip", "position": "middle", "title": "Polarizadas, curvatura base 8", "body": "El polarizado reduce los reflejos del agua, el asfalto y las superficies brillantes (de día sí, de noche no). La curvatura base 8 acompaña la forma de la cara y cubre más hacia los costados."},
      {"type": "recommendation", "position": "bottom", "title": "UV400 y categoría 3", "body": "Las lentes bloquean los rayos UVA y UVB (UV400), independiente del polarizado y del color. Categoría 3, pensada para mucha luz."}
    ]
  }'::jsonb,
  true, false,
  'Anteojos de Sol Mormaii Carmel 2 Semi Envolvente',
  'Anteojos de sol Mormaii Carmel 2 para hombre: semi envolvente rectangular, polarizados y categoría 3. 3 colores, envío a todo el país y garantía de 1 año.'
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description, description=EXCLUDED.description,
  attributes=EXCLUDED.attributes, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, updated_at=now();

-- 3 variantes, items simples de ML (variation_code NULL). Precio y stock de ML (2026-10-26).
INSERT INTO public.product_variants (product_id, sku, attributes, price_cents, stock_qty, is_active, sort_order, mercadolibre_item_id, mercadolibre_variation_code)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), '120110506',
   '{"frame_color":"negro-mate-degrade-marron","lens_color":"marron","model_code":"Col. 06","polarized":true}'::jsonb,
   12229000, 3, true, 1, 'MLA4128895894', NULL),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), '120110501',
   '{"frame_color":"negro-mate","lens_color":"verde-oscuro","model_code":"Col. 01","polarized":true}'::jsonb,
   12229000, 2, true, 2, 'MLA4128895890', NULL),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), '120110503',
   '{"frame_color":"azul-mate-tonos-turquesa","lens_color":"gris-oscuro","model_code":"Col. 03","polarized":true}'::jsonb,
   12229000, 2, true, 3, 'MLA4128895892', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id=EXCLUDED.product_id, attributes=EXCLUDED.attributes, price_cents=EXCLUDED.price_cents,
  stock_qty=EXCLUDED.stock_qty, sort_order=EXCLUDED.sort_order, mercadolibre_item_id=EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code=EXCLUDED.mercadolibre_variation_code, updated_at=now();

-- Fotos: cada variante con su par perfil+frente; medidas SIEMPRE última (sort 99, variant_id NULL). Primaria = perfil de Col 06.
INSERT INTO public.product_images (product_id, variant_id, storage_path, alt_text, width, height, sort_order, is_primary)
VALUES
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), (SELECT id FROM public.product_variants WHERE sku='120110506'),
   'mormaii-carmel-2/perfil-c06.jpg', 'Anteojos de sol Mormaii Carmel 2 semi envolventes, vista lateral, armazón negro mate que degrada a marrón con lente marrón polarizada', 2000, 1333, 0, true),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), (SELECT id FROM public.product_variants WHERE sku='120110506'),
   'mormaii-carmel-2/frente-c06.jpg', 'Anteojos de sol Mormaii Carmel 2 semi envolventes, vista frontal, armazón negro mate que degrada a marrón con lente marrón polarizada', 2000, 1333, 1, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), (SELECT id FROM public.product_variants WHERE sku='120110501'),
   'mormaii-carmel-2/perfil-c01.jpg', 'Anteojos de sol Mormaii Carmel 2 semi envolventes, vista lateral, armazón negro mate con lente verde oscuro polarizada', 2000, 1333, 2, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), (SELECT id FROM public.product_variants WHERE sku='120110501'),
   'mormaii-carmel-2/frente-c01.jpg', 'Anteojos de sol Mormaii Carmel 2 semi envolventes, vista frontal, armazón negro mate con lente verde oscuro polarizada', 2000, 1333, 3, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), (SELECT id FROM public.product_variants WHERE sku='120110503'),
   'mormaii-carmel-2/perfil-c03.jpg', 'Anteojos de sol Mormaii Carmel 2 semi envolventes, vista lateral, armazón azul mate con tonos turquesa y patillas que degradan a celeste, lente gris oscuro polarizada', 2000, 1333, 4, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), (SELECT id FROM public.product_variants WHERE sku='120110503'),
   'mormaii-carmel-2/frente-c03.jpg', 'Anteojos de sol Mormaii Carmel 2 semi envolventes, vista frontal, armazón azul mate con tonos turquesa, lente gris oscuro polarizada', 2000, 1333, 5, false),
  ((SELECT id FROM public.products WHERE slug='mormaii-carmel-2'), NULL,
   'mormaii-carmel-2/medidas-c06.jpg', 'Esquema técnico de medidas Mormaii Carmel 2: lente 58mm, puente 16mm, varilla 128mm, alto total 41mm, ancho total 137mm', 2000, 1333, 99, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id=EXCLUDED.variant_id, alt_text=EXCLUDED.alt_text, sort_order=EXCLUDED.sort_order, is_primary=EXCLUDED.is_primary, updated_at=now();

-- Frase de vuelta: UNA sola, en Macau (vecino directo, rectangular hombre).
UPDATE public.products
SET description = description || E'\n\nSi buscás algo más envolvente y deportivo, mirá los [Mormaii Carmel 2](/anteojos-de-sol/mormaii/mormaii-carmel-2).', updated_at = now()
WHERE slug = 'mormaii-macau' AND description NOT LIKE '%mormaii-carmel-2%';

COMMIT;
