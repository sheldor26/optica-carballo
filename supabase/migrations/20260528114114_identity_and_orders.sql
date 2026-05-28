-- ============================================================================
-- Migración 00002 — Identity + Orders
-- Fecha: 2026-05-28
-- ============================================================================
-- Tablas:
--   - profiles         (1:1 con auth.users, data adicional)
--   - addresses        (múltiples por usuario, con default)
--   - prescriptions    (recetas oftalmológicas reusables — ADR-006)
--   - orders           (con snapshots inmutables — ADR-007)
--   - order_items      (snapshots de producto/variante + lens_options JSONB)
--
-- ADRs aplicables:
--   - ADR-006: Receta como entidad reusable.
--   - ADR-007: Snapshots inmutables en orders.
--   - ADR-013: Storage en Supabase (los image_path apuntan a bucket privado
--     que se crea en feature aparte).
--
-- Seguridad:
--   - RLS habilitada en TODAS las tablas.
--   - profiles, addresses, prescriptions, orders, order_items: cada user solo
--     accede a sus propios datos (auth.uid()).
--   - Trigger handle_new_user crea profile auto en signup (SECURITY DEFINER).
--   - Datos sensibles (DNI, CUIT, datos médicos): protegidos por RLS estricta.
--     Imágenes de recetas viven en bucket privado (feature aparte).
-- ============================================================================

BEGIN;

-- =====================================================================
-- 1. PROFILES
-- =====================================================================
-- Vinculada 1:1 con auth.users vía id PK. Trigger auto-crea row en signup.
-- DNI/CUIT nullable porque se llenan al primer checkout, no en signup.

CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  text,
  phone         text,
  dni           text,
  cuit_cuil     text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No policy de INSERT: lo hace el trigger handle_new_user con SECURITY DEFINER.
-- No policy de DELETE: el ON DELETE CASCADE desde auth.users lo maneja.


-- =====================================================================
-- 2. handle_new_user trigger
-- =====================================================================
-- Crea automáticamente un row en profiles cuando se crea un auth.users.
-- SECURITY DEFINER permite el insert aunque las RLS no lo permitan al user.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =====================================================================
-- 3. ADDRESSES
-- =====================================================================

CREATE TABLE public.addresses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label           text,
  recipient_name  text NOT NULL,
  street          text NOT NULL,
  number          text NOT NULL,
  apartment       text,
  city            text NOT NULL,
  province        text NOT NULL,
  postal_code     text NOT NULL,
  country         text NOT NULL DEFAULT 'AR',
  phone           text,
  is_default      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER on_addresses_updated
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- Solo una dirección is_default = true por user (UNIQUE partial).
CREATE UNIQUE INDEX idx_addresses_one_default_per_user
  ON public.addresses(user_id)
  WHERE is_default;

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own addresses"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own addresses"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users delete own addresses"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================================
-- 4. PRESCRIPTIONS
-- =====================================================================
-- Datos sensibles (salud). RLS estricta.
-- image_path apunta a bucket privado de Storage (se crea en feature aparte).

CREATE TABLE public.prescriptions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name        text,
  prescribed_at       date,
  doctor_name         text,
  doctor_matricula    text,

  -- Ojo derecho (OD)
  od_sphere           numeric(4,2),
  od_cylinder         numeric(4,2),
  od_axis             integer CHECK (od_axis IS NULL OR (od_axis BETWEEN 0 AND 180)),
  od_addition         numeric(3,2),

  -- Ojo izquierdo (OI)
  oi_sphere           numeric(4,2),
  oi_cylinder         numeric(4,2),
  oi_axis             integer CHECK (oi_axis IS NULL OR (oi_axis BETWEEN 0 AND 180)),
  oi_addition         numeric(3,2),

  pupillary_distance  numeric(4,1),
  notes               text,
  image_path          text,
  expires_at          date,
  is_archived         boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER on_prescriptions_updated
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_prescriptions_user ON public.prescriptions(user_id, is_archived);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own prescriptions"
  ON public.prescriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own prescriptions"
  ON public.prescriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own prescriptions"
  ON public.prescriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users delete own prescriptions"
  ON public.prescriptions FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================================
-- 5. ORDERS (con snapshots inmutables — ADR-007)
-- =====================================================================
-- FKs a profiles/addresses/prescriptions son no-blocking (ON DELETE SET NULL
-- o RESTRICT). Los snapshots son la fuente de verdad para mostrar al usuario.
-- order_number se llena por aplicación o function en feature de checkout.

CREATE TABLE public.orders (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  order_number            text NOT NULL UNIQUE,
  status                  text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),

  -- Snapshots del cliente (ADR-007)
  customer_name           text NOT NULL,
  customer_dni            text,
  customer_phone          text,
  customer_email          text NOT NULL,

  -- Snapshots de dirección de envío
  shipping_recipient_name text,
  shipping_street         text,
  shipping_number         text,
  shipping_apartment      text,
  shipping_city           text,
  shipping_province       text,
  shipping_postal_code    text,
  shipping_country        text,
  shipping_phone          text,
  shipping_address_id     uuid REFERENCES public.addresses(id) ON DELETE SET NULL,

  -- Totales (centavos ARS)
  subtotal_cents          bigint NOT NULL CHECK (subtotal_cents >= 0),
  shipping_cents          bigint NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
  discount_cents          bigint NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  total_cents             bigint NOT NULL CHECK (total_cents >= 0),

  -- Pago (Mercado Pago)
  payment_method          text,
  payment_status          text,
  mp_preference_id        text,
  mp_payment_id           text,

  -- Facturación AFIP (Tusfacturas)
  invoice_id              text,
  invoice_cae             text,
  invoice_url             text,

  -- Envío (Andreani / Correo Argentino / pickup)
  shipping_method         text,
  tracking_number         text,
  shipping_cost_cents     bigint,

  -- Receta asociada (solo aplica a orders con anteojos de receta)
  prescription_id         uuid REFERENCES public.prescriptions(id) ON DELETE SET NULL,
  prescription_snapshot   jsonb,

  notes                   text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  paid_at                 timestamptz,
  shipped_at              timestamptz,
  delivered_at            timestamptz
);

CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_orders_user ON public.orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_mp_payment ON public.orders(mp_payment_id) WHERE mp_payment_id IS NOT NULL;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Solo SELECT para el user. Insert/update/delete los maneja service_role
-- desde server actions (checkout, webhooks de MP, admin).
CREATE POLICY "users read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);


-- =====================================================================
-- 6. ORDER_ITEMS
-- =====================================================================
-- FKs a products/variants son no-blocking. Snapshots inmutables (ADR-007).
-- line_total_cents redundante con quantity * unit_price_cents para queries.

CREATE TABLE public.order_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id          uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id          uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,

  -- Snapshots inmutables (ADR-007)
  product_name        text NOT NULL,
  product_slug        text NOT NULL,
  variant_sku         text NOT NULL,
  variant_attributes  jsonb NOT NULL DEFAULT '{}'::jsonb,

  quantity            integer NOT NULL CHECK (quantity > 0),
  unit_price_cents    bigint NOT NULL CHECK (unit_price_cents >= 0),
  line_total_cents    bigint NOT NULL CHECK (line_total_cents >= 0),

  -- Opciones de lentes para anteojos de receta (schema libre por ahora)
  lens_options        jsonb,

  created_at          timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT order_items_line_total_matches CHECK (line_total_cents = quantity * unit_price_cents)
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- User ve order_items solo si la order pertenece al user.
CREATE POLICY "users read own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

COMMIT;
