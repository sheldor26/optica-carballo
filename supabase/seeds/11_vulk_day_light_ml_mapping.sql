-- ============================================
-- Seed 11: ML mapping de Vulk Day Light (2 variantes en mismo MLA)
-- Fecha: 2026-05-29
-- ============================================
-- Vincula las 2 variantes del Vulk Day Light con su listing ML:
-- - SKU 194185 (Carey Brillo / Verde) ↔ MLA2726903920 / variation SDEMI/DRWG15C3
-- - SKU 194180 (Rosa Palido Caramelo / Gris Oscuro Degrade) ↔ MLA2726903920 / variation LPINK/DRT25
--
-- Ambas comparten el mismo MLA porque ML usa multi-variation listing
-- (un solo listing con N opciones de color).
--
-- Idempotente: si volvés a correr, UPDATE no rompe.
-- Requiere migration 20260529300000_ml_variation_support.sql aplicada antes.
-- ============================================

BEGIN;

UPDATE public.product_variants
SET
  mercadolibre_item_id = 'MLA2726903920',
  mercadolibre_variation_code = 'SDEMI/DRWG15C3',
  updated_at = now()
WHERE sku = '194185';

UPDATE public.product_variants
SET
  mercadolibre_item_id = 'MLA2726903920',
  mercadolibre_variation_code = 'LPINK/DRT25',
  updated_at = now()
WHERE sku = '194180';

-- Verificación post-update (opcional, ejecutar separado para ver result)
-- SELECT sku, mercadolibre_item_id, mercadolibre_variation_code
-- FROM product_variants
-- WHERE sku IN ('194185', '194180');

COMMIT;
