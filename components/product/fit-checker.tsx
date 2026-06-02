'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Pencil, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BRIDGE_RANGE,
  compareFit,
  FIT_VERDICT_LABELS,
  FIT_VERDICT_TONE,
  LENS_WIDTH_RANGE,
  productFitReference,
  type FitReference,
} from '@/lib/catalog/fit-compare';

const STORAGE_KEY = 'oc:fit-reference-v1';

const TONE_CLASSES: Record<'good' | 'mild' | 'warn', string> = {
  good: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
  mild: 'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200',
  warn: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
};

function readStoredReference(): FitReference | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FitReference>;
    if (
      typeof parsed.lensWidthMm === 'number' &&
      typeof parsed.bridgeMm === 'number'
    ) {
      return { lensWidthMm: parsed.lensWidthMm, bridgeMm: parsed.bridgeMm };
    }
  } catch {
    /* localStorage no disponible o JSON corrupto → sin referencia */
  }
  return null;
}

/**
 * Comparador de calce ("¿te va a quedar bien?"). El usuario ingresa el grabado
 * (calibre + puente) de unos anteojos que YA usa y le calzan bien; guardamos
 * esa referencia en el navegador y la comparamos contra cada modelo.
 *
 * Devuelve null si este modelo no tiene calibre + puente cargados.
 */
