/**
 * Detecta si el nombre de un producto es un placeholder pendiente de
 * reemplazo (marcado con `[PH]` en el seed). Los productos placeholder
 * NO deben indexarse en Google ni aparecer en sitemap hasta que el
 * founder confirme nombres y precios reales.
 *
 * Cuando el seed se reemplace por data real, este check devuelve false
 * automáticamente sin necesidad de cambiar código.
 */
export function isPlaceholder(name: string): boolean {
  return name.includes('[PH]');
}
