import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { generarEnvioDePedido } from '@/lib/orders/operaciones';

export const dynamic = 'force-dynamic';

/**
 * Da de alta el envío en MiCorreo, desde OptiSys.
 *
 * Es idempotente por `extOrderId`: reintentar un alta que falló la crea, y
 * pedirla de nuevo cuando ya existe devuelve la misma (`alreadyImported`), no
 * una nueva. Para un envío distinto habría que anular el anterior en MiCorreo,
 * que no está implementado.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  return NextResponse.json(await generarEnvioDePedido(id));
}
