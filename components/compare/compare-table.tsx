'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompareRemoveButton } from '@/components/compare/compare-remove-button';
import { cn } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import type { CompareProductCard } from '@/lib/catalog/queries';

export type CompareRow = {
  label: string;
  values: (string | null)[];
};

type Props = {
  products: CompareProductCard[];
  rows: CompareRow[];
};

/**
 * Tabla de comparación con first-col sticky.
 *
 * Layout:
 * - Mobile (~360px): col labels 96px sticky + cols producto 168px c/u → 1.5 visibles, scroll horizontal.
 * - Desktop (md+): col labels 160px + cols producto auto, todo visible si caben 4.
 *
 * Visual cues:
 * - "Deslizá →" hint visible solo si hay scroll overflow (detectado al mount + resize).
 * - Shadow sutil en el borde de la first col cuando hay scroll (indica que hay contenido a la derecha).
 * - Filas alternadas con bg-muted/30.
 */
export function CompareTable({ products, rows }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth + 4);
      setIsScrolled(el.scrollLeft > 4);
    };

    check();
    el.addEventListener('scroll', check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', check);
      ro.disconnect();
    };
  }, [products.length]);

  return (
    <section className="mt-8 md:mt-12" aria-label="Tabla de comparación">
      {/* Hint visual: aparece solo si hay overflow */}
      {hasOverflow && (
        <div className="text-muted-foreground mb-3 flex items-center justify-end gap-1 text-xs md:hidden">
          <span>Deslizá para ver más</span>
          <ChevronRight className="size-3.5 animate-pulse" strokeWidth={2.5} />
        </div>
      )}

      <div
        ref={scrollRef}
        className="-mx-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'thin' }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* First col: label "Atributo" — sticky */}
              <th
                scope="col"
                className={cn(
                  'bg-background sticky left-0 z-10 w-24 align-bottom sm:w-40',
                  'transition-shadow duration-200',
                  isScrolled && 'shadow-[6px_0_8px_-4px_rgba(0,0,0,0.08)]',
                )}
              >
                <span className="sr-only">Atributo</span>
              </th>
              {products.map((p) => (
                <th
                  key={p.slug}
                  scope="col"
                  className="border-border/60 min-w-[168px] border-b align-top p-3 text-left sm:min-w-[200px] sm:p-4"
                >
                  <ProductHeader product={p} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={cn(
                      'sticky left-0 z-10 w-24 px-3 py-3.5 text-left align-top text-[11px] font-semibold uppercase tracking-wider sm:w-40 sm:px-4 sm:py-4 sm:text-xs',
                      'text-muted-foreground transition-shadow duration-200',
                      isEven ? 'bg-muted/30' : 'bg-background',
                      isScrolled && 'shadow-[6px_0_8px_-4px_rgba(0,0,0,0.08)]',
                    )}
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td
                      key={i}
                      className={cn(
                        'border-border/40 border-t px-3 py-3.5 text-sm leading-snug text-foreground sm:px-4 sm:py-4 sm:text-base',
                        isEven && 'bg-muted/30',
                      )}
                    >
                      {value ?? (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        Tu comparador se guarda en tu navegador. No requiere cuenta.
      </p>
    </section>
  );
}

function ProductHeader({ product }: { product: CompareProductCard }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="border-border/60 bg-muted/30 relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border">
        {product.primaryImagePath ? (
          <Image
            src={getProductImageUrl(product.primaryImagePath)}
            alt={product.name}
            width={240}
            height={240}
            className="size-full object-contain p-3 sm:p-4"
            sizes="(min-width: 768px) 200px, 168px"
          />
        ) : (
          <span className="text-muted-foreground text-xs">sin foto</span>
        )}
      </div>
      <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.15em] sm:text-xs">
        {product.brandName}
      </p>
      <Link
        href={`/${product.categorySlug}/${product.brandSlug}/${product.slug}`}
        className="hover:text-brand text-foreground line-clamp-2 font-serif text-sm font-medium leading-tight tracking-tight transition-colors sm:text-base"
      >
        {product.name}
      </Link>
      <Button
        asChild
        size="sm"
        variant="outline"
        className="mt-1 h-8 w-full text-xs sm:h-9 sm:text-sm"
      >
        <Link href={`/${product.categorySlug}/${product.brandSlug}/${product.slug}`}>
          Ver producto
          <ArrowRight className="ml-1 size-3" strokeWidth={2} />
        </Link>
      </Button>
      <CompareRemoveButton slug={product.slug} />
    </div>
  );
}
