-- ============================================
-- Seed 24: Rusty Dearly (sol) — anteojos cuadrados femeninos G-Flex
-- Fecha: 2026-05-31
-- Origen: importado desde 2 ítems ML del seller oficial OPTICACARBALLO 260502
--   - MLA1930366688 (no polarizadas — 0292 + BROWN)
--   - MLA2086807302 (polarizadas — SBLK/SG91 POL)
-- ============================================
-- Modelo Rusty Dearly: anteojos de sol cuadrados de línea femenina, frente
-- y patillas en G-Flex (termoplástico flexible patentado por Rusty), peso
-- 17,3g, lente de policarbonato UV400 categoría 3.
--
-- 3 variantes:
--   SKU 960202 — 0292 / G. ORANGE
--     armazón rosa pálido caramelo + lentes degrade grises (G.ORANGE).
--     NO polarizada. ML item: MLA1930366688.
--   SKU 960203 — BROWN / GB10
--     armazón marrón brillo + lentes marrón degrade (GB10).
--     NO polarizada. ML item: MLA1930366688.
--   SKU 960200 — SBLK / SG91 POL
--     armazón negro brillo + lentes gris oscuro degrade polarizadas (SG91 POL).
--     POLARIZADA. ML item: MLA2086807302.
--
-- Medidas (fuente: imagen técnica que pasó el founder, prevale sobre el
-- texto descriptivo de ML que decía 52/19/133):
--   frame_width_mm: 142
--   lens_width_mm:  54
--   lens_height_mm: 51
--   bridge_mm:      19
--   temple_length_mm: 145
--
-- ============================================
-- Datos extraídos del JSON ML (2026-05-31):
--   MLA1930366688 (no-pol, multi-variation):
--     price 75010.75 ARS → 7501075 centavos
--     initial 65, available 22 total (8 + 14)
--     variation 185630407081 — 0292 rosa pálido, available=8
--     variation 185337710789 — BROWN/GB10 marrón, available=14
--   MLA2086807302 (pol, single variant):
--     price 85904.01 ARS → 8590401 centavos
--     initial 6, available 6
--     family_id 4536485803930766 (SBLK Sg91 Polarizado)
--     variations: [] → mercadolibre_variation_code = NULL
-- ============================================
-- 📸 FOTOS pendientes (founder sube al bucket `products/rusty-dearly/`):
--    01-0292-lateral.jpg     (variante 0292 — rosa pálido + grises)
--    01-0292-frontal.jpg
--    02-brown-lateral.jpg    (variante BROWN — marrón + marrón degrade)
--    02-brown-frontal.jpg
--    03-sblk-lateral.jpg     (variante SBLK POL — negro + gris polarizado)
--    03-sblk-frontal.jpg
--    medidas.jpg             (esquema técnico común al modelo)
-- ============================================

BEGIN;

