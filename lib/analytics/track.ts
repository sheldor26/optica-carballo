/**
 * Helper para emitir eventos custom a GA4 desde client components.
 *
 * Diseño:
 * - Si `window.gtag` no existe (GA4 no cargado por falta de consent o env var),
 *   silencioso no-op. Nunca falla.
 * - Eventos custom siguen convención GA4: name snake_case, params objeto plano.
 * - Eventos pre-definidos en `Events` para evitar typos.
 *
 * Uso:
 *   import { track, Events } from '@/lib/analytics/track';
 *   track(Events.SEARCH, { query: 'vulk' });
 */

type GtagFn = (
  command: 'event' | 'config' | 'set' | 'consent',
  ...args: unknown[]
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export const Events = {
  /** Cliente buscó algo en el dialog global. */
  SEARCH: 'search',
  /** Cliente abrió el modal de quick view de un producto. */
  QUICK_VIEW: 'quick_view',
  /** Cliente agregó/quitó un producto del wishlist. */
  WISHLIST_TOGGLE: 'wishlist_toggle',
  /** Cliente agregó/quitó un producto del comparador. */
  COMPARE_TOGGLE: 'compare_toggle',
  /** Cliente clickeó CTA WhatsApp desde cualquier lugar. */
  WHATSAPP_CLICK: 'whatsapp_click',
  /** Cliente inició checkout (click en "Iniciar compra" en carrito). */
  CHECKOUT_INITIATED: 'checkout_initiated',
  /** Cliente se suscribió al newsletter. */
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  /** Cliente subió una receta al lector IA. */
  PRESCRIPTION_UPLOAD: 'prescription_upload',
  /** Cliente subió foto al recomendador de monturas. */
  FACE_SHAPE_ANALYSIS: 'face_shape_analysis',
} as const;

export type EventName = (typeof Events)[keyof typeof Events];

export function track(
  eventName: EventName | string,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  try {
    // Filter undefined values — GA4 los lista como 'undefined' string.
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined),
        )
      : {};
    window.gtag('event', eventName, cleanParams);
  } catch (err) {
    // gtag puede tirar si hay race con consent. Silencioso.
    if (process.env.NODE_ENV === 'development') {
      console.warn('[track] gtag failed', err);
    }
  }
}
