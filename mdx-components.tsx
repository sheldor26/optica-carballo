import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, ShieldCheck, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { fetchProductsBySlugs } from '@/lib/catalog/queries';

/** Mapa de componentes MDX. Tipado local (no usamos `@types/mdx`). Next.js
 * llama a `useMDXComponents` en runtime; el tipo es solo para DX. */
type MDXComponentMap = Record<string, unknown>;

/**
 * Componentes MDX para las guías (`content/guias/*.mdx`). Next.js App Router
 * los aplica automáticamente a todo .mdx compilado (convención: este archivo
 * vive en la raíz del proyecto). Ver ARTICLE_SEO_STANDARD.md §5.
 *
 * Todos son server components salvo donde se reusa `ProductCard` (client).
 * Los componentes de producto consumen `fetchProductsBySlugs`, que ya devuelve
 * la card data con el scale de la pipeline central (regla 15 de CLAUDE.md) —
 * PROHIBIDO armar ProductCardData a mano acá.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';

// ── Imagen de artículo (optimizada con next/image + epígrafe opcional) ────────

/**
 * Imagen dentro del cuerpo de una guía. `src` = ruta dentro del bucket público
 * `article-images` (ej. "como-leer-receta-anteojos/esfera.jpg"). Acepta URL
 * absoluta también. `alt` obligatorio (SEO + accesibilidad). `caption` opcional.
 * Contenedor 16:9 con object-cover; next/image sirve AVIF/WebP responsivo.
 */
function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const url = src.startsWith('http')
    ? src
    : `${SUPABASE_URL}/storage/v1/object/public/article-images/${src}`;
  return (
    <figure className="not-prose my-8 md:my-10">
      <div className="bg-zinc-50 relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="text-muted-foreground mt-2 text-center text-xs sm:text-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// ── Callouts / bloques editoriales ──────────────────────────────────────────

/** "Lo importante en una línea" — capta el escaneo + candidato a snippet. */
function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <aside className="not-prose border-brand/40 bg-brand/5 my-6 flex gap-3 rounded-xl border-l-4 px-5 py-4">
      <Lightbulb className="text-brand mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="text-foreground text-sm leading-relaxed sm:text-base">
        {children}
      </div>
    </aside>
  );
}

/** Disclaimer médico — obligatorio al final de guías de salud (E-E-A-T/YMYL). */
function MedicalDisclaimer() {
  return (
    <aside className="not-prose border-border bg-muted/30 text-muted-foreground my-8 flex gap-3 rounded-lg border p-4 text-xs leading-relaxed sm:text-sm">
      <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        Esta guía es informativa y fue revisada por nuestro equipo de óptica. No
        reemplaza la consulta con un médico oftalmólogo. Ante síntomas o dudas,
        consultá a un profesional. No vendemos anteojos recetados ni lentes de
        contacto sin receta válida.
      </p>
    </aside>
  );
}

// ── Listas visuales ───────────────────────────────────────────────────────────

/** Lista de pasos/partes en formato visual con número — escaneable, "con aire".
 * Reemplaza párrafos en negrita enumerados por tarjetas claras. */
function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="not-prose my-6 list-none space-y-3 pl-0">{children}</ol>;
}

/** Un ítem de `<Steps>`. `n` = etiqueta del badge (número o símbolo); `title` =
 * encabezado del ítem; los children llevan la descripción (admite markdown). */
function Step({
  n,
  title,
  children,
}: {
  n: number | string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="border-border bg-muted/30 flex gap-4 rounded-xl border p-4">
      <span
        className="bg-brand/10 text-brand flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
        aria-hidden="true"
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-foreground m-0 font-medium">{title}</p>
        {children && (
          <div className="text-muted-foreground mt-1 text-sm leading-relaxed [&>p]:m-0">
            {children}
          </div>
        )}
      </div>
    </li>
  );
}

// ── CTAs internos ────────────────────────────────────────────────────────────

/** CTA a una categoría/página comercial. Anchor descriptivo, no "click acá". */
function CategoryCta({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="not-prose border-border hover:border-foreground/40 group my-6 flex items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-colors"
    >
      <span>
        <span className="text-foreground block font-medium">{title}</span>
        {children && (
          <span className="text-muted-foreground mt-0.5 block text-sm">
            {children}
          </span>
        )}
      </span>
      <span className="text-brand shrink-0 text-sm font-medium group-hover:underline">
        Ver →
      </span>
    </Link>
  );
}

