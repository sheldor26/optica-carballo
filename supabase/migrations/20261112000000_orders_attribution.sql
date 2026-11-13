-- ============================================================================
-- orders.attribution: de qué anuncio/campaña llegó el comprador
-- ============================================================================
-- Antes de gastar en un anuncio en X (2026-11-12) no había forma de saber si
-- una venta vino de la campaña: `orders` no guardaba fuente ni campaña. Se
-- agrega UNA columna jsonb, nullable y sin default, con lo que haya en la
-- cookie propia `oc_attr` al crear el pedido: { source, medium, campaign,
-- content, term, twclid, gclid, landing, capturedAt }. Cambio aditivo: no toca
-- la RPC atómica `create_order_from_cart` (la app lo escribe con un UPDATE
-- best-effort justo después de crear el pedido) ni las policies RLS.
-- ============================================================================

BEGIN;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS attribution jsonb;

COMMENT ON COLUMN public.orders.attribution IS
  'Fuente de la visita que terminó en este pedido (utm_*, twclid, gclid, landing). NULL si no había cookie de atribución (visitante sin consentimiento, tráfico directo, pedidos anteriores al 2026-11-12).';

COMMIT;
