import Image from 'next/image';
import Link from 'next/link';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import type { RelatedProductCard } from '@/lib/catalog/queries';

type Props = {
  products: RelatedProductCard[];
  heading?: string;
};

export function RelatedProducts({
  products,
  heading = 'Anteojos similares',
}: Props) {
  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="related-products-heading"
      className="mt-16 border-t pt-10"
    >
      <RevealOnScroll>
        <h2
          id="related-products-heading"
          className="text-foreground font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl"
        >
          {heading}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Otros modelos de la misma categoría con stock disponible.
        </p>
      </RevealOnScroll>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-6">
        {products.map((product, idx) => (
          <RevealOnScroll
            as="li"
            key={product.slug}
            delay={60 * idx}
            className="h-full"
          >
            <RelatedCard product={product} />
          </RevealOnScroll>
        ))}
      </ul>
    </section>
  );
}

function RelatedCard({ product }: { product: RelatedProductCard }) {
  const href = `/${product.categorySlug}/${product.brandSlug}/${product.slug}`;
  const primaryUrl = product.primaryImagePath
    ? getProductImageUrl(product.primaryImagePath)
    : null;
  const secondaryUrl = product.secondaryImagePath
    ? getProductImageUrl(product.secondaryImagePath)
    : null;

  return (
    <Link href={href} className="group block h-full" aria-label={`${product.brandName} ${product.name}`}>
      <article className="flex h-full flex-col">
        <div className="bg-background relative aspect-[4/3] w-full overflow-hidden">
          {primaryUrl ? (
            <>
              <Image
                src={primaryUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                style={{ transform: `scale(${product.primaryImageScale})` }}
                className={cn(
                  'object-contain transition-all duration-500 ease-out',
                  secondaryUrl
                    ? 'group-hover:opacity-0'
                    : 'group-hover:scale-[1.03]',
                )}
              />
              {secondaryUrl && (
                <Image
                  src={secondaryUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  style={{ transform: `scale(${product.secondaryImageScale})` }}
                  className="object-contain opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
              Foto pendiente
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-1 flex-col items-center gap-0.5 text-center">
          <p className="text-muted-foreground/80 text-[10px] font-medium uppercase tracking-[0.18em]">
            {product.brandName}
          </p>
          <h3 className="text-foreground text-xs font-normal uppercase tracking-[0.12em] line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.minPriceCents !== null ? (
            <p className="text-muted-foreground mt-1 text-xs tabular-nums">
              {formatPriceCents(product.minPriceCents)}
            </p>
          ) : (
            <p className="text-muted-foreground/70 mt-1 text-xs">Sin stock</p>
          )}
        </div>
      </article>
    </Link>
  );
}
