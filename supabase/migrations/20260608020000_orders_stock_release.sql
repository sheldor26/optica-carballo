-- Migración — orders.stock_released_at
-- ============================================================================
-- Marca de "a este pedido ya se le reintegró el stock" para que el reintegro
-- al cancelar ocurra UNA SOLA VEZ (idempotencia del lado del caller, ya que
-- `increment_variant_stock` suma cada vez que se la llama).
--
-- El reintegro se dispara en:
--   - Cancelación manual desde el panel admin (updateOrderStatusAction).
--   - Auto-cancelación de pedidos abandonados sin pago (cron 24h).
-- Ambos usan `releaseOrderStock(orderId)` (lib/checkout/orders.ts), que hace un
-- claim atómico sobre esta columna: solo libera si está en NULL.
--
-- Idempotente (IF NOT EXISTS). Aplicar al cloud vía MCP.
-- ============================================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stock_released_at timestamptz;

COMMENT ON COLUMN public.orders.stock_released_at IS
  'Cuándo se reintegró el stock de este pedido (al cancelar). NULL = todavía retiene stock. Evita reintegrar dos veces.';

-- Backfill defensivo: los pedidos ya cancelados/reembolsados antes de esta
-- migración tuvieron su stock manejado a mano (ver CURRENT_STATE 2026-06-08).
-- Los marcamos como ya-liberados para que un futuro cambio de estado no vuelva
-- a sumar stock que ya fue contabilizado.
UPDATE public.orders
SET stock_released_at = COALESCE(updated_at, created_at)
WHERE status IN ('cancelled', 'refunded')
  AND stock_released_at IS NULL;
