-- ============================================
-- Migration: reclamos y devoluciones de Mercado Libre
-- ============================================
-- `marketplace_orders` dice qué se vendió. No dice qué volvió ni por qué.
-- `marketplace_claims` guarda un renglón por reclamo, con lo que informa la API
-- de post-venta de ML: motivo, etapa, estado, de quién es el turno, plazos,
-- resolución, devolución y su envío, y las fechas. Además:
-- `marketplace_reputation` (una fila por lectura de la reputación) y
-- `marketplace_sync_state` (cuándo fue el último recorrido completo).
-- Las llena el conector (/api/cron/ml-reclamos y sus vecinos), que sólo LEE
-- Mercado Libre. El sistema de la óptica las lee con la service key.
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
-- respuestas de post-venta traen direcciones, nombres y acciones sobre
-- mensajes. Del comprador sólo se guardan su número de usuario y su apodo.
-- Tampoco hay mensajes, evidencia ni el texto libre del reclamo (`description`).
--
-- UNA LECTURA QUE FALLÓ NO PISA NADA; UNA RESPUESTA VÁLIDA, SÍ
--
-- Mismo criterio que 20260901040000_marketplace_no_pisar_envio: el conector
-- hace `upsert` y el disparador conserva lo que ya estaba cuando el valor nuevo
-- viene en null. La excepción son las columnas cuyo vacío es un dato:
-- action_responsible, seller_actions, due_date, reputation_due_date y todo lo de
-- la devolución (return_*). Ésas el disparador NO las conserva: el conector no
-- las manda cuando la lectura falló, y las manda (aunque sea en null) cuando ML
-- contestó bien. Los detalles del envío de vuelta se conservan mientras el envío
-- sea el mismo. Si un reclamo se reabre, `closed_at` y la resolución anterior
-- quedan; manda `status`.
--
-- RLS activo y SIN policies: sólo service_role. Idempotente.
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

  -- Cómo terminó. resolution_coverage: si ML aplicó su cobertura.
  resolution_reason text,
  resolution_benefited text,
  resolution_closed_by text,
  resolution_coverage boolean,

  claimed_quantity numeric,
  quantity_type text,

  -- Quién reclama: número de usuario de ML y apodo (el de la orden).
  buyer_id text,
  buyer_nickname text,

  -- De quién es el turno. seller_actions: [{action, mandatory, due_date}].
  -- due_date: el plazo más cercano entre /detail y las acciones del vendedor.
  action_responsible text,
  seller_actions jsonb,
  due_date timestamptz,
  -- Textos genéricos de ML sobre el caso.
  detail_title text,
  detail_problem text,

  -- Impacto en la reputación, según ML.
  affects_reputation text,
  reputation_due_date timestamptz,
  has_incentive boolean,

  -- La venta referida, aunque sea vieja o esté cancelada (no se inserta en
  -- marketplace_orders). order_items: [{order_id, item_id, variation_id,
  -- seller_sku, title, color, quantity}].
  order_status text,
  order_items jsonb,

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
  -- [{order_id, item_id, variation_id, return_quantity, total_quantity}].
  return_items jsonb,

  -- Control de los correos ya enviados (ver las funciones de abajo).
  notified jsonb,

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

CREATE INDEX IF NOT EXISTS marketplace_claims_comprador_idx
  ON public.marketplace_claims (buyer_id)
  WHERE buyer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS marketplace_claims_abiertos_idx
  ON public.marketplace_claims (opened_at DESC)
  WHERE status = 'opened';

CREATE TABLE IF NOT EXISTS public.marketplace_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fetched_at timestamptz NOT NULL DEFAULT now(),
  level_id text,
  power_seller_status text,
  metrics jsonb
);

CREATE INDEX IF NOT EXISTS marketplace_reputation_fecha_idx
  ON public.marketplace_reputation (fetched_at DESC);

CREATE TABLE IF NOT EXISTS public.marketplace_sync_state (
  -- 'historico' anota si ya terminó la carga de los cerrados viejos (ok_at).
  clave text PRIMARY KEY CHECK (clave IN ('claims', 'reputation', 'historico')),
  -- El último recorrido completo.
  ok_at timestamptz,
  intento_at timestamptz,
  incompleto boolean NOT NULL DEFAULT false,
  detalle text
);

