-- ============================================
-- Fix: trigger de tracking que rompía el INSERT de órdenes (checkout)
-- Fecha: 2026-06-08
-- ============================================
-- BUG: el trigger `on_order_status_change` era BEFORE INSERT OR UPDATE y, en
-- su función, insertaba en `order_status_events` (FK a orders.id) usando
-- NEW.id. En un BEFORE INSERT la fila de `orders` AÚN NO EXISTE, así que el
-- INSERT en la tabla hija viola `order_status_events_order_id_fkey`.
-- Resultado: cada creación de orden por el checkout fallaba con
-- "violates foreign key constraint". No se detectó antes porque los cambios
-- de status manuales son UPDATE (la fila ya existe) y no se habían creado
-- órdenes reales (checkout apagado).
--
-- FIX: separar en dos triggers:
--   - BEFORE: setea los timestamps semánticos (requiere modificar NEW).
--   - AFTER: inserta el evento de timeline (la fila orders ya existe → FK OK).
-- ============================================

BEGIN;

-- 1. Función BEFORE — solo timestamps semánticos.
CREATE OR REPLACE FUNCTION public.set_order_status_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (NEW.status IS DISTINCT FROM OLD.status) THEN
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

-- 2. Función AFTER — registrar el evento (la orden ya existe → FK OK).
CREATE OR REPLACE FUNCTION public.record_order_status_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (NEW.status IS DISTINCT FROM OLD.status) THEN
    INSERT INTO public.order_status_events (order_id, status)
    VALUES (NEW.id, NEW.status);
  END IF;
  RETURN NULL;
END;
$$;

-- 3. Reemplazar el trigger único por dos (BEFORE timestamps + AFTER evento).
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
DROP TRIGGER IF EXISTS set_order_status_timestamps_trg ON public.orders;
DROP TRIGGER IF EXISTS record_order_status_event_trg ON public.orders;

CREATE TRIGGER set_order_status_timestamps_trg
  BEFORE INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_status_timestamps();

CREATE TRIGGER record_order_status_event_trg
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.record_order_status_event();

COMMIT;
