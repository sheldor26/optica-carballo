type AttributesJson = Record<string, unknown>;

const FRAME_MATERIAL_LABELS: Record<string, string> = {
  acetate: 'Acetato',
  metal: 'Metal',
  injected: 'Inyectado',
  titanium: 'Titanio',
  'g-flex': 'G-Flex (termoplástico Vulk)',
  'tr-90': 'TR-90',
};

const FRAME_SHAPE_LABELS: Record<string, string> = {
  wayfarer: 'Wayfarer',
  aviator: 'Aviador',
  round: 'Redondo',
  square: 'Cuadrado',
  rectangular: 'Rectangular',
  cat_eye: 'Cat eye',
  oversized: 'Oversized',
};

const LENS_TREATMENT_LABELS: Record<string, string> = {
  polarized: 'Polarizado',
  uv400: 'Protección UV400',
  gradient: 'Lente degradé',
  mirrored: 'Espejado',
  photochromic: 'Fotocromático',
};

const GENDER_LABELS: Record<string, string> = {
  unisex: 'Unisex',
  male: 'Hombre',
  female: 'Mujer',
};

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const strings = value.filter(
    (v): v is string => typeof v === 'string' && v.length > 0,
  );
  return strings.length > 0 ? strings : null;
}

function lookup(map: Record<string, string>, key: string | null): string | null {
  if (!key) return null;
  return map[key] ?? null;
}

export function ProductAttributes({ attributes }: { attributes: AttributesJson }) {
  const frameMaterial = lookup(FRAME_MATERIAL_LABELS, asString(attributes.frame_material));
  const frameShape = lookup(FRAME_SHAPE_LABELS, asString(attributes.frame_shape));
  const lensTreatments = asStringArray(attributes.lens_treatment)
    ?.map((k) => LENS_TREATMENT_LABELS[k])
    .filter((v): v is string => Boolean(v));
  const gender = lookup(GENDER_LABELS, asString(attributes.gender));

  const weightGrams =
    typeof attributes.weight_grams === 'number' ? attributes.weight_grams : null;

  const rows: { label: string; value: string }[] = [];
  if (frameMaterial) rows.push({ label: 'Material', value: frameMaterial });
  if (frameShape) rows.push({ label: 'Forma', value: frameShape });
  if (lensTreatments && lensTreatments.length > 0) {
    rows.push({ label: 'Lente', value: lensTreatments.join(', ') });
  }
  if (gender) rows.push({ label: 'Género', value: gender });
  if (weightGrams !== null) rows.push({ label: 'Peso', value: `${weightGrams} g` });

  if (rows.length === 0) return null;

  return (
    <div>
      <h2 className="text-foreground text-sm font-semibold tracking-tight">
        Ficha técnica
      </h2>
      <dl className="text-muted-foreground mt-3 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="font-medium">{row.label}</dt>
            <dd className="text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
