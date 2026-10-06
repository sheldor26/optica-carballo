/**
 * Etiqueta legible de una variante a partir de sus `attributes` (frame_color,
 * lens_color, size, model_code). Compartido entre el selector de variantes
 * de la PDP y el detalle de pedido (admin + cliente) — mismo dato,
 * mismo criterio de lectura en todos lados.
 */

export type VariantAttributesJson = Record<string, unknown>;

const FRAME_COLOR_LABELS: Record<string, string> = {
  negro: 'Negro',
  // Reef 183 Bolero (seed 163): un slug nuevo; negro-brillo, negro-mate, marron-transparente y gris-oscuro-transparente ya existen.
  'negro-mate-detalle-naranja': 'Negro mate con detalle naranja',
  // Reef 188 Octopus (seed 159): dos slugs nuevos; negro-brillo, gris-oscuro y marron ya existen.
  'negro-mate-patillas-azules': 'Negro mate con patillas azules',
  'marron-brillo-patillas-marron-crema': 'Marrón brillo con patillas marrón y crema',
  // Reef 177 Aerial (seed 158): un slug nuevo; negro-mate, negro-brillo, gris-oscuro y azul-espejado ya existen.
  'azul-mate-detalles-celestes': 'Azul mate con detalles celestes',
  // Reef 129 Yang (seed 157): sólo 2 slugs nuevos; los demás se reutilizan del 128 (describen la apariencia).
  'gris-oscuro-mate-patillas-plateadas': 'Gris oscuro mate con patillas plateadas',
  'plateado-mate-patillas-plateadas': 'Plateado mate con patillas plateadas',
  // Reef 128 Yin (seed 156): el color se nombra por frente + patillas porque cambian juntos.
  'peltre-patillas-plateadas': 'Peltre con patillas plateadas',
  'peltre-patillas-gris-claro-mate': 'Peltre con patillas gris claro mate',
  'peltre-patillas-negras': 'Peltre con patillas negras',
  'negro-patillas-negro-azul': 'Negro con patillas negro y azul',
  'plateado-patillas-negras': 'Plateado con patillas negras',
  'plateado-patillas-negras-logo-naranja': 'Plateado con patillas negras y logo naranja',
  'dorado-brillo-patillas-plateadas': 'Dorado brillo con patillas plateadas',
  'dorado-mate-patillas-plateadas': 'Dorado mate con patillas plateadas',
  'negro-mate': 'Negro mate',
  'negro-brillo': 'Negro brillo',
  'negro-satinado': 'Negro satinado',
  carey: 'Carey',
  'carey-mate-y-negro-mate': 'Frente carey mate / patillas negro mate',
  'negro-brillo-carey': 'Frente negro brillo / patillas carey',
  'steelblue-negro-mate': 'Frente azul acero / patillas negro mate',
  transparente: 'Transparente',
  'transparente-patillas-negras': 'Frente transparente / patillas negras',
  'gris-transparente': 'Gris transparente',
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
  'negro-mate-y-gris-translucido': 'Frente negro mate / patillas gris translúcido',
  'azul-mate-y-turquesa': 'Frente azul mate / patillas turquesa',
  'transparente-y-negro-blanco': 'Frente transparente / patillas negro y blanco jaspeado',
  'azul-oscuro-mate-y-celeste': 'Frente azul oscuro mate / patillas celeste',
  'gris-turquesa-degrade': 'Gris a turquesa degradé',
  'gris-mate-y-naranja': 'Frente gris mate / patillas naranja',
  'azul-translucido': 'Azul translúcido',
  'negro-mate-detalles-marron': 'Negro mate con detalles marrón',
  sienna: 'Sienna transparente',
  cristal: 'Cristal transparente',
  'negro-mate-detalle-azul': 'Negro mate con detalle en varilla azul',
  'negro-mate-translucido': 'Negro mate translúcido',
  'verde-oliva': 'Verde oliva',
  'azul-oscuro': 'Azul oscuro',
  'azul-mate-translucido': 'Azul mate translúcido',
  'negro-mate-gris': 'Negro mate con gris',
  'rosa-translucido': 'Rosa translúcido',
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
  'celeste-degrade': 'Celeste degradé',
  'naranja-degrade': 'Naranja degradé',
  'azul-degrade': 'Azul degradé',
  'azul-espejado': 'Azul espejado',
  'espejado-azul': 'Azul espejado',
  espejado: 'Espejado',
  // `espejado-rojo` ya lo usaba el Blozon (seed 96) sin entrada acá: caía al
  // fallback de title-case y renderizaba "Espejado Rojo" en vez de "Rojo espejado".
  'espejado-rojo': 'Rojo espejado',
  'espejado-dorado': 'Dorado espejado',
  'espejado-naranja': 'Naranja espejado',
  'verde-g15': 'Verde G15',
  'rojo-degrade': 'Rojo degradé',
  'espejado-celeste': 'Celeste espejado',
  'espejado-verde': 'Verde espejado',
  'gris-semi-espejado': 'Gris semi-espejado',
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
