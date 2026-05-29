import Link from 'next/link';
import { Compass, Home, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

export default function NotFound() {
  const whatsappLink = getWhatsappLinkWithContext(
    'Hola, llegué a una página que no existe en la web. ¿Me ayudan?',
  );

  return (
    <main className="container py-12 md:py-20">
      <section className="mx-auto max-w-2xl text-center">
        <div className="bg-muted/40 border-border/60 mx-auto flex size-16 items-center justify-center rounded-full border">
          <Compass
            className="text-foreground/70 size-8"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <h1 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          Esta página no <span className="italic">existe</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-sm md:text-base">
          Es posible que el link esté roto o que el producto haya cambiado de
          lugar. Probá con la búsqueda o explorá nuestras categorías.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
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
        className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3 md:mt-20"
      >
        <ShortcutCard
          href="/anteojos-de-sol"
          title="Anteojos de sol"
          description="Catálogo completo con filtros."
        />
        <ShortcutCard
          href="/anteojos-de-receta"
          title="Anteojos de receta"
          description="Armazones para tus cristales."
        />
        <ShortcutCard
          href="/preguntas-frecuentes"
          title="Preguntas frecuentes"
          description="Dudas sobre envío, garantía, pagos."
        />
      </section>

      {whatsappLink && (
        <section className="mx-auto mt-12 max-w-md text-center md:mt-16">
          <div className="border-border/60 from-muted/30 to-background relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 md:p-8">
            <p className="text-foreground text-sm font-semibold">
              ¿Buscabas algo específico?
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Escribinos por WhatsApp y te ayudamos a encontrarlo.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 size-4" strokeWidth={2} />
                Escribinos
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
      className="group border-border/60 bg-background hover:border-foreground/40 hover:bg-muted/30 flex flex-col rounded-xl border p-5 transition-all duration-200"
    >
      <p className="text-foreground text-base font-semibold leading-tight">
        {title}
      </p>
      <p className="text-muted-foreground mt-1.5 text-sm leading-snug">
        {description}
      </p>
      <span className="text-muted-foreground group-hover:text-foreground mt-3 text-xs font-medium transition-colors">
        Ir →
      </span>
    </Link>
  );
}
