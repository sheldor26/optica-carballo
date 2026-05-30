-- ============================================
-- Migration: sistema de cupones de descuento
-- ============================================
-- Tablas:
-- 1. coupons: definición del cupón (código, tipo, valor, límites).
-- 2. coupon_redemptions: tracking de cada uso (qué user, qué orden, cuándo).
--
-- Columnas nuevas en orders:
-- - coupon_id: FK a cupón usado (SET NULL si se borra el cupón, no perder
--   historial de la orden).
-- - coupon_code: snapshot del código al momento de la compra (sin depender
--   del FK por si cambia el código en el futuro).
-- - discount_cents: ya existía como columna pero hardcoded en 0. Ahora real.
--
-- Tipos de cupón:
-- - 'percentage': value entre 1-100, descuenta % del subtotal.
-- - 'fixed_amount': value en centavos, descuenta monto fijo.
-- - 'free_shipping': elimina el costo del envío (iter futura, por ahora
--   solo percentage + fixed_amount).
--
-- Restricciones operativas:
-- - max_discount_cents cap para percentage (ej "10% hasta $5000").
-- - min_subtotal_cents mínimo de compra para aplicar.
-- - per_user_limit cuántas veces puede usarlo un mismo user.
-- - usage_limit cuántas veces se puede usar globalmente.
-- - valid_from / valid_until ventana de validez.
-- ============================================

BEGIN;

-- Enum tipo de cupón
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupon_type') THEN
    CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');
  END IF;
END $$;

-- ============================================
-- Tabla coupons
-- ============================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  type coupon_type NOT NULL,
  -- Para percentage: 1-100. Para fixed_amount: centavos > 0. Para free_shipping: ignorado.
  value integer NOT NULL CHECK (value >= 0),
  -- Cap del descuento para percentage. NULL = sin cap.
  max_discount_cents integer CHECK (max_discount_cents IS NULL OR max_discount_cents > 0),
  -- Mínimo de subtotal para aplicar el cupón. NULL = sin mínimo.
  min_subtotal_cents integer CHECK (min_subtotal_cents IS NULL OR min_subtotal_cents > 0),
  -- Límites de uso. NULL = sin límite.
  usage_limit integer CHECK (usage_limit IS NULL OR usage_limit > 0),
  usage_count integer NOT NULL DEFAULT 0,
  per_user_limit integer NOT NULL DEFAULT 1 CHECK (per_user_limit > 0),
  -- Ventana de validez. NULL = sin restricción de fecha.
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT coupons_value_for_type CHECK (
    (type = 'percentage' AND value BETWEEN 1 AND 100) OR
    (type = 'fixed_amount' AND value > 0) OR
    (type = 'free_shipping')
  )
);

CREATE INDEX IF NOT EXISTS coupons_code_active_idx
  ON public.coupons (code)
  WHERE is_active = true;

-- ============================================
-- Tabla coupon_redemptions (tracking de uso)
-- ============================================
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_cents integer NOT NULL CHECK (discount_cents >= 0),
  redeemed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS coupon_redemptions_coupon_idx
  ON public.coupon_redemptions (coupon_id);
CREATE INDEX IF NOT EXISTS coupon_redemptions_user_idx
  ON public.coupon_redemptions (user_id);

-- ============================================
-- Columnas nuevas en orders
-- ============================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES public.coupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS coupon_code text;

CREATE INDEX IF NOT EXISTS orders_coupon_id_idx
  ON public.orders (coupon_id)
  WHERE coupon_id IS NOT NULL;

-- ============================================
-- Trigger updated_at en coupons
-- ============================================
CREATE OR REPLACE FUNCTION public.set_coupons_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS coupons_set_updated_at ON public.coupons;
CREATE TRIGGER coupons_set_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_coupons_updated_at();

-- ============================================
-- RPC increment_coupon_usage — atómico, usado tras crear order con cupón.
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(p_coupon_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.coupons
  SET usage_count = usage_count + 1
  WHERE id = p_coupon_id;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_coupon_usage(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_coupon_usage(uuid) TO service_role;

-- ============================================
-- RLS: solo service_role gestiona coupons. Lectura pública del UPSERT
-- la maneja el server action (con validación). coupon_redemptions: el user
-- ve sus propias redemptions.
-- ============================================
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coupon_redemptions: users see own" ON public.coupon_redemptions;
CREATE POLICY "coupon_redemptions: users see own"
  ON public.coupon_redemptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Sin policies para coupons → solo service_role accede.

COMMIT;
