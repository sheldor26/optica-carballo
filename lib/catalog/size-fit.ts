/**
 * Talle/calce del armazón (size fit). Indica modelos pensados para un tamaño
 * particular — hoy "junior" (calce pequeño, rostros chicos). Data-driven desde
 * `products.attributes.size_fit`.
 *
 * Single source of truth para derivar + etiquetar el badge de talle, usado
 * tanto en la PDP como en las cards del catálogo (pipeline central, regla 15).
 */

export type SizeFit = 'junior' | 'chico';

const SIZE_FIT_VALUES: readonly SizeFit[] = ['junior', 'chico'];

/** Label visible del badge por talle. Español argentino de óptica.
 * `chico`: armazón pequeño para rostros chicos (NO infantil, a diferencia de
 * "junior") — agregado para Rusty Misty (founder pidió énfasis fuerte por
 * reclamos de talle). */
export const SIZE_FIT_LABELS: Record<SizeFit, string> = {
  junior: 'Talle Junior',
  chico: 'Talle chico',
};

/**
 * Deriva el talle desde el JSONB `attributes` del producto. Devuelve null si
 * no está seteado o no es un valor conocido (no rompe si el dato viene sucio).
 */
export function deriveSizeFit(
  attributes: Record<string, unknown> | null | undefined,
): SizeFit | null {
  const raw = attributes?.size_fit;
  if (typeof raw !== 'string') return null;
  return SIZE_FIT_VALUES.includes(raw as SizeFit) ? (raw as SizeFit) : null;
}
