import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
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
          className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl"
        >
          {heading}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Otros modelos de la misma categoría con stock disponible.
        </p>
      </RevealOnScroll>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
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
  const imageUrl = product.primaryImagePath
    ? getProductImageUrl(product.primaryImagePath)
    : null;

  return (
    <Link href={href} className="group block h-full">
      <Card className="hover:border-foreground/40 flex h-full flex-col overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <CardHeader className="p-2 md:p-3">
          <div className="bg-muted/40 relative aspect-square w-full overflow-hidden rounded-md">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
                Foto pendiente
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 px-3 pb-1 pt-0">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            {product.brandName}
          </p>
          <p className="text-foreground mt-0.5 line-clamp-2 text-sm font-medium leading-tight">
            {product.name}
          </p>
        </CardContent>
        <CardFooter className="px-3 pb-3 pt-1">
          {product.minPriceCents !== null ? (
            <p className="text-foreground text-sm font-semibold">
              {formatPriceCents(product.minPriceCents)}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">Sin stock</p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
