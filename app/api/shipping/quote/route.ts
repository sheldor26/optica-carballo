import { NextResponse } from 'next/server';
import { resolveShippingQuotes } from '@/lib/shipping-server';
import { normalizePostalCode } from '@/lib/correo/constants';
import { AR_PROVINCES } from '@/lib/addresses/constants';
import { checkRateLimit, TtlCache } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Cotización de envío para el estimador del carrito (client). Recibe CP (4
 * dígitos) y, opcional, provincia; devuelve costo real a domicilio + sucursal
 * vía la API de Correo (fallback a tabla por zonas). Público (el carrito no
 * requiere login) → validamos inputs, acotamos rangos, y protegemos la cuota de
 * la API de Correo con rate-limit por IP + cache por CP (en memoria, V1; ver
 * lib/rate-limit). Read-only: no genera envíos.
 */
const RATE_LIMIT = 30; // requests
const RATE_WINDOW_MS = 60_000; // por minuto, por IP
const quoteCache = new TtlCache<Awaited<ReturnType<typeof resolveShippingQuotes>>>(
  10 * 60_000, // 10 min
);

export async function POST(request: Request) {
  // Rate-limit por IP (freno de abuso/scraping que agotaría la cuota de Correo).
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rl = checkRateLimit(`shipping-quote:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: 'rate_limited',
        hint: 'Demasiadas consultas seguidas. Probá de nuevo en unos segundos.',
      },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { provinceName, postalCode, subtotalCents, itemCount } = (body ?? {}) as {
    provinceName?: unknown;
    postalCode?: unknown;
    subtotalCents?: unknown;
    itemCount?: unknown;
  };

  // Provincia OPCIONAL: la cotización real de Correo usa solo el CP. Si viene
  // y es válida, afina el fallback por zonas (API caída); si no, '' → zona
  // conservadora. El CP es el único campo requerido.
  const province =
    typeof provinceName === 'string' && AR_PROVINCES.includes(provinceName as never)
      ? provinceName
      : '';

  const cp = typeof postalCode === 'string' ? normalizePostalCode(postalCode) : '';
  if (!cp) {
    return NextResponse.json(
      { ok: false, error: 'cp_invalido', hint: 'Ingresá un código postal de 4 dígitos.' },
      { status: 400 },
    );
  }

  // Acotar rangos para no pasar basura a la API.
  const subtotal =
    typeof subtotalCents === 'number' && Number.isFinite(subtotalCents)
      ? Math.min(Math.max(0, Math.round(subtotalCents)), 100_000_000)
      : 0;
  const items =
    typeof itemCount === 'number' && Number.isFinite(itemCount)
      ? Math.min(Math.max(1, Math.round(itemCount)), 50)
      : 1;

  // Cache por CP: dedupe consultas idénticas (auto-cotización al montar +
  // reintentos) sin volver a pegarle a Correo. Incluye subtotal porque define
  // el envío gratis + "cuánto falta".
  const cacheKey = `${cp}|${province}|${items}|${subtotal}`;
  const cached = quoteCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({ ok: true, ...cached, cached: true });
  }

  const quotes = await resolveShippingQuotes({
    subtotalCents: subtotal,
    provinceName: province,
    postalCode: cp,
    itemCount: items,
  });

  quoteCache.set(cacheKey, quotes);

  return NextResponse.json({ ok: true, ...quotes });
}
