import type { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/static';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();
  const { data: brands } = await supabase
    .from('brands')
    .select('slug, updated_at')
    .eq('is_active', true);

  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/anteojos-de-sol`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/anteojos-de-receta`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const brandUrls: MetadataRoute.Sitemap = (brands ?? []).flatMap((b) => [
    {
      url: `${SITE_URL}/anteojos-de-sol/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/anteojos-de-receta/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]);

  return [...staticUrls, ...brandUrls];
}
