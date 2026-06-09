import { NextResponse } from 'next/server';
import { resolveShippingQuotes } from '@/lib/shipping-server';
import { normalizePostalCode } from '@/lib/correo/constants';
import { AR_PROVINCES } from '@/lib/addresses/constants';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Cotización de envío para el estimador del carrito (client). Recibe provincia
 * + CP (4 dígitos) y devuelve costo real a domicilio + sucursal vía la API de
 * Correo (con fallback a tabla por zonas). Público (el carrito no requiere
 * login) → validamos inputs y acotamos rangos. Read-only: no genera envíos.
 *
 * Nota: sin rate-limit en V1 (bajo tráfico, solo cotiza). Si hubiera abuso,
 * agregar throttling o cache por CP. Ver BACKLOG.
 */
export async function POST(request: Request) {
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

  const quotes = await resolveShippingQuotes({
    subtotalCents: subtotal,
    provinceName: province,
    postalCode: cp,
    itemCount: items,
  });

  return NextResponse.json({ ok: true, ...quotes });
}
