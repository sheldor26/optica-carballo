import type { RelatedProductCard } from '@/lib/catalog/queries';
import { safeJsonLd } from '@/lib/seo/json-ld';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

type Props = {
  products: RelatedProductCard[];
};

export function RelatedItemListJsonLd({ products }: Props) {
  if (products.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Anteojos similares',
    itemListElement: products.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/${product.categorySlug}/${product.brandSlug}/${product.slug}`,
      name: product.name,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
