import 'server-only';
import { conReintentos, type Dependencias } from './claims';
import { dependenciasReales } from './claims-deps';
import { esObjeto, texto } from './claims-mapping';
import type { SyncErrorReason } from './types';

/**
 * La reputación de la cuenta, tal como la informa Mercado Libre. Sólo lee
 * (`GET /users/{id}` → `seller_reputation`) y guarda un renglón por lectura,
 * como mucho una por hora.
 */

/** Menos de 60 a propósito: con la tarea horaria, el reloj corrido no la saltea. */
const MINUTOS_ENTRE_LECTURAS = 55;

export type ResultadoReputacion =
  | { ok: true; omitido: boolean }
  | { ok: false; error: SyncErrorReason };

export async function actualizarReputacion(
  deps: Dependencias = dependenciasReales(),
): Promise<ResultadoReputacion> {
  const ahora = deps.ahora();
  const marca = new Date(ahora).toISOString();

  const fallo = async (error: SyncErrorReason) => {
    await deps.repo
      .guardarEstado('reputation', {
        intento_at: marca,
        incompleto: true,
        detalle: `no se pudo leer: ${error}`,
      })
      .catch(() => {});
    return { ok: false as const, error };
  };

  try {
    const ultima = await deps.repo.ultimaReputacion();
    if (
      ultima &&
      ahora - Date.parse(ultima) < MINUTOS_ENTRE_LECTURAS * 60_000
    ) {
      return { ok: true, omitido: true };
    }
    const vendedor = await deps.vendedor();
    if (!vendedor.ok) return await fallo(vendedor.error);

    const r = await conReintentos(deps)<{ seller_reputation?: unknown }>(
      `/users/${encodeURIComponent(vendedor.data.externalUserId)}`,
      { operation: 'traer_reputacion' },
    );
    if (!r.ok) return await fallo(r.error);
    const rep = r.data?.seller_reputation;
    if (!esObjeto(rep)) return await fallo('validation_error');

    await deps.repo.guardarReputacion({
      fetched_at: marca,
      level_id: texto(rep.level_id),
      power_seller_status: texto(rep.power_seller_status),
      metrics: esObjeto(rep.metrics) ? rep.metrics : null,
    });
    await deps.repo.guardarEstado('reputation', {
      intento_at: marca,
      ok_at: marca,
      incompleto: false,
      detalle: null,
    });
    return { ok: true, omitido: false };
  } catch (err) {
    console.error('[ml-reputacion] la lectura falló', err);
    // Los errores de corte (429, token) traen el motivo en el mensaje.
    const motivo = err instanceof Error ? err.message : '';
    return fallo(
      motivo === 'rate_limited' || motivo.startsWith('token_')
        ? (motivo as SyncErrorReason)
        : 'unknown',
    );
  }
}