-- Lo guardado no se borra con un vacío (salvo las columnas explicadas arriba).
-- needs_refresh y synced_at son de control y siempre mandan los nuevos.
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

  -- Detalles del envío de vuelta: sólo si sigue siendo EL MISMO envío. Si el
  -- conector manda el envío en null (ya no hay devolución), no se conserva nada.
  IF NEW.return_shipment_id = OLD.return_shipment_id THEN
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
  NEW.resolution_coverage   := coalesce(NEW.resolution_coverage,   OLD.resolution_coverage);
  NEW.claimed_quantity      := coalesce(NEW.claimed_quantity,      OLD.claimed_quantity);
  NEW.quantity_type         := coalesce(NEW.quantity_type,         OLD.quantity_type);
  NEW.buyer_id              := coalesce(NEW.buyer_id,              OLD.buyer_id);
  NEW.buyer_nickname        := coalesce(NEW.buyer_nickname,        OLD.buyer_nickname);
  NEW.detail_title          := coalesce(NEW.detail_title,          OLD.detail_title);
  NEW.detail_problem        := coalesce(NEW.detail_problem,        OLD.detail_problem);
  NEW.affects_reputation    := coalesce(NEW.affects_reputation,    OLD.affects_reputation);
  NEW.has_incentive         := coalesce(NEW.has_incentive,         OLD.has_incentive);
  NEW.order_status          := coalesce(NEW.order_status,          OLD.order_status);
  NEW.order_items           := coalesce(NEW.order_items,           OLD.order_items);
  NEW.opened_at             := coalesce(NEW.opened_at,             OLD.opened_at);
  NEW.claim_updated_at      := coalesce(NEW.claim_updated_at,      OLD.claim_updated_at);
  NEW.closed_at             := coalesce(NEW.closed_at,             OLD.closed_at);
  NEW.refunded_at           := coalesce(NEW.refunded_at,           OLD.refunded_at);
  NEW.refunded_at_source    := coalesce(NEW.refunded_at_source,    OLD.refunded_at_source);
  NEW.original_delivered_at := coalesce(NEW.original_delivered_at, OLD.original_delivered_at);
  NEW.notified              := coalesce(NEW.notified,              OLD.notified);
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

-- ============================================
-- Los correos: nunca dos veces el mismo hecho
-- ============================================
-- notified = { "estado": {...}, "hechos": { clave: {e, en, visto, intento} } }
-- con e = pendiente | enviando | enviado | omitido. Cada función es una sola
-- operación sobre un renglón bloqueado: dos recorridos a la vez no se pisan.

-- Guarda cómo está el reclamo y agrega SÓLO los hechos que no estaban.
CREATE OR REPLACE FUNCTION public.marketplace_claim_anotar_avisos(
  p_claim_id text, p_estado jsonb, p_hechos jsonb)
RETURNS void
LANGUAGE sql
SET search_path = ''
AS $$
  UPDATE public.marketplace_claims
     SET notified = jsonb_build_object(
           'estado', p_estado,
           -- `||` se queda con la clave de la derecha: lo ya anotado gana.
           'hechos', coalesce(p_hechos, '{}'::jsonb)
                     || coalesce(notified -> 'hechos', '{}'::jsonb))
   WHERE marketplace = 'mercadolibre' AND claim_id = p_claim_id;
$$;

-- Pasa a 'enviando' lo pendiente y devuelve las claves: cada una, a uno solo.
-- Retoma lo que quedó 'enviando' hace más de 10 minutos (no se supo si salió;
-- la clave de idempotencia del envío evita el duplicado, y vale 24 horas, así
-- que a las 23 se abandona). Lo detectado hace más de 72 horas ya no se manda.
CREATE OR REPLACE FUNCTION public.marketplace_claim_tomar_avisos(
  p_claim_id text, p_ahora timestamptz)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_hechos jsonb;
  v_tomados jsonb := '[]'::jsonb;
  v_hecho record;
  v_estado text;
