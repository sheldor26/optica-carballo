-- ============================================
-- Seed 191: Mormaii Fiji — re-sincronizar con ML tras la conversión a User Products (2026-10-26)
-- ============================================
-- ML convirtió `MLA1392353341` (multivariante) en un item de UNA sola variante (Col 09, 0 variaciones) y el founder pidió "hacé las publicaciones por separado".
-- Creadas por API el 2026-10-26 (verificadas por API): items SIMPLES, 0 variaciones => `variation_code` NULL, $116.890:
--   Col 09  120105909  MLA1392353341  (el original, ya sin variaciones)  stock 3
--   Col 13  120105913  MLA4128975596  stock 2
--   Col 15  120105915  MLA2237596245  stock 3
--   Col 20  120105920  MLA4128975624  stock 2
--   Col 11  FIJI-COL11-BEIGE  (SIN publicación en ML por ahora; stock 0): se deja `mercadolibre_item_id` y `variation_code` en NULL hasta que reingrese y se publique.
-- ============================================
BEGIN;

UPDATE public.product_variants SET mercadolibre_item_id='MLA1392353341', mercadolibre_variation_code=NULL, stock_qty=3, updated_at=now() WHERE sku='120105909';
UPDATE public.product_variants SET mercadolibre_item_id='MLA4128975596',  mercadolibre_variation_code=NULL, stock_qty=2, updated_at=now() WHERE sku='120105913';
UPDATE public.product_variants SET mercadolibre_item_id='MLA2237596245',  mercadolibre_variation_code=NULL, stock_qty=3, updated_at=now() WHERE sku='120105915';
UPDATE public.product_variants SET mercadolibre_item_id='MLA4128975624',  mercadolibre_variation_code=NULL, stock_qty=2, updated_at=now() WHERE sku='120105920';
UPDATE public.product_variants SET mercadolibre_item_id=NULL, mercadolibre_variation_code=NULL, stock_qty=0, updated_at=now() WHERE sku='FIJI-COL11-BEIGE';

COMMIT;
