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
  'marron-transparente': 'Marrón transparente',
  'rosa-oscuro': 'Rosa oscuro',
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
  'gris-oscuro-degrade': 'Gris oscuro degradé',
  'sepia-degrade': 'Sepia degradé',
  'verde-oscuro': 'Verde oscuro',
  'naranja-degrade': 'Naranja degradé',
  'azul-degrade': 'Azul degradé',
  'azul-espejado': 'Azul espejado',
  'espejado-azul': 'Azul espejado',
  espejado: 'Espejado',
  // `espejado-rojo` ya lo usaba el Blozon (seed 96) sin entrada acá: caía al
  // fallback de title-case y renderizaba "Espejado Rojo" en vez de "Rojo espejado".
  'espejado-rojo': 'Rojo espejado',
  'espejado-dorado': 'Dorado espejado',
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
  // Cuarto slot, opcional: para cuando dos variantes comparten frente Y lente y
  // sólo las separa un tratamiento.
  //
  // Hoy NO lo usa ningún producto, y hay una razón que conviene leer antes de
  // volver a usarlo. Se agregó para el Vulk The Guardian, que tiene dos colorways
  // idénticas (las dos "Negro mate / Gris oscuro", una polarizada y la otra no,
  // con $8.720 de diferencia). El founder lo sacó mirando la fila renderizada: en
  // la UI real cada fila ya muestra el badge POLARIZADO, el `model_code`
  // (MBLK/S10 POL vs MBLK/S10), el SKU y el precio. Con cuatro diferenciadores,
  // la nota sólo alargaba la etiqueta.
  //
  // O sea: antes de usar este slot, mirar la fila renderizada, no sólo los campos
  // que componen la etiqueta. El umbral real es que las variantes compartan TODO
  // lo que se ve, no sólo frente y lente.
  //
  // `size` NO sirve para esto: es el slot de talle, y ensuciarlo hace que después
  // alguien lea "polarizada" como si fuera un talle.
  const note = typeof attrs.variant_note === 'string' ? attrs.variant_note : null;
  const parts = [frame, lens, size, note].filter((v): v is string => Boolean(v));
  return parts.length > 0 ? parts.join(' / ') : 'Variante';
}

/** Código de modelo del fabricante (C1/C2/GB10/etc), si el producto lo tiene. */
export function extractDisplayCode(attrs: VariantAttributesJson): string | null {
  const code = attrs.model_code;
  if (typeof code !== 'string' || code.trim().length === 0) return null;
  return code.trim();
}
