/**
 * Talle/calce del armazón (size fit). Indica modelos pensados para un tamaño
 * particular — hoy "junior" (calce pequeño, rostros chicos). Data-driven desde
 * `products.attributes.size_fit`.
 *
 * Single source of truth para derivar + etiquetar el badge de talle, usado
 * tanto en la PDP como en las cards del catálogo (pipeline central, regla 15).
 */

export type SizeFit = 'junior' | 'chico' | 'infantil';

const SIZE_FIT_VALUES: readonly SizeFit[] = ['junior', 'chico', 'infantil'];

/** Label visible del badge por talle. Español argentino de óptica.
 * `chico`: armazón pequeño para rostros chicos (NO infantil, a diferencia de
 * "junior") — agregado para Rusty Misty (founder pidió énfasis fuerte por
 * reclamos de talle).
 * `infantil`: agregado 2026-09-29 para Rusty K12, primer armazón realmente
 * para niños/as del catálogo — el founder pidió explícito un badge nuevo
 * ("para niños") en vez de reusar "junior" (que hasta ahora sólo se había
 * definido en el tipo, nunca asignado a un producto real, y el propio
 * comentario de `chico` lo dejaba ambiguo si "junior" ya implicaba infantil
 * o no — mejor no asumir). */
export const SIZE_FIT_LABELS: Record<SizeFit, string> = {
  junior: 'Talle Junior',
  chico: 'Talle chico',
  infantil: 'Para niños/as',
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
