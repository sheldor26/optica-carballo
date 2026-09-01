-- ============================================
-- Lo que Mercado Libre dejó de contar no se borra de acá
-- ============================================
-- La tarea que trae las ventas mira los últimos siete días y vuelve a escribir
-- TODAS las de esa ventana en cada pasada, una por hora. Eso está bien para el
-- estado del envío, que justamente cambia.
--
-- Está mal para los datos del destino. Mercado Libre los va dejando de compartir
-- a medida que el envío avanza — medido el 01/09/2026 sobre 27 ventas:
--
--     ready_to_ship    2 de 2 traen el nombre de quien recibe   (100%)
--     shipped         15 de 18                                   (83%)
--     delivered        2 de 6                                    (33%)
--
-- Con la dirección pasa lo mismo: de las 6 entregadas, 2 ya no la traen.
--
-- O sea que una venta que hoy llega completa, cuando pase a "entregada" dentro
-- de la misma semana vuelve a guardarse con esos campos en null y se pierde lo
-- que ya teníamos. Si la óptica tarda unos días en cargarla —pasa: al escribir
-- esto había una del 26/08 todavía pendiente— la carga sin nombre ni dirección,
-- y esos datos ya no vuelven porque ML no los da más.
--
-- POR QUÉ UN DISPARADOR Y NO ARREGLARLO EN EL CÓDIGO
--
-- Porque el código que escribe es un `upsert` que manda la fila entera, y para
-- respetar lo guardado tendría que leer antes cada venta: una consulta más por
-- venta y por pasada, y una regla que el próximo que toque esa función se puede
-- olvidar. Acá la garantía la da la base y no hay nada que recordar.
--
-- Sólo protege de que un dato se pierda. Si ML manda un valor nuevo, ese pisa
-- al viejo como corresponde: alguien puede corregir su dirección.
-- ============================================

CREATE OR REPLACE FUNCTION public.marketplace_conservar_datos_del_envio()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.buyer_destinatario := coalesce(NEW.buyer_destinatario, OLD.buyer_destinatario);
  NEW.buyer_direccion    := coalesce(NEW.buyer_direccion,    OLD.buyer_direccion);
  NEW.buyer_localidad    := coalesce(NEW.buyer_localidad,    OLD.buyer_localidad);
  NEW.buyer_provincia    := coalesce(NEW.buyer_provincia,    OLD.buyer_provincia);
  NEW.buyer_cp           := coalesce(NEW.buyer_cp,           OLD.buyer_cp);
  RETURN NEW;
END $$;

COMMENT ON FUNCTION public.marketplace_conservar_datos_del_envio() IS
  'Evita que una pasada de la tarea de ventas borre el nombre de quien recibe o '
  'la dirección: Mercado Libre deja de compartirlos cuando el envío avanza, y el '
  'upsert los volvería a escribir en null.';

DROP TRIGGER IF EXISTS marketplace_orders_conservar_envio ON public.marketplace_orders;
CREATE TRIGGER marketplace_orders_conservar_envio
  BEFORE UPDATE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.marketplace_conservar_datos_del_envio();
