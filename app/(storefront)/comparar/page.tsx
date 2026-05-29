import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecentlyViewed } from '@/components/recently-viewed/recently-viewed';
import { CompareRemoveButton } from '@/components/compare/compare-remove-button';
import {
  fetchProductsForCompareBySlugs,
  type CompareProductCard,
} from '@/lib/catalog/queries';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { readCompareCookie } from '@/lib/compare/cookie';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { formatPriceCents } from '@/lib/format/currency';

const SLUG = 'comparar';
const TITLE = 'Comparar anteojos';
const DESCRIPTION =
  'Compará hasta 4 modelos lado a lado: precio, marca, forma, material, medidas y más.';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    ...buildInfoPageMetadata({
      title: TITLE,
      description: DESCRIPTION,
      slug: SLUG,
    }),
    robots: { index: false, follow: false }, // página personal del usuario
  };
}

const FRAME_MATERIAL_LABELS: Record<string, string> = {
  acetate: 'Acetato',
  metal: 'Metal',
  injected: 'Inyectado',
  titanium: 'Titanio',
  'g-flex': 'G-Flex',
  'tr-90': 'TR-90',
};

const FRAME_SHAPE_LABELS: Record<string, string> = {
  wayfarer: 'Wayfarer',
  aviator: 'Aviador',
  round: 'Redondo',
  square: 'Cuadrado',
  rectangular: 'Rectangular',
  cat_eye: 'Cat eye',
  oversized: 'Oversized',
};

const GENDER_LABELS: Record<string, string> = {
  unisex: 'Unisex',
  male: 'Hombre',
  female: 'Mujer',
};

const LENS_TREATMENT_LABELS: Record<string, string> = {
  polarized: 'Polarizado',
  uv400: 'UV400',
  gradient: 'Degradé',
  mirrored: 'Espejado',
  photochromic: 'Fotocromático',
};

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function lensTreatmentsLabel(attributes: Record<string, unknown>): string | null {
  const arr = attributes.lens_treatment;
  if (!Array.isArray(arr)) return null;
  const labels = arr
    .filter((v): v is string => typeof v === 'string')
    .map((k) => LENS_TREATMENT_LABELS[k])
    .filter((v): v is string => Boolean(v));
  return labels.length > 0 ? labels.join(', ') : null;
}

function measurementMm(
  attributes: Record<string, unknown>,
  key: string,
): string | null {
  const m = attributes.measurements;
  if (!m || typeof m !== 'object') return null;
  const val = (m as Record<string, unknown>)[key];
  const n = asNumber(val);
  return n !== null ? `${n} mm` : null;
}

type Row = {
  label: string;
  values: (string | null)[];
};

function buildRows(products: CompareProductCard[]): Row[] {
  const getPrice = (p: CompareProductCard) =>
    p.minPriceCents !== null
      ? formatPriceCents(p.minPriceCents)
      : 'Sin stock';

  const getMaterial = (p: CompareProductCard) => {
    const k = asString(p.attributes.frame_material);
    return k ? FRAME_MATERIAL_LABELS[k] ?? k : null;
  };

  const getShape = (p: CompareProductCard) => {
    const k = asString(p.attributes.frame_shape);
    return k ? FRAME_SHAPE_LABELS[k] ?? k : null;
  };

  const getGender = (p: CompareProductCard) => {
    const k = asString(p.attributes.gender);
    return k ? GENDER_LABELS[k] ?? k : null;
  };

  return [
    { label: 'Marca', values: products.map((p) => p.brandName) },
    { label: 'Categoría', values: products.map((p) => p.categoryName) },
    { label: 'Precio', values: products.map(getPrice) },
    { label: 'Forma', values: products.map(getShape) },
    { label: 'Material', values: products.map(getMaterial) },
    {
      label: 'Tratamientos de lente',
      values: products.map((p) => lensTreatmentsLabel(p.attributes)),
    },
    { label: 'Género', values: products.map(getGender) },
    {
      label: 'Ancho total',
      values: products.map((p) => measurementMm(p.attributes, 'frame_width_mm')),
    },
    {
      label: 'Altura total',
      values: products.map((p) => measurementMm(p.attributes, 'lens_height_mm')),
    },
    {
      label: 'Puente',
      values: products.map((p) => measurementMm(p.attributes, 'bridge_mm')),
    },
    {
      label: 'Calibre del aro',
      values: products.map((p) => measurementMm(p.attributes, 'lens_width_mm')),
    },
    {
      label: 'Largo patillas',
      values: products.map((p) => measurementMm(p.attributes, 'temple_length_mm')),
    },
    {
      label: 'Peso',
      values: products.map((p) => {
        const w = asNumber(p.attributes.weight_grams);
        return w !== null ? `${w} g` : null;
      }),
    },
  ].filter((row) => row.values.some((v) => v !== null && v !== ''));
}

