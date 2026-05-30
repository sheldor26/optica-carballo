'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Edit2, Glasses, X } from 'lucide-react';
import {
  clearPrescriptionCookie,
  getPrescriptionFromCookie,
} from '@/lib/prescription-cookie/actions';
import type { PrescriptionCookie } from '@/lib/prescription-cookie/types';

/**
 * Banner que indica al usuario que tiene una receta cargada de su sesión
 * con el lector IA. Se renderiza en `/anteojos-de-receta` y PDPs de receta.
 *
 * Client component a propósito: lee la cookie via server action en mount
 * (useEffect) para no romper el cache ISR de las páginas server donde se
 * monta (la cookie es per-user; si el server SSR la leyera, todos los
 * usuarios verían la receta del primer visitante cacheada).
 *
 * Trade-off: el banner aparece después de hydration (no en el HTML inicial).
 * En la práctica el flash es imperceptible si el user viene del lector
 * (cache warm). Si afecta UX, escalar a Suspense + PPR en iter futura.
 *
 * NUNCA loguear `prescription` en consola — datos médicos sensibles (LPDP).
 */
export function PrescriptionBanner() {
  const [prescription, setPrescription] = useState<PrescriptionCookie | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    getPrescriptionFromCookie().then((result) => {
      if (!cancelled) setPrescription(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (prescription === null) return null;

  const onClear = () => {
    startTransition(async () => {
      await clearPrescriptionCookie();
      setPrescription(null);
    });
  };

  return (
    <div className="container mt-6">
      <aside
        aria-labelledby="prescription-banner-heading"
        className="border-brand/25 bg-brand/5 rounded-xl border p-4 md:p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-brand/15 flex size-10 shrink-0 items-center justify-center rounded-full">
            <Glasses className="text-brand size-5" />
          </div>
          <div>
            <h2
              id="prescription-banner-heading"
              className="text-foreground text-sm font-semibold"
            >
              Tu receta está cargada
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              La usamos cuando armemos tus anteojos.
            </p>
            <PrescriptionSummary prescription={prescription} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/lector-de-receta"
            className="border-border text-foreground hover:bg-background inline-flex items-center gap-1.5 rounded-md border bg-transparent px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <Edit2 className="size-3.5" />
            Editar
          </Link>
          <button
            type="button"
            onClick={onClear}
            disabled={pending}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-md bg-transparent px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
            aria-label="Quitar receta cargada"
          >
            <X className="size-3.5" />
            {pending ? 'Quitando…' : 'Quitar'}
          </button>
        </div>
        </div>
      </aside>
    </div>
  );
}

function PrescriptionSummary({
  prescription,
}: {
  prescription: PrescriptionCookie;
}) {
  const od = formatEye(prescription.od);
  const oi = formatEye(prescription.oi);
  const dnp =
    prescription.dnp !== null ? ` · DNP ${prescription.dnp} mm` : '';

  return (
    <p className="text-foreground mt-2 font-mono text-xs tabular-nums">
      OD: {od} · OI: {oi}
      {dnp}
    </p>
  );
}

function formatEye(eye: {
  esf: number | null;
  cil: number | null;
  eje: number | null;
}): string {
  const esf =
    eye.esf === null
      ? '—'
      : eye.esf === 0
        ? '0.00'
        : `${eye.esf > 0 ? '+' : ''}${eye.esf.toFixed(2)}`;
  if (eye.cil === null || eye.cil === 0) return esf;
  const cil = eye.cil.toFixed(2);
  const eje = eye.eje !== null ? ` × ${eye.eje}°` : '';
  return `${esf} / ${cil}${eje}`;
}
