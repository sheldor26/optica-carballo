'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { getProductQuickViewAction } from '@/lib/catalog/quick-view';
import { track, Events } from '@/lib/analytics/track';
import type { QuickViewData } from '@/lib/catalog/quick-view';

type Props = {
  slug: string;
  href: string;
  className?: string;
};

/**
 * Botón "Vista rápida" sobre la card de producto + modal con detalles.
 *
 * Comportamiento:
 * - Desktop: botón aparece on hover de la card (opacity 0 → 1, traducción Y).
 * - Mobile: visible permanente, esquina inferior izq de la imagen.
 *
 * Click → lazy fetch de la data del producto vía server action →
 * abre modal. El fetch ocurre solo la primera vez (data se cachea
 * en state local de la card mientras está montada).
 */
export function QuickView({ slug, href, className }: Props) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<QuickViewData | null>(null);
  const [isPending, startTransition] = useTransition();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (data) {
      setOpen(true);
      track(Events.QUICK_VIEW, { slug, cached: true });
      return;
    }

    startTransition(async () => {
      const result = await getProductQuickViewAction(slug);
      if (result) {
        setData(result);
        setOpen(true);
        track(Events.QUICK_VIEW, {
          slug,
          brand: result.brandSlug,
          cached: false,
        });
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-label={`Vista rápida de ${slug}`}
        title="Vista rápida"
        className={cn(
          'group-hover/card:opacity-100 group-hover/card:translate-y-0',
          'sm:opacity-0 sm:translate-y-2 sm:transition-all sm:duration-300',
          'bg-background/80 text-foreground hover:bg-background absolute left-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full shadow-md backdrop-blur-sm disabled:opacity-60',
          className,
        )}
      >
        {isPending ? (
          <span className="border-foreground/40 border-t-foreground size-3 animate-spin rounded-full border-2" />
        ) : (
          <Eye className="size-4" strokeWidth={2} />
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          {data ? (
            <QuickViewBody data={data} href={href} onClose={() => setOpen(false)} />
          ) : (
            <div className="p-10 text-center">
              <p className="text-muted-foreground text-sm">Cargando…</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function QuickViewBody({
  data,
  href,
  onClose,
}: {
  data: QuickViewData;
  href: string;
  onClose: () => void;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    data.variants.find((v) => v.stockQty > 0)?.id ?? data.variants[0]?.id ?? null,
  );

  const selected = data.variants.find((v) => v.id === selectedVariantId);
  const price = selected?.priceCents;
  const inStock = selected ? selected.stockQty > 0 : false;
  // Imagen de la variante seleccionada, con fallback al global del producto.
  const imagePath = selected?.primaryImagePath ?? data.primaryImagePath;

  return (
    <div className="grid gap-0 md:grid-cols-[1fr_1.2fr]">
      <div className="bg-muted/30 relative aspect-square w-full overflow-hidden">
        {imagePath ? (
          <Image
            key={selectedVariantId ?? 'default'}
            src={getProductImageUrl(imagePath)}
            alt={data.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain p-6"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            Foto pendiente
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 md:p-8">
        <DialogDescription className="text-muted-foreground text-xs font-medium uppercase tracking-[0.15em]">
          {data.brandName}
        </DialogDescription>
        <DialogTitle className="mt-2">{data.name}</DialogTitle>
        {data.shortDescription && (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {data.shortDescription}
          </p>
        )}

        <div className="border-border/40 mt-5 border-t pt-5">
          {price !== undefined ? (
            <p className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
              {formatPriceCents(price)}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Sin variantes activas</p>
          )}
          {price !== undefined && inStock && (
            <p className="text-muted-foreground mt-1 inline-flex items-center gap-1.5 text-xs">
              <span className="size-1.5 rounded-full bg-green-600" />
              En stock
            </p>
          )}
          {price !== undefined && !inStock && (
            <p className="text-muted-foreground/80 mt-1 text-xs">
              Sin stock — consultá disponibilidad
            </p>
          )}
        </div>

        {data.variants.length > 1 && (
          <div className="mt-5">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
              Variante
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const isOut = v.stockQty <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border/60 bg-background text-foreground hover:bg-muted/40',
                      isOut && 'opacity-50',
                    )}
                  >
                    {v.colorFrame ?? v.sku}
                    {isOut && <span className="ml-1">·sin stock</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-6">
          <Button asChild size="lg" className="w-full">
            <Link href={href} onClick={onClose}>
              Ver detalles
              <ArrowRight className="ml-2 size-4" strokeWidth={2} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
