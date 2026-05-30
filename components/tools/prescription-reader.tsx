'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CONSENT_LABEL,
  FORM_DISCLAIMER,
  IN_PERSON_REASON_COPY,
  LOADING_TIPS,
  NOT_A_PRESCRIPTION_MESSAGE,
  RESULT_HEADLINE,
  RESULT_SUBTITLE,
  UPLOAD_DISCLAIMER,
  WARNING_FLAG_MESSAGES,
} from '@/lib/prescription/copy';
import {
  evaluateInPerson,
  hasOnlyAddReason,
  isExpired,
  type EyeMeasurement,
  type PrescriptionAnalysis,
} from '@/lib/prescription/types';
import { savePrescriptionToCookie } from '@/lib/prescription-cookie/actions';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

type State =
  | { kind: 'idle' }
  | { kind: 'preview'; file: File; previewName: string }
  | { kind: 'analyzing'; previewName: string }
  | { kind: 'result'; analysis: PrescriptionAnalysis; previewName: string }
  | { kind: 'error'; message: string };

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/webp,application/pdf';

export function PrescriptionReader() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [consented, setConsented] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setState({
        kind: 'error',
        message: 'El archivo pesa más de 10MB. Probá con uno más liviano.',
      });
      return;
    }
    const ok = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ].includes(file.type);
    if (!ok) {
      setState({
        kind: 'error',
        message:
          'Formato no soportado. Subí JPG, PNG, WebP o PDF. Si tu foto está en HEIC (iPhone), convertila a JPG primero.',
      });
      return;
    }
    setState({ kind: 'preview', file, previewName: file.name });
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
    if (!consented) return;
    const { file, previewName } = state;
    setState({ kind: 'analyzing', previewName });

    try {
      const fd = new FormData();
      fd.append('prescription', file);
      const res = await fetch('/api/prescription', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        let message = 'No pudimos analizar tu receta. Probá de nuevo.';
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // ignore
        }
        setState({ kind: 'error', message });
        return;
      }
      const analysis = (await res.json()) as PrescriptionAnalysis;
      setState({ kind: 'result', analysis, previewName });
    } catch {
      setState({
        kind: 'error',
        message: 'Hubo un problema procesando tu receta. Probá de nuevo.',
      });
    }
  };

  const reset = () => {
    setState({ kind: 'idle' });
    setConsented(false);
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
              aria-label="Subir receta"
            />
            <PrivacyDisclaimer />
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
            <FilePreview name={state.previewName} onClear={reset} />
            <ConsentCheckbox
              checked={consented}
              onChange={setConsented}
            />
            <Button
              size="lg"
              className="w-full"
              onClick={analyze}
              disabled={!consented}
            >
              <FileText className="size-4" />
              Leer mi receta
            </Button>
            <PrivacyDisclaimer />
          </motion.div>
        )}

        {state.kind === 'analyzing' && <LoadingState />}

        {state.kind === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <ResultBlock analysis={state.analysis} onReset={reset} />
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
        <p className="text-foreground font-medium">Subí tu receta oftalmológica</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Arrastrá o hacé click — JPG, PNG, WebP o PDF, máx 10MB
        </p>
      </div>
    </button>
  );
}

function FilePreview({
  name,
  onClear,
}: {
  name: string;
  onClear: () => void;
}) {
  return (
    <div className="border-border/60 bg-muted/20 flex items-center gap-3 rounded-lg border p-4">
      <FileText className="text-brand size-5 shrink-0" />
      <p className="text-foreground flex-1 truncate text-sm font-medium">
        {name}
      </p>
      <button
        type="button"
        onClick={onClear}
        aria-label="Quitar archivo"
        className="hover:bg-muted flex size-8 items-center justify-center rounded-full transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function ConsentCheckbox({
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
      <span className="text-foreground text-sm leading-relaxed">
        {CONSENT_LABEL}
      </span>
    </label>
  );
}