export default async function Page() {
  const entries = await readCompareCookie();
  const slugs = entries.map((e) => e.slug);
  const products = await fetchProductsForCompareBySlugs(slugs);

  // Orden según cookie (orden en que fueron agregados).
  const ordered = entries
    .map((e) => products.find((p) => p.slug === e.slug))
    .filter((p): p is CompareProductCard => Boolean(p));

  const rows = buildRows(ordered);

  return (
    <main className="container py-10 md:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-brand inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
          <Scale className="size-3.5" strokeWidth={2} />
          Comparador
        </p>
        <h1 className="text-foreground mt-4 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          Compará <span className="italic">lado a lado</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-sm md:text-base">
          {ordered.length === 0
            ? 'Todavía no agregaste productos para comparar.'
            : `${ordered.length} ${ordered.length === 1 ? 'modelo' : 'modelos'} en comparación.`}
        </p>
      </header>

      {ordered.length === 0 ? (
        <>
          <EmptyState />
          <RecentlyViewed
            heading="Mientras tanto, mirá lo que viste antes"
            limit={6}
            minToRender={2}
          />
        </>
      ) : (
        <CompareTable products={ordered} rows={rows} />
      )}
    </main>
  );
}

function CompareTable({
  products,
  rows,
}: {
  products: CompareProductCard[];
  rows: Row[];
}) {
  return (
    <section className="mt-10 md:mt-14" aria-label="Tabla de comparación">
      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="bg-background sticky left-0 w-32 align-bottom text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:w-40">
                <span className="sr-only">Atributo</span>
              </th>
              {products.map((p) => (
                <th
                  key={p.slug}
                  className="border-border/60 border-b align-bottom p-3 text-left"
                >
                  <div className="flex flex-col gap-2">
                    <div className="border-border/60 bg-muted/30 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border">
                      {p.primaryImagePath ? (
                        <Image
                          src={getProductImageUrl(p.primaryImagePath)}
                          alt={p.name}
                          width={200}
                          height={200}
                          className="size-full object-contain p-3"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          sin foto
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/${p.categorySlug}/${p.brandSlug}/${p.slug}`}
                      className="hover:text-brand text-foreground font-serif text-base font-medium leading-tight tracking-tight transition-colors md:text-lg"
                    >
                      {p.name}
                    </Link>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">
                      {p.brandName}
                    </p>
                    <CompareRemoveButton slug={p.slug} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.label}
                className={idx % 2 === 0 ? 'bg-muted/15' : ''}
              >
                <th
                  scope="row"
                  className="bg-background sticky left-0 w-32 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:w-40"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td
                    key={i}
                    className="border-border/60 border-t px-3 py-3 text-sm text-foreground"
                  >
                    {value ?? <span className="text-muted-foreground/60">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        Tu comparador se guarda en tu navegador. No requiere cuenta.
      </p>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto mt-12 max-w-md text-center md:mt-16">
      <div className="from-muted/30 to-background relative isolate overflow-hidden rounded-2xl bg-gradient-to-b p-10 md:p-16">
        <div
          aria-hidden="true"
          className="bg-brand/15 pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl"
        />
        <div className="relative">
          <div className="bg-background border-border/60 mx-auto flex size-16 items-center justify-center rounded-full border shadow-sm">
            <Scale className="text-foreground/70 size-7" strokeWidth={1.75} />
          </div>
          <p className="text-foreground mt-6 font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Sin productos para <span className="italic">comparar</span>
          </p>
          <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-balance text-sm">
            Entrá a cualquier producto y tocá el icono de balanza arriba para
            agregarlo. Podés comparar hasta 4 modelos a la vez.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/anteojos-de-sol">Ver anteojos de sol</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/anteojos-de-receta">Ver anteojos de receta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
