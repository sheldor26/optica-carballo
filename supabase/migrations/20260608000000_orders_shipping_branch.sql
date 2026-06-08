-- Fase 2 logística MiCorreo: soporte de envío a SUCURSAL del Correo.
--
-- Agrega a `orders`:
--   - shipping_delivery_type: código MiCorreo del tipo de entrega.
--       'D' = domicilio, 'S' = sucursal, NULL = retiro en local / sin API.
--   - shipping_agency_code: código de sucursal elegida (cuando type='S').
--       Se usa en el alta de envío (Fase 3, /shipping/import).
--   - shipping_agency_name: snapshot del nombre/dirección de la sucursal al
--       momento de compra (ADR-007 — inmutable aunque la sucursal cambie).
--
-- Aditivo + nullable + idempotente: no afecta órdenes existentes. Seguro
-- de re-aplicar.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_delivery_type text,
  ADD COLUMN IF NOT EXISTS shipping_agency_code text,
  ADD COLUMN IF NOT EXISTS shipping_agency_name text;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_shipping_delivery_type_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_shipping_delivery_type_check
  CHECK (
    shipping_delivery_type IS NULL
    OR shipping_delivery_type IN ('D', 'S')
  );

COMMENT ON COLUMN public.orders.shipping_delivery_type IS
  'Tipo de entrega MiCorreo: D=domicilio, S=sucursal, NULL=retiro local/sin API';
COMMENT ON COLUMN public.orders.shipping_agency_code IS
  'Código de sucursal MiCorreo elegida (cuando shipping_delivery_type=S). Para alta de envío (Fase 3).';
COMMENT ON COLUMN public.orders.shipping_agency_name IS
  'Snapshot inmutable (ADR-007) del nombre/dirección de la sucursal al momento de compra.';
