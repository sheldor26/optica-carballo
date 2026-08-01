-- =====================================================================
-- Facturador (app de escritorio) → acceso staff a orders para facturar
-- =====================================================================
-- Contexto: el facturador (`~/Facturador optica/cloud.mjs`) se conecta DIRECTO
-- al Supabase de la óptica logueado como `facturador@opticacarballo.com` (rol
-- `authenticated`, sujeto a RLS). Necesita:
--   - LEER todas las órdenes por facturar (payment_status='approved',
--     invoice_cae IS NULL) + sus order_items.
--   - ESCRIBIR el CAE de vuelta (invoice_id, invoice_cae).
--
-- La RLS actual de `orders` solo deja `SELECT USING (auth.uid()=user_id)` (el
-- dueño = el cliente) y NO tiene policy de UPDATE para authenticated. El admin
-- web funciona porque usa service_role (saltea RLS); el facturador NO puede.
--
-- Solución (Opción A): allowlist `staff_users` + helper `is_staff()` + policies
-- gateadas a staff. NO se abre `orders` a cualquier cliente registrado — solo a
-- los user_id listados en `staff_users`. La escritura se acota además a nivel
-- COLUMNA (solo invoice_*), porque RLS no puede restringir columnas.
--
-- ADR relacionado: ver CURRENT_STATE 2026-07-06 (integración facturador↔óptica).

BEGIN;

-- ---------------------------------------------------------------------
-- 1. Allowlist de cuentas staff
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_users (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.staff_users IS
  'Allowlist de cuentas con acceso operativo a orders (ej: facturador de escritorio). Solo service_role la administra; authenticated/anon no pueden leerla (sin policies).';

-- RLS ON + sin policies → nadie (salvo service_role) la lee/escribe. Así un
-- cliente autenticado no puede enumerar quién es staff.
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.staff_users FROM anon, authenticated;

-- Alta de la cuenta del facturador (idempotente).
INSERT INTO public.staff_users (user_id, note)
VALUES ('9f64cdeb-25f1-4a77-a6a2-98d26bfcae0c', 'facturador@opticacarballo.com — app de escritorio (subida automática de facturas)')
ON CONFLICT (user_id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 2. Helper is_staff() — SECURITY DEFINER para leer staff_users bajo RLS
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.staff_users s WHERE s.user_id = uid);
$$;

REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;

COMMENT ON FUNCTION public.is_staff(uuid) IS
  'True si el uid está en staff_users. SECURITY DEFINER para poder leer la allowlist (que tiene RLS sin policies). Usada en las policies de orders/order_items.';

-- ---------------------------------------------------------------------
-- 3. Policies staff sobre orders (se SUMAN a "users read own orders")
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "staff read all orders" ON public.orders;
CREATE POLICY "staff read all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "staff update orders" ON public.orders;
CREATE POLICY "staff update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- ---------------------------------------------------------------------
-- 4. Policy staff sobre order_items (getPedidoConItems hace select=*,order_items(*))
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "staff read all order items" ON public.order_items;
CREATE POLICY "staff read all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

-- ---------------------------------------------------------------------
-- 5. Restricción a nivel COLUMNA de lo que staff puede escribir
-- ---------------------------------------------------------------------
-- RLS no limita columnas. Por default Supabase da GRANT ALL (incl. UPDATE de
-- TODAS las columnas) a authenticated. Lo acotamos: authenticated solo puede
-- UPDATE de las columnas de facturación. Ningún otro flujo authenticated
-- escribe orders directo (checkout/webhook/admin usan service_role), así que
-- esto no rompe nada y cierra el riesgo de que staff toque precio/estado/etc.
REVOKE UPDATE ON public.orders FROM authenticated;
GRANT UPDATE (invoice_id, invoice_cae, invoice_url) ON public.orders TO authenticated;

COMMIT;
