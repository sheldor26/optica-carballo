import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { applyOrderInvoice } from '@/lib/orders/set-invoice';

export const dynamic = 'force-dynamic';

/** Carga el link de la factura del pedido, desde OptiSys. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  let cuerpo: { url?: string; avisar?: boolean };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cuerpo inválido' }, { status: 400 });
  }

  if (!cuerpo.url) {
    return NextResponse.json({ ok: false, error: 'Falta el link' }, { status: 400 });
  }

  return NextResponse.json(
    await applyOrderInvoice({
      orderId: id,
      invoiceUrl: cuerpo.url,
      // Avisarle al cliente le manda un mail: sólo si lo pidieron explícito.
      notify: cuerpo.avisar === true,
    }),
  );
}
