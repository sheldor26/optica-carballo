import 'server-only';
import { traerReclamos, type Dependencias } from './claims';
import { correoResumen, diaArgentino } from './claims-avisos';
import { dependenciasReales } from './claims-deps';
import { actualizarReputacion } from './reputation';

/**
 * Lo que se pide desde afuera: el botón del sistema, la carga del historial y el
 * resumen de la mañana.
 */

/** Con un recorrido completo más nuevo que esto, no se llama a Mercado Libre. */
const MINUTOS_FRESCO = 4;
/** Más que lo que puede durar un recorrido (maxDuration = 60). */
const SEGUNDOS_DE_CANDADO = 70;

export type Refresco = {
  ok: boolean;
  /** El último recorrido completo. */
  actualizado_en: string | null;
  /** true = no se llamó a Mercado Libre (recién actualizado, o ya en curso). */
  omitido: boolean;
  error?: string;
};

export async function refrescarPostventa(
  deps: Dependencias = dependenciasReales(),
): Promise<Refresco> {
  const ahora = deps.ahora();
  const antes = await deps.repo.leerEstado('claims');
  const actualizado = antes?.ok_at ?? null;
  const omitido = { ok: true, actualizado_en: actualizado, omitido: true };

  if (
    actualizado &&
    ahora - Date.parse(actualizado) < MINUTOS_FRESCO * 60_000
  ) {
    return omitido;
  }
  // También cubre el cron: al arrancar anota su intento, y así no corren dos a
  // la vez ni se pisan al renovar el token.
  if (
    !(await deps.repo.tomarTurno('claims', ahora, SEGUNDOS_DE_CANDADO * 1000))
  ) {
    return omitido;
  }

  const r = await traerReclamos({ modo: 'rapido' }, deps);
  // Si Mercado Libre ya cortó, no se insiste.
  if (r.ok && r.data.corte !== 'limite_de_ml' && r.data.corte !== 'token') {
    await actualizarReputacion(deps);
  }
  const despues = await deps.repo.leerEstado('claims');
  return {
    ok: r.ok && !r.data.incompleto,
    actualizado_en: despues?.ok_at ?? null,
    omitido: false,
    ...(r.ok ? {} : { error: r.error }),
  };
}

export type Tanda = {
  ok: boolean;
  terminado: boolean;
  /** true = no se llamó a Mercado Libre (ya había terminado, o hay otra en curso). */
  omitido: boolean;
  guardados?: number;
  error?: string;
};

/**
 * Una tanda de la carga de los reclamos cerrados viejos. La llama una tarea
 * programada hasta que queda anotado que terminó; desde ahí no hace nada.
 */
export async function cargarTandaDeHistorial(
  deps: Dependencias = dependenciasReales(),
): Promise<Tanda> {
  const antes = await deps.repo.leerEstado('historico');
  if (antes?.ok_at) return { ok: true, terminado: true, omitido: true };
  const ahora = deps.ahora();
  if (
    !(await deps.repo.tomarTurno('historico', ahora, SEGUNDOS_DE_CANDADO * 1000))
  ) {
    return { ok: true, terminado: false, omitido: true };
  }

  const r = await traerReclamos({ modo: 'historico' }, deps);
  if (!r.ok) {
    return { ok: false, terminado: false, omitido: false, error: r.error };
  }
  const h = r.data.historico;
  // También termina si llegó al final y no quedó nada nuevo que guardar: un
  // reclamo que falla siempre no puede tener la tarea corriendo para siempre.
  const alFinal = !!h && h.total !== null && h.recorridos >= h.total;
  const terminado = !!h && (h.terminado || (alFinal && r.data.guardados === 0));
  const marca = new Date(ahora).toISOString();
  await deps.repo.guardarEstado('historico', {
    intento_at: marca,
    incompleto: !terminado,
    detalle: r.data.errores.slice(0, 3).join('; ').slice(0, 400) || null,
    ...(terminado ? { ok_at: marca } : {}),
  });
  return {
    ok: true,
    terminado,
    omitido: false,
    guardados: r.data.guardados,
  };
}

export type ResultadoResumen = {
  ok: boolean;
  enviado: boolean;
  motivo?: 'sin_destino' | 'nada_que_contar' | 'fallo_el_envio';
};

/**
 * El resumen de la mañana: lo abierto, lo que viene en camino y si la
 * sincronización viene fallando. Sólo lee la base. La clave lleva el día de
 * Argentina: si la tarea corre dos veces, sale un solo correo.
 */
export async function enviarResumenDiario(
  deps: Dependencias = dependenciasReales(),
): Promise<ResultadoResumen> {
  const to = deps.cartero.destino();
  if (!to) return { ok: true, enviado: false, motivo: 'sin_destino' };

  const ahora = deps.ahora();
  let correo;
  try {
    correo = correoResumen({
      reclamos: await deps.repo.abiertosYEnCamino(),
      estado: await deps.repo.leerEstado('claims'),
      ahora,
    });
  } catch (err) {
    console.error('[ml-resumen] no pude leer la base', err);
    // Que no se pueda leer también es una falla que hay que contar.
    correo = correoResumen({
      reclamos: [],
      estado: {
        clave: 'claims',
        ok_at: null,
        intento_at: null,
        incompleto: true,
        detalle: 'no se pudo leer la base de la web',
      },
      ahora,
    });
  }
  if (!correo) return { ok: true, enviado: false, motivo: 'nada_que_contar' };

  const r = await deps.cartero.enviar(
    correo,
    to,
    `ml-resumen/${diaArgentino(ahora)}`,
  );
  return r === 'enviado'
    ? { ok: true, enviado: true }
    : { ok: false, enviado: false, motivo: 'fallo_el_envio' };
}
