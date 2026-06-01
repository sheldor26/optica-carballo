/**
 * Config de cuotas — single source of truth.
 *
 * El número de cuotas y la visibilidad viven ACÁ, no hardcodeados en
 * componentes. Si la promo cambia, se toca un solo valor y se actualiza
 * ficha + grid juntos.
 *
 * Contexto compliance (ver MISTAKES 2026-06-01): "X cuotas sin interés" es
 * una promo que el vendedor activa y PAGA en el panel de Mercado Pago — NO
 * viene por default. Publicitarla sin tenerla activa es publicidad engañosa
 * (Ley 24.240 art. 8). Por eso el flag arranca APAGADO.
 */

/**
 * Cantidad de cuotas sin interés a publicitar.
 * DEBE coincidir con la promo ACTIVA en el panel de Mercado Pago.
 */
export const INTEREST_FREE_INSTALLMENTS = 3;

/**
 * Interruptor maestro de visibilidad de cuotas en TODO el sitio (ficha + grid).
 *
 * `false` = no se muestra ninguna línea de cuotas en ningún lado.
 *
 * Prender (`true`) SOLO cuando se cumplan las dos condiciones:
 *   1. El checkout de Mercado Pago esté configurado y operativo.
 *   2. La promo de ≥ INTEREST_FREE_INSTALLMENTS cuotas sin interés esté
 *      ACTIVA en el panel MP (si no, es publicidad engañosa).
 *
 * Mientras el founder termina de setear el procesador de pagos y envíos,
 * queda en `false`: la feature está construida pero oculta.
 */
export const INSTALLMENTS_ENABLED = false;

/**
 * Monto (en centavos) de cada cuota sin interés para un precio dado.
 * Redondeado al peso más cercano.
 */
export function installmentAmountCents(priceCents: number): number {
  return Math.round(priceCents / INTEREST_FREE_INSTALLMENTS);
}
