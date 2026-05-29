import type { MetadataRoute } from 'next';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { BRAND_FILTERS } from '@/lib/catalog/brand-filters';
import { createStaticClient } from '@/lib/supabase/static';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

type ProductSitemapRow = {
  slug: string;
  name: string;
  updated_at: string;
  brand: { slug: string };
  category: { slug: string };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const [{ data: brands }, { data: products }] = await Promise.all([
    supabase.from('brands').select('slug, updated_at').eq('is_active', true),
    supabase
      .from('products')
      .select(
        'slug, name, updated_at, brand:brands!inner(slug), category:categories!inner(slug)',
      )
      .eq('is_active', true)
      .returns<ProductSitemapRow[]>(),
  ]);

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
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/anteojos-de-receta`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/sobre-nosotros`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/marcas`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/recomendador-de-monturas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/lector-de-receta`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/preguntas-frecuentes`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/politica-de-devolucion`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/boton-de-arrepentimiento`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/defensa-del-consumidor`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/politica-de-privacidad`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terminos-y-condiciones`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const brandUrls: MetadataRoute.Sitemap = (brands ?? []).flatMap((b) => [
    {
      url: `${SITE_URL}/anteojos-de-sol/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/anteojos-de-receta/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Páginas hijas SEO por género (4 por marca). Volumen target alto
    // según SEO_STRATEGY (3.200/2.600 vol/mes para "rusty hombre/mujer", etc).
    {
      url: `${SITE_URL}/anteojos-de-sol/${b.slug}/hombre`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/anteojos-de-sol/${b.slug}/mujer`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/anteojos-de-receta/${b.slug}/hombre`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/anteojos-de-receta/${b.slug}/mujer`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    // Páginas hijas SEO por filtro (polarizados + formas). Generadas por
    // BRAND_FILTERS — cada filtro × cada categoría aplicable.
    ...BRAND_FILTERS.flatMap((filter) =>
      filter.categories.map((cat) => ({
        url: `${SITE_URL}/${cat === 'sol' ? 'anteojos-de-sol' : 'anteojos-de-receta'}/${b.slug}/${filter.urlSlug}`,
        lastModified: new Date(b.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ),
  ]);

  // Excluir productos placeholder [PH] del sitemap: no deben indexarse hasta
  // que el founder confirme nombres y precios reales.
  const productUrls: MetadataRoute.Sitemap = (products ?? [])
    .filter((p) => !isPlaceholder(p.name))
    .map((p) => ({
      url: `${SITE_URL}/${p.category.slug}/${p.brand.slug}/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [...staticUrls, ...brandUrls, ...productUrls];
}
