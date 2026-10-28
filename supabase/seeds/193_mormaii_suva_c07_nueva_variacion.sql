-- ============================================
-- Seed 193: Mormaii Suva — C07 con la variación NUEVA de ML (2026-10-28)
-- ============================================
-- El founder rehízo la variación C07 en `MLA1550213828` porque la vieja (`179105099310`, "Negro mate con azul y turquesa") estaba mal nombrada (decía negro mate y es AZUL mate).
-- Verificado por API el 2026-10-28 23:19: sigue multivariante (5 variaciones); la C07 ahora es `208165312101` "C07 - Azul mate con Turqueza", stock 3, 0 vendidas, 5 fotos.
-- ============================================
BEGIN;
UPDATE public.product_variants
SET mercadolibre_variation_code = '208165312101', stock_qty = 3, updated_at = now()
WHERE sku = '110105707' AND mercadolibre_item_id = 'MLA1550213828';
COMMIT;
