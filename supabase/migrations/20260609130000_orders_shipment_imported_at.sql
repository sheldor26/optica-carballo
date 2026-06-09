-- Marca cuándo se dio de alta el envío del pedido en MiCorreo (Correo Argentino).
-- Permite al panel admin mostrar "envío ya generado" sin re-llamar a la API, y
-- habilita la generación de envíos EN LOTE (sabiendo cuáles ya se generaron).
-- Aditiva y nullable → segura (no toca datos existentes). NULL = todavía no se generó.

alter table public.orders
  add column if not exists shipment_imported_at timestamptz;

comment on column public.orders.shipment_imported_at is
  'Timestamp del alta del envío en MiCorreo. NULL = todavía no se generó el envío.';
