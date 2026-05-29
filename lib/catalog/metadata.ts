import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import type { CategoryConfig } from '@/lib/catalog/categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

type BrandMetaRow = { name: string };
type ProductMetaRow = {
  name: string;
  short_description: string | null;
  meta_description: string | null;
};

/**
 * Metadata para páginas de marca (sol o receta). Genera title con keyword
 * principal de la categoría + brand + diferenciador "Originales | Envío a
 * Todo el País", description con E-E-A-T, hreflang absoluto + x-default.
 */
export async function buildBrandMetadata(
  category: CategoryConfig,
  brandSlug: string,
): Promise<Metadata> {
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from('brands')
    .select('name')
    .eq('slug', brandSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<BrandMetaRow>();

  if (!brand) {
    return { title: 'Marca no encontrada' };
  }

  const title = `${category.name} ${brand.name} Originales | Envío a Todo el País - Óptica Carballo`;
  const description = `${capitalize(category.metaPhrase)} ${brand.name} originales. Envíos a todo Argentina, cuotas sin interés y asesoramiento de técnico óptico matriculado. 30+ años de experiencia.`;
  const url = `${SITE_URL}/${category.slug}/${brandSlug}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

/**
 * Metadata para páginas hijas SEO de marca por género —
 * `/anteojos-de-sol/[brand]/hombre` y `.../mujer`.
 *
 * Target keywords (SEO_STRATEGY.md):
 * - "anteojos de sol rusty hombre" (3.200 vol/mes)
 * - "anteojos de sol rusty mujer" (2.600 vol/mes)
 * - patrón análogo para otras marcas.
 */
export async function buildBrandGenderMetadata(args: {
  category: CategoryConfig;
  brandSlug: string;
  target: 'hombre' | 'mujer';
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from('brands')
    .select('name')
    .eq('slug', args.brandSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<BrandMetaRow>();

  if (!brand) {
    return { title: 'Marca no encontrada' };
  }

  const targetLabel = args.target === 'hombre' ? 'Hombre' : 'Mujer';
  const title = `${args.category.name} ${brand.name} ${targetLabel} | Originales con Envío - Óptica Carballo`;
  const description = `${capitalize(args.category.metaPhrase)} ${brand.name} para ${args.target}. Envíos a todo Argentina, cuotas sin interés y asesoramiento de técnico óptico matriculado. 30+ años de experiencia.`;
  const url = `${SITE_URL}/${args.category.slug}/${args.brandSlug}/${args.target}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

/**
 * Metadata para páginas de producto (sol o receta). Productos `[PH]` reciben
 * `robots: noindex, follow` para no contaminar Google con placeholders.
 */
export async function buildProductMetadata(
  category: CategoryConfig,
  brandSlug: string,
  productSlug: string,
): Promise<Metadata> {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, short_description, meta_description')
    .eq('slug', productSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<ProductMetaRow>();

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const isPh = isPlaceholder(product.name);
  const title = `${product.name} | ${category.name} - Óptica Carballo`;
  const description =
    product.meta_description ??
    product.short_description ??
    `${product.name} en Óptica Carballo. Envíos a todo Argentina, cuotas sin interés y asesoramiento de técnico óptico matriculado.`;
  const url = `${SITE_URL}/${category.slug}/${brandSlug}/${productSlug}`;

  return {
    title: { absolute: title },
    description,
    robots: isPh ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

/**
 * Metadata para la home (`/`). Title con marca + categorías principales +
 * diferenciador. Description con E-E-A-T (matriculados, años, envíos).
 */
export function buildHomeMetadata(): Metadata {
  const title =
    'Óptica Carballo — Anteojos de Sol y Receta | Envíos a Todo el País';
  const description =
    'Óptica Carballo: anteojos de sol y receta originales. 30+ años de experiencia, regente óptica matriculada, envíos a todo Argentina y cuotas sin interés.';
  const url = SITE_URL;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

/**
 * Metadata para páginas índice de categoría (`/anteojos-de-sol`,
 * `/anteojos-de-receta`). Title con keyword genérica + descripción que
 * lista las marcas con productos en esa categoría.
 */
export function buildCategoryIndexMetadata(
  category: CategoryConfig,
  brandNames: string[],
): Metadata {
  const title = `${category.name} — Marcas Originales con Envío | Óptica Carballo`;
  const brandList = formatBrandList(brandNames);
  const description = brandList
    ? `${capitalize(category.metaPhrase)} ${brandList}. Envíos a todo Argentina, cuotas sin interés y asesoramiento de técnico óptico matriculado.`
    : `${capitalize(category.metaPhrase)} en Óptica Carballo. Envíos a todo Argentina, cuotas sin interés y asesoramiento de técnico óptico matriculado.`;
  const url = `${SITE_URL}/${category.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

/**
 * Metadata para páginas estáticas de información/legales (sobre nosotros,
 * política de devolución, etc.). Title + description + canonical + hreflang.
 */
export function buildInfoPageMetadata(args: {
  title: string;
  description: string;
  slug: string;
}): Metadata {
  const fullTitle = `${args.title} | Óptica Carballo`;
  const url = `${SITE_URL}/${args.slug}`;
  return {
    title: { absolute: fullTitle },
    description: args.description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title: fullTitle, description: args.description, url, type: 'article' },
  };
}

function formatBrandList(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} y ${names[1]}`;
  const head = names.slice(0, -1).join(', ');
  const tail = names[names.length - 1];
  return `${head} y ${tail}`;
}

function capitalize(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
