import {
  getBusinessInfo,
  GOOGLE_BUSINESS_URL,
  SOCIAL_LINKS,
} from '@/lib/site/business';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Optician (LocalBusiness sub-type) schema con campos completos para SEO
 * local Argentina + rich snippets Google.
 *
 * Regla: SOLO emite data verificable o universal para todas las ópticas
 * AR. Si falta una env var opcional (ej street, postal), se omite ese campo.
 * NUNCA inventar horarios, dirección o nombres.
 *
 * Campos universales aplicados:
 * - priceRange: $$ (segmento medio — todas las marcas trabajadas son medio).
 * - currenciesAccepted: ARS.
 * - paymentAccepted: tarjeta de crédito (vía Mercado Pago), efectivo (retiro local).
 * - areaServed: Argentina (envíos a todo el país).
 * - foundingDate: 1994 (30+ años a 2026-05-28).
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
    '@id': `${SITE_URL}#organization`,
    name: business.siteName,
    url: SITE_URL,
    // Image apunta al OG dinámico (Next 15 sirve este path desde
    // app/opengraph-image.tsx automáticamente). Generaba 404 antes porque
    // apuntaba a /og-image.png estático que nunca existió.
    image: `${SITE_URL}/opengraph-image`,
    address: {
      '@type': 'PostalAddress',
      ...addressParts,
    },
    priceRange: '$$',
    currenciesAccepted: 'ARS',
    paymentAccepted: 'Credit Card, Cash',
    areaServed: {
      '@type': 'Country',
      name: 'Argentina',
    },
    foundingDate: '1994',
    knowsAbout: [
      'Anteojos de sol',
      'Anteojos recetados',
      'Lentes de contacto',
      'Cristales oftálmicos',
      'Atención óptica',
    ],
  };

  if (business.phone) jsonLd.telephone = business.phone;

  const sameAs: string[] = [
    ...SOCIAL_LINKS.map((s) => s.url),
    GOOGLE_BUSINESS_URL,
  ];
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
