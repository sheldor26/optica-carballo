import type { Metadata } from 'next';
// Cliente estático (sin cookies): la metadata de páginas públicas no depende
// de sesión, y leer cookies acá volvía DINÁMICAS todas las rutas que usan
// estos builders — anulaba el ISR (audit perf 2026-06-11).
import { createStaticClient } from '@/lib/supabase/static';
import { fetchCategoryByFilter } from '@/lib/catalog/queries';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { hasAvailableStock } from '@/lib/catalog/availability';
import { CATEGORIES, type CategoryConfig } from '@/lib/catalog/categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

type BrandMetaRow = { name: string };
type ProductMetaRow = {
  name: string;
  short_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  variants: { is_active: boolean; stock_qty: number }[];
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
  const supabase = createStaticClient();
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

  // Título corto (hallazgo #9, audit 2026-08-01): "Envío a Todo el País" se
  // sacó del title (se trunca en SERP en combos con marcas largas) — el dato
  // ya está en la description.
  const title = `${category.name} ${brand.name} | Originales - Óptica Carballo`;
  const description = `${capitalize(category.metaPhrase)} ${brand.name} originales. Envíos a todo Argentina, cuotas sin interés y asesoramiento personal con experiencia en óptica. 30+ años de experiencia.`;
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
 * Metadata para sub-categoría global por género SIN marca — `/anteojos-de-{sol,receta}/{hombre,mujer}`.
 * Captura queries genéricas tipo "anteojos sol hombre", "lentes mujer".
 */
export function buildCategoryGenderMetadata(args: {
  category: CategoryConfig;
  target: 'hombre' | 'mujer';
}): Metadata {
  const targetLabel = args.target === 'hombre' ? 'Hombre' : 'Mujer';
  const title = `${args.category.name} ${targetLabel} | Originales - Óptica Carballo`;
  const description = `${capitalize(args.category.metaPhrase)} para ${args.target}. Envíos a todo Argentina, cuotas sin interés y asesoramiento personal con experiencia en óptica. 30+ años de experiencia.`;
  const url = `${SITE_URL}/${args.category.slug}/${args.target}`;

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

type CategoryShapeMetaInput = {
  category: CategoryConfig;
  filterLabel: string;
  filterUrlSlug: string;
  filterMetaPhrase: string;
  /** Predicado del filtro. Si se pasa, se cuenta el catálogo y la página se
   * marca `noindex, follow` cuando da 0 productos (thin content: ej "aviador"
   * o "acetato" todavía sin stock). Sin esto, comportamiento previo (indexable). */
  filter?: Parameters<typeof fetchCategoryByFilter>[0]['filter'];
};

/**
 * Metadata para sub-categoría global por forma/material/treatment SIN marca —
 * `/anteojos-de-{sol,receta}/[shape]`. Captura queries genéricas tipo
 * "anteojos aviador", "lentes wayfarer", "anteojos polarizados".
 */
export async function buildCategoryShapeMetadata({
  category,
  filterLabel,
  filterUrlSlug,
  filterMetaPhrase,
  filter,
}: CategoryShapeMetaInput): Promise<Metadata> {
  const title = `${category.name} ${filterLabel} | Originales - Óptica Carballo`;
  const description = `${capitalize(category.metaPhrase)} ${filterMetaPhrase}. Envíos a todo Argentina, cuotas sin interés y asesoramiento personal con experiencia en óptica. 30+ años de experiencia.`;
  const url = `${SITE_URL}/${category.slug}/${filterUrlSlug}`;

  // Si se pasó el predicado, contamos el catálogo: las páginas sin productos
  // (ej "aviador"/"acetato" todavía vacías con 2 marcas) salen `noindex` para
  // no meter thin content en Google. Se reindexan solas al cargar catálogo.
  let noindex = false;
  if (filter) {
    const products = await fetchCategoryByFilter({
      categorySlug: category.slug,
      filter,
    });
    noindex = products.length === 0;
  }

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/**
 * Metadata para sub-página `/anteojos-de-{sol,receta}/[brand]/sobre-la-marca`
 * — página dedicada con texto SEO largo separada del catálogo para mantener
 * el catálogo limpio. Captura queries informacionales sobre la marca.
 */
export async function buildBrandAboutMetadata(
  category: CategoryConfig,
  brandSlug: string,
): Promise<Metadata> {
  const supabase = createStaticClient();
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

  const title = `Sobre ${brand.name} — Historia, Líneas y Catálogo en Óptica Carballo`;
  const description = `Conocé ${brand.name}: historia, identidad y propuesta de la marca aplicada al mundo de la óptica. Distribución oficial en Argentina con asesoramiento personal con experiencia en óptica.`;
  const url = `${SITE_URL}/${category.slug}/${brandSlug}/sobre-la-marca`;
  // Canonical cruzado hacia la versión de sol (adenddum GSC, audit 2026-08-01):
  // sol y receta muestran el mismo seo_intro/seo_outro (misma fila de `brands`,
  // sin diferenciación por categoría) — es contenido duplicado real, y Google
  // ya venía eligiendo sol como canonical por su cuenta. Esto lo hace explícito
  // en vez de dejar que Google adivine. La versión de sol se autocanonicaliza.
  const canonicalUrl = `${SITE_URL}/${CATEGORIES.sol.slug}/${brandSlug}/sobre-la-marca`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: { 'es-AR': canonicalUrl, 'x-default': canonicalUrl },
    },
    openGraph: { title, description, url, type: 'article' },
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
  const supabase = createStaticClient();
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
  const title = `${args.category.name} ${brand.name} ${targetLabel} | Originales - Óptica Carballo`;
  const description = `${capitalize(args.category.metaPhrase)} ${brand.name} para ${args.target}. Envíos a todo Argentina, cuotas sin interés y asesoramiento personal con experiencia en óptica. 30+ años de experiencia.`;
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
 * Metadata para páginas hijas SEO de marca filtradas por atributo —
 * `/anteojos-de-sol/[brand]/polarizados`, `.../wayfarer`, etc.
 *
 * Target keywords (SEO_STRATEGY.md):
 * - "anteojos de sol vulk polarizados"
 * - "anteojos de sol ray-ban wayfarer" (1.400 vol específico)
 * - patrón análogo para otras combinaciones.
 */
export async function buildBrandFilterMetadata(args: {
  category: CategoryConfig;
  brandSlug: string;
  filterLabel: string;
  filterUrlSlug: string;
  filterMetaPhrase: string;
  /** `true` → `robots: noindex, follow` (página sin productos: thin content
   * que no queremos en el índice de Google hasta que se cargue catálogo). */
  noindex?: boolean;
}): Promise<Metadata> {
  const supabase = createStaticClient();
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

  const title = `${args.category.name} ${brand.name} ${args.filterLabel} | Originales - Óptica Carballo`;
  const description = `${capitalize(args.category.metaPhrase)} ${brand.name} ${args.filterMetaPhrase}. Envíos a todo Argentina, cuotas sin interés y asesoramiento personal con experiencia en óptica.`;
  const url = `${SITE_URL}/${args.category.slug}/${args.brandSlug}/${args.filterUrlSlug}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
    robots: args.noindex ? { index: false, follow: true } : undefined,
  };
}

/**
 * Metadata para páginas de producto (sol o receta). Reciben `robots:
 * noindex, follow` los productos `[PH]` (placeholder) y los que no tienen
 * ninguna variante activa con stock — mandar a Google una ficha que no se
 * puede comprar contradice `SEO_STRATEGY.md` (hallazgo #4, audit 2026-08-01).
 */
export async function buildProductMetadata(
  category: CategoryConfig,
  brandSlug: string,
  productSlug: string,
): Promise<Metadata> {
  const supabase = createStaticClient();
  const { data: product } = await supabase
    .from('products')
    .select(
      'id, name, short_description, meta_title, meta_description, variants:product_variants(is_active, stock_qty)',
    )
    .eq('slug', productSlug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<ProductMetaRow & { id: string }>();

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  // Foto primary del producto → og:image. Necesario para que WhatsApp/
  // Facebook/Telegram muestren preview con foto al compartir el link.
  // Sin esto el preview cae al og:image genérico del sitio.
  const { data: primaryImage } = await supabase
    .from('product_images')
    .select('storage_path, alt_text')
    .eq('product_id', product.id)
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  const ogImageUrl = primaryImage?.storage_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${primaryImage.storage_path}`
    : null;

  const isPh = isPlaceholder(product.name);
  const outOfStock = !hasAvailableStock(product.variants);
  // `meta_title` es el título craftedo a mano con keyword research por
  // producto (evita canibalización entre hermanos de marca — ver
  // SEO_STRATEGY.md). Antes se ignoraba y siempre se armaba el genérico de
  // acá abajo (hallazgo #7, audit 2026-08-01) — research muerto en la DB.
  const title =
    product.meta_title ??
    `${product.name} | ${category.name} - Óptica Carballo`;
  const description =
    product.meta_description ??
    product.short_description ??
    `${product.name} en Óptica Carballo. Envíos a todo Argentina, pago seguro con Mercado Pago y asesoramiento personal con experiencia en óptica.`;
  const url = `${SITE_URL}/${category.slug}/${brandSlug}/${productSlug}`;

  return {
    title: { absolute: title },
    description,
    robots: isPh || outOfStock ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: { 'es-AR': url, 'x-default': url },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: primaryImage?.alt_text ?? product.name,
              },
            ],
          }
        : {}),
    },
  };
}

