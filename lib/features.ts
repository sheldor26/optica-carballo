/**
 * Feature flags del proyecto.
 *
 * Convención: env vars `NEXT_PUBLIC_*_ENABLED` con valor `'true'` para
 * habilitar. Cualquier otro valor (o ausente) → deshabilitada.
 *
 * Por qué public env vars: la lógica de mostrar/ocultar UI corre en
 * Server Components renderizados en build / request — la env tiene que
 * ser leída de ambos lados (server + client si hace falta hidratar).
 *
 * Cada flag es un toggle binario. Si necesitamos progressive rollouts /
 * A-B tests, migramos a una herramienta dedicada (GrowthBook, Statsig).
 */

/**
 * Cuando es `true`:
 *   - Se muestran botones "Agregar al carrito" inline por variante.
 *   - CartBadge aparece en el header.
 *   - /carrito habilita el CTA "Iniciar compra" → /checkout.
 *   - /checkout funciona (cuando exista — sub-feature 2b).
 *
 * Cuando es `false` / ausente:
 *   - Los botones por variante son "Consultar por WhatsApp".
 *   - CartBadge oculto.
 *   - /carrito muestra empty state genérico sin link a checkout.
 *   - /checkout devuelve 404 (cuando exista).
 *
 * Activar en producción: setear `NEXT_PUBLIC_CHECKOUT_ENABLED=true` en
 * Vercel Environment Variables (Production) + redeploy.
 *
 * Activar en dev local: agregar a `.env.local` y reiniciar `pnpm dev`.
 */
export function isCheckoutEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === 'true';
}
