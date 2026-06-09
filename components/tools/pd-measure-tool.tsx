'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { updatePrescriptionDnpInCookie } from '@/lib/prescription-cookie/actions';
import {
  PD_MODE_LABELS,
  type PDMeasureMode,
  type PDResult,
} from '@/lib/pd-measure/types';

type State =
  | { kind: 'idle' }
  | { kind: 'preview'; previewUrl: string; file: File }
  | { kind: 'analyzing'; previewUrl: string }
  | { kind: 'result'; previewUrl: string; result: PDResult }
  | { kind: 'error'; message: string; previewUrl?: string };

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/webp';
const RESIZE_MAX_DIM = 1600;

/**
 * Resize a max 1600px lado mayor para reducir bandwidth + tokens vision.
 * Mantenemos 1600 (vs 1024 del face-shape) porque la medición de pupilas
 * y bordes de tarjeta necesita más resolución para precisión sub-mm.
 */
async function resizeImageIfNeeded(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      const maxDim = Math.max(width, height);
      if (maxDim <= RESIZE_MAX_DIM) {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
        return;
      }
      const scale = RESIZE_MAX_DIM / maxDim;
      const targetW = Math.round(width * scale);
      const targetH = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error('Could not resize'));
            return;
          }
          resolve(
            new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            }),
          );
        },
        file.type,
        0.92,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image'));
    };
    img.src = objectUrl;
  });
}

type Props = {
  /**
   * Callback opcional cuando se obtiene una DNP válida. Si está presente,
   * el ResultBlock muestra un botón adicional "Usar esta DNP" que dispara
   * el callback (sin guardar a cookie). Pensado para uso embebido en
   * forms — modal del medidor desde otro componente.
   *
   * Si no está presente, comportamiento default: botón "Guardar a mi receta"
   * que actualiza cookie de receta.
   */
  onResult?: (dnpMm: number) => void;
};

