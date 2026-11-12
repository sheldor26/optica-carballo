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
 * Marcas con más cuotas sin interés que el resto (pedido del founder
 * 2026-11-12: Vulk y Rusty en 6, el resto sigue en 3). La clave es el slug
 * de la marca (`brands.slug`). Misma regla de compliance: los 6 DEBEN estar
 * ACTIVOS en el panel de Mercado Pago para esas ventas, o es publicidad
 * engañosa (Ley 24.240 art. 8).
 */
export const INTEREST_FREE_INSTALLMENTS_BY_BRAND: Record<string, number> = {
  vulk: 6,
  rusty: 6,
};

/**
 * Tope de cuotas para el COBRO (payment_methods.installments de Mercado Pago).
 *
 * Mercado Pago aplica UN solo número de cuotas a todo el pago, y la promo de 6
 * sin interés vive en la cuenta (vale para toda venta). Para que solo Vulk y
 * Rusty den 6 sin interés:
 *   - carrito con SOLO marcas de `INTEREST_FREE_INSTALLMENTS_BY_BRAND` →
 *     `undefined` (sin tope: valen las 6 sin interés de la cuenta);
 *   - cualquier otra marca en el carrito (incluido un carrito mixto) → tope de
 *     `INTEREST_FREE_INSTALLMENTS` (3). Decisión del founder 2026-11-12
 *     (opción A del carrito mixto).
 * Acepta slug o nombre de marca (los pedidos viejos solo guardan el nombre).
 * Marca desconocida/ausente → tope 3 (lado conservador).
 */
export function maxInstallmentsForBrands(
  brands: ReadonlyArray<string | null | undefined>,
): number | undefined {
  if (brands.length === 0) return INTEREST_FREE_INSTALLMENTS;
  const allEligible = brands.every(
    (b) =>
      !!b &&
      Object.hasOwn(INTEREST_FREE_INSTALLMENTS_BY_BRAND, b.trim().toLowerCase()),
  );
  return allEligible ? undefined : INTEREST_FREE_INSTALLMENTS;
}

/** true si el carrito MEZCLA marcas de 6 cuotas (Vulk/Rusty) con otras: ahí
 * el cobro queda con tope de 3 y la UI debe avisarlo. */
export function cartHasMixedInstallmentBrands(
  brands: ReadonlyArray<string | null | undefined>,
): boolean {
  const eligible = brands.filter(
    (b) =>
      !!b &&
      Object.hasOwn(INTEREST_FREE_INSTALLMENTS_BY_BRAND, b.trim().toLowerCase()),
  ).length;
  return eligible > 0 && eligible < brands.length;
}

/** Cuotas sin interés a publicitar para un producto de esa marca. */
export function interestFreeInstallmentsFor(
  brandSlug: string | null | undefined,
): number {
  if (!brandSlug) return INTEREST_FREE_INSTALLMENTS;
  return INTEREST_FREE_INSTALLMENTS_BY_BRAND[brandSlug] ?? INTEREST_FREE_INSTALLMENTS;
}

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
export const INSTALLMENTS_ENABLED = true;

/**
 * Monto (en centavos) de cada cuota sin interés para un precio dado.
 * Redondeado al peso más cercano.
 */
export function installmentAmountCents(
  priceCents: number,
  installments: number = INTEREST_FREE_INSTALLMENTS,
): number {
  return Math.round(priceCents / installments);
}
