-- ============================================
-- Migration: las ventas de Mercado Libre, guardadas
-- ============================================
-- Hasta hoy la tienda no sabía que vendía en Mercado Libre. Se enteraba del
-- EFECTO y nunca del hecho: cuando ML vende, cambia el stock de la publicación,
-- eso dispara un webhook `items` y sync-stock lo baja acá. El webhook de
-- `orders_v2` está ignorado a propósito desde el sprint 2b, con ese argumento.
--
-- Es cierto para el stock y es insuficiente para todo lo demás. La óptica
-- necesita saber QUIÉN compró, QUÉ y a CUÁNTO, para dar de alta al cliente,
-- registrar la venta al precio de ML —que difiere del de la óptica en 130 de
-- 132 modelos comparables, siempre para arriba— y descontar la unidad del
-- artículo con asterisco. Nada de eso se deduce de un cambio de stock.
--
-- POR QUÉ NO SE REUSA `orders`
--
-- `orders` es el checkout propio de la tienda: tiene mp_preference_id,
-- coupon_id, prescription_id, un order_number con formato 'OC-2026-...' y un
-- `id` uuid. Una orden de Mercado Libre no tiene nada de eso y su identificador
-- es numérico (2000018164697964), que no entra en un uuid. Meterla ahí
-- obligaría a llenar de nulos la mitad de la tabla y a que todo lo que hoy lee
-- `orders` aprenda a saltear filas que no son suyas.
--
-- DOS NÚMEROS DISTINTOS, Y HAY QUE GUARDAR LOS DOS
--
-- `external_id` es el id de la orden, que es lo que devuelve /orders/search y
-- lo que sirve para volver a pedirla. `pack_id` es el número que el vendedor VE
-- en su panel de Mercado Libre. NO son el mismo número: la venta de PILOLUC del
-- 28/08 es la orden 2000018164697964 y el pack 2000014753233033, y en el panel
-- figura el segundo. Verificado contra la API el 29/08/2026 sobre 18 ventas: en
-- las 18 difieren. Si la óptica mostrara el id de orden, nadie podría cruzar la
-- venta con el panel — que es justo para lo que se mira ese número.
--
-- Viene en null cuando la venta no pertenece a un pack; ahí el panel muestra el
-- id de orden y los dos números coinciden.
--
-- LO QUE MERCADO LIBRE NO DA, Y POR ESO NO ESTÁ ACÁ
--
-- No hay columnas de documento ni de localidad, y no es un olvido:
--
--   · `GET /orders/{id}/billing_info` contesta 403 (PolicyAgent,
--     PA_UNAUTHORIZED_RESULT_FROM_POLICIES) con los permisos de esta
--     aplicación, así que el DNI/CUIT del comprador no es alcanzable. El
--     `buyer.billing_info` que sí viene en la orden trae un solo campo, `id`,
--     que es un identificador interno de ML y no un documento.
--   · La dirección no cuelga de la orden sino del envío: haría falta un
--     `GET /shipments/{id}` por venta. No se hace, porque la ficha de la óptica
--     lleva "MERCADOLIBRE" en el domicilio por regla del negocio y la dirección
--     real la usa Mercado Envíos, que es quien despacha.
--
-- Una columna que el código no puede llenar nunca es una mentira en el esquema.
-- Si algún día se habilita el permiso de facturación, se agrega en su momento;
-- mientras tanto el JSON completo queda en `payload`.
--
-- POR QUÉ SE GUARDA EL JSON ENTERO
--
-- Porque todavía no sabemos qué vamos a necesitar. Las columnas de arriba son
-- lo que la óptica usa hoy; `payload` es el resto, para no tener que volver a
-- pedírselo a ML el día que aparezca un caso que no previmos. Es lo mismo que
-- hace marketplace_webhook_events.
--
-- LA COLUMNA QUE IMPORTA MÁS DE LO QUE PARECE: `variant_sku`
--
-- Es lo que convierte una venta de ML en algo que la óptica puede emparejar.
-- Del lado de allá existe `pedidos_web_equivalencias`, con el sku de la tienda
-- como clave, que aprende a qué artículo del stock corresponde cada producto y
-- no lo vuelve a preguntar. Si las ventas de ML resuelven su sku, las dos
-- pestañas —Mercado Libre y Pedidos Web— comparten ese aprendizaje en vez de
-- tener cada una el suyo.
-- ============================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace text NOT NULL DEFAULT 'mercadolibre'
    CHECK (marketplace IN ('mercadolibre')),

  -- El id de la orden en ML. Numérico y largo, va como texto.
  external_id text NOT NULL,

  -- El número que se ve en el panel del vendedor. Ver arriba: no es el mismo.
  pack_id text,

  -- El estado tal como lo dice ML: paid, cancelled, invalid... No se traduce
  -- acá; la óptica decide qué hacer con cada uno.
  status text NOT NULL,
  sold_at timestamptz NOT NULL,
  total_cents bigint NOT NULL DEFAULT 0,

  -- EL COMPRADOR. `nickname` es el apodo que se ve en el listado de ML
  -- ('PILOLUC'); nombre y apellido son los de facturación, que es lo que va en
  -- la ficha del cliente. Juan fue explícito: "no completes con el nombre de
  -- usuario, sino con los datos del comprador para la facturación".
  --
  -- OJO: esos dos NO vienen en /orders/search, que devuelve un `buyer` con
  -- apenas `id` y `nickname`. Salen del detalle, /orders/{id}. Es la razón de
  -- que la tarea pida cada orden por separado.
  buyer_nickname text,
  buyer_nombre text,
  buyer_apellido text,

  -- EL ENVÍO. `shipment_id` es lo único que hace falta para pedirle la etiqueta
  -- a ML. Sin Mercado Envíos viene en null y no hay etiqueta que imprimir.
  shipment_id text,

  payload jsonb NOT NULL,

  fetched_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- La tarea que las trae vuelve a pasar por las mismas ventas cada vez que
  -- corre —mira siete días para atrás— así que la única defensa que sirve está
  -- acá abajo y no en el código.
  CONSTRAINT marketplace_orders_unica UNIQUE (marketplace, external_id)
);

