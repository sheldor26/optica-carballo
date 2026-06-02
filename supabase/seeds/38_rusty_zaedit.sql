-- ============================================
-- Seed 38: Rusty Zaedit (sol) — wayfarer unisex G-Flex
-- Fecha: 2026-06-02
-- ============================================
-- Modelo Rusty Zaedit: anteojos de sol wayfarer unisex, frente y patillas en
-- G-Flex, 23,2g, lente policarbonato UV400. 2 de 3 variantes polarizadas; la
-- MBLK/REVO BLUE es espejada NO polarizada (confirmado por el founder pese a
-- que el título de ML dice "polarizado" — la fuente real es el óptico, no ML).
-- El flag `polarized` va a nivel variante.
--
-- Precio/stock obtenidos vía API de ML (token OAuth, 2026-06-02):
--
--   SKU 127063 — MBLK / S10 POL
--     negro mate + lentes gris oscuro polarizadas. MLA1732660220.
--     price $77.366,29, stock 4. POLARIZADA. (primary del modelo)
--
--   SKU 127060 — SBLK / DRT03
--     negro brillo + lentes gris oscuro degradé polarizadas. MLA1429775495.
--     price $77.366,29, stock 5. POLARIZADA.
--
--   SKU 127062 — MBLK / REVO BLUE
--     negro mate + lentes azul espejado (revo). MLA1564461732.
--     price $85.888,07, stock 5. NO POLARIZADA (espejada, coating premium).
--
-- Medidas (imagen técnica del founder):
--   frame_width_mm: 146
--   lens_width_mm:  59
--   lens_height_mm: 50
--   bridge_mm:      19
--   temple_length_mm: 135
--
-- ============================================
-- 📸 FOTOS (founder subió al bucket `products/rusty-zaedit/`):
--   ZAEDIT_MBLK_S10POL_p.jpg  (S10 — perfil, primary del MODELO)
--   ZAEDIT_MBLK_S10POL_f.jpg  (S10 — frente)
--   ZAEDIT_SBLK_DRT03_p.jpg   (DRT03 — perfil)
--   ZAEDIT_SBLK_DRT03_f.jpg   (DRT03 — frente)
--   ZAEDIT_MBLK_R_BLUE_p.jpg  (REVO — perfil)
--   ZAEDIT_MBLK_R_BLUE_f.jpg  (REVO — frente)
-- (sin medidas.jpg — no incluida en la entrega del founder)
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
  'rusty-zaedit',
  'Rusty Zaedit',
  'Anteojos de sol wayfarer unisex con frente y patillas en G-Flex (23,2g). Lentes de policarbonato UV400, 2 de 3 variantes polarizadas. Diseño clásico versátil.',
  E'Los Rusty Zaedit son anteojos de sol con la silueta wayfarer clásica, unisex y súper versátil: funcionan para manejar, la playa, la ciudad o cualquier salida al aire libre, y combinan tanto con un look casual como con uno más arreglado.\n\nEl frente y las patillas están construidos en G-Flex, un termoplástico flexible patentado por Rusty que aguanta torsiones, golpes y caídas mejor que un acetato tradicional. Con solo 23,2 gramos son livianos y cómodos para todo el día.\n\nLas lentes son de policarbonato, un material liviano y resistente a impactos que protege los ojos sin astillarse, con protección UV400 que filtra el 100% de los rayos UVA y UVB.\n\nDisponible en 3 variantes:\n\n• MBLK / S10 POL (SKU 127063):\nNegro mate con lentes gris oscuro polarizadas. La opción más clásica y sobria. Las lentes polarizadas eliminan los reflejos del asfalto, el agua, los capots y los vidrios — claves para manejar de día y para la playa.\n\n• SBLK / DRT03 (SKU 127060):\nNegro brillo con lentes gris oscuro degradé polarizadas. El degradé aclara la parte de abajo del lente, un look más relajado, manteniendo la ventaja de la polarización contra los reflejos.\n\n• MBLK / REVO BLUE (SKU 127062):\nNegro mate con lentes azul espejado (revo). La opción más llamativa y de mayor impacto visual. El espejado azul es un acabado premium; esta variante NO es polarizada — es la elección de estilo por sobre la función anti-reflejo.\n\nIncluye estuche original Rusty y franela de microfibra. Garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "wayfarer",
    "temple_material": "g-flex",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "unisex",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "measurements": {
      "frame_width_mm": 146,
      "lens_width_mm": 59,
      "lens_height_mm": 50,
      "bridge_mm": 19,
      "temple_length_mm": 135
    },
    "weight_grams": 23.2,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "Por qué el wayfarer le queda bien a casi todos",
        "body": "El wayfarer es la forma más universal: su línea recta arriba y los lados levemente trapezoidales equilibran rostros redondos y ovalados, y suavizan los angulares. Por eso es un clásico que nunca pasa de moda y funciona como unisex."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "¿Polarizado o espejado?",
        "body": "Si lo vas a usar para manejar o en la playa, elegí una variante polarizada (MBLK/S10 o SBLK/DRT03): eliminan el reflejo del asfalto y el agua. Si buscás impacto visual y estilo por sobre todo, la MBLK/REVO BLUE espejada es la más llamativa (aunque no es polarizada)."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Para que duren",
        "body": "Guardalos siempre en el estuche cuando no los usás (no sueltos en la cartera o el bolsillo). Limpiá únicamente con la franela de microfibra incluida — la remera o el papel rayan el tratamiento del cristal. Si vas a la pileta o al mar, enjuagalos con agua dulce antes de guardarlos: el cloro y la sal degradan el tratamiento con el tiempo."
      }
    ],
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_ids": ["MLA1732660220", "MLA1429775495", "MLA1564461732"],
      "imported_at": "2026-06-02"
    }
  }'::jsonb,
  true,
  false,
  'Rusty Zaedit Anteojos de Sol Wayfarer Unisex Polarizados | Óptica Carballo',
  'Anteojos Rusty Zaedit wayfarer unisex: G-Flex, lente policarbonato UV400, 23,2g. 3 variantes (2 polarizadas + 1 espejada revo). Stock real y envíos a toda Argentina.'
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
  -- 127063 MBLK / S10 POL — primary del modelo (negro clásico polarizado)
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'), '127063',
   '{"frame_color":"negro-mate","lens_color":"gris-oscuro","model_code":"MBLK / S10 POL","polarized":true}'::jsonb,
   7736629, 4, true, 1, 'MLA1732660220', NULL),
  -- 127060 SBLK / DRT03 — degradé polarizada
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'), '127060',
   '{"frame_color":"negro-brillo","lens_color":"gris-oscuro-degrade","model_code":"SBLK / DRT03","polarized":true}'::jsonb,
   7736629, 5, true, 2, 'MLA1429775495', NULL),
  -- 127062 MBLK / REVO BLUE — espejada NO polarizada (coating premium)
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'), '127062',
   '{"frame_color":"negro-mate","lens_color":"azul-espejado","model_code":"MBLK / REVO BLUE","polarized":false}'::jsonb,
   8588807, 5, true, 3, 'MLA1564461732', NULL)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Imágenes — 6 entries (2 por variante). Primary del modelo: S10 perfil.
