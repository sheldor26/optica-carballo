/**
 * Etiqueta legible de una variante a partir de sus `attributes` (frame_color,
 * lens_color, size, model_code). Compartido entre el selector de variantes
 * de la PDP y el detalle de pedido (admin + cliente) — mismo dato,
 * mismo criterio de lectura en todos lados.
 */

export type VariantAttributesJson = Record<string, unknown>;

const FRAME_COLOR_LABELS: Record<string, string> = {
  negro: 'Negro',
  'negro-mate': 'Negro mate',
  'negro-brillo': 'Negro brillo',
  'negro-satinado': 'Negro satinado',
  carey: 'Carey',
  'carey-mate-y-negro-mate': 'Frente carey mate / patillas negro mate',
  'negro-brillo-carey': 'Frente negro brillo / patillas carey',
  'steelblue-negro-mate': 'Frente azul acero / patillas negro mate',
  transparente: 'Transparente',
  'azul-mate': 'Azul mate',
  'gris-oscuro-transparente': 'Gris oscuro transparente',
  'azul-metalico': 'Azul metálico',
  'rosa-transparente': 'Rosa transparente',
  'carey-oscuro': 'Carey oscuro',
  dorado: 'Dorado',
  plata: 'Plata',
  azul: 'Azul',
  marron: 'Marrón',
  blanco: 'Blanco',
  rojo: 'Rojo',
  verde: 'Verde',
};

const LENS_COLOR_LABELS: Record<string, string> = {
  gris: 'Gris',
  marron: 'Marrón',
  verde: 'Verde',
  azul: 'Azul',
  'marron-degrade': 'Marrón degradé',
  'gris-degrade': 'Gris degradé',
  'verde-degrade': 'Verde degradé',
  'gris-oscuro': 'Gris oscuro',
  'azul-espejado': 'Azul espejado',
  'espejado-azul': 'Azul espejado',
  espejado: 'Espejado',
};

function toTitleCase(s: string): string {
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function lookup(map: Record<string, string>, key: unknown): string | null {
  if (typeof key !== 'string') return null;
  if (map[key]) return map[key];
  return toTitleCase(key);
}

export function describeVariant(attrs: VariantAttributesJson): string {
  const frame = lookup(FRAME_COLOR_LABELS, attrs.frame_color);
  const lens = lookup(LENS_COLOR_LABELS, attrs.lens_color);
  const size = typeof attrs.size === 'string' ? attrs.size : null;
  const parts = [frame, lens, size].filter((v): v is string => Boolean(v));
  return parts.length > 0 ? parts.join(' / ') : 'Variante';
}

/** Código de modelo del fabricante (C1/C2/GB10/etc), si el producto lo tiene. */
export function extractDisplayCode(attrs: VariantAttributesJson): string | null {
  const code = attrs.model_code;
  if (typeof code !== 'string' || code.trim().length === 0) return null;
  return code.trim();
}
