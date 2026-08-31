-- ============================================
-- Seed 16: Vulk Yamain (sol) — anteojos ovalados grandes para mujer
-- Fecha: 2026-05-30
-- Origen: importado desde 2 listings ML (Tienda Oficial OPTICACARBALLO 260502)
--   - MLA1391497225 (base, no polarizado: variantes CRY y MBLK)
--   - MLA2026217358 (polarizado: variante SBLK)
-- ============================================
-- Caracterísitcas comunes a todas las variantes:
--   - Frame: G-Flex con bisagras Flexo System
--   - Lente: Policarbonato + UV400 (todas)
--   - Forma: Ovalada (las 3 son iguales — Founder confirmó. Ignoramos el
--     "Ojo de Gato" que ML tenía para variation 3 del listing principal —
--     metadata mal cargada en ML; físicamente son ovalados.)
--   - Género: Mujer
--   - Talle: Large
--   - Peso: 30.9g
--   - Medidas: 146mm frente / 58mm calibre / 16mm puente / 55mm altura / 145mm varilla
--   - prescription_adapter: false (no admite lentes graduadas adaptables)
--
-- Variantes a cargar (3):
--   1. SKU 127100 - CRY/CSV01 (Transparente, gris degradé, NO POL) - $79.832,39, stock 6
--   2. SKU 127101 - MBLK/G3237 (Negro Mate, gris oscuro, NO POL) - $79.832,39, stock 3
--   3. SKU 127104 - SBLK/SG91 POL (Negro Brillo, gris polarizada) - $86.228,00, stock 1
--
-- Founder NO sube por ahora 2 variantes marrones del listing original
-- (problemas de color del fabricante). Documentado para futuro.
--
-- has_polarized_variant=true porque 1 de las 3 variantes es polarizada.
-- lens_treatment a nivel producto = ['uv400'] (común a todas).
-- Variante 127104 sobrescribe en sus attributes con ['polarized', 'uv400'].
--
-- Founder sube 7 fotos al bucket `products/vulk-yamain-sol/` con nombres EXACTOS:
--   01-cry-lateral.jpg    (variante 127100 primary)
--   02-cry-frontal.jpg    (variante 127100 secondary)
--   03-mblk-lateral.jpg   (variante 127101 primary)
--   04-mblk-frontal.jpg   (variante 127101 secondary)
--   05-sblk-lateral.jpg   (variante 127104 primary, polarizada)
--   06-sblk-frontal.jpg   (variante 127104 secondary, polarizada)
--   07-medidas.jpg        (esquema técnico medidas, común a todas, variant_id NULL)
-- ============================================

BEGIN;

-- =====================================================================
-- 1. Producto base — características COMUNES a las 3 variantes Yamain
-- =====================================================================
WITH
  vulk AS (SELECT id FROM public.brands WHERE slug = 'vulk'),
  sol  AS (
    SELECT id FROM public.categories
    WHERE slug = 'anteojos-de-sol' AND parent_id IS NULL
  )
