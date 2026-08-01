'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import type { RecommendedProduct } from '@/lib/face-shape/queries';

type Props = {
  /** Productos devueltos por `fetchRecommendedProducts`. */
  products: RecommendedProduct[];
  /** Shapes recomendadas por la IA (para fallback CTA). */
  recommendedShapes: string[];
};

/**
 * Bloque que se muestra debajo del resultado del recomendador de monturas
 * cuando hay productos del catálogo que matchean las shapes recomendadas
 * por la IA. Si no hay productos, muestra un fallback con CTA al catálogo
 * completo.
 *
 * Reutiliza `ProductCard` para que el estilo, hover, wishlist y quick-view
 * coincidan con el resto del catálogo — el cliente reconoce el componente
 * y siente que está navegando el mismo sitio, no una herramienta aparte.
 */
export function RecommendedProductsGrid({ products, recommendedShapes }: Props) {
  if (products.length === 0) {
    return <EmptyFallback shapes={recommendedShapes} />;
  }

  return (
    <section
      aria-labelledby="recommended-products-heading"
      className="border-border/60 bg-background rounded-xl border p-5 md:p-7"
    >
      <header className="flex items-start gap-3">
        <Sparkles className="text-brand mt-1 size-5 shrink-0" />
        <div>
          <h3
            id="recommended-products-heading"
            className="text-foreground font-serif text-xl font-medium tracking-tight md:text-2xl"
          >
            Productos de nuestro catálogo que te van a quedar bien
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Filtrados por las formas que mejor combinan con tu rostro.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {recommendedShapes.length > 0 && (
        <Link
          href={`/anteojos-de-sol?forma=${encodeURIComponent(recommendedShapes.join(','))}`}
          className="text-foreground mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          Ver todos los modelos de esta forma
          <ArrowRight className="size-4" />
        </Link>
      )}
    </section>
  );
}

/**
 * Estado vacío: el IA recomendó formas pero ningún producto del catálogo
 * matchea (puede pasar si el catálogo todavía está incompleto). Le damos
 * salida al usuario sin que se sienta colgado.
 */
function EmptyFallback({ shapes }: { shapes: string[] }) {
  const href =
    shapes.length > 0
      ? `/anteojos-de-sol?forma=${encodeURIComponent(shapes.join(','))}`
      : '/anteojos-de-sol';

  return (
    <section className="border-border/60 bg-muted/20 rounded-xl border p-5 md:p-7">
      <div className="flex items-start gap-3">
        <Sparkles className="text-brand mt-1 size-5 shrink-0" />
        <div className="flex-1">
          <h3 className="text-foreground font-serif text-lg font-medium tracking-tight md:text-xl">
            Todavía estamos sumando modelos de esas formas
          </h3>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Mirá el catálogo completo o escribinos por WhatsApp y te buscamos
            algo similar.
          </p>
          <Link
            href={href}
            className="text-foreground mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Ver catálogo de anteojos de sol
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
