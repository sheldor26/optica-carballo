import { z } from 'zod';

/**
 * Límites duros del carrito V1. Defensa anti-bot / anti-abuso y para mantener
 * la cookie bajo el límite de 4KB (con holgura para el HMAC + base64).
 */
export const MAX_QUANTITY_PER_ITEM = 10;
export const MAX_ITEMS_IN_CART = 20;

/** Item del carrito tal como vive en la cookie (estructura mínima). */
export const cartItemSchema = z.object({
  variantId: z.uuid(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).max(MAX_ITEMS_IN_CART),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;

export const EMPTY_CART: Cart = { items: [] };

/**
 * Cart "resuelto" — items enriquecidos con datos vivos de DB. Items cuyo
 * variant ya no existe / está inactivo / sin stock quedan flageados pero no
 * se silencian: la UI los muestra para que el user los quite.
 */
export type ResolvedCartItem = {
  variantId: string;
  quantity: number;
  variant: {
    sku: string;
    priceCents: number;
    stockQty: number;
    attributes: Record<string, unknown>;
  };
  product: {
    slug: string;
    name: string;
  };
  brand: {
    slug: string;
    name: string;
  };
  categorySlug: string;
  /**
   * Si está presente, el item está roto y no debe sumar al subtotal.
   * Valores: 'unavailable' (variant/product inactivo o borrado),
   *          'out_of_stock' (stock=0), 'over_stock' (qty > stock_qty).
   */
  issue: 'unavailable' | 'out_of_stock' | 'over_stock' | null;
};

export type ResolvedCart = {
  items: ResolvedCartItem[];
  subtotalCents: number;
  itemCount: number;
  hasIssues: boolean;
};

export const EMPTY_RESOLVED_CART: ResolvedCart = {
  items: [],
  subtotalCents: 0,
  itemCount: 0,
  hasIssues: false,
};
