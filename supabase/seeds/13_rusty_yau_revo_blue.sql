-- ============================================
-- Seed 13: Variante nueva Rusty Yau — MBLK Revo Blue (azul espejada polarizada)
-- Fecha: 2026-05-30
-- ============================================
-- Variante N+1 del modelo `rusty-yau` (seed 10). El producto base, su
-- descripción, atributos, callouts y MEDIDAS son compartidos a nivel
-- producto → ya existen. Este seed SOLO agrega la variante + sus 2 fotos.
--
-- SKU 126081 — MBLK/R. BLUE POL - YELLOW
--   MBLK     = armazón Negro Mate (MISMO armazón que la variante 126080)
--   R. BLUE  = par principal: lentes Azules Espejadas Polarizadas (Revo Blue)
--   POL      = polarizado
--   YELLOW   = incluye par adicional de lentes Amarillas (común a todas)
--
-- Listing ML SEPARADO: MLA1432121317 (distinto del MLA1432137395 de la 126080).
-- NO es multi-variation → mercadolibre_variation_code = NULL.
--
-- Datos extraídos de ML (prod, 2026-05-30 vía /api/admin/ml-import-preview):
--   price 103902 ARS → 10390200 centavos ($103.902,00)
--   available_quantity 0 (vendió 14 de 14). Se carga stock 0 / activa,
--   precedente Vulk BROWN (seed 12): producto activo sin stock permite
--   alertas de reposición; sync ML corrige stock en próximo cambio.
--   Si founder confirma unidades físicas reales > 0, UPDATE stock_qty.
--
-- La imagen de MEDIDAS (rusty-yau/03-medidas.jpg) es compartida (variant_id
-- NULL desde seed 10) y aplica a esta variante también → NO se re-inserta.
--
-- Founder sube 2 fotos al bucket `products/` con los nombres exactos de
-- abajo ANTES de aplicar. Cropear igual que las de la 126080 (anteojo
-- centrado ~75-85% del frame) para consistencia visual en galería.
-- ============================================

BEGIN;

-- =====================================================================
-- Variante 126081 — Negro Mate / Lentes Azul Espejada Polarizada
-- =====================================================================
INSERT INTO public.product_variants (
  product_id, sku, attributes,
  price_cents, stock_qty, is_active, sort_order,
  mercadolibre_item_id, mercadolibre_variation_code
)
VALUES (
  (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
  '126081',
  '{
    "frame_color": "negro-mate",
    "lens_color": "azul-espejado",
    "model_code": "MBLK/R. BLUE POL - YELLOW",
    "polarized": true
  }'::jsonb,
  10390200,
  0,
  true,
  2,
  'MLA1432121317',
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
-- Imágenes variante 126081 — 2 archivos JPG en bucket "products"
-- Path canónico: rusty-yau/<filename>
-- (La 3ra imagen — medidas — es compartida y ya existe, variant_id NULL.)
-- =====================================================================
INSERT INTO public.product_images (
  product_id, variant_id, storage_path, alt_text,
  width, height, sort_order, is_primary
)
VALUES
  -- Foto primary de la variante: lateral 3/4
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
    (SELECT id FROM public.product_variants WHERE sku = '126081'),
    'rusty-yau/04-revo-blue-lateral.jpg',
    'Rusty Yau anteojos deportivos vista lateral 3/4, armazón negro mate con lentes azul espejada polarizada Revo Blue',
    1500, 1000, 0, true
  ),
  -- Foto secundaria: vista frontal
  (
    (SELECT id FROM public.products WHERE slug = 'rusty-yau'),
    (SELECT id FROM public.product_variants WHERE sku = '126081'),
    'rusty-yau/05-revo-blue-frontal.jpg',
    'Rusty Yau anteojos deportivos vista frontal, lentes azul espejada polarizada Revo Blue, armazón envolvente negro mate',
    1500, 1000, 1, false
  )
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  variant_id  = EXCLUDED.variant_id,
  alt_text    = EXCLUDED.alt_text,
  sort_order  = EXCLUDED.sort_order,
  is_primary  = EXCLUDED.is_primary,
  updated_at  = now();

COMMIT;
