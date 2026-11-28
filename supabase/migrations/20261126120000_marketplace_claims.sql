-- ============================================
-- Migration: reclamos y devoluciones de Mercado Libre
-- ============================================
-- `marketplace_orders` dice qué se vendió. No dice qué volvió ni por qué. Esta
-- tabla guarda un renglón por reclamo, con lo que informa la API de post-venta
-- de ML: motivo, etapa, estado, resolución, devolución y su envío, y las
-- fechas. La llena la tarea /api/cron/ml-reclamos (sólo LEE Mercado Libre).
--
-- SE CRUZA CON LAS VENTAS POR TEXTO, SIN CLAVE FORÁNEA
--
-- `order_external_id` es el `external_id` de marketplace_orders y `pack_id` su
-- `pack_id` (el número que se ve en el panel). No hay FK a propósito: puede
-- llegar un reclamo de una venta anterior a la primera sincronización, y no por
-- eso hay que perderlo.
--
-- Hay reclamos sobre la orden y sobre el ENVÍO (`resource`). La tarea intenta
-- completar order_external_id en los dos casos; si la venta se sincronizó
-- después, el envío igual permite cruzarlos:
--
--     SELECT c.*, o.sold_at
--       FROM public.marketplace_claims c
--       LEFT JOIN LATERAL (
--         SELECT * FROM public.marketplace_orders o
--          WHERE o.marketplace = c.marketplace
--            AND (o.external_id = c.order_external_id
--                 OR (c.resource = 'shipment' AND o.shipment_id = c.resource_id))
--          ORDER BY (o.external_id = c.order_external_id) DESC NULLS LAST
--          LIMIT 1
--       ) o ON true;
--
-- Un pack puede tener varias órdenes en un mismo envío: ahí `order_external_id`
-- es una de ellas y `pack_id` las reúne.
--
-- LO QUE NO ESTÁ ACÁ, Y NO ES UN OLVIDO
--
-- No hay JSON crudo (`payload`), a diferencia de marketplace_orders: las
-- respuestas de post-venta traen identificadores del comprador, direcciones y
-- acciones sobre mensajes. Sólo se guardan las columnas de abajo. Tampoco hay
-- mensajes ni evidencia.
--
-- TODO NULLABLE, Y UNA CORRIDA NUNCA PISA CON VACÍO
--
-- Mismo criterio que 20260901040000_marketplace_no_pisar_envio: la tarea hace
-- `upsert` de la fila entera y el disparador conserva lo que ya estaba cuando
-- el valor nuevo viene en null. Consecuencia a saber: si un reclamo se reabre,
-- `closed_at` y la resolución anterior quedan; manda `status`.
--
-- RLS activo y SIN policies: sólo service_role (la tarea). Idempotente.
-- ============================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.marketplace_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace text NOT NULL DEFAULT 'mercadolibre'
    CHECK (marketplace IN ('mercadolibre')),
  claim_id text NOT NULL,

  -- A qué se refiere el reclamo, tal como lo dice ML, y a qué venta corresponde.
  resource text,
  resource_id text,
  order_external_id text,
  pack_id text,

  -- Qué es y en qué anda. Códigos de ML sin traducir.
  claim_type text,
  stage text,
  status text,

  -- El motivo: código (ej. PDD9943) y lo que ML informa sobre ese código.
  reason_id text,
  reason_name text,
  reason_detail text,

  -- Cómo terminó.
  resolution_reason text,
  resolution_benefited text,
  resolution_closed_by text,

  -- Fechas.
  opened_at timestamptz,
  claim_updated_at timestamptz,
  closed_at timestamptz,
  refunded_at timestamptz,
  -- De dónde salió refunded_at: 'order_payment' (última modificación del pago
  -- devuelto en la orden) o 'claim_resolution' (fecha de la resolución). Las
  -- dos son aproximaciones: ML no informa una "fecha de reembolso" en el reclamo.
  refunded_at_source text,
  -- Cuándo recibió el comprador el envío ORIGINAL.
  original_delivered_at timestamptz,
  -- Días enteros (de 24 h) entre esa entrega y la apertura del reclamo. Null si
  -- falta alguna de las dos fechas; negativo si se reclamó antes de recibir.
  days_from_delivery_to_claim integer GENERATED ALWAYS AS (
    floor(extract(epoch FROM (opened_at - original_delivered_at)) / 86400)::integer
  ) STORED,

  -- La devolución, si la hay.
  return_id text,
  return_type text,
  return_subtype text,
  return_status text,
  return_money_status text,
  -- Ojo: NO es una fecha. Es la regla de CUÁNDO se devuelve la plata
  -- (`refund_at` de ML: 'shipped', 'delivered', ...).
  return_refund_trigger text,
  return_opened_at timestamptz,
  return_closed_at timestamptz,

  -- El envío de vuelta (el principal) y su seguimiento.
  return_shipment_id text,
  return_shipment_status text,
  return_shipment_substatus text,
  return_tracking_number text,
  return_tracking_method text,
  return_shipped_at timestamptz,
  return_delivered_at timestamptz,
  -- Todos los tramos que informa la devolución, sólo con id, tipo, estado,
  -- seguimiento y tipo de destino. Sin direcciones ni nombres.
  return_shipments jsonb,

  -- Control de la tarea: si hay que volver a consultarlo y cuándo se miró.
  needs_refresh boolean NOT NULL DEFAULT true,
  synced_at timestamptz NOT NULL DEFAULT now(),
  fetched_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT marketplace_claims_unico UNIQUE (marketplace, claim_id)
);

