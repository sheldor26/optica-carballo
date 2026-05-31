-- ============================================
-- Seed 28: Rusty Etiquet (sol) — redondo femenino G-Flex
-- Fecha: 2026-05-31
-- ============================================
-- Modelo Rusty Etiquet: anteojos de sol redondos línea femenina, frente y
-- patillas en G-Flex, 32,8g, lente policarbonato UV400. 3 de 4 variantes
-- son polarizadas; la MBLK-BROWN/G.BROWN tiene lente degradé NO polarizada
-- (confirmado: precio menor + título ML dice "degradé" no "polarizada" +
-- code sin "POL"). El flag `polarized` va a nivel variante.
--
-- 4 variantes (cada una con MLA separado, no multi-variation):
--
--   SKU 957070 — BROWN / B15 POL
--     armazón marrón brillo + lentes marrón polarizadas. MLA1695988466.
--     price $76.194, stock 7. POLARIZADA.
--
--   SKU 957071 — SBLK / S10 POL
--     armazón negro brillo + lentes gris oscuro polarizadas. MLA1388079397.
--     price $76.194, stock 2. POLARIZADA. ⚠️ pocas unidades.
--
--   SKU 957072 — L.PINK / DRT-03 POL
--     armazón rosa pálido + lentes gris oscuro degradé polarizadas.
--     MLA1468016411. price $76.194, stock 6. POLARIZADA.
--
--   SKU 957073 — MBLK-BROWN / G. BROWN
--     frente negro mate + patillas marrón + lentes marrón degradé.
--     MLA1470675939. price $66.457,11, stock 5. NO POLARIZADA.
--
-- Medidas (imagen técnica del founder):
--   frame_width_mm: 142
--   lens_width_mm:  52
--   lens_height_mm: 57
--   bridge_mm:      23
--   temple_length_mm: 135
--
-- ============================================
-- 📸 FOTOS pendientes (founder sube al bucket `products/rusty-etiquet/`):
--   ETIQUET BROWN B15 POL p.jpg          (variante BROWN — lateral, primary del MODELO)
--   ETIQUET BROWN B15 POL f.jpg          (variante BROWN — frontal)
--   ETIQUET SBLK S10 POL L.jpg           (variante SBLK — lateral, "L" final)
--   ETIQUET SBLK 10 POL F.jpg            (variante SBLK — frontal, "F" final)
--   ETIQUET L.PINK DRT-03 POL. perfil.jpg (variante L.PINK — lateral)
--   ETIQUET L.PINK DRT-03 POL f.jpg      (variante L.PINK — frontal)
--   ETIQUET MBLK-BROWN G.BROWN-P.jpg     (variante MBLK-BROWN — lateral)
--   ETIQUET MBLK-BROWN G.BROWN-F.jpg     (variante MBLK-BROWN — frontal)
--   medidas.jpg                          (esquema técnico común al modelo)
--
-- Foto primary del MODELO: ETIQUET BROWN B15 POL p.jpg (variante BROWN
-- tiene mayor stock = 7 unidades → la default visible en grid).
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base — características COMUNES a todas las variantes
-- =====================================================================
WITH
  rusty AS (SELECT id FROM public.brands WHERE slug = 'rusty'),
  sol   AS (
    SELECT id FROM public.categories
    WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL
  )
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM rusty),
  (SELECT id FROM sol),
  'rusty-etiquet',
  'Rusty Etiquet',
  'Anteojos de sol redondos femeninos con frente y patillas en G-Flex (32,8g). Lentes de policarbonato UV400 con 3 de 4 variantes polarizadas. Diseño clásico atemporal.',
  E'Los Rusty Etiquet son anteojos de sol redondos de línea femenina, pensados para uso urbano diario: paseo, manejo de día, salidas al aire libre. El diseño redondo de gran tamaño aporta un look retro-moderno versátil — funciona con outfits casuales y formales por igual.\n\nEl frente y las patillas están construidos en G-Flex, un termoplástico flexible patentado por Rusty que resiste torsiones, golpes y caídas mejor que un acetato tradicional. El peso total es de 32,8 gramos, equilibrado para el tamaño del armazón redondo grande.\n\nLas lentes son de policarbonato, un material liviano y resistente a impactos que protege los ojos en caso de golpe sin astillarse (a diferencia del cristal templado, que se puede romper en pedazos). La protección UV400 filtra el 100% de los rayos UVA y UVB.\n\nDisponible en 4 variantes con identidades muy distintas:\n\n• BROWN / B15 POL (SKU 957070):\nArmazón marrón brillo con lentes marrón polarizadas. Tono cálido y sofisticado, combina con casi cualquier tono de piel y outfit. Las lentes polarizadas eliminan los reflejos del asfalto, agua, capots y vidrios — clave para manejo de día.\n\n• SBLK / S10 POL (SKU 957071):\nArmazón negro brillo con lentes gris oscuro polarizadas. La opción más sobria y profesional. Las lentes polarizadas neutralizan reflejos manteniendo fidelidad cromática.\n\n• L.PINK / DRT-03 POL (SKU 957072):\nArmazón rosa pálido con lentes gris oscuro degradé polarizadas. La opción más femenina y luminosa, ideal para outfits primaverales y verano. El degradé en gris suaviza la transición visual entre el lente y la cara.\n\n• MBLK-BROWN / G. BROWN (SKU 957073):\nFrente negro mate combinado con patillas marrón, lentes marrón degradé (NO polarizadas — variante más accesible). Mezcla dual-color elegante que funciona como statement piece.\n\nIncluye estuche original Rusty y franela de microfibra. Garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "redondo",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "female",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {
      "frame_width_mm": 142,
      "lens_width_mm": 52,
      "lens_height_mm": 57,
      "bridge_mm": 23,
      "temple_length_mm": 135
    },
    "weight_grams": 32.8,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "Por qué el redondo favorece tanto",
        "body": "El redondo grande es la forma más equilibrada para rostros cuadrados y angulares — suaviza la mandíbula y aporta feminidad. En rostros redondos, el contraste de proporción funciona bien si el armazón es un poco más grande que el ancho de los pómulos."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "¿Polarizado o degradé?",
        "body": "3 de las 4 variantes son polarizadas (BROWN, SBLK, L.PINK) — eliminan reflejos del asfalto y agua, ideal para manejo y exterior. La MBLK-BROWN viene con lente degradé NO polarizado, con un precio más accesible si lo querés más como accesorio de paseo urbano que para manejo intenso."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Para que duren",
        "body": "Guardalos siempre en el estuche cuando no los usás (no sueltos en la cartera). Limpiá únicamente con la franela de microfibra incluida — la remera o el papel rayan el tratamiento del cristal. Si vas a la pileta o al mar, enjuagalos con agua dulce antes de guardarlos: el cloro y la sal degradan el tratamiento UV con el tiempo."
      }
    ],
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_ids": ["MLA1695988466", "MLA1388079397", "MLA1468016411", "MLA1470675939"],
      "imported_at": "2026-05-31"
    }
  }'::jsonb,
  true,
  false,
  'Rusty Etiquet Anteojos de Sol Redondos Femeninos | Óptica Carballo',
  'Anteojos Rusty Etiquet redondos femeninos: G-Flex, lente policarbonato UV400, 32,8g. 4 variantes (3 polarizadas + 1 degradé). Stock real y envíos a toda Argentina.'
)
ON CONFLICT (slug) DO UPDATE SET
  name              = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description       = EXCLUDED.description,
  attributes        = EXCLUDED.attributes,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  updated_at        = now();

