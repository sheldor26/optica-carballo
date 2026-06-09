'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Ruler,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PDMeasureModal } from '@/components/tools/pd-measure-modal';
import { savePrescriptionToCookie } from '@/lib/prescription-cookie/actions';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

/**
 * Form manual de receta. Alternativa al lector IA para usuarios que
 * prefieren cargar los valores a mano (privacidad, ya conocen la receta,
 * la IA falló al parsear, etc.).
 *
 * Soporta SOLO monofocales sin patología. Casos complejos (bifocales,
 * alta graduación, contact lens, prismas) derivan a:
 * - Lector IA (`/lector-de-receta`) si es bifocal — el lector tiene flow
 *   de opciones lejos/cerca.
 * - WhatsApp para presencial si es alta graduación / patología.
 *
 * Decisión técnica: NO duplico lógica del lector. Si la receta cargada es
 * compleja, derivo al lector. Esto mantiene 1 source of truth para flows
 * complejos.
 */

// Rangos realistas para selects.
const ESF_OPTIONS = generateOptions(-20, 12, 0.25);
const CIL_OPTIONS = generateOptions(-6, 0, 0.25);
const ADD_OPTIONS = generateOptions(0.75, 3.5, 0.25);
const EJE_OPTIONS = (() => {
  const arr: number[] = [];
  for (let i = 1; i <= 180; i += 1) arr.push(i);
  return arr;
})();

function generateOptions(min: number, max: number, step: number): number[] {
  const arr: number[] = [];
  for (let v = min; v <= max + 0.001; v += step) {
    arr.push(Number(v.toFixed(2)));
  }
  return arr;
}