BEGIN
  SELECT notified -> 'hechos' INTO v_hechos
    FROM public.marketplace_claims
   WHERE marketplace = 'mercadolibre' AND claim_id = p_claim_id
     FOR UPDATE;
  IF v_hechos IS NULL THEN
    RETURN v_tomados;
  END IF;

  FOR v_hecho IN SELECT key, value FROM jsonb_each(v_hechos) LOOP
    v_estado := v_hecho.value ->> 'e';
    IF v_estado = 'pendiente'
       OR (v_estado = 'enviando'
           AND (v_hecho.value ->> 'en')::timestamptz < p_ahora - interval '10 minutes') THEN
      IF (v_hecho.value ->> 'visto')::timestamptz < p_ahora - interval '72 hours'
         OR (v_hecho.value ->> 'intento')::timestamptz < p_ahora - interval '23 hours' THEN
        v_hechos := jsonb_set(v_hechos, ARRAY[v_hecho.key],
          v_hecho.value || jsonb_build_object('e', 'omitido', 'en', p_ahora));
      ELSE
        v_hechos := jsonb_set(v_hechos, ARRAY[v_hecho.key],
          v_hecho.value || jsonb_build_object(
            'e', 'enviando', 'en', p_ahora,
            'intento', coalesce(v_hecho.value -> 'intento', to_jsonb(p_ahora))));
        v_tomados := v_tomados || to_jsonb(v_hecho.key);
      END IF;
    END IF;
  END LOOP;

  UPDATE public.marketplace_claims
     SET notified = jsonb_set(notified, '{hechos}', v_hechos)
   WHERE marketplace = 'mercadolibre' AND claim_id = p_claim_id;
  RETURN v_tomados;
END $$;

-- Cierra lo tomado: 'enviado', 'omitido', o de vuelta a 'pendiente' si el
-- servicio de correo contestó que no salió.
CREATE OR REPLACE FUNCTION public.marketplace_claim_cerrar_avisos(
  p_claim_id text, p_claves text[], p_resultado text, p_ahora timestamptz)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_hechos jsonb;
  v_clave text;
BEGIN
  IF p_resultado NOT IN ('enviado', 'pendiente', 'omitido') THEN
    RAISE EXCEPTION 'resultado de aviso desconocido: %', p_resultado;
  END IF;
  SELECT notified -> 'hechos' INTO v_hechos
    FROM public.marketplace_claims
   WHERE marketplace = 'mercadolibre' AND claim_id = p_claim_id
     FOR UPDATE;
  IF v_hechos IS NULL THEN
    RETURN;
  END IF;

  FOREACH v_clave IN ARRAY p_claves LOOP
    IF v_hechos -> v_clave ->> 'e' = 'enviando' THEN
      v_hechos := jsonb_set(v_hechos, ARRAY[v_clave],
        ((v_hechos -> v_clave) - 'intento')
        || jsonb_build_object('e', p_resultado, 'en', p_ahora));
    END IF;
  END LOOP;

  UPDATE public.marketplace_claims
     SET notified = jsonb_set(notified, '{hechos}', v_hechos)
   WHERE marketplace = 'mercadolibre' AND claim_id = p_claim_id;
END $$;

-- Los reclamos con algo por mandar (para reintentar).
CREATE OR REPLACE FUNCTION public.marketplace_claims_con_avisos_pendientes(
  p_limite integer, p_ahora timestamptz)
RETURNS SETOF text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT c.claim_id
    FROM public.marketplace_claims c
   WHERE c.marketplace = 'mercadolibre'
     AND EXISTS (
       SELECT 1
         FROM jsonb_each(coalesce(c.notified -> 'hechos', '{}'::jsonb)) h
        WHERE h.value ->> 'e' = 'pendiente'
           OR (h.value ->> 'e' = 'enviando'
               AND (h.value ->> 'en')::timestamptz < p_ahora - interval '10 minutes'))
   ORDER BY c.updated_at
   LIMIT p_limite;
$$;

