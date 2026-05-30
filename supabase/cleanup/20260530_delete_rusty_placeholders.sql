-- ============================================
-- Cleanup: borrar productos placeholder Rusty del seed 02
-- Fecha: 2026-05-30
-- ============================================
-- Contexto: el seed 02_rusty_products.sql cargó 4 productos placeholder
-- ([PH]) con nombres y precios inventados, para tener algo visible mientras
-- se cargaba el catálogo real. Founder pidió eliminarlos porque generan
-- ruido: aparecen en /anteojos-de-sol y /anteojos-de-receta sin ser
-- productos vendibles reales.
--
-- Productos a borrar (4):
--   - rusty-wayfarer-classic-sol (PH)
--   - rusty-aviator-pilot-sol (PH)
--   - rusty-redondo-vintage-rx (PH)
--   - rusty-square-modern-rx (PH)
--
-- NO se toca:
--   - rusty-yau (Rusty Yau Polarizado, producto REAL importado de ML).
--
-- Cascade automático:
--   - product_variants (FK ON DELETE CASCADE) → se borran solas.
--   - product_images (FK ON DELETE CASCADE) → se borran solas.
--   - product_alerts (FK ON DELETE CASCADE) → se borran solas.
--   - order_items.product_id (FK ON DELETE SET NULL) → si alguien compró
--     un PH (no debería pasar pero por las dudas), queda histórico con NULL.
--
-- Idempotente: si los productos ya están borrados, el DELETE no afecta filas.
-- ============================================

BEGIN;

DELETE FROM public.products
WHERE slug IN (
  'rusty-wayfarer-classic-sol',
  'rusty-aviator-pilot-sol',
  'rusty-redondo-vintage-rx',
  'rusty-square-modern-rx'
);

-- Verificación: log de productos Rusty que quedan después del cleanup.
-- Esperado: solo 'rusty-yau' (el real).
DO $$
DECLARE
  remaining_count integer;
BEGIN
  SELECT count(*) INTO remaining_count
  FROM public.products p
  JOIN public.brands b ON b.id = p.brand_id
  WHERE b.slug = 'rusty';

  RAISE NOTICE 'Productos Rusty restantes: %', remaining_count;
END $$;

COMMIT;