const TOOLS: Record<string, { href: string; label: string; desc: string }> = {
  'lector-de-receta': {
    href: '/lector-de-receta',
    label: 'Leé tu receta con IA',
    desc: 'Subí una foto de tu receta y te la interpretamos al instante.',
  },
  'medidor-de-dnp': {
    href: '/medidor-de-dnp',
    label: 'Medí tu DNP gratis',
    desc: 'Distancia naso-pupilar con la cámara y una tarjeta. Clave para multifocales.',
  },
  recomendador: {
    href: '/recomendador-de-monturas',
    label: 'Recomendador de monturas con IA',
    desc: 'Te sugerimos armazones según tu rostro y estilo.',
  },
};

/** CTA a una herramienta del sitio (alta conversión). */
function ToolCta({ tool }: { tool: keyof typeof TOOLS | string }) {
  const t = TOOLS[tool];
  if (!t) return null;
  return (
    <Link
      href={t.href}
      className="not-prose from-brand/10 to-background border-brand/30 group my-6 flex items-center justify-between gap-4 rounded-xl border bg-gradient-to-br px-5 py-4 transition-colors"
    >
      <span className="flex items-start gap-3">
        <Sparkles className="text-brand mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>
          <span className="text-foreground block font-medium">{t.label}</span>
          <span className="text-muted-foreground mt-0.5 block text-sm">
            {t.desc}
          </span>
        </span>
      </span>
      <span className="text-brand shrink-0 text-sm font-medium group-hover:underline">
        Probar →
      </span>
    </Link>
  );
}

// ── Productos embebidos (async server components, vía pipeline central) ───────

/** Mapea la card data de `fetchProductsBySlugs` (WishlistProductCard) al shape
 * que consume `<ProductCard>`. href + scale + variants ya vienen listos. */
function toCardData(p: Awaited<ReturnType<typeof fetchProductsBySlugs>>[number]) {
  return {
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    minPriceCents: p.minPriceCents,
    inStockCount: p.inStockCount,
    primaryImagePath: p.primaryImagePath,
    secondaryImagePath: p.secondaryImagePath,
    primaryImageScale: p.primaryImageScale,
    secondaryImageScale: p.secondaryImageScale,
    sizeFit: p.sizeFit,
    variants: p.variants,
    href: `/${p.categorySlug}/${p.brandSlug}/${p.slug}`,
    categorySlug: p.categorySlug,
    brandSlug: p.brandSlug,
  };
}

/** Ofrece UN producto puntual inline (la solución real del tema del artículo).
 * Honestidad: solo productos en stock real; el copy no debe contradecir el
 * cuerpo. Si el slug no existe / sin stock, no renderiza nada. */
async function ProductCta({
  slug,
  heading = 'Te puede servir',
}: {
  slug: string;
  heading?: string;
}) {
  const products = await fetchProductsBySlugs([slug]);
  const product = products[0];
  if (!product) return null;
  return (
    <section className="not-prose my-8">
      <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-[0.15em]">
        {heading}
      </p>
      <div className="max-w-xs">
        <ProductCard product={toCardData(product)} />
      </div>
    </section>
  );
}

/** Grid de productos relacionados al final del artículo. Preserva el orden de
 * los slugs pasados. */
async function RelatedProducts({
  slugs,
  heading = 'Modelos que te pueden interesar',
}: {
  slugs: string[];
  heading?: string;
}) {
  const products = await fetchProductsBySlugs(slugs);
  if (products.length === 0) return null;
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const ordered = slugs.map((s) => bySlug.get(s)).filter(Boolean) as typeof products;
  return (
    <section className="not-prose my-10">
      <h2 className="text-foreground font-serif text-2xl font-medium tracking-tight">
        {heading}
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
        {ordered.map((p) => (
          <ProductCard key={p.slug} product={toCardData(p)} />
        ))}
      </div>
    </section>
  );
}

// ── Overrides de elementos HTML ───────────────────────────────────────────────

/** Links: externos → nueva pestaña + rel seguro (citas a autoridades). Internos
 * → Link de Next. Mantiene el estilo prose. */
function MdxLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const isExternal = /^https?:\/\//.test(href) && !href.startsWith(SITE_URL);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...(rest as Record<string, unknown>)}>
      {children}
    </Link>
  );
}

/** Tablas con scroll horizontal en mobile (para comparativas → snippet de tabla). */
function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table
        className="w-full border-collapse text-sm [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold"
        {...props}
      />
    </div>
  );
}

export function useMDXComponents(
  components: MDXComponentMap,
): MDXComponentMap {
  return {
    ...components,
    a: MdxLink,
    table: MdxTable,
    KeyTakeaway,
    MedicalDisclaimer,
    ArticleImage,
    Steps,
    Step,
    CategoryCta,
    ToolCta,
    ProductCta,
    RelatedProducts,
  };
}
