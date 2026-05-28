import { getBusinessInfo } from '@/lib/site/business';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Organization schema con sub-tipo Optician. Sólo emite campos del negocio
 * que están realmente configurados en env vars (sin inventar data).
 */
export function OrganizationJsonLd() {
  const business = getBusinessInfo();

  const addressParts: Record<string, string> = {};
  if (business.street) addressParts.streetAddress = business.street;
  if (business.locality) addressParts.addressLocality = business.locality;
  if (business.region) addressParts.addressRegion = business.region;
  if (business.postal) addressParts.postalCode = business.postal;
  addressParts.addressCountry = 'AR';

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Optician'],
    name: business.siteName,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      ...addressParts,
    },
  };

  if (business.phone) jsonLd.telephone = business.phone;

  const sameAs: string[] = [];
  if (business.whatsappNumber) {
    sameAs.push(`https://wa.me/${business.whatsappNumber}`);
  }
  if (sameAs.length > 0) jsonLd.sameAs = sameAs;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
