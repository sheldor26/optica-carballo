import type { MetadataRoute } from 'next';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { hasAvailableStock } from '@/lib/catalog/availability';
import { BRAND_FILTERS } from '@/lib/catalog/brand-filters';
import { createStaticClient } from '@/lib/supabase/static';
import { listArticles } from '@/lib/content/articles';

const NOW_LAST_MODIFIED = new Date();

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

type ProductSitemapRow = {
  slug: string;
  name: string;
  updated_at: string;
  brand: { slug: string };
  category: { slug: string };
  variants: { is_active: boolean; stock_qty: number }[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const [{ data: brands }, { data: products }] = await Promise.all([
    supabase.from('brands').select('slug, updated_at').eq('is_active', true),
    supabase
      .from('products')
      .select(
        'slug, name, updated_at, brand:brands!inner(slug), category:categories!inner(slug), variants:product_variants(is_active, stock_qty)',
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
      // Indexable (sin noindex) pero faltaba acá — hallazgo bajo, audit 2026-08-01.
      url: `${SITE_URL}/descubrir`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/lector-de-receta`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/cargar-receta`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/medidor-de-dnp`,
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
    // Sub-páginas /sobre-la-marca con texto SEO largo (separado del catálogo
    // para mantener UX limpia). Captura queries informacionales sobre la marca.
    {
      url: `${SITE_URL}/anteojos-de-sol/${b.slug}/sobre-la-marca`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/anteojos-de-receta/${b.slug}/sobre-la-marca`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
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

  // Excluir productos placeholder [PH] (nombres/precios sin confirmar) y sin
  // stock real (ninguna variante activa con stock_qty > 0) del sitemap — sin
  // esto Google indexaba fichas que no se pueden comprar (hallazgo #4,
  // audit 2026-08-01, mismo criterio que aplica `buildProductMetadata`).
  const productUrls: MetadataRoute.Sitemap = (products ?? [])
    .filter((p) => !isPlaceholder(p.name) && hasAvailableStock(p.variants))
    .map((p) => ({
      url: `${SITE_URL}/${p.category.slug}/${p.brand.slug}/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // Sub-categorías globales por forma/material/treatment SIN marca, ej:
  // `/anteojos-de-sol/aviador` (todos los aviadores de cualquier marca).
  // Captura queries genéricas tipo "anteojos aviador", "lentes wayfarer".
  const shapeUrls: MetadataRoute.Sitemap = BRAND_FILTERS.flatMap((filter) =>
    filter.categories.map((cat) => ({
      url: `${SITE_URL}/${cat === 'sol' ? 'anteojos-de-sol' : 'anteojos-de-receta'}/${filter.urlSlug}`,
      lastModified: NOW_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  );

  // Sub-categorías globales por género SIN marca. Captura queries genéricas
  // tipo "anteojos sol hombre", "lentes mujer". Priority alta (0.8) por
  // volumen SEO esperado superior a shape sin marca.
  const genderUrls: MetadataRoute.Sitemap = [
    'anteojos-de-sol',
    'anteojos-de-receta',
  ].flatMap((cat) =>
    ['hombre', 'mujer'].map((target) => ({
      url: `${SITE_URL}/${cat}/${target}`,
      lastModified: NOW_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  );

  // Guías: índice + cada artículo publicado (los draft no entran — listArticles
  // ya los excluye). Antes faltaban por completo en el sitemap.
  const articles = listArticles();
  const guidesUrls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/guias`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...articles.map((a) => ({
      url: `${SITE_URL}/guias/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticUrls,
    ...brandUrls,
    ...shapeUrls,
    ...genderUrls,
    ...productUrls,
    ...guidesUrls,
  ];
}
