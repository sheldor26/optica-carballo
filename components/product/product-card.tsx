import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { WishlistButton } from '@/components/wishlist/wishlist-button';

export type ProductCardData = {
  slug: string;
  name: string;
  shortDescription: string | null;
  minPriceCents: number | null;
  inStockCount: number;
  primaryImagePath: string | null;
  /** 2da imagen (sort_order después de primary). Si existe, se muestra al
   * hacer hover sobre la card — patrón clásico de e-commerce de óptica/moda. */
  secondaryImagePath: string | null;
  href: string;
  /** Para construir entry de wishlist. */
  categorySlug: string;
  brandSlug: string;
};

/**
 * Card minimalista estilo premium/editorial (Acne Studios, Cartier, etc).
 * Sin Card wrapper visible (sin border/shadow/padding). Foto domina,
 * nombre uppercase + precio centrados debajo. "Sin stock" sutil.
 *
 * El WishlistButton va como sibling del Link (no DENTRO) para evitar
 * HTML inválido (<button> dentro de <a> es ilegal). El article wrapper
 * es relative para que el botón posicionado absolute funcione.
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.inStockCount === 0;
  const primaryUrl = product.primaryImagePath
    ? getProductImageUrl(product.primaryImagePath)
    : null;
  const secondaryUrl = product.secondaryImagePath
    ? getProductImageUrl(product.secondaryImagePath)
    : null;

  return (
    <article className="relative flex h-full flex-col">
      <WishlistButton
        entry={{
          slug: product.slug,
          category: product.categorySlug,
          brand: product.brandSlug,
        }}
        variant="card"
      />
      <Link
        href={product.href}
        className="group/card flex h-full flex-col"
        aria-label={product.name}
      >
        <div
          className="bg-background relative aspect-[4/3] w-full overflow-hidden"
          aria-hidden="true"
        >
          {primaryUrl ? (
            <>
              <Image
                src={primaryUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={cn(
                  'object-contain transition-all duration-500 ease-out',
                  secondaryUrl
                    ? 'group-hover/card:opacity-0'
                    : 'group-hover/card:scale-[1.04]',
                )}
              />
              {secondaryUrl && (
                <Image
                  src={secondaryUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain opacity-0 transition-opacity duration-500 ease-out group-hover/card:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              Foto pendiente
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-1 flex-col items-center gap-1 text-center">
          <h3 className="text-foreground text-sm font-normal uppercase tracking-[0.15em] md:text-[15px]">
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
    </article>
  );
}