-- Tablas privadas, doble cerrojo: RLS sin policies y además sin permisos para
-- los roles del navegador. Las funciones, sólo para service_role.
ALTER TABLE public.marketplace_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_sync_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_claims, public.marketplace_reputation,
  public.marketplace_sync_state FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.marketplace_claims, public.marketplace_reputation,
  public.marketplace_sync_state TO service_role;

REVOKE ALL ON FUNCTION
  public.marketplace_claim_anotar_avisos(text, jsonb, jsonb),
  public.marketplace_claim_tomar_avisos(text, timestamptz),
  public.marketplace_claim_cerrar_avisos(text, text[], text, timestamptz),
  public.marketplace_claims_con_avisos_pendientes(integer, timestamptz)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION
  public.marketplace_claim_anotar_avisos(text, jsonb, jsonb),
  public.marketplace_claim_tomar_avisos(text, timestamptz),
  public.marketplace_claim_cerrar_avisos(text, text[], text, timestamptz),
  public.marketplace_claims_con_avisos_pendientes(integer, timestamptz)
  TO service_role;

-- Segunda verificación, dentro de la misma transacción: si algo quedara sin RLS
-- o abierto al público, la migración falla entera.
DO $$
DECLARE
  v_tabla text;
  v_rol text;
  v_funcion regprocedure;
BEGIN
  FOREACH v_tabla IN ARRAY ARRAY[
    'marketplace_claims', 'marketplace_reputation', 'marketplace_sync_state'] LOOP
    IF NOT (SELECT relrowsecurity FROM pg_class
             WHERE oid = ('public.' || v_tabla)::regclass) THEN
      RAISE EXCEPTION '% quedó sin RLS', v_tabla;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies
                WHERE schemaname = 'public' AND tablename = v_tabla) THEN
      RAISE EXCEPTION '% tiene una policy', v_tabla;
    END IF;
    FOREACH v_rol IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      IF has_table_privilege(v_rol, 'public.' || v_tabla,
                             'SELECT, INSERT, UPDATE, DELETE') THEN
        RAISE EXCEPTION '% tiene permisos sobre %', v_rol, v_tabla;
      END IF;
    END LOOP;
  END LOOP;

  FOREACH v_funcion IN ARRAY ARRAY[
    'public.marketplace_claim_anotar_avisos(text, jsonb, jsonb)',
    'public.marketplace_claim_tomar_avisos(text, timestamptz)',
    'public.marketplace_claim_cerrar_avisos(text, text[], text, timestamptz)',
    'public.marketplace_claims_con_avisos_pendientes(integer, timestamptz)'
  ]::regprocedure[] LOOP
    IF has_function_privilege('anon', v_funcion, 'EXECUTE')
       OR has_function_privilege('authenticated', v_funcion, 'EXECUTE') THEN
      RAISE EXCEPTION '% se puede ejecutar desde el navegador', v_funcion;
    END IF;
  END LOOP;
END $$;

COMMENT ON TABLE public.marketplace_claims IS
  'Reclamos y devoluciones de Mercado Libre (API post-purchase). Del comprador '
  'sólo número de usuario y apodo; sin mensajes. Sólo service_role (RLS sin '
  'policies). La llena /api/cron/ml-reclamos.';

COMMENT ON TABLE public.marketplace_reputation IS
  'La reputación de la cuenta según Mercado Libre: un renglón por lectura (como '
  'mucho una por hora). Vale la última.';

COMMENT ON TABLE public.marketplace_sync_state IS
  'Cuándo se actualizó cada cosa. ok_at = último recorrido completo.';

COMMENT ON COLUMN public.marketplace_claims.return_refund_trigger IS
  'refund_at de la devolución según ML: en qué momento se devuelve la plata. No es una fecha.';

COMMENT ON COLUMN public.marketplace_claims.refunded_at IS
  'Fecha aproximada del reembolso. Ver refunded_at_source.';

COMMENT ON COLUMN public.marketplace_claims.return_delivered_at IS
  'Cuándo llegó la devolución al vendedor. Null si sólo llegó al depósito de ML.';

COMMIT;