INSERT INTO public.products (
  brand_id, category_id, slug, name,
  short_description, description, attributes,
  is_active, is_featured, meta_title, meta_description
)
VALUES (
  (SELECT id FROM vulk),
  (SELECT id FROM sol),
  'vulk-yamain',
  'Vulk Yamain',
  'Anteojos de sol ovalados grandes para mujer. Armazón G-Flex con bisagras Flexo, lentes policarbonato UV400. Disponible con lente clásica o polarizada.',
  E'Los Vulk Yamain combinan protección ocular y estilo femenino sofisticado. Pensados para mujeres que buscan resaltar sus rasgos sin sacrificar funcionalidad, ofrecen total protección contra los rayos UV — podés disfrutar del sol sin preocupaciones, con un diseño elegante que va con cualquier outfit.\n\nEl frente del armazón está fabricado con G-Flex, un termoplástico flexible patentado por Vulk que aguanta caídas, torsiones y uso intensivo mejor que un acetato tradicional. Las patillas incorporan Flexo System con bisagras Flex: absorben presión lateral sin romperse, manteniendo el ajuste seguro y cómodo durante todo el día. Útil si las llevás en bolso o cartera donde otros lentes se rinden a los meses.\n\nLos lentes son de policarbonato con filtro UV400 (bloquean 100% UVA y UVB). El policarbonato es más liviano que el cristal y resistente al impacto. El conjunto pesa 30,9 gramos.\n\nMedidas pensadas para adaptarse a la mayoría de los rostros: ancho de la lente 58mm, puente 16mm, largo de las patillas 145mm. Talle Large (146mm de frente x 55mm de altura) ideal para rostros de tamaño mediano a grande. Si tenés rostro chico, consultanos antes de comprar y te orientamos.\n\nDisponibles en varias opciones de color, incluyendo una versión con lentes polarizadas. La polarización elimina los reflejos molestos del agua, asfalto y vidrio — ideal si conducís de día, vas a la playa o pasás tiempo cerca del agua. Las versiones con lentes clásicas mantienen la misma protección UV400 a menor costo, perfectas para uso casual urbano.\n\nDiseño ovalado femenino, elegante y sofisticado. Cada par se entrega con estuche original Vulk, franela de microfibra y garantía oficial 1 año del fabricante contra defectos.',
  '{
    "frame_material": "g-flex",
    "frame_shape": "oval",
    "lens_material": "policarbonato",
    "lens_treatment": ["uv400"],
    "gender": "female",
    "line": "sol",
    "size": "large",
    "weight_grams": 30.9,
    "hinge_system": "flexo",
    "prescription_adapter": false,
    "has_polarized_variant": true,
    "measurements": {
      "frame_width_mm": 146,
      "lens_width_mm": 58,
      "lens_height_mm": 55,
      "bridge_mm": 16,
      "temple_length_mm": 145
    },
    "includes": ["estuche", "franela"],
    "warranty_months": 12,
    "recommended_face_shapes": ["redonda", "cuadrada", "corazon"],
    "callouts": [
      {
        "type": "info",
        "position": "top",
        "title": "Sabías que…",
        "body": "El G-Flex (termoplástico patentado por Vulk) tolera torsiones que romperían un acetato tradicional. Útil para uso diario en bolso o cartera, donde otros lentes se rinden a los 3-6 meses. Con cuidado básico, los Yamain te duran años."
      },
      {
        "type": "recommendation",
        "position": "middle",
        "title": "¿Polarizadas o clásicas?",
        "body": "Una de las variantes incluye lentes polarizadas, ideales si conducís de día, vas a la playa, pescás o trabajás cerca del agua — la polarización elimina reflejos que cansan la vista. Las variantes con lentes clásicas mantienen la misma protección UV400 a menor costo, perfectas para uso casual urbano."
      },
      {
        "type": "tip",
        "position": "bottom",
        "title": "Para que duren más",
        "body": "Guardalas siempre en su estuche cuando no las usás (las suelta en cartera se rayan en días). Limpiá con la franela de microfibra incluida — la remera microabrasiona los cristales. Si las usás cerca del mar o pileta, enjuagá con agua dulce: sal y cloro degradan el tratamiento UV con el tiempo."
      }
    ],
    "imported_from": [
      {
        "marketplace": "mercadolibre",
        "item_id": "MLA1391497225",
        "imported_at": "2026-05-30",
        "note": "Listing principal, variantes CRY y MBLK"
      },
      {
        "marketplace": "mercadolibre",
        "item_id": "MLA2026217358",
        "imported_at": "2026-05-30",
        "note": "Listing polarizada, variante SBLK"
      }
    ]
  }'::jsonb,
  true,
  false,
  'Vulk Yamain Anteojos de Sol Ovalados Mujer | Óptica Carballo',
  'Anteojos de sol Vulk Yamain ovalados grandes para mujer. Armazón G-Flex flexible, lentes policarbonato UV400. Versión polarizada disponible. Stock real, envíos a toda Argentina.'
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
-- 2a. Variante 127100 — CRY/CSV01 (Transparente / gris degradé)
-- Listing ML: MLA1391497225, variation 180172684195
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
  '127100',
  '{
    "frame_color": "transparente",
    "lens_color": "gris-degrade",
    "model_code": "CRY/CSV01",
    "is_polarized": false
  }'::jsonb,
  7983239,
  6,
  true,
  1,
  'MLA1391497225',
  '180172684195'
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
-- 2b. Variante 127101 — MBLK/G3237 (Negro Mate / gris oscuro)
-- Listing ML: MLA1391497225, variation 182035179595
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
  '127101',
  '{
    "frame_color": "negro-mate",
    "lens_color": "gris-oscuro",
    "model_code": "MBLK/G3237",
    "is_polarized": false
  }'::jsonb,
  7983239,
  3,
  true,
  2,
  'MLA1391497225',
  '182035179595'
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
-- 2c. Variante 127104 — SBLK/SG91 POL (Negro Brillo / gris degradé POLARIZADA)
-- Listing ML SEPARADO: MLA2026217358 (single-variant, no variation_code)
-- Precio mayor por el tratamiento polarizado.
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
  '127104',
  '{
    "frame_color": "negro-brillo",
    "lens_color": "gris-degrade",
    "model_code": "SBLK/SG91 POL",
    "is_polarized": true,
    "lens_treatment": ["polarized", "uv400"]
  }'::jsonb,
  8622800,
  1,
  true,
  3,
  'MLA2026217358',
  NULL
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
-- 3. Imágenes — 7 archivos JPG en bucket "products"
-- Path canónico: vulk-yamain-sol/<filename>
-- 2 fotos por variante (lateral + frontal) + 1 esquema de medidas global
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- CRY 127100 — primary lateral
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
    (SELECT id FROM public.product_variants WHERE sku = '127100'),
    'vulk-yamain-sol/01-cry-lateral.jpg',
    'Vulk Yamain anteojos de sol ovalados vista lateral, armazón transparente CRY con lentes gris degradé',
    1500, 1000, 0, true
  ),
  -- CRY 127100 — secondary frontal
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
    (SELECT id FROM public.product_variants WHERE sku = '127100'),
    'vulk-yamain-sol/02-cry-frontal.jpg',
    'Vulk Yamain vista frontal, armazón transparente con lentes gris degradé, diseño ovalado para mujer',
    1500, 1000, 1, false
  ),
  -- MBLK 127101 — primary lateral
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
    (SELECT id FROM public.product_variants WHERE sku = '127101'),
    'vulk-yamain-sol/03-mblk-lateral.jpg',
    'Vulk Yamain anteojos de sol vista lateral, armazón negro mate MBLK con lentes gris oscuro',
    1500, 1000, 0, true
  ),
  -- MBLK 127101 — secondary frontal
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
    (SELECT id FROM public.product_variants WHERE sku = '127101'),
    'vulk-yamain-sol/04-mblk-frontal.jpg',
    'Vulk Yamain vista frontal, armazón negro mate con lentes gris oscuro, diseño ovalado',
    1500, 1000, 1, false
  ),
  -- SBLK 127104 — primary lateral (polarizada)
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
    (SELECT id FROM public.product_variants WHERE sku = '127104'),
    'vulk-yamain-sol/05-sblk-lateral.jpg',
    'Vulk Yamain polarizada vista lateral, armazón negro brillo SBLK con lentes gris degradé polarizadas SG91',
    1500, 1000, 0, true
  ),
  -- SBLK 127104 — secondary frontal (polarizada)
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
    (SELECT id FROM public.product_variants WHERE sku = '127104'),
    'vulk-yamain-sol/06-sblk-frontal.jpg',
    'Vulk Yamain polarizada vista frontal, armazón negro brillo con lentes gris degradé polarizadas, diseño ovalado',
    1500, 1000, 1, false
  ),
  -- Esquema técnico medidas — común a todas las variantes Yamain (variant_id NULL)
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-yamain'),
    NULL,
    'vulk-yamain-sol/07-medidas.jpg',
    'Esquema técnico de medidas Vulk Yamain: frente 146mm x 55mm, calibre 58mm, puente 16mm, varilla 145mm',
    1500, 1500, 2, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