/**
 * Metadata para la home (`/`). Title con marca + categorías principales +
 * diferenciador. Description con E-E-A-T (experiencia, años, envíos).
 */
export function buildHomeMetadata(): Metadata {
  const title =
    'Óptica Carballo — Anteojos de Sol y Receta | Envíos a Todo el País';
  const description =
    'Óptica Carballo: anteojos de sol y receta originales. 30+ años de experiencia, asesoramiento personal, envíos a todo Argentina y cuotas sin interés.';
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
    ? `${capitalize(category.metaPhrase)} ${brandList}. Envíos a todo Argentina, cuotas sin interés y asesoramiento personal con experiencia en óptica.`
    : `${capitalize(category.metaPhrase)} en Óptica Carballo. Envíos a todo Argentina, cuotas sin interés y asesoramiento personal con experiencia en óptica.`;
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
 *
 * `incomplete: true` agrega `noindex` — usar mientras la página tenga datos
 * legales sin confirmar (`[A CONFIRMAR]` visible en el contenido, ej. razón
 * social/CUIT en Términos/Privacidad). Indexar una página legal incompleta
 * es peor trust signal que no indexarla (hallazgo #5, audit 2026-08-01,
 * verificado con argentine-ecom). Sacar el flag apenas el founder confirme
 * los datos pendientes.
 */
export function buildInfoPageMetadata(args: {
  title: string;
  description: string;
  slug: string;
  incomplete?: boolean;
}): Metadata {
  const fullTitle = `${args.title} | Óptica Carballo`;
  const url = `${SITE_URL}/${args.slug}`;
  return {
    title: { absolute: fullTitle },
    description: args.description,
    robots: args.incomplete ? { index: false, follow: true } : undefined,
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
