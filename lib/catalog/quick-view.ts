'use server';

import { createStaticClient } from '@/lib/supabase/static';

export type QuickViewVariant = {
  id: string;
  sku: string;
  priceCents: number;
  stockQty: number;
  colorFrame: string | null;
};

export type QuickViewData = {
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string;
  shortDescription: string | null;
  primaryImagePath: string | null;
  secondaryImagePath: string | null;
  variants: QuickViewVariant[];
};

type QuickViewRow = {
  slug: string;
  name: string;
  short_description: string | null;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string; is_active: boolean };
  variants: Array<{
    id: string;
    sku: string;
    price_cents: number;
    stock_qty: number;
    attributes: Record<string, unknown>;
    is_active: boolean;
    sort_order: number;
  }>;
  images: Array<{
    storage_path: string;
    is_primary: boolean;
    sort_order: number;
  }>;
};

/**
 * Fetch lazy de la data del producto para el modal Quick View.
 * Llamado client-side al primer click del botón "Vista rápida".
 *
 * Devuelve `null` si el producto no existe, está inactivo, o brand/category
 * inactivos.
 */
export async function getProductQuickViewAction(
  slug: string,
): Promise<QuickViewData | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select(
      `
        slug,
        name,
        short_description,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(id, sku, price_cents, stock_qty, attributes, is_active, sort_order),
        images:product_images(storage_path, is_primary, sort_order)
      `,
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
    .returns<QuickViewRow>();

  if (!data) return null;
  if (!data.brand.is_active) return null;
  if (!data.category.is_active) return null;

  const sortedImages = [...data.images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });

  const variants: QuickViewVariant[] = data.variants
    .filter((v) => v.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      sku: v.sku,
      priceCents: v.price_cents,
      stockQty: v.stock_qty,
      colorFrame:
        typeof v.attributes?.color_frame === 'string'
          ? v.attributes.color_frame
          : null,
    }));

  return {
    slug: data.slug,
    name: data.name,
    brandName: data.brand.name,
    brandSlug: data.brand.slug,
    categorySlug: data.category.slug,
    shortDescription: data.short_description,
    primaryImagePath: sortedImages[0]?.storage_path ?? null,
    secondaryImagePath: sortedImages[1]?.storage_path ?? null,
    variants,
  };
}