CREATE INDEX IF NOT EXISTS marketplace_claims_orden_idx
  ON public.marketplace_claims (order_external_id);

CREATE INDEX IF NOT EXISTS marketplace_claims_pack_idx
  ON public.marketplace_claims (pack_id)
  WHERE pack_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS marketplace_claims_apertura_idx
  ON public.marketplace_claims (opened_at DESC);

CREATE INDEX IF NOT EXISTS marketplace_claims_a_revisar_idx
  ON public.marketplace_claims (synced_at)
  WHERE needs_refresh;

-- Lo guardado no se borra con un vacío. needs_refresh y synced_at quedan fuera
-- a propósito: son de control y siempre mandan los nuevos.
CREATE OR REPLACE FUNCTION public.marketplace_claims_conservar_datos()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- El texto del motivo sólo se conserva si el código sigue siendo el mismo.
  IF NEW.reason_id IS NULL OR OLD.reason_id IS NULL OR NEW.reason_id = OLD.reason_id THEN
    NEW.reason_name   := coalesce(NEW.reason_name,   OLD.reason_name);
    NEW.reason_detail := coalesce(NEW.reason_detail, OLD.reason_detail);
  END IF;

  -- Lo mismo con la devolución: no mezclar datos de dos devoluciones distintas.
  IF NEW.return_id IS NULL OR OLD.return_id IS NULL OR NEW.return_id = OLD.return_id THEN
    NEW.return_type           := coalesce(NEW.return_type,           OLD.return_type);
    NEW.return_subtype        := coalesce(NEW.return_subtype,        OLD.return_subtype);
    NEW.return_status         := coalesce(NEW.return_status,         OLD.return_status);
    NEW.return_money_status   := coalesce(NEW.return_money_status,   OLD.return_money_status);
    NEW.return_refund_trigger := coalesce(NEW.return_refund_trigger, OLD.return_refund_trigger);
    NEW.return_opened_at      := coalesce(NEW.return_opened_at,      OLD.return_opened_at);
    NEW.return_closed_at      := coalesce(NEW.return_closed_at,      OLD.return_closed_at);
    NEW.return_shipments      := coalesce(NEW.return_shipments,      OLD.return_shipments);
  END IF;

  -- Y con el envío de vuelta.
  IF NEW.return_shipment_id IS NULL OR OLD.return_shipment_id IS NULL
     OR NEW.return_shipment_id = OLD.return_shipment_id THEN
    NEW.return_shipment_status    := coalesce(NEW.return_shipment_status,    OLD.return_shipment_status);
    NEW.return_shipment_substatus := coalesce(NEW.return_shipment_substatus, OLD.return_shipment_substatus);
    NEW.return_tracking_number    := coalesce(NEW.return_tracking_number,    OLD.return_tracking_number);
    NEW.return_tracking_method    := coalesce(NEW.return_tracking_method,    OLD.return_tracking_method);
    NEW.return_shipped_at         := coalesce(NEW.return_shipped_at,         OLD.return_shipped_at);
    NEW.return_delivered_at       := coalesce(NEW.return_delivered_at,       OLD.return_delivered_at);
  END IF;

  NEW.resource              := coalesce(NEW.resource,              OLD.resource);
  NEW.resource_id           := coalesce(NEW.resource_id,           OLD.resource_id);
  NEW.order_external_id     := coalesce(NEW.order_external_id,     OLD.order_external_id);
  NEW.pack_id               := coalesce(NEW.pack_id,               OLD.pack_id);
  NEW.claim_type            := coalesce(NEW.claim_type,            OLD.claim_type);
  NEW.stage                 := coalesce(NEW.stage,                 OLD.stage);
  NEW.status                := coalesce(NEW.status,                OLD.status);
  NEW.reason_id             := coalesce(NEW.reason_id,             OLD.reason_id);
  NEW.resolution_reason     := coalesce(NEW.resolution_reason,     OLD.resolution_reason);
  NEW.resolution_benefited  := coalesce(NEW.resolution_benefited,  OLD.resolution_benefited);
  NEW.resolution_closed_by  := coalesce(NEW.resolution_closed_by,  OLD.resolution_closed_by);
  NEW.opened_at             := coalesce(NEW.opened_at,             OLD.opened_at);
  NEW.claim_updated_at      := coalesce(NEW.claim_updated_at,      OLD.claim_updated_at);
  NEW.closed_at             := coalesce(NEW.closed_at,             OLD.closed_at);
  NEW.refunded_at           := coalesce(NEW.refunded_at,           OLD.refunded_at);
  NEW.refunded_at_source    := coalesce(NEW.refunded_at_source,    OLD.refunded_at_source);
  NEW.original_delivered_at := coalesce(NEW.original_delivered_at, OLD.original_delivered_at);
  NEW.return_id             := coalesce(NEW.return_id,             OLD.return_id);
  NEW.return_shipment_id    := coalesce(NEW.return_shipment_id,    OLD.return_shipment_id);
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS marketplace_claims_conservar ON public.marketplace_claims;
CREATE TRIGGER marketplace_claims_conservar
  BEFORE UPDATE ON public.marketplace_claims
  FOR EACH ROW EXECUTE FUNCTION public.marketplace_claims_conservar_datos();

