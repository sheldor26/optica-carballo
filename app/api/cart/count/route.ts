import { NextResponse } from 'next/server';
import { readCartCookie } from '@/lib/cart/cookie';
import { countCartItems } from '@/lib/cart/queries';

export const dynamic = 'force-dynamic';

/**
 * Devuelve el count de items del cart (sumando quantities, excluyendo rotos).
 * Endpoint liviano consumido por <CartBadge> del header. La cookie es
 * HttpOnly, por eso necesitamos route handler en vez de leer del cliente.
 */
export async function GET() {
  const cart = await readCartCookie();
  const count = await countCartItems(cart);
  return NextResponse.json(
    { count },
    {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    },
  );
}