function PrivacyDisclaimer() {
  return (
    <div className="text-muted-foreground border-border/40 mt-6 flex items-start gap-2 rounded-lg border p-4 text-xs leading-relaxed">
      <ShieldCheck className="text-brand mt-0.5 size-4 shrink-0" />
      <p>{UPLOAD_DISCLAIMER}</p>
    </div>
  );
}

function LoadingState() {
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((idx) => (idx + 1) % LOADING_TIPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-border/60 bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-xl border p-12"
    >
      <Loader2 className="text-brand size-10 animate-spin" />
      <motion.p
        key={tipIdx}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-foreground text-sm font-medium"
      >
        {LOADING_TIPS[tipIdx]}
      </motion.p>
    </motion.div>
  );
}

function ResultBlock({
  analysis,
  onReset,
}: {
  analysis: PrescriptionAnalysis;
  onReset: () => void;
}) {
  // Si no es receta válida, mensaje claro + reset.
  if (!analysis.isPrescription) {
    return (
      <div className="space-y-4">
        <div className="border-border/60 bg-muted/20 rounded-lg border p-6 text-center">
          <AlertCircle className="text-brand mx-auto size-6" />
          <p className="text-foreground mt-3 text-sm">
            {NOT_A_PRESCRIPTION_MESSAGE}
          </p>
        </div>
        <Button variant="outline" size="lg" className="w-full" onClick={onReset}>
          <RefreshCw className="size-4" />
          Probar de nuevo
        </Button>
      </div>
    );
  }

  const inPersonReasons = evaluateInPerson(analysis);
  const expired = isExpired(analysis.expirationDate);

  // Receta bifocal/multifocal SIN otras patologías: mostramos opciones de
  // monofocal lejos/cerca + handoff opcional. Founder explícito: podemos
  // armar 2 anteojos separados — no hay que bloquear el flow completo.
  if (hasOnlyAddReason(inPersonReasons)) {
    return <BifocalOptionsBlock analysis={analysis} expired={expired} onReset={onReset} />;
  }

  // Resto de casos presenciales (alta graduación, contact lens, etc.) →
  // handoff WhatsApp completo, no podemos hacerlo online.
  if (inPersonReasons.length > 0) {
    return (
      <InPersonHandoff
        analysis={analysis}
        reasons={inPersonReasons}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Análisis completo
        </p>
        <h2 className="text-foreground mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
          {RESULT_HEADLINE}
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          {RESULT_SUBTITLE}
        </p>
      </div>

      {expired && (
        <div className="border-amber-400/40 bg-amber-50 flex items-start gap-3 rounded-lg border p-4 dark:bg-amber-950/20">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-foreground text-sm">
            {WARNING_FLAG_MESSAGES.expired_date}
          </p>
        </div>
      )}

      {analysis.warningFlags
        .filter((f) => f !== 'expired_date')
        .map((flag) => (
          <div
            key={flag}
            className="border-border/60 bg-muted/20 flex items-start gap-3 rounded-lg border p-4"
          >
            <AlertCircle className="text-brand mt-0.5 size-5 shrink-0" />
            <p className="text-foreground text-sm">
              {WARNING_FLAG_MESSAGES[flag]}
            </p>
          </div>
        ))}

      <PrescriptionForm analysis={analysis} />

      <p className="text-muted-foreground border-border/40 border-t pt-4 text-xs leading-relaxed">
        {FORM_DISCLAIMER}
      </p>

      <SaveAndShopCta analysis={analysis} disabled={expired} />

      <Button variant="outline" size="lg" className="w-full" onClick={onReset}>
        <RefreshCw className="size-4" />
        Subir otra receta
      </Button>
    </div>
  );
}

/**
 * CTA primario: guarda la receta en cookie firmada + redirige al catálogo
 * de receta. Sólo disponible para recetas válidas no vencidas — receta
 * vencida no puede comprar (la regente no fabrica con receta vieja).
 *
 * Si el guardado falla, mostramos el error pero NO bloqueamos al usuario
 * (puede seguir manualmente al catálogo).
 */
function SaveAndShopCta({
  analysis,
  disabled,
}: {
  analysis: PrescriptionAnalysis;
  disabled: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    // Llegamos acá solo si evaluateInPerson devolvió [] → es comprable
    // online → forzamos type: 'monofocal' aunque la IA haya devuelto
    // 'unknown'. El schema de cookie sólo acepta 'monofocal'.
    //
    // Forzamos `add: null` explícito: invariante "monofocal en cookie nunca
    // tiene add". Si por algún edge case la IA devolvió add !== null pero
    // evaluateInPerson lo dejó pasar (no debería, pero defense-in-depth),
    // descartamos el add acá para que la regente no se confunda al armar.
    const stripAdd = (eye: EyeMeasurement) => ({
      esf: eye.esf,
      cil: eye.cil,
      eje: eye.eje,
      add: null,
    });
    const payload = {
      type: 'monofocal' as const,
      od: stripAdd(analysis.od),
      oi: stripAdd(analysis.oi),
      dnp: analysis.dnp,
      expirationDate: analysis.expirationDate,
      savedAt: Date.now(),
    };

    const result = await savePrescriptionToCookie(payload);
    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return;
    }
    router.push('/anteojos-de-receta');
  };

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        className="w-full"
        onClick={onSave}
        disabled={disabled || saving}
      >
        {saving ? (
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
      {disabled && (
        <p className="text-muted-foreground text-center text-xs">
          Tu receta está vencida — no podemos armar anteojos con receta de más
          de 1 año. Hacé un control con tu oftalmólogo.
        </p>
      )}
      {error && (
        <p className="text-destructive text-center text-xs">{error}</p>
      )}
    </div>
  );
}

/**
 * Block para recetas bifocales/multifocales (has_add) SIN otras patologías.
 *
 * Founder feedback: aunque el usuario tenga add, podemos armar 2 anteojos
 * monofocales (uno de lejos, uno de cerca) o solo uno de los dos. Solo el
 * multifocal "todo en uno" requiere mediciones presenciales.
 *
 * Mostramos la tabla con valores (educativo: el user escaneó su receta,
 * dale el output) + 3 opciones claras.
 *
 * Fórmula monofocal de cerca (estándar óptica AR, aprobado por founder):
 * - ESF cerca = ESF lejos + ADD (por ojo)
 * - CIL cerca = CIL lejos (no cambia)
 * - EJE cerca = EJE lejos (no cambia)
 * - DNP: reutilizamos la de lejos. La regente ajusta -3mm por lado típico
 *   al armar (procedimiento manual, fuera de scope del lector IA).
 */
function BifocalOptionsBlock({
  analysis,
  expired,
  onReset,
}: {
  analysis: PrescriptionAnalysis;
  expired: boolean;
  onReset: () => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<'distance' | 'near' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveAndShop = async (mode: 'distance' | 'near') => {
    if (saving !== null) return;
    setSaving(mode);
    setError(null);

    const payload = {
      type: 'monofocal' as const,
      od:
        mode === 'distance'
          ? { esf: analysis.od.esf, cil: analysis.od.cil, eje: analysis.od.eje, add: null }
          : {
              esf: (analysis.od.esf ?? 0) + (analysis.od.add ?? 0),
              cil: analysis.od.cil,
              eje: analysis.od.eje,
              add: null,
            },
      oi:
        mode === 'distance'
          ? { esf: analysis.oi.esf, cil: analysis.oi.cil, eje: analysis.oi.eje, add: null }
          : {
              esf: (analysis.oi.esf ?? 0) + (analysis.oi.add ?? 0),
              cil: analysis.oi.cil,
              eje: analysis.oi.eje,
              add: null,
            },
      dnp: analysis.dnp,
      expirationDate: analysis.expirationDate,
      savedAt: Date.now(),
    };

    const result = await savePrescriptionToCookie(payload);
    if (!result.ok) {
      setError(result.error);
      setSaving(null);
      return;
    }
    router.push('/anteojos-de-receta');
  };

  const multifocalMessage = `Hola! Hice el lector de receta de Óptica Carballo y me indicó que necesito un anteojo multifocal o bifocal. ¿Cuándo puedo pasar para tomar las mediciones?`;
  const whatsappLink = getWhatsappLinkWithContext(multifocalMessage);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Lejos y cerca
        </p>
        <h2 className="text-foreground mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Tu receta es para ver de lejos y de cerca
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          Te explicamos las opciones. Podemos armarte uno o los dos anteojos por
          separado online, o coordinar un multifocal en persona.
        </p>
      </div>

      {expired && (
        <div className="border-amber-400/40 bg-amber-50 flex items-start gap-3 rounded-lg border p-4 dark:bg-amber-950/20">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-foreground text-sm">
            {WARNING_FLAG_MESSAGES.expired_date}
          </p>
        </div>
      )}

      <PrescriptionForm analysis={analysis} />

      <div className="space-y-3">
        <h3 className="text-foreground text-sm font-semibold uppercase tracking-wide">
          ¿Qué podemos armarte?
        </h3>

        <OptionCard
          title="Anteojo monofocal solo para LEJOS"
          description="Usamos los valores de ESF, CIL y EJE. Para conducir, ver TV, caminar."
          buttonLabel={
            saving === 'distance' ? 'Guardando…' : 'Buscar anteojos de lejos'
          }
          onClick={() => saveAndShop('distance')}
          disabled={saving !== null || expired}
          primary
        />

        <OptionCard
          title="Anteojo monofocal solo para CERCA"
          description="Sumamos la ADD a la graduación. Para leer, computadora, costura."
          buttonLabel={
            saving === 'near' ? 'Guardando…' : 'Buscar anteojos de cerca'
          }
          onClick={() => saveAndShop('near')}
          disabled={saving !== null || expired}
          primary
        />

        <OptionCard
          title="Multifocal o bifocal completo"
          description="Un solo anteojo con ambas zonas. Requiere mediciones presenciales (altura pupilar, postura natural, adaptación)."
          buttonLabel="Coordinar por WhatsApp"
          href={whatsappLink ?? undefined}
        />
      </div>

      {expired && (
        <p className="text-muted-foreground text-center text-xs">
          Tu receta está vencida — no podemos armar anteojos con receta de más
          de 1 año. Hacé un control con tu oftalmólogo.
        </p>
      )}
      {error && (
        <p className="text-destructive text-center text-xs">{error}</p>
      )}

      <p className="text-muted-foreground border-border/40 border-t pt-4 text-xs leading-relaxed">
        {FORM_DISCLAIMER}
      </p>

      <Button variant="outline" size="lg" className="w-full" onClick={onReset}>
        <RefreshCw className="size-4" />
        Subir otra receta
      </Button>
    </div>
  );
}

/**
 * Card de opción dentro del BifocalOptionsBlock. Tres modos:
 * - `primary`: botón principal (color brand). Para acciones online.
 * - `href` presente: link externo (WhatsApp). Sin onClick.
 * - Default: botón secundario.
 */
function OptionCard({
  title,
  description,
  buttonLabel,
  onClick,
  disabled,
  primary,
  href,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  href?: string;
}) {
  const buttonClass = primary
    ? 'bg-foreground text-background hover:bg-foreground/90'
    : 'border-border bg-background hover:bg-muted/40 border';

  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex-1">
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            buttonClass,
          )}
        >
          {buttonLabel}
          <ArrowRight className="size-4" />
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
            buttonClass,
          )}
        >
          {buttonLabel}
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}

