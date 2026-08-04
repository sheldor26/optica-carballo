import { NextResponse } from 'next/server';
import { secretsMatch } from '@/lib/security/timing-safe-equal';
import { applyOrderInvoice } from '@/lib/orders/set-invoice';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Endpoint interno — lo llama el Facturador Óptica (app de escritorio, no un
 * navegador con sesión admin) apenas factura un pedido web: pega el link del
 * PDF en `orders.invoice_url` y avisa al cliente por mail, sin que alguien
 * tenga que entrar al panel a tildar "avisar por mail" a mano.
 *
 * Autorizado vía FACTURADOR_API_SECRET (mismo patrón que los crons:
 * `Authorization: Bearer <secreto>`, comparación en tiempo constante). NO usa
 * `requireAdmin` porque quien llama no tiene sesión de Clerk — es una máquina.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.FACTURADOR_API_SECRET}`;
  if (!process.env.FACTURADOR_API_SECRET || !secretsMatch(auth, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json().catch(() => null);
  const invoiceUrl = typeof body?.invoiceUrl === 'string' ? body.invoiceUrl : '';
  if (!invoiceUrl) {
    return NextResponse.json({ ok: false, error: 'Falta invoiceUrl' }, { status: 400 });
  }

  const result = await applyOrderInvoice({ orderId: id, invoiceUrl, notify: true });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