-- Perfil primario (como Etiquet/Vrast), frente secundario (hover).
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Variante MBLK/S10 POL (sort 0-1, primary)
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'),
   (SELECT id FROM public.product_variants WHERE sku = '127063'),
   'rusty-zaedit/ZAEDIT_MBLK_S10POL_p.jpg',
   'Rusty Zaedit wayfarer vista lateral 3/4, armazón negro mate G-Flex con lentes gris oscuro polarizadas',
   1500, 1000, 0, true),
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'),
   (SELECT id FROM public.product_variants WHERE sku = '127063'),
   'rusty-zaedit/ZAEDIT_MBLK_S10POL_f.jpg',
   'Rusty Zaedit wayfarer vista frontal, armazón negro mate con lentes gris oscuro polarizadas',
   1500, 1000, 1, false),
  -- Variante SBLK/DRT03 (sort 2-3)
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'),
   (SELECT id FROM public.product_variants WHERE sku = '127060'),
   'rusty-zaedit/ZAEDIT_SBLK_DRT03_p.jpg',
   'Rusty Zaedit wayfarer vista lateral 3/4, armazón negro brillo G-Flex con lentes gris oscuro degradé polarizadas',
   1500, 1000, 2, false),
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'),
   (SELECT id FROM public.product_variants WHERE sku = '127060'),
   'rusty-zaedit/ZAEDIT_SBLK_DRT03_f.jpg',
   'Rusty Zaedit wayfarer vista frontal, armazón negro brillo con lentes gris oscuro degradé',
   1500, 1000, 3, false),
  -- Variante MBLK/REVO BLUE (sort 4-5)
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'),
   (SELECT id FROM public.product_variants WHERE sku = '127062'),
   'rusty-zaedit/ZAEDIT_MBLK_R_BLUE_p.jpg',
   'Rusty Zaedit wayfarer vista lateral 3/4, armazón negro mate con lentes azul espejado revo',
   1500, 1000, 4, false),
  ((SELECT id FROM public.products WHERE slug = 'rusty-zaedit'),
   (SELECT id FROM public.product_variants WHERE sku = '127062'),
   'rusty-zaedit/ZAEDIT_MBLK_R_BLUE_f.jpg',
   'Rusty Zaedit wayfarer vista frontal, armazón negro mate con lentes azul espejado revo',
   1500, 1000, 5, false)
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
