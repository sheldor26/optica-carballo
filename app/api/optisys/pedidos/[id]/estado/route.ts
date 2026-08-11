import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { cambiarEstadoDePedido } from '@/lib/orders/operaciones';
import type { OrderStatus } from '@/lib/orders/types';

export const dynamic = 'force-dynamic';

/**
 * Cambia el estado del pedido, desde OptiSys.
 *
 * OJO: para los estados notificables esto LE MANDA UN MAIL AL CLIENTE, con el
 * número de seguimiento adentro. No es una marca interna.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  let cuerpo: { estado?: string; nota?: string; seguimiento?: string };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cuerpo inválido' }, { status: 400 });
  }

  // El estado se valida adentro contra la lista permitida; acá sólo se pasa.
  const resultado = await cambiarEstadoDePedido({
    orderId: id,
    newStatus: cuerpo.estado as OrderStatus,
    note: cuerpo.nota,
    trackingNumber: cuerpo.seguimiento,
  });
  return NextResponse.json(resultado);
}