export function FitChecker({
  attributes,
}: {
  attributes: Record<string, unknown>;
}) {
  const productRef = productFitReference(attributes);

  const [loaded, setLoaded] = useState(false);
  const [reference, setReference] = useState<FitReference | null>(null);
  const [editing, setEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [lensInput, setLensInput] = useState('');
  const [bridgeInput, setBridgeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCalc, setShowCalc] = useState(false);
  const [showMeasure, setShowMeasure] = useState(false);

  useEffect(() => {
    const stored = readStoredReference();
    setReference(stored);
    if (stored) {
      setLensInput(String(stored.lensWidthMm));
      setBridgeInput(String(stored.bridgeMm));
    }
    setLoaded(true);
  }, []);

  // Este modelo no participa (sin calibre/puente). Tampoco renderizar antes de
  // leer localStorage para evitar parpadeo / mismatch de hidratación.
  if (!productRef || !loaded) return null;

  function handleSave() {
    const lens = Number(lensInput.replace(',', '.'));
    const bridge = Number(bridgeInput.replace(',', '.'));

    if (
      !Number.isFinite(lens) ||
      lens < LENS_WIDTH_RANGE.min ||
      lens > LENS_WIDTH_RANGE.max
    ) {
      setError(
        `El calibre suele estar entre ${LENS_WIDTH_RANGE.min} y ${LENS_WIDTH_RANGE.max} mm.`,
      );
      return;
    }
    if (
      !Number.isFinite(bridge) ||
      bridge < BRIDGE_RANGE.min ||
      bridge > BRIDGE_RANGE.max
    ) {
      setError(
        `El puente suele estar entre ${BRIDGE_RANGE.min} y ${BRIDGE_RANGE.max} mm.`,
      );
      return;
    }

    const ref: FitReference = { lensWidthMm: lens, bridgeMm: bridge };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ref));
    } catch {
      /* sin persistencia, pero igual mostramos el resultado en esta sesión */
    }
    setReference(ref);
    setEditing(false);
    setError(null);
  }

  // --- Estado con referencia guardada: mostrar veredicto ---
  if (reference && !editing) {
    const result = compareFit(reference, productRef);
    const tone = FIT_VERDICT_TONE[result.verdict];
    const diffAbs = Math.abs(result.diffMm);

    return (
      <div>
        <h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.15em]">
          ¿Te va a quedar bien?
        </h2>
        <div className={`mt-3 rounded-lg border px-4 py-3 ${TONE_CLASSES[tone]}`}>
          <div className="flex items-start gap-2.5">
            <Ruler className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {FIT_VERDICT_LABELS[result.verdict]}
              </p>
              <p className="mt-0.5 text-xs opacity-90">
                {result.verdict === 'similar'
                  ? `Ancho casi igual a tus anteojos (${diffAbs} mm de diferencia).`
                  : `Este modelo es ${diffAbs} mm ${
                      result.diffMm > 0 ? 'más ancho' : 'más angosto'
                    } que tu referencia (${result.referenceWidthMm} mm).`}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowCalc((s) => !s)}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] underline-offset-2 hover:underline"
          >
            <ChevronDown
              className={`size-3.5 transition-transform ${showCalc ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
            ¿Cómo lo calculamos?
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setError(null);
            }}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] underline-offset-2 hover:underline"
          >
            <Pencil className="size-3" aria-hidden="true" />
            Editar mi medida
          </button>
        </div>

        {showCalc && (
          <div className="border-border text-muted-foreground mt-2 space-y-2 rounded-lg border border-dashed p-3 text-xs leading-relaxed">
            <p>
              Medimos el <strong>ancho del frente</strong>: los dos lentes más
              el puente del medio.
            </p>
            <dl className="space-y-1">
              <div className="flex items-baseline justify-between gap-3">
                <dt>Tus anteojos</dt>
                <dd className="text-foreground font-mono tabular-nums">
                  {reference.lensWidthMm} + {reference.lensWidthMm} +{' '}
                  {reference.bridgeMm} = {result.referenceWidthMm} mm
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt>Este modelo</dt>
                <dd className="text-foreground font-mono tabular-nums">
                  {productRef.lensWidthMm} + {productRef.lensWidthMm} +{' '}
                  {productRef.bridgeMm} = {result.productWidthMm} mm
                </dd>
              </div>
              <div className="border-border/60 flex items-baseline justify-between gap-3 border-t pt-1">
                <dt className="text-foreground font-medium">Diferencia</dt>
                <dd className="text-foreground font-mono font-medium tabular-nums">
                  {diffAbs} mm {result.diffMm > 0 ? 'más ancho' : 'más angosto'}
                </dd>
              </div>
            </dl>
            <p className="text-[11px]">
              Calibre y puente son los dos primeros números grabados en la
              patilla (ej. <span className="font-mono">52▢18</span>).
            </p>
          </div>
        )}

        <p className="text-muted-foreground mt-2 text-[11px]">
          Orientativo — el calce también depende del puente y la patilla.
        </p>
      </div>
    );
  }

  // --- Estado sin referencia / editando: formulario ---
  return (
    <div>
      <h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.15em]">
        ¿Te va a quedar bien?
      </h2>
      <div className="border-border mt-3 rounded-lg border p-4">
        <p className="text-foreground text-sm">
          Comparalo con unos anteojos que ya usás y te quedan cómodos. Ingresá
          su <strong>calibre</strong> y <strong>puente</strong> (los vas a
          encontrar grabados en la patilla).
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <button
            type="button"
            onClick={() => setShowHelp((s) => !s)}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs underline-offset-2 hover:underline"
          >
            <ChevronDown
              className={`size-3.5 transition-transform ${showHelp ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
            ¿Dónde lo leo?
          </button>
          <button
            type="button"
            onClick={() => setShowMeasure((s) => !s)}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs underline-offset-2 hover:underline"
          >
            <ChevronDown
              className={`size-3.5 transition-transform ${showMeasure ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
            ¿No encontrás las medidas?
          </button>
        </div>
        {showHelp && (
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            En la parte interna de la patilla suele haber tres números, por
            ejemplo <span className="text-foreground font-mono">52▢18 140</span>
            . El primero es el <strong>calibre</strong> (52), el segundo el{' '}
            <strong>puente</strong> (18) y el tercero el largo de la patilla
            (140, no lo necesitamos acá).
          </p>
        )}
        {showMeasure && (
          <div className="text-muted-foreground mt-2 space-y-1.5 text-xs leading-relaxed">
            <p>
              En anteojos viejos el grabado a veces se borra. Si no lo
              encontrás, medilos con una <strong>regla en milímetros</strong>:
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                <strong>Calibre</strong>: el ancho de <strong>un</strong> lente
                solo, de borde a borde en horizontal, en su parte más ancha.
              </li>
              <li>
                <strong>Puente</strong>: la separación entre los dos lentes (el
                espacio que queda sobre la nariz), de un aro al otro.
              </li>
            </ul>
            <p>
              Es una medida aproximada, pero alcanza perfecto para comparar el
              calce.
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium">
              Calibre (mm)
            </span>
            <Input
              type="number"
              inputMode="numeric"
              min={LENS_WIDTH_RANGE.min}
              max={LENS_WIDTH_RANGE.max}
              placeholder="52"
              value={lensInput}
              onChange={(e) => setLensInput(e.target.value)}
              className="w-24"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium">
              Puente (mm)
            </span>
            <Input
              type="number"
              inputMode="numeric"
              min={BRIDGE_RANGE.min}
              max={BRIDGE_RANGE.max}
              placeholder="18"
              value={bridgeInput}
              onChange={(e) => setBridgeInput(e.target.value)}
              className="w-24"
            />
          </label>
          <Button type="button" onClick={handleSave} className="h-10">
            <Check className="size-4" aria-hidden="true" />
            Ver calce
          </Button>
        </div>

        {error && (
          <p className="text-destructive mt-2 text-xs">{error}</p>
        )}
      </div>
    </div>
  );
}
