-- ============================================
-- Seed 14: cupones iniciales (lanzamiento)
-- ============================================
-- Cupones de muestra para que el founder los pueda promocionar de inmediato.
-- Founder puede editar valores, agregar más o desactivar desde Supabase
-- Dashboard → Table Editor → coupons.
-- ============================================

BEGIN;

INSERT INTO public.coupons (
  code, description, type, value,
  min_subtotal_cents, max_discount_cents,
  usage_limit, per_user_limit,
  valid_from, valid_until, is_active
)
VALUES
  -- 10% de bienvenida para el primer pedido. Cap $10000 para no perder
  -- mucho en pedidos grandes.
  (
    'BIENVENIDA10',
    '10% de descuento para tu primera compra',
    'percentage', 10,
    NULL, 1000000,
    NULL, 1,
    NULL, NULL, true
  ),
  -- Promo fija $5000 con compra mínima $50000. Útil para newsletter.
  (
    'NEWSLETTER5K',
    '$5.000 de descuento en compras mayores a $50.000',
    'fixed_amount', 500000,
    5000000, NULL,
    NULL, 1,
    NULL, NULL, true
  ),
  -- Envío gratis sin importar provincia. Util para campañas Black Friday.
  (
    'ENVIOGRATIS',
    'Envío gratis a todo el país',
    'free_shipping', 0,
    NULL, NULL,
    NULL, 1,
    NULL, NULL, true
  )
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  type        = EXCLUDED.type,
  value       = EXCLUDED.value,
  min_subtotal_cents = EXCLUDED.min_subtotal_cents,
  max_discount_cents = EXCLUDED.max_discount_cents,
  usage_limit = EXCLUDED.usage_limit,
  per_user_limit = EXCLUDED.per_user_limit,
  valid_from  = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  is_active   = EXCLUDED.is_active,
  updated_at  = now();

COMMIT;
