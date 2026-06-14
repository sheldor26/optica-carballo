'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { QuizAnswers, QuizCara, QuizCorreccion, QuizGenero, QuizPrecio, QuizUso } from '@/lib/quiz/types';

type Step = 1 | 2 | 3 | 4 | 5;

type Option<T extends string> = { value: T; label: string; emoji: string; description?: string };

const STEP_1_OPTIONS: Option<QuizUso>[] = [
  { value: 'sol', label: 'Anteojos de sol', emoji: '☀️', description: 'Para el día a día, la playa o deportes al aire libre' },
  { value: 'receta', label: 'Armazón de receta', emoji: '👓', description: 'Tengo receta y necesito anteojos graduados' },
  { value: 'ambos', label: 'Los dos', emoji: '✨', description: 'Quiero ver opciones de sol y de receta' },
];

const STEP_2_OPTIONS: Option<QuizCara>[] = [
  { value: 'ovalada', label: 'Ovalada', emoji: '🥚', description: 'Frente más ancha, mandíbula suave' },
  { value: 'redonda', label: 'Redonda', emoji: '🌕', description: 'Mejillas llenas, frente y mandíbula similares' },
  { value: 'cuadrada', label: 'Cuadrada', emoji: '⬜', description: 'Mandíbula definida, frente amplia' },
  { value: 'corazon', label: 'Corazón', emoji: '🫀', description: 'Frente amplia, mentón más angosto' },
];

const STEP_3_OPTIONS: Option<QuizPrecio>[] = [
  { value: 'bajo', label: 'Económico', emoji: '💚', description: 'Hasta $60.000' },
  { value: 'medio', label: 'Intermedio', emoji: '💛', description: '$60.000 – $120.000' },
  { value: 'alto', label: 'Premium', emoji: '🏆', description: 'Más de $120.000' },
];

const STEP_4_OPTIONS: Option<QuizGenero>[] = [
  { value: 'hombre', label: 'Para hombre', emoji: '👨', description: 'Modelos masculinos y unisex' },
  { value: 'mujer', label: 'Para mujer', emoji: '👩', description: 'Modelos femeninos y unisex' },
  { value: 'unisex', label: 'Sin preferencia', emoji: '🙋', description: 'Mostrame todo el catálogo' },
];

const STEP_5_OPTIONS: Option<QuizCorreccion>[] = [
  { value: 'si', label: 'Sí, tengo receta', emoji: '📋', description: 'Necesito lentes con graduación' },
  { value: 'no', label: 'No necesito graduación', emoji: '😎', description: 'Sin corrección visual' },
];

const STEP_QUESTIONS: Record<Step, string> = {
  1: '¿Para qué los usás?',
  2: '¿Cuál es la forma de tu cara?',
  3: '¿Cuánto querés gastar?',
  4: '¿Para quién son?',
  5: '¿Necesitás corrección visual?',
};

const STEP_SUBTITLES: Record<Step, string> = {
  1: 'Elegí el tipo de anteojos que buscás',
  2: 'Hay monturas que quedan mejor según tu forma de cara',
  3: 'Te recomendamos opciones en tu rango',
  4: 'Para mostrarte los modelos que mejor te van',
  5: 'Esto nos ayuda a afinar la recomendación',
};

function OptionCard<T extends string>({
  option,
  selected,
  onSelect,
}: {
  option: Option<T>;
  selected: boolean;
  onSelect: (value: T) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        'w-full rounded-xl border-2 p-4 text-left transition-all duration-150 active:scale-[0.98]',
        selected
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-background hover:border-foreground/40',
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {option.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-sm', selected ? 'text-background' : 'text-foreground')}>
            {option.label}
          </p>
          {option.description && (
            <p className={cn('text-xs mt-0.5', selected ? 'text-background/70' : 'text-muted-foreground')}>
              {option.description}
            </p>
          )}
        </div>
        <div
          className={cn(
            'size-5 shrink-0 rounded-full border-2 flex items-center justify-center',
            selected ? 'border-background bg-background' : 'border-border',
          )}
        >
          {selected && <div className="size-2.5 rounded-full bg-foreground" />}
        </div>
      </div>
    </button>
  );
}

export function QuizStepper() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  function select<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (step < 5) {
      setStep((s) => (s + 1) as Step);
    } else {
      const a = answers as QuizAnswers;
      const params = new URLSearchParams({
        uso: a.uso,
        cara: a.cara,
        precio: a.precio,
        genero: a.genero,
        correccion: a.correccion,
      });
      router.push(`/encontra-tu-anteojo/resultados?${params.toString()}`);
    }
  }

  function goBack() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  const currentAnswer = {
    1: answers.uso,
    2: answers.cara,
    3: answers.precio,
    4: answers.genero,
    5: answers.correccion,
  }[step];

  const canContinue = currentAnswer !== undefined;
  const isLast = step === 5;

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:py-16">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-muted-foreground text-xs font-medium">
            Pregunta {step} de 5
          </p>
          <p className="text-muted-foreground text-xs">
            {Math.round(((step - 1) / 5) * 100)}% completado
          </p>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
          {STEP_QUESTIONS[step]}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {STEP_SUBTITLES[step]}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {step === 1 &&
          STEP_1_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              option={opt}
              selected={answers.uso === opt.value}
              onSelect={(v) => select('uso', v)}
            />
          ))}
        {step === 2 &&
          STEP_2_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              option={opt}
              selected={answers.cara === opt.value}
              onSelect={(v) => select('cara', v)}
            />
          ))}
        {step === 2 && (
          <button
            type="button"
            onClick={() => { select('cara', 'no_se'); }}
            className={cn(
              'w-full rounded-xl border-2 p-3 text-left transition-all text-sm font-medium',
              answers.cara === 'no_se'
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background text-muted-foreground hover:border-foreground/40',
            )}
          >
            🤷 No sé cuál es mi forma de cara
          </button>
        )}
        {step === 3 &&
          STEP_3_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              option={opt}
              selected={answers.precio === opt.value}
              onSelect={(v) => select('precio', v)}
            />
          ))}
        {step === 4 &&
          STEP_4_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              option={opt}
              selected={answers.genero === opt.value}
              onSelect={(v) => select('genero', v)}
            />
          ))}
        {step === 5 &&
          STEP_5_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              option={opt}
              selected={answers.correccion === opt.value}
              onSelect={(v) => select('correccion', v)}
            />
          ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3">
        {step > 1 && (
          <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
            <ArrowLeft className="size-4" />
            Atrás
          </Button>
        )}
        <Button
          size="lg"
          onClick={goNext}
          disabled={!canContinue}
          className={cn('flex-1', step === 1 && 'w-full')}
        >
          {isLast ? 'Ver mis recomendaciones' : 'Siguiente'}
          {!isLast && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
