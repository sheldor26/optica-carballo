type AttributesJson = Record<string, unknown>;

type MeasurementRow = { label: string; valueMm: number };

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function ProductMeasurements({
  attributes,
}: {
  attributes: AttributesJson;
}) {
  const raw = attributes.measurements;
  if (raw === null || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;

  const rows: MeasurementRow[] = [];

  const anchoTotal = asNumber(m.frame_width_mm);
  if (anchoTotal !== null) rows.push({ label: 'Ancho total', valueMm: anchoTotal });

  const alturaTotal = asNumber(m.lens_height_mm);
  if (alturaTotal !== null) rows.push({ label: 'Altura total', valueMm: alturaTotal });

  const puente = asNumber(m.bridge_mm);
  if (puente !== null) rows.push({ label: 'Puente', valueMm: puente });

  const calibre = asNumber(m.lens_width_mm);
  if (calibre !== null) rows.push({ label: 'Calibre del aro', valueMm: calibre });

  const patillas = asNumber(m.temple_length_mm);
  if (patillas !== null) rows.push({ label: 'Largo de las patillas', valueMm: patillas });

  if (rows.length === 0) return null;

  return (
    <div>
      <h2 className="text-foreground text-sm font-semibold tracking-tight">
        Medidas
      </h2>
      <dl className="text-muted-foreground mt-3 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="font-medium">{row.label}</dt>
            <dd className="text-foreground">{row.valueMm} mm</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
