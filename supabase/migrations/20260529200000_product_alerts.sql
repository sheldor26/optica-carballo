-- Migración: tabla product_alerts para sistema de alertas de precio + stock.
-- Cada usuario logueado puede suscribirse a alertas sobre:
--   - Bajada de precio (con target_price_cents opcional)
--   - Vuelta de stock
--   - Ambos (default)
-- El CRON `/api/cron/check-alerts` corre cada hora y dispara emails via Resend.
--
-- RLS: cada user solo ve/edita sus propias alertas. Service role (CRON) tiene
-- acceso total para query global.

-- ============================================================================
-- Enum alert_type
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
    CREATE TYPE alert_type AS ENUM ('price_drop', 'stock_back', 'both');
  END IF;
END $$;

-- ============================================================================
-- Tabla product_alerts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Alerta puede ser a nivel producto (variant_id NULL = cualquier variante)
  -- o a una variante específica.
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL DEFAULT 'both',
  -- Si NULL y type='price_drop'/'both' → avisar a cualquier baja.
  -- Si seteado → solo avisar cuando price actual <= target_price_cents.
  target_price_cents bigint CHECK (target_price_cents IS NULL OR target_price_cents > 0),
  is_active boolean NOT NULL DEFAULT true,
  -- Anti-spam: el CRON no re-notifica si ya envió email en las últimas 24h.
  last_notified_at timestamptz,
  -- Snapshot del precio mín y stock al crear la alerta — usado para detectar
  -- cambios (precio bajó respecto al baseline / volvió stock).
  baseline_price_cents bigint,
  baseline_in_stock boolean,
  -- Token corto para unsubscribe desde email (sin requerir login).
  unsubscribe_token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_alerts_user_id_idx
  ON public.product_alerts(user_id);

CREATE INDEX IF NOT EXISTS product_alerts_active_idx
  ON public.product_alerts(is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS product_alerts_unsubscribe_token_idx
  ON public.product_alerts(unsubscribe_token);

-- Una alerta única por (user, variant, type). Si quiere 2 tipos, usa 'both'.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'product_alerts_user_variant_type_unique'
  ) THEN
    CREATE UNIQUE INDEX product_alerts_user_variant_type_unique
      ON public.product_alerts(user_id, variant_id, alert_type)
      WHERE variant_id IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'product_alerts_user_product_type_unique'
  ) THEN
    CREATE UNIQUE INDEX product_alerts_user_product_type_unique
      ON public.product_alerts(user_id, product_id, alert_type)
      WHERE variant_id IS NULL;
  END IF;
END $$;

-- ============================================================================
-- Trigger updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_product_alerts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS product_alerts_set_updated_at ON public.product_alerts;
CREATE TRIGGER product_alerts_set_updated_at
  BEFORE UPDATE ON public.product_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_product_alerts_updated_at();

-- ============================================================================
-- RLS: cada user solo accede a sus alertas. Service role tiene acceso total.
-- ============================================================================
ALTER TABLE public.product_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "alerts: users select own" ON public.product_alerts;
CREATE POLICY "alerts: users select own"
  ON public.product_alerts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "alerts: users insert own" ON public.product_alerts;
CREATE POLICY "alerts: users insert own"
  ON public.product_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "alerts: users update own" ON public.product_alerts;
CREATE POLICY "alerts: users update own"
  ON public.product_alerts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "alerts: users delete own" ON public.product_alerts;
CREATE POLICY "alerts: users delete own"
  ON public.product_alerts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE public.product_alerts IS
  'Alertas de precio + stock por usuario. CRON /api/cron/check-alerts dispara emails cuando se cumplen condiciones.';