-- =====================================================================
-- Variantes
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES
  -- 957070 BROWN / B15 POL — MAYOR STOCK (default del modelo)
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'), '957070',
   '{"frame_color":"marron-brillo","lens_color":"marron","model_code":"BROWN / B15 POL","polarized":true}'::jsonb,
   7619400, 7, true, 1, 'MLA1695988466', NULL),
  -- 957071 SBLK / S10 POL — pocas unidades
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'), '957071',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro","model_code":"SBLK / S10 POL","polarized":true}'::jsonb,
   7619400, 2, true, 2, 'MLA1388079397', NULL),
  -- 957072 L.PINK / DRT-03 POL
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'), '957072',
   '{"frame_color":"rosa-palido","lens_color":"gris-oscuro-degrade","model_code":"L.PINK / DRT-03 POL","polarized":true}'::jsonb,
   7619400, 6, true, 3, 'MLA1468016411', NULL),
  -- 957073 MBLK-BROWN / G. BROWN — NO POLARIZADA (variante degradé, precio menor)
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'), '957073',
   '{"frame_color":"negro-mate-y-marron","lens_color":"marron-degrade","model_code":"MBLK-BROWN / G. BROWN","polarized":false}'::jsonb,
   6645711, 5, true, 4, 'MLA1470675939', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Imágenes — 9 entries (2 por variante + 1 esquema técnico)
