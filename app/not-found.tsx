import Link from 'next/link';
import { ArrowRight, Compass, Home, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

export default function NotFound() {
  const whatsappLink = getWhatsappLinkWithContext(
    'Hola, llegué a una página que no existe en la web. ¿Me ayudan?',
  );

  return (
    <main className="container py-16 md:py-24">
      <section className="mx-auto max-w-3xl text-center">
        <div className="border-foreground/15 bg-zinc-50 mx-auto flex size-16 items-center justify-center rounded-full border">
          <Compass
            className="text-foreground/70 size-8"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <p className="text-foreground/60 mt-10 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
          <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
          Error 404
        </p>

        <h1 className="text-foreground mt-6 text-balance font-serif text-5xl font-medium leading-[1.0] tracking-[-0.025em] md:text-6xl lg:text-7xl">
          Esta página{' '}
          <span className="font-normal italic text-foreground/70">
            se nos perdió
          </span>
          .
        </h1>
        <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-balance text-base md:text-lg">
          Es posible que el link esté roto o que el producto haya cambiado de
          lugar. Probá con la búsqueda o explorá las categorías abajo.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
            <Link href="/">
              <Home className="mr-2 size-4" strokeWidth={2} aria-hidden />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/marcas">
              <Search className="mr-2 size-4" strokeWidth={2} aria-hidden />
              Ver marcas
            </Link>
          </Button>
        </div>
      </section>

      <section
        aria-label="Atajos rápidos"
        className="border-foreground/10 mx-auto mt-20 grid max-w-4xl gap-x-8 gap-y-10 border-t pt-12 sm:grid-cols-2 md:mt-28 lg:grid-cols-4"
      >
        <ShortcutCard
          href="/anteojos-de-sol"
          title="Anteojos de sol"
          description="Catálogo con filtros por forma."
        />
        <ShortcutCard
          href="/anteojos-de-receta"
          title="Anteojos de receta"
          description="Armazones para tus cristales."
        />
        <ShortcutCard
          href="/guias"
          title="Guías"
          description="Artículos de salud visual escritos por óptica matriculada."
        />
        <ShortcutCard
          href="/preguntas-frecuentes"
          title="Preguntas frecuentes"
          description="Envíos, garantía, pagos, devoluciones."
        />
      </section>

      {whatsappLink && (
        <section className="bg-zinc-50 mx-auto mt-20 flex max-w-2xl flex-col gap-4 rounded-2xl p-8 text-center md:mt-28 md:p-10">
          <p className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
            ¿Buscabas algo específico?
          </p>
          <p className="text-muted-foreground mx-auto max-w-md text-balance text-sm md:text-base">
            Escribinos por WhatsApp y te ayudamos a encontrarlo. Atención por
            técnico óptico matriculado.
          </p>
          <div className="mt-2">
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 size-4" strokeWidth={2} />
                Escribinos por WhatsApp
              </a>
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}

function ShortcutCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group/card border-foreground/10 hover:border-foreground/30 flex flex-col gap-3 border-t pt-6 transition-colors duration-500"
    >
      <p className="text-foreground font-serif text-xl font-medium leading-tight tracking-[-0.01em] md:text-2xl">
        {title}
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
      <span className="text-foreground/80 group-hover/card:text-foreground mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors">
        Ir
        <ArrowRight className="size-3 transition-transform duration-300 group-hover/card:translate-x-1" />
      </span>
    </Link>
  );
}