-- =====================================================================
-- Producto base — características COMUNES a todas las variantes Dearly
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
  'rusty-dearly',
  'Rusty Dearly',
  'Anteojos de sol cuadrados femeninos con frente y patillas en G-Flex (17,3g), lente de policarbonato UV400 categoría 3. Disponible en rosa caramelo, marrón brillo y negro brillo polarizado.',
  E'Los Rusty Dearly son anteojos de sol cuadrados de línea femenina, pensados para uso urbano diario: paseo, manejo de día, salidas al aire libre. El diseño cuadrado de esquinas suavizadas es uno de los más versátiles para rostros redondos y ovalados — agrega estructura sin endurecer los rasgos.\n\nEl frente y las patillas están construidos en G-Flex, un termoplástico flexible patentado por Rusty que resiste torsiones, golpes y caídas mejor que un acetato tradicional. El peso total es de 17,3 gramos: prácticamente no los sentís durante el día, incluso usándolos varias horas seguidas.\n\nLa lente es de policarbonato, un material liviano y resistente a impactos que protege los ojos en caso de golpe sin astillarse (a diferencia del cristal templado, que se puede romper en pedazos). La protección es UV400 categoría 3: filtra el 100% de los rayos UVA y UVB y bloquea entre el 82% y el 92% de la luz visible, el rango adecuado para sol intenso de exterior sin llegar al extremo de las categorías 4 (que NO se pueden usar manejando).\n\nLas bisagras son de plástico reforzado, simples y resistentes para uso diario.\n\nDisponible en 3 variantes con identidades muy distintas:\n\n• Rosa caramelo con lentes grises degrade (0292 / G. ORANGE):\nLa opción más femenina y luminosa, ideal para outfits primaverales y verano. El degradé en gris suaviza la transición visual entre el lente y la cara.\n\n• Marrón brillo con lentes marrón degrade (BROWN / GB10):\nTono cálido y sofisticado, combina con casi cualquier tono de piel y outfit. El lente marrón degrade es excelente para días de sol fuerte porque mantiene la calidez de los colores reales (a diferencia del gris, que tiende a apagarlos).\n\n• Negro brillo con lentes gris oscuro degrade POLARIZADAS (SBLK / SG91 POL):\nLa opción premium para quien busca máxima eliminación de reflejos. Las lentes polarizadas neutralizan los reflejos del asfalto, agua, capots y vidrios — claves para manejo de día y actividades al aire libre cerca del agua. Esta variante es la única polarizada del modelo.\n\nIncluye estuche original Rusty y franela de microfibra. Garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "cuadrado",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "lens_category": 3,
    "gender": "female",
    "line": "urbana",
    "interchangeable_lenses": false,
    "prescription_adapter": false,
    "hinge_material": "plastico",
    "temple_material": "g-flex",
    "measurements": {
      "frame_width_mm": 142,
      "lens_width_mm": 54,
      "lens_height_mm": 51,
      "bridge_mm": 19,
      "temple_length_mm": 145
    },
    "weight_grams": 17.3,
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "Por qué el cuadrado favorece tanto",
        "body": "El cuadrado de esquinas suavizadas es la forma más versátil para rostros redondos y ovalados — agrega estructura visual sin endurecer los rasgos. En rostros más angulares, suavizá la elección eligiendo el rosa caramelo o el marrón antes que el negro."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "¿Polarizado o no polarizado?",
        "body": "Si manejás mucho de día o pasás tiempo cerca del agua (playa, río, piscina), la variante SBLK POL te va a hacer una diferencia notable: elimina los reflejos del asfalto y del agua. Si lo querés más como accesorio de paseo urbano, las 0292 o BROWN no polarizadas alcanzan perfecto y tienen un precio más accesible."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Para que duren",
        "body": "Guardalas siempre en el estuche cuando no las usás (no sueltas en la cartera). Limpiá únicamente con la franela de microfibra incluida — la remera o el papel rayan el tratamiento del cristal. Si vas a la pileta o al mar, enjuagalas con agua dulce antes de guardarlas: el cloro y la sal degradan el tratamiento UV con el tiempo."
      }
    ],
    "imported_from": {
      "marketplace": "mercadolibre",
      "item_ids": ["MLA1930366688", "MLA2086807302"],
      "imported_at": "2026-05-31"
    }
  }'::jsonb,
  true,
  false,
  'Rusty Dearly Anteojos de Sol Cuadrados Femeninos | Óptica Carballo',
  'Anteojos Rusty Dearly cuadrados femeninos: G-Flex, lente policarbonato UV400, 17,3g. Rosa caramelo, marrón brillo y negro brillo polarizado. Stock real y envíos a toda Argentina.'
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
-- Variante 960202 — 0292 / G. ORANGE
-- armazón rosa pálido caramelo + lentes degrade grises, NO polarizada
-- ML item: MLA1930366688 (multi-variation seller)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
  '960202',
  '{
    "frame_color": "rosa-palido-caramelo",
    "lens_color": "gris-degrade",
    "model_code": "0292 / G. ORANGE",
    "polarized": false
  }'::jsonb,
  7501075,  -- $75.010,75 (MLA1930366688)
  8,        -- stock variation 185630407081
  true,
  1,
  'MLA1930366688',
  '185630407081'
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Variante 960203 — BROWN / GB10
-- armazón marrón brillo + lentes marrón degrade, NO polarizada
-- ML item: MLA1930366688 (multi-variation seller)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
  '960203',
  '{
    "frame_color": "marron-brillo",
    "lens_color": "marron-degrade",
    "model_code": "BROWN / GB10",
    "polarized": false
  }'::jsonb,
  7501075,  -- $75.010,75 (MLA1930366688)
  14,       -- stock variation 185337710789
  true,
  2,
  'MLA1930366688',
  '185337710789'
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Variante 960200 — SBLK / SG91 POL
-- armazón negro brillo + lentes gris oscuro degrade POLARIZADAS
-- ML item: MLA2086807302 (item separado para la polarizada)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
  '960200',
  '{
    "frame_color": "negro-brillo",
    "lens_color": "gris-oscuro-degrade",
    "model_code": "SBLK / SG91 POL",
    "polarized": true,
    "lens_treatment_extra": ["polarized"]
  }'::jsonb,
  8590401,  -- $85.904,01 (MLA2086807302 — pol)
  6,        -- stock (single variant, available_quantity 6)
  true,
  3,
  'MLA2086807302',
  NULL  -- single variant (variations: []), confirmado en JSON ML
)
ON CONFLICT (sku) DO UPDATE SET
  product_id                  = EXCLUDED.product_id,
  attributes                  = EXCLUDED.attributes,
  price_cents                 = EXCLUDED.price_cents,
  stock_qty                   = EXCLUDED.stock_qty,
  mercadolibre_item_id        = EXCLUDED.mercadolibre_item_id,
  mercadolibre_variation_code = EXCLUDED.mercadolibre_variation_code,
  updated_at                  = now();

