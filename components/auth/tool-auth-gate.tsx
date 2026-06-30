import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  /** Etiqueta corta arriba del título (ej. "Descubrir", "Lector de receta"). */
  eyebrow: string;
  /** Título del muro. */
  title: string;
  /** Por qué conviene crear cuenta (la propuesta de valor real). */
  description: string;
  /** Ruta a la que volver tras login/registro (ej. "/descubrir"). */
  next: string;
  /** Texto del botón primario. Default "Crear cuenta gratis". */
  ctaLabel?: string;
};

/**
 * Muro de autenticación para herramientas con "gate duro": el usuario debe
 * estar logueado para usarlas. Se renderiza en lugar de la herramienta cuando
 * no hay sesión. Explica el beneficio (por qué crear cuenta) — no es un bloqueo
 * a secas. Server component, 0 JS.
 *
 * Reusado por /descubrir (swipe) y /lector-de-receta (scanner).
 */
export function ToolAuthGate({
  eyebrow,
  title,
  description,
  next,
  ctaLabel = 'Crear cuenta gratis',
}: Props) {
  const nextParam = `?next=${encodeURIComponent(next)}`;

  return (
    <main className="container py-16 md:py-24">
      <section className="mx-auto max-w-xl text-center">
        <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="text-foreground mt-5 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-lg text-balance text-base md:text-lg">
          {description}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Link href={`/registro${nextParam}`}>
              <Sparkles className="mr-2 size-4" />
              {ctaLabel}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`/ingresar${nextParam}`}>Ya tengo cuenta</Link>
          </Button>
        </div>

        <p className="text-muted-foreground/80 mt-4 text-xs">
          Es gratis y toma 30 segundos.
        </p>
      </section>
    </main>
  );
}