export function PDMeasureTool({ onResult }: Props = {}) {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [mode, setMode] = useState<PDMeasureMode>('simple');
  const [flags, setFlags] = useState({
    age_confirmed: false,
    no_strabismus: false,
    no_prisms: false,
    understands_progressive_limitation: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allFlagsChecked = Object.values(flags).every(Boolean);

  const handleFile = useCallback((file: File | null | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setState({
        kind: 'error',
        message: 'La imagen pesa más de 8MB. Probá con una más liviana.',
      });
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setState({
        kind: 'error',
        message: 'Formato no soportado. Usá JPG, PNG o WebP.',
      });
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setState({ kind: 'preview', previewUrl, file });
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const analyze = async () => {
    if (state.kind !== 'preview') return;
    if (!allFlagsChecked) return;
    const { previewUrl, file } = state;
    setState({ kind: 'analyzing', previewUrl });

    try {
      const resized = await resizeImageIfNeeded(file);
      const fd = new FormData();
      fd.append('image', resized);
      fd.append('flags', JSON.stringify(flags));
      fd.append('mode', mode);

      const res = await fetch('/api/measure-pd', {
        method: 'POST',
        body: fd,
      });

      const data = (await res.json()) as PDResult & { error?: string };
      if (!res.ok) {
        setState({
          kind: 'error',
          message: data.error ?? 'No pudimos analizar la foto. Probá de nuevo.',
          previewUrl,
        });
        return;
      }
      setState({ kind: 'result', previewUrl, result: data });
    } catch {
      setState({
        kind: 'error',
        message: 'Hubo un problema procesando tu foto. Probá de nuevo.',
        previewUrl,
      });
    }
  };

  const reset = () => {
    if ('previewUrl' in state && state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    setState({ kind: 'idle' });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait">
        {state.kind === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ModeSelector mode={mode} onChange={setMode} />
            <SetupInstructions mode={mode} />
            <FlagsForm flags={flags} onChange={setFlags} />
            <DropZone
              disabled={!allFlagsChecked}
              onDrop={onDrop}
              onClick={() =>
                allFlagsChecked && fileInputRef.current?.click()
              }
            />
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              onChange={onFileInput}
              className="sr-only"
              aria-label="Subir foto frontal con tarjeta de referencia"
            />
            <PrivacyNote />
          </motion.div>
        )}

        {state.kind === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <PreviewImage url={state.previewUrl} onClear={reset} />
            <Button size="lg" className="w-full" onClick={analyze}>
              Medir mi DNP
              <ArrowRight className="size-4" />
            </Button>
            <PrivacyNote />
          </motion.div>
        )}

        {state.kind === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="relative">
              <PreviewImage url={state.previewUrl} dimmed />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Loader2 className="text-brand size-10 animate-spin" />
                <p className="bg-background/90 text-foreground rounded-full px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
                  Midiendo tu DNP…
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {state.kind === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <ResultBlock
              result={state.result}
              previewUrl={state.previewUrl}
              onRetry={reset}
              onResult={onResult}
            />
          </motion.div>
        )}

        {state.kind === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4">
              <AlertCircle className="text-destructive mt-0.5 size-5 shrink-0" />
              <p className="text-foreground text-sm">{state.message}</p>
            </div>
            <Button size="lg" className="w-full" onClick={reset}>
              <RefreshCw className="size-4" />
              Probar de nuevo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModeSelector({
  mode,
  onChange,
}: {
  mode: PDMeasureMode;
  onChange: (next: PDMeasureMode) => void;
}) {
  return (
    <div className="border-border/60 bg-background rounded-xl border p-5">
      <h2 className="text-foreground text-sm font-semibold uppercase tracking-wide">
        Elegí cómo medir
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(['simple', 'precise'] as const).map((m) => {
          const labels = PD_MODE_LABELS[m];
          const isActive = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => onChange(m)}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                isActive
                  ? 'border-brand bg-brand/5'
                  : 'border-border bg-background hover:bg-muted/40',
              )}
              aria-pressed={isActive}
            >
              <p className="text-foreground text-sm font-semibold">
                {labels.name}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {labels.tagline}
              </p>
              <p className="text-muted-foreground mt-1.5 text-xs italic">
                {labels.precision}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SetupInstructions({ mode }: { mode: PDMeasureMode }) {
  const steps =
    mode === 'simple'
      ? [
          'Buena luz natural frontal. Sin sombras duras sobre la cara.',
          'Sacate los anteojos. Necesitamos ver tus pupilas reales.',
          (<>
            Apoyá una <strong>tarjeta de crédito o débito</strong> contra tu{' '}
            <strong>frente</strong>, sujetándola con dos dedos por las esquinas
            superiores.
          </>),
          'Sostené el celular a unos 40–60cm (a un brazo de distancia, no más).',
          'Mirá directo al lente de la cámara, no a la pantalla.',
        ]
      : [
          'Buena luz natural frontal. Sin sombras duras sobre la cara.',
          'Sacate los anteojos. Necesitamos ver tus pupilas reales.',
          (<>
            Apoyá una <strong>tarjeta de crédito o débito</strong> contra tus{' '}
            <strong>pómulos</strong> (debajo de los ojos, alineada con la base
            de la nariz).{' '}
            <em>Mismo plano vertical que tus pupilas.</em>
          </>),
          'Sostené el celular a unos 60–80cm (brazo extendido). Mejor si te ayuda otra persona.',
          'Mirá directo al lente de la cámara, no a la pantalla.',
        ];

  return (
    <div className="border-border/60 bg-muted/20 rounded-xl border p-5">
      <h2 className="text-foreground text-sm font-semibold uppercase tracking-wide">
        Antes de sacar la foto
      </h2>
      <ol className="text-foreground mt-3 list-decimal space-y-2 pl-5 text-sm">
        {steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

function FlagsForm({
  flags,
  onChange,
}: {
  flags: {
    age_confirmed: boolean;
    no_strabismus: boolean;
    no_prisms: boolean;
    understands_progressive_limitation: boolean;
  };
  onChange: (
    next: typeof flags | ((prev: typeof flags) => typeof flags),
  ) => void;
}) {
  const items = [
    {
      key: 'age_confirmed' as const,
      label: 'Soy mayor de 16 años.',
    },
    {
      key: 'no_strabismus' as const,
      label: 'No tengo estrabismo diagnosticado.',
    },
    {
      key: 'no_prisms' as const,
      label: 'Mi receta no incluye prismas.',
    },
    {
      key: 'understands_progressive_limitation' as const,
      label:
        'Entiendo que para lentes multifocales/progresivos la medición final se hace con el armazón puesto.',
    },
  ];

  return (
    <div className="border-border/60 bg-background rounded-xl border p-5">
      <h2 className="text-foreground text-sm font-semibold uppercase tracking-wide">
        Confirmaciones obligatorias
      </h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <label
            key={item.key}
            className="text-foreground flex cursor-pointer items-start gap-3 text-sm"
          >
            <input
              type="checkbox"
              checked={flags[item.key]}
              onChange={(e) =>
                onChange({ ...flags, [item.key]: e.target.checked })
              }
              className="border-border accent-brand mt-0.5 size-4 shrink-0 rounded"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DropZone({
  onDrop,
  onClick,
  disabled,
}: {
  onDrop: (e: React.DragEvent<HTMLElement>) => void;
  onClick: () => void;
  disabled: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        if (disabled) return;
        setHover(false);
        onDrop(e);
      }}
      className={cn(
        'border-border bg-muted/30 hover:bg-muted/50 hover:border-foreground/40 group flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all duration-300 sm:p-14',
        hover && 'border-brand bg-brand/5 scale-[1.01]',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="bg-background border-border/60 flex size-14 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110">
        <Upload className="text-foreground/70 size-6" />
      </div>
      <div className="text-center">
        <p className="text-foreground font-medium">
          {disabled ? 'Marcá las 4 casillas para continuar' : 'Subí tu foto con la tarjeta'}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          JPG, PNG o WebP — máx 8MB
        </p>
      </div>
    </button>
  );
}

function PrivacyNote() {
  return (
    <div className="text-muted-foreground flex items-start gap-2 text-xs">
      <ShieldCheck className="text-brand size-4 shrink-0" />
      <p>
        Tu foto se procesa y se descarta inmediatamente. No la guardamos. En
        Óptica Carballo verificamos cada DNP antes de armar tus anteojos.
      </p>
    </div>
  );
}

function PreviewImage({
  url,
  onClear,
  dimmed = false,
}: {
  url: string;
  onClear?: () => void;
  dimmed?: boolean;
}) {
  return (
    <div className="border-border/60 bg-muted/30 relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Vista previa de tu foto"
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          dimmed && 'opacity-50',
        )}
      />
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Quitar foto"
          className="bg-background/90 hover:bg-background absolute right-3 top-3 flex size-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

function ResultBlock({
  result,
  previewUrl,
  onRetry,
  onResult,
}: {
  result: PDResult;
  previewUrl: string;
  onRetry: () => void;
  /** Si presente: callback embed mode (botón "Usar esta DNP"). */
  onResult?: (dnpMm: number) => void;
}) {
  if (!result.ok) {
    return (
      <div className="space-y-4">
        <PreviewImage url={previewUrl} />
        <div className="border-border/60 bg-muted/20 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-brand mt-0.5 size-5 shrink-0" />
            <p className="text-foreground text-sm">{result.error}</p>
          </div>
        </div>
        <Button size="lg" className="w-full" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Probar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-border/60 bg-background relative overflow-hidden rounded-xl border p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="bg-brand/10 pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl"
        />
        <div className="relative">
          <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
            Tu DNP es
          </p>
          <h2 className="text-foreground mt-2 font-serif text-5xl font-medium tracking-tight md:text-6xl">
            {result.dnp_total_mm.toFixed(1)}
            <span className="text-muted-foreground ml-2 text-2xl font-normal">
              mm
            </span>
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">
                OD (derecho)
              </p>
              <p className="text-foreground mt-1 font-mono tabular-nums">
                {result.dnp_od_mm.toFixed(1)} mm
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">
                OI (izquierdo)
              </p>
              <p className="text-foreground mt-1 font-mono tabular-nums">
                {result.dnp_oi_mm.toFixed(1)} mm
              </p>
            </div>
          </div>

          {result.confidence !== 'high' && (
            <p className="text-muted-foreground mt-4 text-xs italic">
              Confianza {result.confidence === 'medium' ? 'media' : 'baja'} —
              la sugerencia es orientativa.
            </p>
          )}
        </div>
      </div>

      {result.soft_warnings.length > 0 && (
        <div className="space-y-2">
          {result.soft_warnings.map((w, idx) => (
            <div
              key={idx}
              className="border-border/60 bg-muted/20 flex items-start gap-3 rounded-lg border p-3 text-sm"
            >
              <AlertCircle className="text-brand mt-0.5 size-4 shrink-0" />
              <p className="text-foreground">{w}</p>
            </div>
          ))}
        </div>
      )}

      {onResult ? (
        <Button
          size="lg"
          className="w-full"
          onClick={() => onResult(result.dnp_total_mm)}
        >
          Usar esta DNP
          <ArrowRight className="size-4" />
        </Button>
      ) : (
        <SaveToReceta dnpMm={result.dnp_total_mm} />
      )}

      <Button variant="outline" size="lg" className="w-full" onClick={onRetry}>
        <RefreshCw className="size-4" />
        Medir de nuevo
      </Button>

      <p className="text-muted-foreground border-border/40 border-t pt-4 text-xs leading-relaxed">
        Esta medición es una estimación orientativa basada en análisis de
        imagen. La distancia interpupilar definitiva la validamos y ajustamos
        al armar tus lentes. Para lentes multifocales, progresivos, recetas con
        prismas o graduaciones altas, recomendamos medición presencial.
      </p>
    </div>
  );
}

/**
 * Botón "Guardar a mi receta" — llama al server action que actualiza la
 * cookie de receta si existe. Si no hay receta cargada, devuelve error
 * con instrucción de usar /lector-de-receta primero.
 */
function SaveToReceta({ dnpMm }: { dnpMm: number }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSave = async () => {
    if (status === 'saving') return;
    setStatus('saving');
    setErrorMsg(null);
    const result = await updatePrescriptionDnpInCookie(dnpMm);
    if (!result.ok) {
      setErrorMsg(result.error);
      setStatus('error');
      return;
    }
    setStatus('saved');
  };

  if (status === 'saved') {
    return (
      <div className="border-brand/30 bg-brand/5 flex items-start gap-3 rounded-lg border p-4">
        <CheckCircle2 className="text-brand mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-foreground text-sm font-medium">
            DNP guardada en tu receta.
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            La vas a ver en el banner de receta al navegar el catálogo de
            anteojos de receta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        className="w-full"
        onClick={onSave}
        disabled={status === 'saving'}
      >
        {status === 'saving' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Guardando…
          </>
        ) : (
          <>
            Guardar a mi receta
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
      {errorMsg && (
        <p className="text-muted-foreground text-center text-xs">{errorMsg}</p>
      )}
    </div>
  );
}
