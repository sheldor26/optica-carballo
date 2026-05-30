import 'server-only';
import { createStaticClient } from '@/lib/supabase/static';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import { validateCoupon } from '@/lib/coupons/validate';
import {
  EMPTY_RESOLVED_CART,
  type AppliedCoupon,
  type Cart,
  type ResolvedCart,
  type ResolvedCartItem,
} from './types';

type VariantRow = {
  id: string;
  sku: string;
  price_cents: number;
  stock_qty: number;
  attributes: Record<string, unknown>;
  is_active: boolean;
  product: {
    id: string;
    slug: string;
    name: string;
    is_active: boolean;
    brand: { slug: string; name: string; is_active: boolean };
    category: { slug: string; is_active: boolean };
  };
};

/**
 * Resuelve un cart raw (cookie) contra DB: trae variant + product + brand +
 * category de cada item, calcula subtotal, marca items rotos con un `issue`.
 *
 * El cart se mantiene completo en la cookie incluso si un item está roto —
 * la UI muestra el issue y deja al user decidir quitarlo. Esto evita que un
 * usuario pierda items por race conditions transitorias de stock.
 */
export async function resolveCart(
  cart: Cart,
  options?: { userId?: string | null },
): Promise<ResolvedCart> {
  if (cart.items.length === 0) return EMPTY_RESOLVED_CART;

  const supabase = createStaticClient();
  const variantIds = cart.items.map((it) => it.variantId);

  const { data: rows } = await supabase
    .from('product_variants')
    .select(
      `
        id, sku, price_cents, stock_qty, attributes, is_active,
        product:products!inner(
          id, slug, name, is_active,
          brand:brands!inner(slug, name, is_active),
          category:categories!inner(slug, is_active)
        )
      `,
    )
    .in('id', variantIds)
    .returns<VariantRow[]>();

  const byId = new Map<string, VariantRow>();
  for (const row of rows ?? []) byId.set(row.id, row);

  const resolvedItems: ResolvedCartItem[] = [];
  let subtotalCents = 0;
  let itemCount = 0;
  let hasIssues = false;

  for (const item of cart.items) {
    const row = byId.get(item.variantId);

    // Variant no existe o algo en la cadena (variant/product/brand/category)
    // está inactivo / es placeholder => 'unavailable'.
    if (
      !row ||
      !row.is_active ||
      !row.product.is_active ||
      !row.product.brand.is_active ||
      !row.product.category.is_active ||
      isPlaceholder(row.product.name)
    ) {
      hasIssues = true;
      resolvedItems.push({
        variantId: item.variantId,
        quantity: item.quantity,
        variant: {
          sku: row?.sku ?? '—',
          priceCents: row?.price_cents ?? 0,
          stockQty: row?.stock_qty ?? 0,
          attributes: row?.attributes ?? {},
        },
        product: {
          id: row?.product.id ?? '',
          slug: row?.product.slug ?? '',
          name: row?.product.name ?? 'Producto no disponible',
        },
        brand: {
          slug: row?.product.brand.slug ?? '',
          name: row?.product.brand.name ?? '—',
        },
        categorySlug: row?.product.category.slug ?? '',
        issue: 'unavailable',
      });
      continue;
    }

    let issue: ResolvedCartItem['issue'] = null;
    if (row.stock_qty === 0) issue = 'out_of_stock';
    else if (item.quantity > row.stock_qty) issue = 'over_stock';

    if (issue) hasIssues = true;
    else {
      subtotalCents += row.price_cents * item.quantity;
      itemCount += item.quantity;
    }

    resolvedItems.push({
      variantId: item.variantId,
      quantity: item.quantity,
      variant: {
        sku: row.sku,
        priceCents: row.price_cents,
        stockQty: row.stock_qty,
        attributes: row.attributes,
      },
      product: {
        id: row.product.id,
        slug: row.product.slug,
        name: row.product.name,
      },
      brand: { slug: row.product.brand.slug, name: row.product.brand.name },
      categorySlug: row.product.category.slug,
      issue,
    });
  }

  // Validar cupón si está en la cookie + userId disponible.
  let coupon: AppliedCoupon | null = null;
  let couponError: string | null = null;
  if (cart.couponCode) {
    const validation = await validateCoupon({
      code: cart.couponCode,
      userId: options?.userId ?? null,
      subtotalCents,
    });
    if (validation.ok) {
      coupon = {
        id: validation.coupon.id,
        code: validation.coupon.code,
        type: validation.coupon.type,
        description: validation.coupon.description,
        discountCents: validation.discountCents,
        removeShipping: validation.removeShipping,
      };
    } else {
      couponError = validation.message;
    }
  }

  return {
    items: resolvedItems,
    subtotalCents,
    itemCount,
    hasIssues,
    coupon,
    couponError,
  };
}

/**
 * Cuenta items totales del cart (sumando quantities). Sólo cuenta items
 * disponibles, no rotos. Usado por el badge del header.
 */
export async function countCartItems(cart: Cart): Promise<number> {
  if (cart.items.length === 0) return 0;
  const resolved = await resolveCart(cart);
  return resolved.itemCount;
}