function PrescriptionForm({ analysis }: { analysis: PrescriptionAnalysis }) {
  return (
    <div className="border-border/60 bg-background overflow-hidden rounded-xl border">
      <div className="border-border/60 bg-muted/30 grid grid-cols-[80px_1fr_1fr_80px] border-b text-xs font-semibold uppercase tracking-wider sm:grid-cols-[100px_1fr_1fr_1fr_100px]">
        <div className="text-muted-foreground p-3" />
        <div className="text-muted-foreground p-3 text-center">ESF</div>
        <div className="text-muted-foreground p-3 text-center">CIL</div>
        <div className="hidden text-muted-foreground p-3 text-center sm:block">
          EJE
        </div>
        <div className="text-muted-foreground p-3 text-center">ADD</div>
      </div>
      <EyeRow label="OD" eye={analysis.od} />
      <EyeRow label="OI" eye={analysis.oi} isLast />
      {analysis.dnp !== null && (
        <div className="border-border/60 bg-muted/10 border-t p-3 text-center">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">
            DNP:{' '}
          </span>
          <span className="text-foreground text-sm font-medium tabular-nums">
            {analysis.dnp} mm
          </span>
        </div>
      )}
    </div>
  );
}

function EyeRow({
  label,
  eye,
  isLast = false,
}: {
  label: string;
  eye: EyeMeasurement;
  isLast?: boolean;
}) {
  const lowConfidence = eye.confidence === 'low';
  return (
    <div
      className={cn(
        'grid grid-cols-[80px_1fr_1fr_80px] items-center text-sm sm:grid-cols-[100px_1fr_1fr_1fr_100px]',
        !isLast && 'border-border/60 border-b',
        lowConfidence && 'bg-amber-50/40 dark:bg-amber-950/10',
      )}
    >
      <div className="text-foreground p-3 text-center font-semibold">
        {label}
      </div>
      <ValueCell value={eye.esf} format="signed" />
      <ValueCell value={eye.cil} format="signed" />
      <div className="hidden p-3 text-center tabular-nums sm:block">
        {eye.eje !== null ? `${eye.eje}°` : '—'}
      </div>
      <ValueCell value={eye.add} format="positive" />
    </div>
  );
}

