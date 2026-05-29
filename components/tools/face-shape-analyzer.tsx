'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ANALYSIS_DISCLAIMER,
  FACE_SHAPE_COPY,
  FRAME_SHAPE_COPY,
  LOW_CONFIDENCE_MESSAGE,
  STANDARD_CLOSING,
  WARNING_FLAG_MESSAGES,
} from '@/lib/face-shape/copy';
import {
  CONFIDENCE_THRESHOLDS,
  type FaceShapeAnalysis,
  confidenceLevel,
} from '@/lib/face-shape/types';

type State =
  | { kind: 'idle' }
  | { kind: 'preview'; previewUrl: string; file: File }
  | { kind: 'analyzing'; previewUrl: string }
  | { kind: 'result'; previewUrl: string; analysis: FaceShapeAnalysis }
  | { kind: 'error'; message: string; previewUrl?: string };

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/webp';
const RESIZE_MAX_DIM = 1024;

/**
 * Resize la imagen a max 1024px lado mayor antes de enviarla.
 * Ahorra bandwidth y tokens (Anthropic factura por tile de imagen).
 * Devuelve un nuevo Blob/File del mismo MIME.
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
        0.9,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image'));
    };
    img.src = objectUrl;
  });
}

export function FaceShapeAnalyzer() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setState({
        kind: 'error',
        message: 'La imagen pesa más de 5MB. Probá con una más liviana.',
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
    if (!ageConfirmed) return;
    const { previewUrl, file } = state;
    setState({ kind: 'analyzing', previewUrl });

    try {
      const resized = await resizeImageIfNeeded(file);
      const fd = new FormData();
      fd.append('image', resized);

      const res = await fetch('/api/face-shape', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        let message = 'No pudimos analizar la imagen. Probá de nuevo.';
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // ignore
        }
        setState({ kind: 'error', message, previewUrl });
        return;
      }
      const analysis = (await res.json()) as FaceShapeAnalysis;
      setState({ kind: 'result', previewUrl, analysis });
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
    setAgeConfirmed(false);
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
          >
            <DropZone
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              onChange={onFileInput}
              className="sr-only"
              aria-label="Subir foto de tu rostro"
            />
            <Tips />
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
            <AgeGate
              checked={ageConfirmed}
              onChange={setAgeConfirmed}
            />
            <Button
              size="lg"
              className="w-full"
              onClick={analyze}
              disabled={!ageConfirmed}
            >
              <Camera className="size-4" />
              Analizar mi rostro
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
                  Analizando tu rostro…
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
            <ResultBlock analysis={state.analysis} previewUrl={state.previewUrl} />
            <Button variant="outline" size="lg" className="w-full" onClick={reset}>
              <RefreshCw className="size-4" />
              Probar con otra foto
            </Button>
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

function DropZone({
  onDrop,
  onClick,
}: {
  onDrop: (e: React.DragEvent<HTMLElement>) => void;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        setHover(false);
        onDrop(e);
      }}
      className={cn(
        'border-border bg-muted/30 hover:bg-muted/50 hover:border-foreground/40 group flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all duration-300 sm:p-16',
        hover && 'border-brand bg-brand/5 scale-[1.01]',
      )}
    >
      <div className="bg-background border-border/60 flex size-14 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110">
        <Upload className="text-foreground/70 size-6" />
      </div>
      <div className="text-center">
        <p className="text-foreground font-medium">Subí una foto de tu rostro</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Arrastrá o hacé click — JPG, PNG, WebP, máx 5MB
        </p>
      </div>
    </button>
  );
}

function Tips() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      {[
        { title: 'Foto frontal', desc: 'Mirando de frente, no de perfil.' },
        { title: 'Buena luz', desc: 'Natural si es posible, sin sombras duras.' },
        { title: 'Sin anteojos', desc: 'Que se vea todo el rostro despejado.' },
      ].map((tip) => (
        <div
          key={tip.title}
          className="border-border/60 bg-background rounded-lg border p-3"
        >
          <p className="text-foreground text-xs font-semibold uppercase tracking-wide">
            {tip.title}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">{tip.desc}</p>
        </div>
      ))}
    </div>
  );
}

function PrivacyNote() {
  return (
    <div className="text-muted-foreground mt-6 flex items-start gap-2 text-xs">
      <ShieldCheck className="text-brand size-4 shrink-0" />
      <p>
        Tu foto se procesa y se descarta inmediatamente. No la guardamos en
        ningún lugar.
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
    <div className="border-border/60 bg-muted/30 relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-xl border">
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

function AgeGate({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="border-border/60 bg-muted/20 hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="border-border accent-brand mt-0.5 size-4 shrink-0 rounded"
      />
      <span className="text-foreground text-sm">
        Confirmo que soy mayor de 18 años y autorizo el análisis automatizado
        de mi foto.
      </span>
    </label>
  );
}

function ResultBlock({
  analysis,
  previewUrl,
}: {
  analysis: FaceShapeAnalysis;
  previewUrl: string;
}) {
  const isLowConfidence =
    analysis.confidence < CONFIDENCE_THRESHOLDS.LOW ||
    analysis.faceShape === null;

  // Si hay warningFlags, mostramos tips antes que resultado.
  if (analysis.warningFlags.length > 0) {
    const flag = analysis.warningFlags[0]!;
    const message = WARNING_FLAG_MESSAGES[flag] ?? LOW_CONFIDENCE_MESSAGE;
    return (
      <div className="space-y-4">
        <PreviewImage url={previewUrl} />
        <div className="border-border/60 bg-muted/20 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-brand mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-foreground text-sm font-medium">
                Probemos con otra foto
              </p>
              <p className="text-muted-foreground mt-1 text-sm">{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLowConfidence) {
    return (
      <div className="space-y-4">
        <PreviewImage url={previewUrl} />
        <div className="border-border/60 bg-muted/20 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-brand mt-0.5 size-5 shrink-0" />
            <p className="text-foreground text-sm">{LOW_CONFIDENCE_MESSAGE}</p>
          </div>
        </div>
      </div>
    );
  }

  const shape = analysis.faceShape!;
  const copy = FACE_SHAPE_COPY[shape];
  const level = confidenceLevel(analysis.confidence);

  return (
    <div className="space-y-6">
      <div className="border-border/60 bg-background relative overflow-hidden rounded-xl border p-6 sm:p-8">
        {/* Glow ámbar de fondo */}
        <div
          aria-hidden="true"
          className="bg-brand/10 pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl"
        />
        <div className="relative grid gap-6 sm:grid-cols-[auto_1fr]">
          <PreviewImage url={previewUrl} />
          <div className="space-y-4">
            <div>
              <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
                Tu rostro es
              </p>
              <h2 className="text-foreground mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
                {copy.label}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm md:text-base">
                {copy.description}
              </p>
            </div>

            {level === 'medium' && (
              <p className="text-muted-foreground text-xs italic">
                Confianza media — la sugerencia es orientativa.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FrameShapeList
          title="Marcos que te van a quedar bien"
          shapes={analysis.recommendedFrameShapes}
          tone="recommended"
        />
        <FrameShapeList
          title="Mejor evitar"
          shapes={analysis.avoidFrameShapes}
          tone="avoid"
        />
      </div>

      <div className="border-border/60 bg-muted/20 rounded-lg border p-4">
        <p className="text-foreground text-sm">{analysis.rationale}</p>
        <p className="text-muted-foreground mt-3 text-sm">{STANDARD_CLOSING}</p>
      </div>

      {analysis.recommendedFrameShapes.length > 0 && (
        <CatalogCtaForRecommendation
          shapes={analysis.recommendedFrameShapes}
        />
      )}

      <div className="text-muted-foreground border-border/40 border-t pt-4 text-xs leading-relaxed">
        <p>{ANALYSIS_DISCLAIMER}</p>
      </div>
    </div>
  );
}

