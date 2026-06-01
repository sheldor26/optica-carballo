-- ============================================
-- Migración: Order Status Tracking (Tracker de pedido en vivo — Opción Z)
-- Fecha: 2026-06-01
-- ============================================
-- Tracker post-compra que muestra al cliente el progreso del armado de su
-- pedido. Iter 1: la regente cambia `orders.status` desde el Supabase
-- Dashboard; un TRIGGER auto-registra cada cambio en `order_status_events`
-- con timestamp. El cliente ve el timeline en /mi-cuenta/pedidos/[id].
--
-- Iter 2 (futuro): admin UI propia con auth + emails automáticos por cambio.
--
-- 2 cambios:
-- 1. Agregar 'reviewed' al CHECK de orders.status (estado "Revisado por
--    óptica matriculada" — entre preparing y shipped).
-- 2. Tabla order_status_events (timeline) + trigger que la popula al cambiar
--    orders.status + RLS (el cliente lee los eventos de SUS pedidos).
-- ============================================

BEGIN;

-- =====================================================================
-- 1. Agregar 'reviewed' al CHECK de orders.status
-- =====================================================================
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending', 'paid', 'preparing', 'reviewed',
    'shipped', 'delivered', 'cancelled', 'refunded'
  ));

-- =====================================================================
-- 2. Tabla order_status_events (timeline)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.order_status_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status      text NOT NULL,
  -- Nota opcional visible para el cliente (ej. "Tu pedido está siendo armado
  -- por nuestra óptica regente matriculada"). NULL = se usa el label default
  -- del estado en el frontend.
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_status_events_order
  ON public.order_status_events(order_id, created_at ASC);

-- =====================================================================
-- 3. Trigger: al cambiar orders.status, registrar evento en el timeline.
--    También actualiza los timestamps semánticos (paid_at/shipped_at/
--    delivered_at) si corresponde y aún no están seteados.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.record_order_status_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo registrar si el status REALMENTE cambió (o es INSERT).
  IF (TG_OP = 'INSERT') OR (NEW.status IS DISTINCT FROM OLD.status) THEN
    INSERT INTO public.order_status_events (order_id, status)
    VALUES (NEW.id, NEW.status);

    -- Timestamps semánticos (idempotente — solo si están NULL).
    IF NEW.status = 'paid' AND NEW.paid_at IS NULL THEN
      NEW.paid_at := now();
    ELSIF NEW.status = 'shipped' AND NEW.shipped_at IS NULL THEN
      NEW.shipped_at := now();
    ELSIF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- BEFORE para poder modificar NEW.*_at en el mismo UPDATE.
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
CREATE TRIGGER on_order_status_change
  BEFORE INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.record_order_status_event();

-- =====================================================================
-- 4. RLS — el cliente lee los eventos de SUS pedidos. Escritura solo
--    vía el trigger (SECURITY DEFINER) / service_role.
-- =====================================================================
ALTER TABLE public.order_status_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own order events" ON public.order_status_events;
CREATE POLICY "users read own order events"
  ON public.order_status_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_status_events.order_id
        AND o.user_id = auth.uid()
    )
  );
-- Sin policy de INSERT/UPDATE/DELETE para authenticated/anon → solo el
-- trigger (DEFINER) y service_role pueden escribir.

-- =====================================================================
-- 5. Backfill: crear evento inicial para orders existentes (si las hay)
--    que no tengan ningún evento, usando su status + created_at actual.
-- =====================================================================
INSERT INTO public.order_status_events (order_id, status, created_at)
SELECT o.id, o.status, o.created_at
FROM public.orders o
WHERE NOT EXISTS (
  SELECT 1 FROM public.order_status_events e WHERE e.order_id = o.id
);

COMMIT;
