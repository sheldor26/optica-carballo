'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
        <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
        Algo se desenfocó
      </p>
      <h1 className="text-foreground mt-6 max-w-xl text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl">
        Algo <span className="font-normal italic text-foreground/70">salió mal</span>
      </h1>
      <p className="text-muted-foreground mx-auto mt-5 max-w-md text-balance text-sm md:text-base">
        Hubo un problema cargando esta página. Probá de nuevo; si sigue, podés
        volver al inicio o escribirnos.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button type="button" size="lg" onClick={() => reset()}>
          Reintentar
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
}