function formatSigned(n: number): string {
  if (n === 0) return '0.00';
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}`;
}

type EyeValues = {
  esf: number;
  cil: number;
  eje: number | null;
  add: number | null;
};

const DEFAULT_EYE: EyeValues = {
  esf: 0,
  cil: 0,
  eje: null,
  add: null,
};

export function ManualPrescriptionForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [sameBothEyes, setSameBothEyes] = useState(false);
  const [od, setOd] = useState<EyeValues>(DEFAULT_EYE);
  const [oi, setOi] = useState<EyeValues>(DEFAULT_EYE);
  const [dnp, setDnp] = useState<number | null>(null);
  const [noPrisms, setNoPrisms] = useState(false);
  const [validReceta, setValidReceta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routing, setRouting] = useState<
    | { kind: 'bifocal'; reason: string }
    | { kind: 'in_person'; reason: string }
    | null
  >(null);

  const onSameBothEyesChange = (checked: boolean) => {
    setSameBothEyes(checked);
    if (checked) setOi(od);
  };

  const updateOd = (patch: Partial<EyeValues>) => {
    const next = { ...od, ...patch };
    setOd(next);
    if (sameBothEyes) setOi(next);
  };

  const updateOi = (patch: Partial<EyeValues>) => {
    setOi({ ...oi, ...patch });
  };

  const dnpValid = dnp !== null && dnp >= 40 && dnp <= 80;
  const canSubmit = noPrisms && validReceta && dnpValid && !pending;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setRouting(null);

    // Detectar add presente — el form solo guarda monofocales.
    const hasAdd = od.add !== null || oi.add !== null;
    if (hasAdd) {
      setRouting({
        kind: 'bifocal',
        reason:
          'Tu receta tiene ADD (componente de cerca). El form manual sólo guarda monofocales. Usá el lector IA para opciones "anteojo de lejos" o "anteojo de cerca" por separado.',
      });
      return;
    }

    // Detectar alta graduación / patología.
    const inPersonReasons = evaluateBasicReasons(od, oi);
    if (inPersonReasons.length > 0) {
      setRouting({
        kind: 'in_person',
        reason: inPersonReasons[0]!,
      });
      return;
    }

    // Validación EJE: si hay cilindro, el eje es obligatorio.
    if (od.cil < 0 && od.eje === null) {
      setError('Tu OD tiene cilindro pero falta el eje. Ingresalo (1-180°).');
      return;
    }
    if (oi.cil < 0 && oi.eje === null) {
      setError('Tu OI tiene cilindro pero falta el eje. Ingresalo (1-180°).');
      return;
    }

    // OK — guardar a cookie.
    startTransition(async () => {
      const result = await savePrescriptionToCookie({
        type: 'monofocal',
        od: { esf: od.esf, cil: od.cil, eje: od.eje, add: null },
        oi: { esf: oi.esf, cil: oi.cil, eje: oi.eje, add: null },
        dnp,
        expirationDate: null,
        savedAt: Date.now(),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push('/anteojos-de-receta');
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SameEyesToggle checked={sameBothEyes} onChange={onSameBothEyesChange} />

      <div className="border-border/60 bg-background overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-border/60 bg-muted/30 border-b">
            <tr>
              <th className="text-muted-foreground p-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
              <th className="text-muted-foreground p-3 text-center text-xs font-semibold uppercase tracking-wider">
                ESF
              </th>
              <th className="text-muted-foreground p-3 text-center text-xs font-semibold uppercase tracking-wider">
                CIL
              </th>
              <th className="text-muted-foreground p-3 text-center text-xs font-semibold uppercase tracking-wider">
                EJE
              </th>
              <th className="text-muted-foreground p-3 text-center text-xs font-semibold uppercase tracking-wider">
                ADD
              </th>
            </tr>
          </thead>
          <tbody>
            <EyeRow label="OD" eye={od} onChange={updateOd} />
            <EyeRow
              label="OI"
              eye={oi}
              onChange={updateOi}
              disabled={sameBothEyes}
            />
          </tbody>
        </table>
      </div>

      <DnpField dnp={dnp} onChange={setDnp} />

      <ConfirmationCheckboxes
        noPrisms={noPrisms}
        validReceta={validReceta}
        onNoPrismsChange={setNoPrisms}
        onValidRecetaChange={setValidReceta}
      />

      {routing && <RoutingBlock routing={routing} />}

      {error && (
        <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4">
          <AlertCircle className="text-destructive mt-0.5 size-5 shrink-0" />
          <p className="text-foreground text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Guardando…
          </>
        ) : (
          <>
            Guardar receta y buscar anteojos
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function SameEyesToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="border-border/60 bg-background flex cursor-pointer items-center gap-3 rounded-lg border p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="border-border accent-brand size-4 shrink-0 rounded"
      />
      <span className="text-foreground text-sm">
        Misma graduación para ambos ojos
      </span>
    </label>
  );
}

function EyeRow({
  label,
  eye,
  onChange,
  disabled,
}: {
  label: string;
  eye: EyeValues;
  onChange: (patch: Partial<EyeValues>) => void;
  disabled?: boolean;
}) {
  return (
    <tr className="border-border/60 border-b last:border-b-0">
      <td className="text-foreground p-3 font-semibold">{label}</td>
      <td className="p-2">
        <select
          value={eye.esf}
          onChange={(e) => onChange({ esf: Number(e.target.value) })}
          disabled={disabled}
          className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-2 py-1.5 text-center text-sm tabular-nums outline-none transition-colors disabled:opacity-50"
        >
          {ESF_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {formatSigned(v)}
            </option>
          ))}
        </select>
      </td>
      <td className="p-2">
        <select
          value={eye.cil}
          onChange={(e) => {
            const nextCil = Number(e.target.value);
            // Si pasa a 0, limpiar eje.
            onChange({ cil: nextCil, ...(nextCil === 0 ? { eje: null } : {}) });
          }}
          disabled={disabled}
          className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-2 py-1.5 text-center text-sm tabular-nums outline-none transition-colors disabled:opacity-50"
        >
          {CIL_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {formatSigned(v)}
            </option>
          ))}
        </select>
      </td>
      <td className="p-2">
        <select
          value={eye.eje ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ eje: v === '' ? null : Number(v) });
          }}
          disabled={disabled || eye.cil === 0}
          className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-2 py-1.5 text-center text-sm tabular-nums outline-none transition-colors disabled:opacity-50"
        >
          <option value="">—</option>
          {EJE_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v}°
            </option>
          ))}
        </select>
      </td>
      <td className="p-2">
        <select
          value={eye.add ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ add: v === '' ? null : Number(v) });
          }}
          disabled={disabled}
          className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-2 py-1.5 text-center text-sm tabular-nums outline-none transition-colors disabled:opacity-50"
        >
          <option value="">—</option>
          {ADD_OPTIONS.map((v) => (
            <option key={v} value={v}>
              +{v.toFixed(2)}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

function DnpField({
  dnp,
  onChange,
}: {
  dnp: number | null;
  onChange: (next: number | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-border/60 bg-background rounded-xl border p-4">
      <label
        htmlFor="dnp-input"
        className="text-foreground text-xs font-semibold uppercase tracking-wide"
      >
        DNP (Distancia Naso-Pupilar) en mm
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          id="dnp-input"
          type="number"
          min="50"
          max="78"
          step="0.5"
          value={dnp ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '') {
              onChange(null);
              return;
            }
            const num = Number(v);
            if (Number.isFinite(num)) onChange(num);
          }}
          placeholder="62"
          className="border-border focus:border-foreground/40 bg-background w-32 rounded-md border px-3 py-2 text-center text-base tabular-nums outline-none transition-colors"
        />
        <PDMeasureModal
          open={open}
          onOpenChange={setOpen}
          onMeasured={(measuredDnp) => onChange(measuredDnp)}
        >
          <button
            type="button"
            className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            <Ruler className="size-4" />
            Mide tu DNP con IA
          </button>
        </PDMeasureModal>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Rango típico: 54-74 mm. Si no la sabés, usá el medidor con IA.
      </p>
    </div>
  );
}

function ConfirmationCheckboxes({
  noPrisms,
  validReceta,
  onNoPrismsChange,
  onValidRecetaChange,
}: {
  noPrisms: boolean;
  validReceta: boolean;
  onNoPrismsChange: (v: boolean) => void;
  onValidRecetaChange: (v: boolean) => void;
}) {
  return (
    <div className="border-border/60 bg-background rounded-xl border p-4">
      <p className="text-foreground text-xs font-semibold uppercase tracking-wide">
        Confirmaciones obligatorias
      </p>
      <div className="mt-3 space-y-3">
        <label className="text-foreground flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={noPrisms}
            onChange={(e) => onNoPrismsChange(e.target.checked)}
            className="border-border accent-brand mt-0.5 size-4 shrink-0 rounded"
          />
          <span>Mi receta NO incluye valores de prisma.</span>
        </label>
        <label className="text-foreground flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={validReceta}
            onChange={(e) => onValidRecetaChange(e.target.checked)}
            className="border-border accent-brand mt-0.5 size-4 shrink-0 rounded"
          />
          <span>
            Los valores que cargué corresponden a una receta válida (no
            vencida) emitida por un oftalmólogo.
          </span>
        </label>
      </div>
    </div>
  );
}

function RoutingBlock({
  routing,
}: {
  routing:
    | { kind: 'bifocal'; reason: string }
    | { kind: 'in_person'; reason: string };
}) {
  if (routing.kind === 'bifocal') {
    return (
      <div className="border-brand/25 bg-brand/5 space-y-3 rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-brand mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-semibold">
              Tu receta tiene componente de cerca
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {routing.reason}
            </p>
          </div>
        </div>
        <Link
          href="/lector-de-receta"
          className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Ir al lector IA
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const whatsappLink = getWhatsappLinkWithContext(
    'Hola! Cargué mi receta manualmente en el sitio y necesito asesoramiento personalizado.',
  );

  return (
    <div className="border-border/60 bg-muted/20 space-y-3 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-brand mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-foreground text-sm font-semibold">
            Necesitás atención personalizada
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {routing.reason}
          </p>
        </div>
      </div>
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            'bg-emerald-600 text-white hover:bg-emerald-700',
          )}
        >
          <MessageCircle className="size-4" />
          Escribinos por WhatsApp
        </a>
      )}
    </div>
  );
}

/**
 * Detección básica de casos que requieren presencial.
 * Sin duplicar `evaluateInPerson` del lector — esta versión es solo para
 * casos sin ADD (que ya filtramos arriba).
 */
function evaluateBasicReasons(od: EyeValues, oi: EyeValues): string[] {
  const reasons: string[] = [];

  const odEsf = od.esf;
  const oiEsf = oi.esf;
  const odCil = od.cil;
  const oiCil = oi.cil;

  if (Math.abs(odEsf) > 6 || Math.abs(oiEsf) > 6) {
    reasons.push(
      'Tu receta tiene graduación esférica alta (>±6.00). Necesitamos medirte los anteojos en persona para asegurar el centrado.',
    );
  }
  if (Math.abs(odCil) > 2 || Math.abs(oiCil) > 2) {
    reasons.push(
      'Tu receta tiene cilindro alto (>2.00). Necesitamos medirte los anteojos en persona.',
    );
  }
  if (
    Math.abs(odEsf) + Math.abs(odCil) > 7 ||
    Math.abs(oiEsf) + Math.abs(oiCil) > 7
  ) {
    reasons.push(
      'La suma de esfera + cilindro supera 7.00 en alguno de tus ojos. Coordinamos medición presencial.',
    );
  }
  if (Math.abs(odEsf - oiEsf) >= 2) {
    reasons.push(
      'Hay anisometropía (diferencia >2.00 entre ojos). Coordinamos atención presencial.',
    );
  }

  return reasons;
}
