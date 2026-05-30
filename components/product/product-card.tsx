'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { QuickView } from '@/components/product/quick-view';
import { WishlistButton } from '@/components/wishlist/wishlist-button';

export type ProductCardVariant = {
  id: string;
  /** Label legible (color del armazón). Para tooltip + a11y. */
  label: string;
  /** Imagen primary de esta variante (la que muestra el thumbnail). */
  primaryImagePath: string | null;
  /** Imagen secondary (lateral). Para hover swap dentro de la misma variante. */
  secondaryImagePath: string | null;
  inStock: boolean;
};

export type ProductCardData = {
  slug: string;
  name: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  /** Imagen primary de la variante DEFAULT (la que se muestra al cargar). */
  primaryImagePath: string | null;
  /** Imagen secondary de la variante DEFAULT (para hover swap). */
  secondaryImagePath: string | null;
  href: string;
  /** Para construir entry de wishlist. */
  categorySlug: string;
  brandSlug: string;
  /** Variantes para thumbnails clickeables. La primera entrada suele ser la
   * misma que primaryImagePath / secondaryImagePath. Si solo hay 1 variante
   * o el shape no lo provee (compat con consumers viejos), los thumbs NO
   * se renderizan. */
  variants?: ProductCardVariant[];
};

const MAX_VISIBLE_THUMBS = 5;

/**
 * Card minimalista estilo retail premium. Foto del producto domina,
 * nombre + precio centrados debajo, thumbnails de variantes opcionales.
 *
 * Interactividad (client component):
 * - Hover sobre la card → swap entre primary (frontal) y secondary (lateral)
 *   de la MISMA variante seleccionada (NO cambia a otra variante).
 * - Click en thumbnail → cambia la variante mostrada en la card.
 *
 * WishlistButton va como sibling del Link (no DENTRO) para evitar HTML
 * inválido (<button> dentro de <a>). El article wrapper es relative para
 * que el botón posicionado absolute funcione.
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.inStockCount === 0;
  const variants = product.variants ?? [];
  const hasMultipleVariants = variants.length > 1;

  // Estado: variante actualmente mostrada. Default: la primera del array
  // (que es la que matchea con primary/secondaryImagePath del data).
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );

  // Imágenes a mostrar: si hay variante seleccionada, usar sus imágenes.
  // Si no (caso edge: producto sin variantes), usar las top-level del data.
  const currentImages = useMemo(() => {
    if (selectedVariantId === null) {
      return {
        primary: product.primaryImagePath,
        secondary: product.secondaryImagePath,
      };
    }
    const variant = variants.find((v) => v.id === selectedVariantId);
    if (!variant) {
      return {
        primary: product.primaryImagePath,
        secondary: product.secondaryImagePath,
      };
    }
    return {
      primary: variant.primaryImagePath,
      secondary: variant.secondaryImagePath,
    };
  }, [
    selectedVariantId,
    variants,
    product.primaryImagePath,
    product.secondaryImagePath,
  ]);

  const primaryUrl = currentImages.primary
    ? getProductImageUrl(currentImages.primary)
    : null;
  const secondaryUrl = currentImages.secondary
    ? getProductImageUrl(currentImages.secondary)
    : null;

  return (
    <article className="group/card relative flex h-full flex-col">
      <WishlistButton
        entry={{
          slug: product.slug,
          category: product.categorySlug,
          brand: product.brandSlug,
        }}
        variant="card"
      />
      <QuickView slug={product.slug} href={product.href} />
      <Link
        href={product.href}
        className="flex h-full flex-col"
        aria-label={product.name}
      >
        <div
          className="group/image bg-background relative aspect-[3/2] w-full overflow-hidden rounded-md"
          aria-hidden="true"
        >
          {primaryUrl ? (
            <>
              <Image
                key={`${selectedVariantId ?? 'default'}-primary`}
                src={primaryUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={cn(
                  'scale-[1.4] object-contain transition-all duration-500 ease-out',
                  secondaryUrl
                    ? 'group-hover/image:opacity-0'
                    : 'group-hover/image:scale-[1.5]',
                )}
              />
              {secondaryUrl && (
                <Image
                  key={`${selectedVariantId ?? 'default'}-secondary`}
                  src={secondaryUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="scale-[1.4] object-contain opacity-0 transition-opacity duration-500 ease-out group-hover/image:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              Foto pendiente
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-1 flex-col items-center gap-1 text-center">
          <h3 className="text-foreground text-sm font-medium uppercase tracking-[0.15em] md:text-[15px]">
            {product.name}
          </h3>
          {product.minPriceCents !== null ? (
            <p className="text-muted-foreground text-sm tabular-nums">
              {formatPriceCents(product.minPriceCents)}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Sin stock</p>
          )}
          {outOfStock && product.minPriceCents !== null && (
            <p className="text-muted-foreground/70 mt-0.5 text-xs">Sin stock</p>
          )}
        </div>
      </Link>

      {hasMultipleVariants && (
        <VariantThumbnails
          variants={variants}
          selectedVariantId={selectedVariantId}
          onSelect={setSelectedVariantId}
        />
      )}
    </article>
  );
}

/**
 * Tira horizontal de thumbnails (uno por variante). Click cambia la imagen
 * mostrada en la card. Sin stock → tinte gris. Si hay más de MAX_VISIBLE_THUMBS,
 * mostramos "+N" al final (sin overflow horizontal).
 */
function VariantThumbnails({
  variants,
  selectedVariantId,
  onSelect,
}: {
  variants: ProductCardVariant[];
  selectedVariantId: string | null;
  onSelect: (id: string) => void;
}) {
  const visible = variants.slice(0, MAX_VISIBLE_THUMBS);
  const hiddenCount = variants.length - visible.length;

  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      {visible.map((v) => {
        const isActive = v.id === selectedVariantId;
        const url = v.primaryImagePath
          ? getProductImageUrl(v.primaryImagePath)
          : null;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            onMouseEnter={() => onSelect(v.id)}
            aria-label={`Ver ${v.label}`}
            aria-pressed={isActive}
            className={cn(
              'bg-background relative size-16 shrink-0 overflow-hidden rounded border transition-colors md:size-20',
              isActive
                ? 'border-foreground'
                : 'border-border/60 hover:border-foreground/40',
              !v.inStock && 'opacity-50',
            )}
          >
            {url ? (
              <Image
                src={url}
                alt={v.label}
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="scale-[1.3] object-contain p-1"
              />
            ) : (
              <span className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
                —
              </span>
            )}
          </button>
        );
      })}
      {hiddenCount > 0 && (
        <span className="text-muted-foreground text-xs">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
