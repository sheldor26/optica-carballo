import { safeJsonLd } from '@/lib/seo/json-ld';

type ProductEntry = {
  name: string;
  slug: string;
  minPriceCents: number | null;
  inStockCount: number;
};

type Args = {
  brandName: string;
  brandDescription: string | null;
  categoryName: string;
  pageUrl: string;
  products: ProductEntry[];
};

export function CatalogJsonLd({
  brandName,
  brandDescription,
  categoryName,
  pageUrl,
  products,
}: Args) {
  const inStock = products.filter((p) => p.inStockCount > 0);
  const prices = inStock
    .map((p) => p.minPriceCents)
    .filter((c): c is number => c !== null);
  const lowestPrice = prices.length ? Math.min(...prices) / 100 : null;
  const highestPrice = prices.length ? Math.max(...prices) / 100 : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: pageUrl,
    name: `${categoryName} ${brandName}`,
    about: {
      '@type': 'Brand',
      name: brandName,
      ...(brandDescription ? { description: brandDescription } : {}),
    },
    ...(lowestPrice !== null && highestPrice !== null
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'ARS',
            lowPrice: lowestPrice,
            highPrice: highestPrice,
            offerCount: inStock.length,
          },
        }
      : {}),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          brand: { '@type': 'Brand', name: brandName },
          ...(p.minPriceCents !== null
            ? {
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'ARS',
                  price: p.minPriceCents / 100,
                  availability:
                    p.inStockCount > 0
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                },
              }
            : {}),
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
