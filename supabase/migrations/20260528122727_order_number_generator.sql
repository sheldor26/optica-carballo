-- ============================================================================
-- Migración 00003 — Order Number Generator
-- Fecha: 2026-05-28
-- ============================================================================
-- Auto-genera orders.order_number con formato OC-YYYY-NNNNN al insertar una
-- order sin pasarlo explícitamente. Counter global (sequence), año como
-- prefijo según el momento del insert. Padding 5 dígitos cubre 99999 orders.
--
-- - Permite override manual (importar histórico de Mercado Libre).
-- - nextval() es atómico (no race conditions) pero NO rollback-safe (gaps
--   son normales si una transacción falla).
-- - El trigger BEFORE INSERT corre antes del NOT NULL check de order_number.
-- ============================================================================

BEGIN;

-- Sequence para el contador global.
CREATE SEQUENCE IF NOT EXISTS public.orders_number_seq
  START WITH 1
  INCREMENT BY 1
  NO MAXVALUE
  CACHE 1;

-- Función pública: genera un order_number nuevo cada vez que se invoca.
-- Útil también desde server actions si se quiere mostrar el número en UI
-- antes del insert real (con cuidado del side-effect del nextval).
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'OC-'
    || to_char(now() AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY')
    || '-'
    || lpad(nextval('public.orders_number_seq')::text, 5, '0');
END;
$$;

-- Función interna del trigger: si order_number viene NULL o vacío, lo llena.
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger BEFORE INSERT en orders.
CREATE TRIGGER on_orders_set_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_number();

COMMIT;
