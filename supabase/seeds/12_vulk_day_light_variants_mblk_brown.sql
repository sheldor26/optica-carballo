-- ============================================
-- Seed 12: 2 variantes nuevas Vulk Day Light — MBLK (Negro mate) + BROWN
-- Fecha: 2026-05-30
-- ============================================
-- Founder confirmó que el listing MLA2726903920 tiene 4 variations (en ML),
-- DB solo tenía 2 (Rosa 194180 + Carey 194185). Sumamos las 2 restantes:
--
-- 1. SKU 194182 — MBLK/DRT04 POL — Negro mate / Lentes Verde degradé
--    Stock ML al 2026-05-30: 5 unidades. Si difiere del real, el sync ML
--    lo corrige automático en próxima venta o cron horario.
--    Fotos: 2 del producto + 1 de modelo con el anteojo.
--
-- 2. SKU 194187 — L.BROWN/DRLB14 POL — Marrón / Lentes Marrones
--    Stock ML al 2026-05-30: 0 (sin stock). Producto sigue activo para
--    que el sistema de alertas funcione (user puede crear alerta de
--    vuelta de stock).
--    Fotos: 2 del producto.
--
-- ⚠️ mercadolibre_variation_code MUY IMPORTANTE:
-- El sync ML matchea variations parseando attribute_combinations[DESIGN].value_name
-- con formato "CODIGO - Descripción". El código va al inicio antes del " - ".
-- ML guarda "BROWN/DRLB14 - Marrón - Lentes Marrones" (SIN la "L." que el
-- founder usa internamente). Por lo tanto el variation_code en DB debe ser
-- "BROWN/DRLB14" (sin "L."), sino matching falla → bug silencioso 2026-05-29.
--
-- Founder sube fotos al bucket `products/vulk-day-light-sol/` con los
-- nombres exactos del seed antes de aplicar.
-- ============================================

BEGIN;

-- =====================================================================
-- VARIANTE 1: MBLK/DRT04 POL (Negro mate / Lentes Verde degradé)
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
  '194182',
  '{
    "frame_color": "negro-mate",
    "lens_color": "verde-degrade",
    "reference_code": "MBLK/DRT04 POL"
  }'::jsonb,
  8803700,
  5,
  true,
  3,
  'MLA2726903920',
  'MBLK/DRT04'
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
-- VARIANTE 2: L.BROWN/DRLB14 POL (Marrón / Lentes Marrones) — sin stock
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
  '194187',
  '{
    "frame_color": "marron",
    "lens_color": "marron",
    "reference_code": "L.BROWN/DRLB14 POL"
  }'::jsonb,
  8803700,
  0,
  true,
  4,
  'MLA2726903920',
  'BROWN/DRLB14'
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
-- IMÁGENES VARIANTE MBLK (194182) — 3 archivos
-- Path: vulk-day-light-sol/06,07,08-mblk-*.jpg
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194182'),
    'vulk-day-light-sol/06-mblk-frontal.jpg',
    'Vulk Day Light Negro mate vista frontal, lentes verde degradé polarizadas',
    1500, 1500, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194182'),
    'vulk-day-light-sol/07-mblk-lateral.jpg',
    'Vulk Day Light Negro mate vista lateral, armazón G-Flex',
    1500, 1500, 1, false
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194182'),
    'vulk-day-light-sol/08-mblk-modelo.jpg',
    'Vulk Day Light Negro mate puesto, modelo con anteojos de sol polarizados',
    1500, 1500, 2, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

-- =====================================================================
-- IMÁGENES VARIANTE BROWN (194187) — 2 archivos
-- Path: vulk-day-light-sol/09,10-brown-*.jpg
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194187'),
    'vulk-day-light-sol/09-brown-frontal.jpg',
    'Vulk Day Light Marrón vista frontal, lentes marrones polarizadas',
    1500, 1500, 0, true
  ),
  (
    (SELECT id FROM public.products WHERE slug = 'vulk-day-light'),
    (SELECT id FROM public.product_variants WHERE sku = '194187'),
    'vulk-day-light-sol/10-brown-lateral.jpg',
    'Vulk Day Light Marrón vista lateral, armazón G-Flex',
    1500, 1500, 1, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
