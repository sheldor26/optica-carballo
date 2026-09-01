-- ============================================
-- El nombre de quien recibe el paquete
-- ============================================
-- La orden de Mercado Libre trae un comprador, y ese comprador no siempre es un
-- nombre. Cuando ML decide no compartir los datos manda algo derivado del apodo
-- y el apellido vacío.
--
-- Pasó el 31/08/2026 con la venta 2000018216295754: llegó como
--
--     buyer.nickname   SD20260831192045304
--     buyer.first_name Sanariasdundo
--     buyer.last_name  (vacío)
--
-- y la óptica imprimió la ficha a nombre de "Sanariasdundo". La etiqueta del
-- MISMO envío decía "Gustavo orgeira", que es quien de verdad iba a recibir el
-- paquete. De 27 ventas, dos llegaron así — las dos con el apellido vacío, que
-- es la señal de que el nombre no es un nombre.
--
-- El dato existe y estaba a la vista: es el que Mercado Libre imprime en la
-- etiqueta, y sale del envío, no de la orden. La tarea ya consulta el envío
-- para traer la dirección; ahora se queda también con el nombre.
--
-- POR QUÉ UNA COLUMNA Y NO SACARLO DEL `payload`
--
-- Porque `payload` es la orden, y esto viene del envío: son dos recursos
-- distintos de la API. Meterlo ahí sería escribir adentro de un JSON que
-- guardamos justamente para tener lo que ML dijo, sin agregados nuestros.
--
-- Queda en null cuando la venta no tiene Mercado Envíos, o cuando el envío no
-- trae el nombre. La óptica cae al nombre del comprador en ese caso.
-- ============================================

ALTER TABLE public.marketplace_orders
  ADD COLUMN IF NOT EXISTS buyer_destinatario text;

COMMENT ON COLUMN public.marketplace_orders.buyer_destinatario IS
  'Nombre de quien recibe el paquete, tal como lo imprime la etiqueta de '
  'Mercado Envíos. Sale del envío, no de la orden. Es más confiable que '
  'buyer_nombre: cuando ML no comparte los datos del comprador, aquel llega '
  'derivado del apodo y con el apellido vacío.';
