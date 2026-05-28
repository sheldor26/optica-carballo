import 'server-only';
import { Preference } from 'mercadopago';
import { getMpClient } from './client';
import type { ResolvedCart } from '@/lib/cart/types';
import type { ShippingQuote } from '@/lib/shipping';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export type CreatePreferenceResult =
  | {
      ok: true;
      preferenceId: string;
      initPoint: string; // URL para redirigir al user al checkout MP
      sandboxInitPoint: string; // URL del sandbox MP (cuando token=TEST)
    }
  | { ok: false; error: string };

/**
 * Crea una preferencia de pago en Mercado Pago Checkout Pro.
 *
 * Estructura del payload (Checkout Pro V1):
 *   - items: lista de productos con title/quantity/unit_price.
 *   - payer: email del cliente (auto-rellena en MP).
 *   - back_urls: a dónde redirige MP post-pago (success/pending/failure).
 *   - auto_return: 'approved' → redirige automáticamente si pago aprobado.
 *   - external_reference: nuestro order_number (formato OC-YYYY-NNNNN).
 *     Esto nos permite matchear el webhook con la orden en DB.
 *   - notification_url: a dónde MP postea eventos de payment (webhook).
 *     Sub-feature 3 implementa el handler en /api/mp/webhook.
 *   - statement_descriptor: texto que aparece en el resumen del cliente.
 *
 * Trick: el `shipping` se agrega como un item separado en la lista. MP no
 * tiene un campo dedicado de "envío" en Checkout Pro V1, así que va inline.
 *
 * IMPORTANTE: `external_reference` debe ser único por order. Usamos el
 * `order_number` (OC-YYYY-NNNNN), que ya es UNIQUE en DB.
 */
export async function createCheckoutPreference(args: {
  orderNumber: string;
  payerEmail: string;
  cart: ResolvedCart;
  shipping: ShippingQuote;
}): Promise<CreatePreferenceResult> {
  const { orderNumber, payerEmail, cart, shipping } = args;

  if (cart.items.length === 0) {
    return { ok: false, error: 'Carrito vacío.' };
  }

  const items = cart.items.map((it) => ({
    id: it.variant.sku,
    title: `${it.brand.name} ${it.product.name}`.slice(0, 256),
    description: `SKU ${it.variant.sku}`.slice(0, 256),
    quantity: it.quantity,
    unit_price: it.variant.priceCents / 100, // MP usa decimales, no centavos
    currency_id: 'ARS',
  }));

  // Envío como item extra si no es free. Usamos un ID convencional para
  // poder filtrar el item de envío del cart real en el webhook.
  if (!shipping.isFree && shipping.cents > 0) {
    items.push({
      id: 'SHIPPING',
      title: `Envío — ${shipping.zoneLabel}`,
      description: 'Costo de envío',
      quantity: 1,
      unit_price: shipping.cents / 100,
      currency_id: 'ARS',
    });
  }

  // MP rechaza `auto_return` cuando back_urls apuntan a localhost. En dev
  // local, omitimos auto_return y el user clickea "Volver al sitio" manual
  // en la UI de MP. En prod con dominio real, auto_return funciona normal.
  const isLocalhost =
    SITE_URL.includes('localhost') || SITE_URL.includes('127.0.0.1');

  const body = {
    items,
    payer: { email: payerEmail },
    external_reference: orderNumber,
    back_urls: {
      success: `${SITE_URL}/checkout/exito`,
      pending: `${SITE_URL}/checkout/pendiente`,
      failure: `${SITE_URL}/checkout/error`,
    },
    ...(isLocalhost ? {} : { auto_return: 'approved' as const }),
    statement_descriptor: 'OPTICA CARBALLO',
    notification_url: `${SITE_URL}/api/mp/webhook`,
    metadata: {
      order_number: orderNumber,
    },
  };

  try {
    const client = getMpClient();
    const preference = new Preference(client);
    const result = await preference.create({ body });

    if (!result.id || !result.init_point) {
      return {
        ok: false,
        error: 'Mercado Pago no devolvió un init_point válido.',
      };
    }

    return {
      ok: true,
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point ?? result.init_point,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: `Error de Mercado Pago: ${message}`,
    };
  }
}
