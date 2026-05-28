/**
 * Política universal de inclusión por compra.
 * Source of truth: BUSINESS_POLICIES.md sección "Lo que incluye TODA compra".
 *
 * Cada producto vendido por Óptica Carballo incluye por defecto estos 3 ítems.
 * Un producto puede override esto via `attributes.includes_override` (jsonb)
 * — si está presente y es un array de strings, reemplaza la default.
 */

export type ProductInclude = {
  key: string;
  label: string;
  description: string;
};

export const DEFAULT_PRODUCT_INCLUDES: readonly ProductInclude[] = [
  {
    key: 'case',
    label: 'Estuche original',
    description: 'De la marca del producto, oficial del fabricante.',
  },
  {
    key: 'cloth',
    label: 'Franela de microfibra',
    description: 'Para limpieza segura del cristal.',
  },
  {
    key: 'warranty',
    label: 'Garantía 1 año del fabricante',
    description: 'Contra defectos de fabricación. No cubre uso indebido ni golpes.',
  },
] as const;

/**
 * Devuelve los ítems incluidos de un producto. Si tiene
 * `attributes.includes_override` con un array de keys válidas, filtra la
 * lista default a esos ítems; si no, devuelve la lista entera.
 *
 * Si querés cambiar la lista global para todos los productos, editá
 * DEFAULT_PRODUCT_INCLUDES y BUSINESS_POLICIES.md.
 */
export function resolveProductIncludes(
  attributes: Record<string, unknown>,
): readonly ProductInclude[] {
  const override = attributes.includes_override;
  if (!Array.isArray(override)) return DEFAULT_PRODUCT_INCLUDES;
  const keys = new Set(
    override.filter((k): k is string => typeof k === 'string'),
  );
  if (keys.size === 0) return DEFAULT_PRODUCT_INCLUDES;
  return DEFAULT_PRODUCT_INCLUDES.filter((item) => keys.has(item.key));
}