DROP TRIGGER IF EXISTS marketplace_claims_updated_at ON public.marketplace_claims;
CREATE TRIGGER marketplace_claims_updated_at
  BEFORE UPDATE ON public.marketplace_claims
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tabla privada, doble cerrojo: RLS sin policies y además sin permisos para los
-- roles del navegador. service_role (la tarea) no se ve afectado.
ALTER TABLE public.marketplace_claims ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_claims FROM anon, authenticated;

-- Segunda verificación, dentro de la misma transacción: si la tabla quedara sin
-- RLS o abierta al público, la migración falla entera.
DO $$
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class
           WHERE oid = 'public.marketplace_claims'::regclass) THEN
    RAISE EXCEPTION 'marketplace_claims quedó sin RLS';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies
              WHERE schemaname = 'public' AND tablename = 'marketplace_claims'
                AND (roles && ARRAY['anon', 'public']::name[])) THEN
    RAISE EXCEPTION 'marketplace_claims tiene una policy pública';
  END IF;
  IF has_table_privilege('anon', 'public.marketplace_claims', 'SELECT') THEN
    RAISE EXCEPTION 'anon puede leer marketplace_claims';
  END IF;
END $$;

COMMENT ON TABLE public.marketplace_claims IS
  'Reclamos y devoluciones de Mercado Libre (API post-purchase). Sin mensajes ni '
  'datos del comprador. Sólo service_role (RLS sin policies). La llena '
  '/api/cron/ml-reclamos.';

COMMENT ON COLUMN public.marketplace_claims.return_refund_trigger IS
  'refund_at de la devolución según ML: en qué momento se devuelve la plata. No es una fecha.';

COMMENT ON COLUMN public.marketplace_claims.refunded_at IS
  'Fecha aproximada del reembolso. Ver refunded_at_source.';

COMMIT;
