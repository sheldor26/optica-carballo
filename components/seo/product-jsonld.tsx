type Offer = {
  priceCents: number;
  stockQty: number;
  sku: string;
};

type Args = {
  name: string;
  description: string | null;
  brandName: string;
  brandUrl?: string;
  pageUrl: string;
  imageUrl: string | null;
  offers: Offer[];
};

export function ProductJsonLd({
  name,
  description,
  brandName,
  brandUrl,
  pageUrl,
  imageUrl,
  offers,
}: Args) {
  const inStockOffers = offers.filter((o) => o.stockQty > 0);
  const prices = inStockOffers.map((o) => o.priceCents / 100);
  const hasInStock = inStockOffers.length > 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  let offerData: Record<string, unknown>;
  if (!hasInStock) {
    offerData = {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ARS',
        availability: 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: pageUrl,
      },
    };
  } else if (minPrice === maxPrice) {
    offerData = {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ARS',
        price: minPrice,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: pageUrl,
      },
    };
  } else {
    offerData = {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'ARS',
        lowPrice: minPrice,
        highPrice: maxPrice,
        offerCount: inStockOffers.length,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    };
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description ? { description } : {}),
    brand: {
      '@type': 'Brand',
      name: brandName,
      ...(brandUrl ? { url: brandUrl } : {}),
    },
    url: pageUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(offers[0]?.sku ? { sku: offers[0].sku } : {}),
    ...offerData,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
