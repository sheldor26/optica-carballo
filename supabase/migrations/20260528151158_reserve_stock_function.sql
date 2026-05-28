-- ============================================================================
-- Migración 00006 — reserve_stock(items) función SQL atómica
-- Fecha: 2026-05-28
-- ============================================================================
-- Decrementa stock_qty de N product_variants en una sola transacción.
-- Si CUALQUIER decremento dejaría el stock en negativo, FALLA toda la
-- operación con `raise exception` — garantiza all-or-nothing.
--
-- Defensa contra race conditions de overselling (dos usuarios comprando
-- la última unidad simultáneamente). El CHECK constraint del schema
-- (`stock_qty >= 0`) es el último guardián; esta función expone el
-- error de forma estructurada para el server action.
--
-- Uso desde server action:
--   const { error } = await supabase.rpc('reserve_stock', {
--     p_items: [{ variant_id: '...', quantity: 2 }, ...]
--   });
--
-- Si error → rollback automático (función es transaccional por default).
-- Si OK → stock decrementado para todos los items.
-- ============================================================================

BEGIN;

-- SECURITY INVOKER: la función corre con los privilegios del caller.
-- Caller esperado: service_role (server action con createAdminClient),
-- que bypassa RLS y tiene UPDATE sobre product_variants. anon y
-- authenticated NO tienen UPDATE sobre product_variants — aunque
-- pudieran llamar la función, fallaría en el UPDATE con permission denied.
-- Además revocamos EXECUTE para no exponer la función desde el browser.
CREATE OR REPLACE FUNCTION public.reserve_stock(
  p_items jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_item jsonb;
  v_variant_id uuid;
  v_quantity integer;
  v_updated_rows integer;
  v_current_stock integer;
  v_variant_sku text;
BEGIN
  -- Validar shape mínimo del JSON
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'reserve_stock: p_items debe ser un array JSON' USING ERRCODE = '22023';
  END IF;

  -- Iterar items. Cada decremento es atómico (1 UPDATE con CHECK);
  -- toda la función está en una transacción implícita, así que si
  -- cualquier UPDATE falla, los anteriores se revierten.
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_variant_id := (v_item ->> 'variant_id')::uuid;
    v_quantity := (v_item ->> 'quantity')::integer;

    IF v_variant_id IS NULL OR v_quantity IS NULL OR v_quantity <= 0 THEN
      RAISE EXCEPTION 'reserve_stock: item inválido (variant_id o quantity faltante / no positivo)'
        USING ERRCODE = '22023';
    END IF;

    -- Intentamos decrementar. El CHECK constraint de product_variants
    -- (stock_qty >= 0) rechaza si dejaría negativo → SQLSTATE 23514.
    -- Aprovechamos ese error para devolver un mensaje útil.
    BEGIN
      UPDATE public.product_variants
        SET stock_qty = stock_qty - v_quantity
        WHERE id = v_variant_id
          AND is_active = true;

      GET DIAGNOSTICS v_updated_rows = ROW_COUNT;

      IF v_updated_rows = 0 THEN
        RAISE EXCEPTION 'reserve_stock: variante % no existe o está inactiva', v_variant_id
          USING ERRCODE = 'P0002';
      END IF;
    EXCEPTION
      WHEN check_violation THEN
        -- Rollback del savepoint implícito ya devolvió stock_qty al valor
        -- original — lo leemos directo sin compensar.
        SELECT stock_qty, sku INTO v_current_stock, v_variant_sku
          FROM public.product_variants
          WHERE id = v_variant_id;
        RAISE EXCEPTION 'reserve_stock: stock insuficiente para SKU % (disponible: %, pedido: %)',
          v_variant_sku, v_current_stock, v_quantity
          USING ERRCODE = '23514';
    END;
  END LOOP;
END;
$$;

-- Supabase otorga EXECUTE por default a anon + authenticated en functions
-- públicas. Las revocamos explícitamente — esta función solo se llama
-- desde server actions con service_role (createAdminClient).
REVOKE ALL ON FUNCTION public.reserve_stock(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reserve_stock(jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.reserve_stock(jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_stock(jsonb) TO service_role;

-- ============================================================================
-- Función compensatoria: increment_variant_stock
-- ============================================================================
-- Usada para revertir un reserve_stock cuando un INSERT posterior falla
-- (en `createOrderFromCart`). NO valida CHECK (no puede dejar negativo —
-- siempre suma). Idempotente: si se llama dos veces, suma dos veces (y eso
-- es problema del caller, no de la función).
--
-- Solo se llama desde server actions con service_role.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_variant_stock(
  p_variant_id uuid,
  p_amount integer
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'increment_variant_stock: p_amount debe ser entero positivo' USING ERRCODE = '22023';
  END IF;

  UPDATE public.product_variants
    SET stock_qty = stock_qty + p_amount
    WHERE id = p_variant_id;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_variant_stock(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_variant_stock(uuid, integer) FROM anon;
REVOKE ALL ON FUNCTION public.increment_variant_stock(uuid, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_variant_stock(uuid, integer) TO service_role;

COMMIT;
