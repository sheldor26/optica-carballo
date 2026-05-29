import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import type { RelatedProductCard } from '@/lib/catalog/queries';

/**
 * Versión compacta de RelatedProducts para meter en la columna derecha del
 * sidebar de producto (debajo de MEDIDAS). Muestra hasta 3 productos en
 * layout vertical compacto (thumb 64x64 + nombre + precio), distinto al
 * grid grande de `RelatedProducts` que va full-width al fondo.
 *
 * Aprovecha el espacio blanco que queda cuando la columna izquierda
 * (gallery + incluye) es más alta que la columna derecha (info + medidas).
 */
export function RelatedProductsSidebar({
  products,
}: {
  products: RelatedProductCard[];
}) {
  const top = products.slice(0, 3);
  if (top.length === 0) return null;

  return (
    <div className="border-border/60 bg-muted/30 rounded-xl border p-4 md:p-5">
      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]">
        También te puede gustar
      </p>
      <ul className="mt-3 space-y-3">
        {top.map((p) => {
          const href = `/${p.categorySlug}/${p.brandSlug}/${p.slug}`;
          const imageUrl = p.primaryImagePath
            ? getProductImageUrl(p.primaryImagePath)
            : null;
          return (
            <li key={p.slug}>
              <Link
                href={href}
                className="group hover:bg-background flex items-center gap-3 rounded-lg p-2 transition-colors"
              >
                <div className="border-border/60 bg-background relative size-16 shrink-0 overflow-hidden rounded-md border">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={p.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  ) : (
                    <div className="bg-muted size-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                    {p.brandName}
                  </p>
                  <p className="text-foreground line-clamp-1 text-sm font-medium leading-tight">
                    {p.name}
                  </p>
                  {p.minPriceCents !== null && (
                    <p className="text-foreground mt-0.5 text-sm font-semibold">
                      {formatPriceCents(p.minPriceCents)}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {products.length > 3 && (
        <p className="border-border/40 mt-3 border-t pt-3 text-right">
          <a
            href="#related-products-heading"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
          >
            Ver todos abajo
            <ArrowRight className="size-3" aria-hidden="true" />
          </a>
        </p>
      )}
    </div>
  );
}