-- =====================================================================
-- Imágenes — 7 archivos JPG en bucket "products"
-- Path canónico: rusty-dearly/<filename>
-- 2 fotos por variante (lateral + frontal) + 1 esquema técnico común.
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Variante 0292 — rosa caramelo
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
    (SELECT id FROM public.product_variants WHERE sku = '960202'),
    'rusty-dearly/01-0292-lateral.jpg',
    'Rusty Dearly anteojos de sol cuadrados femeninos vista lateral 3/4, armazón rosa pálido caramelo G-Flex con lentes degrade grises',
    1500, 1000, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
    (SELECT id FROM public.product_variants WHERE sku = '960202'),
    'rusty-dearly/01-0292-frontal.jpg',
    'Rusty Dearly vista frontal armazón rosa pálido caramelo, lente cuadrada policarbonato gris degrade',
    1500, 1000, 1, false
  ),
  -- Variante BROWN — marrón brillo
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
    (SELECT id FROM public.product_variants WHERE sku = '960203'),
    'rusty-dearly/02-brown-lateral.jpg',
    'Rusty Dearly anteojos de sol cuadrados femeninos vista lateral 3/4, armazón marrón brillo G-Flex con lentes marrón degrade',
    1500, 1000, 2, false
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
    (SELECT id FROM public.product_variants WHERE sku = '960203'),
    'rusty-dearly/02-brown-frontal.jpg',
    'Rusty Dearly vista frontal armazón marrón brillo, lente cuadrada policarbonato marrón degrade',
    1500, 1000, 3, false
  ),
  -- Variante SBLK POL — negro brillo polarizado
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
    (SELECT id FROM public.product_variants WHERE sku = '960200'),
    'rusty-dearly/03-sblk-lateral.jpg',
    'Rusty Dearly anteojos de sol cuadrados femeninos vista lateral 3/4, armazón negro brillo G-Flex con lentes polarizadas gris oscuro degrade',
    1500, 1000, 4, false
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
    (SELECT id FROM public.product_variants WHERE sku = '960200'),
    'rusty-dearly/03-sblk-frontal.jpg',
    'Rusty Dearly vista frontal armazón negro brillo, lente cuadrada polarizada gris oscuro degrade',
    1500, 1000, 5, false
  ),
  -- Esquema técnico de medidas (común al modelo, variant_id=NULL)
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-dearly'),
    NULL,
    'rusty-dearly/medidas.jpg',
    'Esquema técnico de medidas Rusty Dearly: frente 142mm, lente 54x51mm, puente 19mm, varilla 145mm',
    1500, 1500, 6, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
