import { getBusinessInfo } from '@/lib/site/business';
import { safeJsonLd } from '@/lib/seo/json-ld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** WebSite schema básico. Sin SearchAction porque no hay search global todavía. */
export function WebsiteJsonLd() {
  const { siteName } = getBusinessInfo();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: SITE_URL,
    inLanguage: 'es-AR',
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
