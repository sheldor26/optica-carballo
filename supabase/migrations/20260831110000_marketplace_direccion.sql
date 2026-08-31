-- ============================================
-- Migration: a dónde va el paquete de cada venta de Mercado Libre
-- ============================================
-- La venta que devuelve `/orders/search` NO trae la dirección. Verificado el
-- 29/08/2026 sobre las 18 ventas de la semana: `receiver_address` viene
-- `undefined` en las 18. La dirección cuelga del ENVÍO, en `/shipments/{id}`,
-- adentro de `destination.shipping_address`.
--
-- Por eso la primera versión de estas tablas no tenía estas columnas: el código
-- no las podía llenar, y una columna que nunca se llena es una mentira en el
-- esquema. Ahora sí se piden, porque Juan las pidió:
--
--   "Agendar dirección, provincia, CP y otros datos — que no aparezcan en la
--    ficha impresa, pero sí que quede guardado en la ficha del sistema"
--
-- QUÉ SE HACE CON ESTO DEL OTRO LADO
--
-- La óptica las guarda en el cliente: la localidad y la provincia en
-- `clientes.localidad`, el código postal en `clientes.codigo_postal` y la calle
-- en las observaciones del cliente. NINGUNO de esos tres sale en la ficha
-- impresa —ahí el domicilio dice MERCADOLIBRE, que es la regla— así que el dato
-- queda en el sistema y no en el papel, que es exactamente lo que se pidió.
--
-- El teléfono del comprador NO se guarda, y no es un olvido: el que da Mercado
-- Libre es un número intermedio que se apaga cuando la venta se cierra.

alter table public.marketplace_orders
  add column if not exists buyer_direccion  text,
  add column if not exists buyer_localidad  text,
  add column if not exists buyer_provincia  text,
  add column if not exists buyer_cp         text,
  -- EN QUÉ ANDA EL ENVÍO. Sale de la misma llamada que la dirección, así que es
  -- gratis, y hace falta: Mercado Libre NO entrega la etiqueta de un envío ya
  -- despachado. Contesta 400 con cause NOT_PRINTABLE_STATUS.
  --
  -- Sin esto la óptica ofrecía "Imprimir etiqueta" en las 22 ventas y las 22
  -- fallaban, porque las 22 ya estaban despachadas —14 shipped, 5 delivered, 2
  -- out_for_delivery, 1 waiting_for_withdrawal, medido el 31/08/2026—. Un botón
  -- que nunca puede funcionar es peor que no tener el botón.
  add column if not exists shipping_estado    text,
  add column if not exists shipping_subestado text;

comment on column public.marketplace_orders.buyer_direccion is
  'Calle y número del envío, de /shipments/{id}. La usa la óptica para dejarla '
  'anotada en el cliente; el paquete lo despacha Mercado Envíos.';

comment on column public.marketplace_orders.shipping_estado is
  'Estado del envío en Mercado Libre: ready_to_ship, shipped, delivered... La '
  'etiqueta sólo se puede pedir en ready_to_ship.';
