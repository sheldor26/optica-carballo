'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createStaticClient } from '@/lib/supabase/static';
import { isPlaceholder } from '@/lib/catalog/placeholder';
import {
  readCartCookie,
  writeCartCookie,
  deleteCartCookie,
} from './cookie';
import {
  MAX_ITEMS_IN_CART,
  MAX_QUANTITY_PER_ITEM,
  type Cart,
} from './types';

export type CartActionResult = { ok: true } | { ok: false; error: string };

const addInputSchema = z.object({
  variantId: z.uuid({ error: 'Variante inválida.' }),
  quantity: z
    .number()
    .int()
    .min(1, { error: 'Cantidad mínima: 1.' })
    .max(MAX_QUANTITY_PER_ITEM, {
      error: `Máximo ${MAX_QUANTITY_PER_ITEM} unidades por variante.`,
    }),
});

const updateInputSchema = addInputSchema;
const variantIdSchema = z.uuid({ error: 'Variante inválida.' });

type VariantValidationRow = {
  id: string;
  stock_qty: number;
  is_active: boolean;
  product: {
    name: string;
    is_active: boolean;
    brand: { is_active: boolean };
    category: { is_active: boolean };
  };
};

/**
 * Lee variant + product chain con un sólo query. Devuelve null si algo no
 * existe, está inactivo o es placeholder. Usado por add/update para validar
 * stock antes de tocar la cookie.
 */
async function fetchValidVariant(
  variantId: string,
): Promise<VariantValidationRow | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('product_variants')
    .select(
      `
        id, stock_qty, is_active,
        product:products!inner(
          name, is_active,
          brand:brands!inner(is_active),
          category:categories!inner(is_active)
        )
      `,
    )
    .eq('id', variantId)
    .eq('is_active', true)
    .maybeSingle()
    .returns<VariantValidationRow>();

  if (!data) return null;
  if (!data.product.is_active) return null;
  if (!data.product.brand.is_active) return null;
  if (!data.product.category.is_active) return null;
  if (isPlaceholder(data.product.name)) return null;
  return data;
}

function findItem(cart: Cart, variantId: string): number {
  return cart.items.findIndex((it) => it.variantId === variantId);
}

export async function addToCart(input: {
  variantId: string;
  quantity: number;
}): Promise<CartActionResult> {
  const parsed = addInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Entrada inválida.' };
  }
  const { variantId, quantity } = parsed.data;

  const variant = await fetchValidVariant(variantId);
  if (!variant) {
    return { ok: false, error: 'Esa variante ya no está disponible.' };
  }
  if (variant.stock_qty === 0) {
    return { ok: false, error: 'Sin stock disponible.' };
  }

  const cart = await readCartCookie();
  const idx = findItem(cart, variantId);

  const currentQty = idx >= 0 ? (cart.items[idx]?.quantity ?? 0) : 0;
  const newQty = currentQty + quantity;

  if (newQty > MAX_QUANTITY_PER_ITEM) {
    return {
      ok: false,
      error: `Máximo ${MAX_QUANTITY_PER_ITEM} unidades por variante (tenés ${currentQty}).`,
    };
  }
  if (newQty > variant.stock_qty) {
    return {
      ok: false,
      error: `Sólo quedan ${variant.stock_qty} unidades disponibles.`,
    };
  }

  let nextItems: Cart['items'];
  if (idx >= 0) {
    nextItems = cart.items.map((it, i) =>
      i === idx ? { variantId: it.variantId, quantity: newQty } : it,
    );
  } else {
    if (cart.items.length >= MAX_ITEMS_IN_CART) {
      return {
        ok: false,
        error: `Máximo ${MAX_ITEMS_IN_CART} productos distintos en el carrito.`,
      };
    }
    nextItems = [...cart.items, { variantId, quantity: newQty }];
  }

  await writeCartCookie({ items: nextItems });
  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function updateCartItem(input: {
  variantId: string;
  quantity: number;
}): Promise<CartActionResult> {
  const parsed = updateInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Entrada inválida.' };
  }
  const { variantId, quantity } = parsed.data;

  const variant = await fetchValidVariant(variantId);
  if (!variant) {
    return { ok: false, error: 'Esa variante ya no está disponible.' };
  }
  if (quantity > variant.stock_qty) {
    return {
      ok: false,
      error: `Sólo quedan ${variant.stock_qty} unidades disponibles.`,
    };
  }

  const cart = await readCartCookie();
  const idx = findItem(cart, variantId);
  if (idx < 0) {
    return { ok: false, error: 'Ese producto no está en tu carrito.' };
  }

  const nextItems = cart.items.map((it, i) =>
    i === idx ? { variantId: it.variantId, quantity } : it,
  );
  await writeCartCookie({ items: nextItems });
  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function removeFromCart(input: {
  variantId: string;
}): Promise<CartActionResult> {
  const parsed = variantIdSchema.safeParse(input.variantId);
  if (!parsed.success) {
    return { ok: false, error: 'Variante inválida.' };
  }

  const cart = await readCartCookie();
  const nextItems = cart.items.filter((it) => it.variantId !== parsed.data);
  if (nextItems.length === cart.items.length) {
    return { ok: true }; // no-op silencioso si ya no estaba
  }

  await writeCartCookie({ items: nextItems });
  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function clearCart(): Promise<CartActionResult> {
  await deleteCartCookie();
  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
  return { ok: true };
}

/**
 * Aplica un código de cupón al cart. Solo guarda el código en la cookie —
 * la validación real se hace en resolveCart (con userId + subtotal).
 *
 * Limpiamos el código a uppercase + trim para consistencia con la validación.
 */
export async function applyCouponToCart(
  code: string,
): Promise<CartActionResult> {
  const cleaned = code.trim().toUpperCase();
  if (cleaned.length === 0) {
    return { ok: false, error: 'Ingresá un código.' };
  }
  if (cleaned.length > 40) {
    return { ok: false, error: 'El código es demasiado largo.' };
  }
  const cart = await readCartCookie();
  await writeCartCookie({ ...cart, couponCode: cleaned });
  revalidatePath('/carrito');
  revalidatePath('/checkout');
  return { ok: true };
}

/**
 * Remueve el cupón aplicado al cart. No toca los items.
 */
export async function removeCouponFromCart(): Promise<CartActionResult> {
  const cart = await readCartCookie();
  const { couponCode: _removed, ...rest } = cart;
  await writeCartCookie(rest);
  revalidatePath('/carrito');
  revalidatePath('/checkout');
  return { ok: true };
}
