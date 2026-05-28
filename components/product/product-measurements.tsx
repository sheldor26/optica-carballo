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
      <h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.15em]">
        Medidas
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="border-border/60 from-muted/40 to-background hover:border-foreground/40 group relative overflow-hidden rounded-lg border bg-gradient-to-br px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <dt className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider leading-tight">
              {row.label}
            </dt>
            <dd className="text-foreground mt-1 flex items-baseline gap-1 text-lg font-bold leading-none tracking-tight">
              {row.valueMm}
              <span className="text-muted-foreground text-[10px] font-medium">
                mm
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