function ValueCell({
  value,
  format,
}: {
  value: number | null;
  format: 'signed' | 'positive';
}) {
  if (value === null) {
    return <div className="text-muted-foreground p-3 text-center">—</div>;
  }
  const formatted =
    format === 'signed'
      ? value === 0
        ? '0.00'
        : `${value > 0 ? '+' : ''}${value.toFixed(2)}`
      : `+${value.toFixed(2)}`;
  return (
    <div className="text-foreground p-3 text-center tabular-nums">
      {formatted}
    </div>
  );
}

function InPersonHandoff({
  analysis,
  reasons,
  onReset,
}: {
  analysis: PrescriptionAnalysis;
  reasons: ReturnType<typeof evaluateInPerson>;
  onReset: () => void;
}) {
  const primary = reasons[0]!;
  const copy = IN_PERSON_REASON_COPY[primary];

  // Mensaje WhatsApp con contexto pero SIN exponer datos médicos completos.
  const message = `Hola! Hice el lector de receta de Óptica Carballo y me indicó que necesito atención personalizada. ¿Pueden orientarme?`;
  const whatsappLink = getWhatsappLinkWithContext(message);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
          Atención personalizada
        </p>
        <h2 className="text-foreground mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
          {copy.title}
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          {copy.body}
        </p>
      </div>

      {reasons.length > 1 && (
        <ul className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-4 text-sm">
          {reasons.slice(1).map((r) => (
            <li key={r} className="flex items-start gap-2">
              <CheckCircle2 className="text-brand mt-0.5 size-4 shrink-0" />
              <span className="text-foreground">{IN_PERSON_REASON_COPY[r].title}</span>
            </li>
          ))}
        </ul>
      )}

      {whatsappLink && (
        <Button
          asChild
          size="lg"
          className="w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            Escribinos por WhatsApp
          </a>
        </Button>
      )}

      <Button variant="outline" size="lg" className="w-full" onClick={onReset}>
        <RefreshCw className="size-4" />
        Probar con otra receta
      </Button>
    </div>
  );
}
