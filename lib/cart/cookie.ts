import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { cartSchema, EMPTY_CART, type Cart } from './types';

const COOKIE_NAME = 'oc_cart';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

function getSecret(): string {
  const secret = process.env.CART_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'CART_COOKIE_SECRET no está configurada o es muy corta (>= 32 chars). Generar con `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"`.',
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function verify(payload: string, signature: string): boolean {
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

function encode(cart: Cart): string {
  const payload = Buffer.from(JSON.stringify(cart)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function decode(raw: string): Cart {
  const dot = raw.indexOf('.');
  if (dot < 0) return EMPTY_CART;

  const payload = raw.slice(0, dot);
  const signature = raw.slice(dot + 1);
  if (!verify(payload, signature)) return EMPTY_CART;

  let json: unknown;
  try {
    json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return EMPTY_CART;
  }

  const parsed = cartSchema.safeParse(json);
  return parsed.success ? parsed.data : EMPTY_CART;
}

/**
 * Lee y verifica la cookie del carrito. Si la firma no matchea, la cookie
 * fue manipulada o el secret rotó — devuelve carrito vacío silenciosamente
 * (no es un error del usuario).
 */
export async function readCartCookie(): Promise<Cart> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return EMPTY_CART;
  return decode(raw);
}

/**
 * Escribe la cookie del carrito firmada. Solo puede llamarse desde server
 * actions o route handlers (Next 15 rule).
 */
export async function writeCartCookie(cart: Cart): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encode(cart), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/** Borra la cookie del carrito. */
export async function deleteCartCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