-- Primary del modelo: BROWN (mayor stock). Sort_order asciende para que
-- en grid la primera foto sea la BROWN lateral.
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Variante BROWN (sort 0-1, primary)
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957070'),
   'rusty-etiquet/ETIQUET BROWN B15 POL p.jpg',
   'Rusty Etiquet redondo mujer vista lateral 3/4, armazón marrón brillo G-Flex con lentes marrón polarizadas',
   1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957070'),
   'rusty-etiquet/ETIQUET BROWN B15 POL f.jpg',
   'Rusty Etiquet redondo mujer vista frontal, armazón marrón brillo con lentes marrón',
   1500, 1000, 1, false),
  -- Variante SBLK (sort 2-3)
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957071'),
   'rusty-etiquet/ETIQUET SBLK S10 POL L.jpg',
   'Rusty Etiquet redondo mujer vista lateral 3/4, armazón negro brillo G-Flex con lentes gris oscuro polarizadas',
   1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957071'),
   'rusty-etiquet/ETIQUET SBLK 10 POL F.jpg',
   'Rusty Etiquet redondo mujer vista frontal, armazón negro brillo con lentes gris oscuro',
   1500, 1000, 3, false),
  -- Variante L.PINK (sort 4-5)
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957072'),
   'rusty-etiquet/ETIQUET L.PINK DRT-03 POL. perfil.jpg',
   'Rusty Etiquet redondo mujer vista lateral 3/4, armazón rosa pálido G-Flex con lentes gris oscuro degradé polarizadas',
   1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957072'),
   'rusty-etiquet/ETIQUET L.PINK DRT-03 POL f.jpg',
   'Rusty Etiquet redondo mujer vista frontal, armazón rosa pálido con lentes gris oscuro degradé',
   1500, 1000, 5, false),
  -- Variante MBLK-BROWN (sort 6-7, dual-color)
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957073'),
   'rusty-etiquet/ETIQUET MBLK-BROWN G.BROWN-P.jpg',
   'Rusty Etiquet redondo mujer vista lateral 3/4, frente negro mate con patillas marrón y lentes marrón degradé',
   1500, 1000, 6, false),
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   (SELECT id FROM public.product_variants WHERE sku = '957073'),
   'rusty-etiquet/ETIQUET MBLK-BROWN G.BROWN-F.jpg',
   'Rusty Etiquet redondo mujer vista frontal, frente negro mate con patillas marrón y lentes degradé',
   1500, 1000, 7, false),
  -- Esquema técnico (común al modelo)
  ((SELECT id FROM public.products WHERE slug = 'rusty-etiquet'),
   NULL,
   'rusty-etiquet/medidas.jpg',
   'Esquema técnico de medidas Rusty Etiquet: frente 142mm, lente 52x57mm, puente 23mm, varilla 135mm',
   1500, 1500, 8, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
