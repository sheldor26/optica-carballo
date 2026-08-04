-- ============================================================================
-- create_order_from_cart(...): persistir customer_dni (DNI/CUIT del cliente)
-- ============================================================================
-- Founder pidió pedir DNI/CUIT obligatorio en el checkout (2026-08-04): su
-- app de facturación de escritorio (~/Facturador optica/cloud.mjs) YA lee
-- `orders.customer_dni` para armar la factura (busca en el padrón AFIP si el
-- comprador es consumidor final o requiere Factura A) — la columna existe
-- desde `20260528114114_identity_and_orders.sql` pero el checkout nunca la
-- llenaba. Este migration solo agrega `customer_dni` al INSERT de la RPC
-- atómica (`20260801143222`); no toca schema, la columna ya existe.
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.create_order_from_cart(
  p_user_id uuid,
  p_idempotency_key text,
  p_reserve_items jsonb,
  p_order jsonb,
  p_items jsonb,
  p_prescription jsonb DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_existing_id uuid;
  v_existing_number text;
  v_order_id uuid;
  v_order_number text;
  v_prescription_id uuid;
  v_item jsonb;
  v_variant_id uuid;
  v_quantity integer;
  v_updated_rows integer;
  v_current_stock integer;
  v_variant_sku text;
  v_coupon_id uuid;
BEGIN
  -- ===== 0. Idempotencia: replay si ya existe una orden con esta key =====
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id, order_number INTO v_existing_id, v_existing_number
      FROM public.orders
      WHERE idempotency_key = p_idempotency_key;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'id', v_existing_id,
        'order_number', v_existing_number,
        'replay', true
      );
    END IF;
  END IF;

  -- ===== 1. Reservar stock (misma lógica que reserve_stock, inline para
  --          que quede en la MISMA transacción) =====
  IF p_reserve_items IS NULL OR jsonb_typeof(p_reserve_items) <> 'array'
     OR jsonb_array_length(p_reserve_items) = 0 THEN
    RAISE EXCEPTION 'create_order_from_cart: p_reserve_items debe ser un array JSON no vacío'
      USING ERRCODE = '22023';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_reserve_items)
  LOOP
    v_variant_id := (v_item ->> 'variant_id')::uuid;
    v_quantity := (v_item ->> 'quantity')::integer;

    IF v_variant_id IS NULL OR v_quantity IS NULL OR v_quantity <= 0 THEN
      RAISE EXCEPTION 'create_order_from_cart: item inválido (variant_id o quantity faltante / no positivo)'
        USING ERRCODE = '22023';
    END IF;

    BEGIN
      UPDATE public.product_variants
        SET stock_qty = stock_qty - v_quantity
        WHERE id = v_variant_id
          AND is_active = true;

      GET DIAGNOSTICS v_updated_rows = ROW_COUNT;

      IF v_updated_rows = 0 THEN
        RAISE EXCEPTION 'create_order_from_cart: variante % no existe o está inactiva', v_variant_id
          USING ERRCODE = 'P0002';
      END IF;
    EXCEPTION
      WHEN check_violation THEN
        SELECT stock_qty, sku INTO v_current_stock, v_variant_sku
          FROM public.product_variants
          WHERE id = v_variant_id;
        RAISE EXCEPTION 'create_order_from_cart: stock insuficiente para SKU % (disponible: %, pedido: %)',
          v_variant_sku, v_current_stock, v_quantity
          USING ERRCODE = '23514';
    END;
  END LOOP;

  -- ===== 2. Prescription (opcional — solo si el carrito la requiere) =====
  IF p_prescription IS NOT NULL THEN
    INSERT INTO public.prescriptions (
      user_id, od_sphere, od_cylinder, od_axis, od_addition,
      oi_sphere, oi_cylinder, oi_axis, oi_addition,
      pupillary_distance, expires_at
    )
    VALUES (
      p_user_id,
      (p_prescription->>'od_sphere')::numeric, (p_prescription->>'od_cylinder')::numeric,
      (p_prescription->>'od_axis')::integer, (p_prescription->>'od_addition')::numeric,
      (p_prescription->>'oi_sphere')::numeric, (p_prescription->>'oi_cylinder')::numeric,
      (p_prescription->>'oi_axis')::integer, (p_prescription->>'oi_addition')::numeric,
      (p_prescription->>'pupillary_distance')::numeric,
      NULLIF(p_prescription->>'expires_at', '')::date
    )
    RETURNING id INTO v_prescription_id;
  END IF;

  -- ===== 3. INSERT orders (order_number lo pone el trigger existente) =====
  v_coupon_id := NULLIF(p_order->>'coupon_id', '')::uuid;

  INSERT INTO public.orders (
    user_id, customer_name, customer_email, customer_phone, customer_dni,
    shipping_recipient_name, shipping_street, shipping_number, shipping_apartment,
    shipping_city, shipping_province, shipping_postal_code, shipping_country, shipping_phone,
    shipping_address_id, subtotal_cents, shipping_cents, discount_cents, total_cents,
    shipping_method, shipping_delivery_type, shipping_agency_code, shipping_agency_name,
    coupon_id, coupon_code, prescription_id, prescription_snapshot, notes, idempotency_key
  )
  VALUES (
    p_user_id,
    p_order->>'customer_name', p_order->>'customer_email', p_order->>'customer_phone',
    NULLIF(p_order->>'customer_dni', ''),
    p_order->>'shipping_recipient_name', p_order->>'shipping_street', p_order->>'shipping_number', p_order->>'shipping_apartment',
    p_order->>'shipping_city', p_order->>'shipping_province', p_order->>'shipping_postal_code', p_order->>'shipping_country', p_order->>'shipping_phone',
    NULLIF(p_order->>'shipping_address_id', '')::uuid,
    (p_order->>'subtotal_cents')::bigint, (p_order->>'shipping_cents')::bigint,
    (p_order->>'discount_cents')::bigint, (p_order->>'total_cents')::bigint,
    p_order->>'shipping_method', p_order->>'shipping_delivery_type',
    p_order->>'shipping_agency_code', p_order->>'shipping_agency_name',
    v_coupon_id, p_order->>'coupon_code', v_prescription_id, p_prescription,
    p_order->>'notes', p_idempotency_key
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;

  -- ===== 4. INSERT order_items =====
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'create_order_from_cart: p_items debe ser un array JSON no vacío'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.order_items (
    order_id, product_id, variant_id, product_name, product_slug,
    brand_name, variant_sku, variant_attributes, quantity, unit_price_cents, line_total_cents
  )
  SELECT
    v_order_id,
    NULLIF(item->>'product_id', '')::uuid,
    NULLIF(item->>'variant_id', '')::uuid,
    item->>'product_name', item->>'product_slug', item->>'brand_name', item->>'variant_sku',
    COALESCE(item->'variant_attributes', '{}'::jsonb),
    (item->>'quantity')::integer, (item->>'unit_price_cents')::bigint, (item->>'line_total_cents')::bigint
  FROM jsonb_array_elements(p_items) AS item;

  -- ===== 5. Coupon redemption (si aplica) =====
  IF v_coupon_id IS NOT NULL THEN
    INSERT INTO public.coupon_redemptions (coupon_id, user_id, order_id, discount_cents)
    VALUES (v_coupon_id, p_user_id, v_order_id, (p_order->>'discount_cents')::bigint);

    UPDATE public.coupons SET usage_count = usage_count + 1 WHERE id = v_coupon_id;
  END IF;

  RETURN jsonb_build_object('id', v_order_id, 'order_number', v_order_number, 'replay', false);
END;
$$;

COMMIT;