CREATE TABLE IF NOT EXISTS public.marketplace_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL
    REFERENCES public.marketplace_orders (id) ON DELETE CASCADE,

  -- Lo que manda ML de cada renglón.
  ml_item_id text NOT NULL,
  ml_variation_id text,
  seller_sku text,
  title text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_cents bigint NOT NULL,

  -- La variante de la tienda, si se pudo resolver. Puede quedar en null: ML
  -- avisó sobre 847 publicaciones distintas y la tienda tiene linkeadas 188,
  -- así que hoy la mayoría de las ventas llegan de publicaciones que la tienda
  -- no conoce. Que quede null no es un error: es el caso normal, y la óptica lo
  -- resuelve preguntando una vez.
  variant_id uuid REFERENCES public.product_variants (id) ON DELETE SET NULL,
  variant_sku text,

  -- `NULLS NOT DISTINCT` y no un UNIQUE común. Sin eso esta restricción no
  -- restringe nada en el caso que más se da: Postgres considera distintos a dos
  -- NULL, y `ml_variation_id` es NULL siempre que la publicación no tenga
  -- variaciones — que fueron las 18 de 18 ventas verificadas contra la API el
  -- 29/08/2026. El `onConflict` del upsert nunca encontraba conflicto, así que
  -- cada corrida de la tarea insertaba otra vez los mismos renglones y la
  -- pantalla de la óptica iba a mostrar el mismo anteojo una vez por hora.
  --
  -- Requiere Postgres 15+; el proyecto corre 17.6. Hay precedente en el repo:
  -- catalog_foundation usa UNIQUE NULLS NOT DISTINCT (parent_id, slug).
  UNIQUE NULLS NOT DISTINCT (order_id, ml_item_id, ml_variation_id)
);

CREATE INDEX IF NOT EXISTS marketplace_orders_pendientes_idx
  ON public.marketplace_orders (status, sold_at DESC);

CREATE INDEX IF NOT EXISTS marketplace_order_items_orden_idx
  ON public.marketplace_order_items (order_id);

CREATE INDEX IF NOT EXISTS marketplace_order_items_sku_idx
  ON public.marketplace_order_items (variant_sku)
  WHERE variant_sku IS NOT NULL;

-- `updated_at` a cargo de la base y no del que escribe. La tarea la manda a
-- mano en cada upsert, pero cualquier UPDATE futuro —marcar la venta como
-- procesada, corregir un estado— se olvidaría, y la columna quedaría mintiendo
-- justo cuando más se la mira. Es el helper que ya usa todo el catálogo.
DROP TRIGGER IF EXISTS marketplace_orders_updated_at ON public.marketplace_orders;
CREATE TRIGGER marketplace_orders_updated_at
  BEFORE UPDATE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS estricta, igual que marketplace_webhook_events: sin policies, sólo
-- service_role. Acá adentro hay nombre y apellido de gente que compró: no tiene
-- por qué ser alcanzable desde el navegador de nadie.
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_order_items ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.marketplace_orders IS
  'Ventas de Mercado Libre traídas de la API. Las lee la pestaña Mercado Libre '
  'del sistema de la óptica para dar de alta el cliente, registrar la venta al '
  'precio de ML y descontar el stock.';

COMMENT ON COLUMN public.marketplace_orders.pack_id IS
  'El número que el vendedor ve en su panel de Mercado Libre. Distinto del '
  'external_id (el id de la orden). Null cuando la venta no está en un pack.';

COMMENT ON COLUMN public.marketplace_order_items.variant_sku IS
  'El sku de la tienda, cuando la publicación está linkeada a una variante. Es '
  'la clave de optica.pedidos_web_equivalencias: con esto una venta de ML hereda '
  'el emparejado que ya aprendió la tienda web, y al revés.';

COMMIT;
