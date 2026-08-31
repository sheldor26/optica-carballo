import { NextResponse } from 'next/server';
import { autorizadoOptiSys } from '@/lib/auth/optisys';
import { traerVentas } from '@/lib/integrations/mercadolibre/orders';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Traer las ventas de Mercado Libre AHORA, a pedido de la óptica.
 *
 * POR QUÉ, SI YA HAY UN CRON
 *
 * `/api/cron/ml-ventas` corre cada hora en punto y anda bien. Pero la óptica
 * despacha mirando la pantalla: alguien compra, Juan lo ve en el panel de
 * Mercado Libre, entra al sistema y la venta no está porque falta media hora
 * para la próxima pasada. Esperar una hora con el paquete en la mano no sirve,
 * y peor: parece que el sistema está roto cuando está funcionando.
 *
 * Esto es la misma sincronización, disparada por una persona en vez de por el
 * reloj. No reemplaza al cron —el cron es el que garantiza que nada se pierda
 * aunque nadie apriete nada— sino que le adelanta la corrida.
 *
 * POR QUÉ NO LLAMA AL CRON DIRECTAMENTE
 *
 * Porque esa ruta se autentica con `CRON_SECRET`, que es de Vercel y de nadie
 * más. Compartirlo con la óptica sería darle a un segundo sistema la llave de
 * TODAS las tareas programadas —cobros, avisos, publicaciones— para que pueda
 * pedir una sola. Acá entra por `OPTISYS_TOKEN`, que es la llave que la óptica
 * ya tiene y que sólo abre lo que es suyo.
 *
 * ES POST Y NO GET
 *
 * Hace algo: sale a Mercado Libre y escribe en la base. Un GET invita a que lo
 * dispare un `<a>`, un prefetch del navegador o un robot, y esto habla con una
 * API de afuera que tiene límite de pedidos.
 *
 * `?dias=N` para recuperar algo viejo que se haya perdido; por omisión mira los
 * últimos días, igual que el cron.
 */
export async function POST(request: Request) {
  const rechazo = autorizadoOptiSys(request);
  if (rechazo) return rechazo;

  const pedido = Number(new URL(request.url).searchParams.get('dias'));
  const dias = Number.isFinite(pedido) && pedido > 0 ? Math.min(pedido, 365) : undefined;

  const r = await traerVentas(dias);
  if (!r.ok) {
    /*
     * `retryable` viaja tal cual para que la óptica sepa qué decirle a quien
     * está adelante: si Mercado Libre se cayó un segundo, "probá de nuevo"; si
     * el token venció, no hay botón que lo arregle y hay que avisar.
     */
    return NextResponse.json(
      { ok: false, error: r.error, retryable: r.retryable },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, ...r.data });
}