function FrameShapeList({
  title,
  shapes,
  tone,
}: {
  title: string;
  shapes: string[];
  tone: 'recommended' | 'avoid';
}) {
  if (shapes.length === 0) return null;
  return (
    <div className="border-border/60 bg-background rounded-lg border p-4">
      <p className="text-foreground text-xs font-semibold uppercase tracking-wide">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {shapes.map((slug) => {
          const label =
            FRAME_SHAPE_COPY[slug as keyof typeof FRAME_SHAPE_COPY] ?? slug;
          return (
            <li key={slug} className="flex items-center gap-2 text-sm">
              {tone === 'recommended' ? (
                <CheckCircle2 className="text-brand size-4 shrink-0" />
              ) : (
                <X className="text-muted-foreground size-4 shrink-0" />
              )}
              <span className="text-foreground">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * CTA al final del resultado: linkea al catálogo de sol filtrado por las
 * formas recomendadas. Cierra el funnel: cliente termina el test →
 * descubre productos concretos que matchean.
 */
function CatalogCtaForRecommendation({ shapes }: { shapes: string[] }) {
  const formaParam = shapes.join(',');
  const href = `/anteojos-de-sol?forma=${encodeURIComponent(formaParam)}`;
  const labels = shapes
    .map((s) => FRAME_SHAPE_COPY[s as keyof typeof FRAME_SHAPE_COPY] ?? s)
    .slice(0, 2)
    .join(' y ');

  return (
    <Link
      href={href}
      className="group border-brand/30 bg-brand/5 hover:bg-brand/10 flex items-center justify-between gap-3 rounded-xl border p-5 transition-colors"
    >
      <div>
        <p className="text-brand text-xs font-medium uppercase tracking-[0.18em]">
          Próximo paso
        </p>
        <p className="text-foreground mt-1 font-serif text-base font-medium md:text-lg">
          Ver anteojos {labels.toLowerCase()}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Filtramos el catálogo por las formas recomendadas para vos.
        </p>
      </div>
      <ArrowRight className="text-foreground size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
