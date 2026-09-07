-- ============================================
-- Migration: número de comprobante de ARCA en cada venta de ML, + acceso staff
-- ============================================
-- La migración anterior (marketplace_ventas) dejaba escrito: "No hay columnas
-- de documento... Si algún día se habilita el permiso de facturación, se
-- agrega en su momento". Ese día llegó: se activó el permiso "Facturación"
-- (Lectura) en la app de Mercado Libre y se reautorizó (07/09/2026).
--
-- `GET /users/{seller_id}/invoices/orders/{order_id}` devuelve, entre otras
-- cosas, `invoice_series` (el Punto de Venta de ARCA, ej. "6"), `invoice_number`
-- (el número de comprobante) y `attributes.document_type` (ej. "factura_b",
-- "nota_de_credito_a"). Verificado contra la API el 07/09/2026 sobre la venta
-- 2000018330379448: invoice_series=6, invoice_number=980, document_type=
-- factura_b — coincide exactamente con lo que el Facturador (la app de
-- escritorio) ya trae de ARCA por WSFE para el Punto de Venta 0006.
--
-- Con estas tres columnas, el Facturador puede buscar "¿qué vendí en el
-- comprobante Pto.Vta. 6 N° 980?" y traer el detalle real de productos
-- (marketplace_order_items, que YA se guarda desde la migración anterior) en
-- vez de mostrar el cartel de "detalle no disponible".
--
-- ACCESO: mismo patrón que ya usan las policies reales de `orders`/`order_items`
-- (`facturador_lee_orders`, etc. — verificado contra pg_policies en prod el
-- 07/09/2026, que chequean directo `auth.jwt()->>'email' = 'facturador@...'`,
-- no la función is_staff()/tabla staff_users que aparecen en el archivo
-- facturador_staff_rls.sql del repo — ese diseño no llegó a aplicarse, quedó
-- superado por esta versión más simple). El Facturador se conecta directo a
-- este Supabase logueado como facturador@opticacarballo.com (rol
-- authenticated, sujeto a RLS) — necesita SOLO LECTURA acá, nunca escribe
-- estas tablas.
-- ============================================

BEGIN;

ALTER TABLE public.marketplace_orders
  ADD COLUMN IF NOT EXISTS invoice_ptovta text,
  ADD COLUMN IF NOT EXISTS invoice_numero integer,
  ADD COLUMN IF NOT EXISTS invoice_document_type text;

COMMENT ON COLUMN public.marketplace_orders.invoice_ptovta IS
  'Punto de Venta de ARCA del comprobante que Mercado Libre emitió para esta venta (invoice_series de GET /users/{id}/invoices/orders/{order_id}). Null si esa venta todavía no tiene comprobante autorizado.';
COMMENT ON COLUMN public.marketplace_orders.invoice_numero IS
  'Número de comprobante de ARCA (invoice_number). Junto con invoice_ptovta e invoice_document_type identifica el mismo comprobante que ya trae el Facturador por WSFE.';
COMMENT ON COLUMN public.marketplace_orders.invoice_document_type IS
  'Tal como lo manda Mercado Libre (attributes.document_type): "factura_a", "factura_b", "nota_de_credito_a", etc. Se guarda tal cual, sin traducir, para no inventar un mapeo que después no coincida.';

CREATE INDEX IF NOT EXISTS marketplace_orders_comprobante_idx
  ON public.marketplace_orders (invoice_ptovta, invoice_numero)
  WHERE invoice_ptovta IS NOT NULL;

-- Sólo lectura para el Facturador (a diferencia de orders/order_items, acá no
-- hace falta UPDATE: el Facturador nunca escribe estas tablas, solo busca el
-- detalle de productos de una venta ya conocida).
DROP POLICY IF EXISTS "facturador_lee_marketplace_orders" ON public.marketplace_orders;
CREATE POLICY "facturador_lee_marketplace_orders"
  ON public.marketplace_orders FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'facturador@opticacarballo.com');

DROP POLICY IF EXISTS "facturador_lee_marketplace_order_items" ON public.marketplace_order_items;
CREATE POLICY "facturador_lee_marketplace_order_items"
  ON public.marketplace_order_items FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'email') = 'facturador@opticacarballo.com');

COMMIT;
