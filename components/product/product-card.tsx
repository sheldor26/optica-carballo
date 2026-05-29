import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';

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
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.inStockCount === 0;
  const primaryUrl = product.primaryImagePath
    ? getProductImageUrl(product.primaryImagePath)
    : null;
  const secondaryUrl = product.secondaryImagePath
    ? getProductImageUrl(product.secondaryImagePath)
    : null;

  return (
    <Link href={product.href} className="group/card block h-full">
      <Card className="hover:border-foreground/30 flex h-full flex-col transition-all duration-300 ease-out group-hover/card:-translate-y-0.5 group-hover/card:shadow-lg">
        <CardHeader className="pb-3">
          <div
            className="bg-background border-border/40 relative aspect-[4/3] w-full overflow-hidden rounded-md border p-2"
            aria-hidden="true"
          >
            {primaryUrl ? (
              <>
                <Image
                  src={primaryUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={cn(
                    'object-contain transition-all duration-500 ease-out',
                    // Si hay secondary → crossfade (opacity 0 al hover).
                    // Si NO hay → scale leve como antes (sino la card no
                    // tendría feedback de hover en la imagen).
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
        </CardHeader>
        <CardContent className="flex-1">
          <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
          {product.shortDescription && (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
              {product.shortDescription}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-baseline justify-between gap-2 pt-3">
          {product.minPriceCents !== null ? (
            <p className="text-base font-semibold">
              <span className="text-muted-foreground text-xs font-normal">Desde </span>
              {formatPriceCents(product.minPriceCents)}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Sin stock</p>
          )}
          {outOfStock ? (
            <span className="text-destructive text-xs font-medium">Sin stock</span>
          ) : (
            <ArrowRight
              className="text-muted-foreground group-hover/card:text-foreground size-4 transition-all duration-300 group-hover/card:translate-x-0.5"
              aria-hidden="true"
            />
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
