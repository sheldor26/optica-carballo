/**
 * Consulta de prueba: ¿la app de Mercado Libre puede leer reclamos?
 *
 * Hace SIETE GET a la búsqueda de reclamos, cada uno con otros filtros, para
 * saber cuál acepta Mercado Libre. Imprime sólo el código HTTP, la cantidad y
 * el conteo por estado y etapa; si rechaza, su mensaje de error con los números
 * largos tapados. Ningún id, nombre ni motivo.
 *
 * EFECTOS DE CORRERLO
 *   - Lee `marketplace_integrations` (con la service role) y descifra el token.
 *   - NO renueva el token y NO escribe nada en la base: si está vencido, corta.
 *     (Usa scripts/lib/ml-auth.ts y `fetch` directo, no mlFetch.)
 *   - No necesita la tabla marketplace_claims ni la migración.
 *
 * Uso (desde la carpeta del worktree o del repo, ya mergeado):
 *   pnpm exec tsx --env-file="/ruta/al/repo/.env.local" scripts/ml-reclamos-prueba.ts --confirmar
 */
import { obtenerIntegracionML } from './lib/ml-auth';

function contar(
  filas: Array<Record<string, unknown>>,
  campo: string,
): Record<string, number> {
  const conteo: Record<string, number> = {};
  for (const f of filas) {
    const valor = f[campo];
    // Sólo códigos cortos: nunca texto libre.
    const clave =
      typeof valor === 'string' && /^[a-z_]{1,40}$/i.test(valor)
        ? valor
        : '(otro)';
    conteo[clave] = (conteo[clave] ?? 0) + 1;
  }
  return conteo;
}

const codigo = (v: unknown) =>
  typeof v === 'string' && /^[\w.-]{1,60}$/.test(v) ? v : undefined;

async function main() {
  if (!process.argv.includes('--confirmar')) {
    console.log(
      'No se hizo nada. Leé el encabezado del script y corrélo con --confirmar.',
    );
    return;
  }

  const { token, externalUserId } = await obtenerIntegracionML();

  const ahora = Date.now();
  const iso = (ms: number) => new Date(ms).toISOString().replace('Z', '+00:00');
  const rango = (campo: string) =>
    `${campo}:after:${iso(ahora - 90 * 86_400_000)},before:${iso(ahora)}`;
  const yo = {
    'players.role': 'respondent',
    'players.user_id': externalUserId,
  };

  // ML rechazó la búsqueda completa con un 400: se prueban formas más simples
  // para saber cuál acepta. Todas son lecturas (GET).
  const intentos: Array<[string, Record<string, string>]> = [
    ['abiertos', { status: 'opened' }],
    ['cerrados', { status: 'closed' }],
    ['míos, abiertos', { ...yo, status: 'opened' }],
    [
      'por fecha de creación',
      {
        status: 'closed',
        range: rango('date_created'),
        sort: 'date_created:desc',
      },
    ],
    [
      'por fecha de cambio',
      {
        status: 'closed',
        range: rango('last_updated'),
        sort: 'last_updated:desc',
      },
    ],
    ['míos, por fecha de creación', { ...yo, range: rango('date_created') }],
    ['la original', { ...yo, range: rango('last_updated') }],
  ];

  for (const [nombre, parametros] of intentos) {
    const q = new URLSearchParams({ ...parametros, limit: '30', offset: '0' });
    const r = await fetch(
      `https://api.mercadolibre.com/post-purchase/v1/claims/search?${q}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );
    const cuerpo = (await r.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    console.log(`\n[${nombre}] HTTP ${r.status}`);

    if (!r.ok) {
      // El mensaje de ML explica qué parámetro no le gustó. Se tapan los
      // números largos para no mostrar identificadores.
      const mensaje =
        typeof cuerpo?.message === 'string'
          ? cuerpo.message.replace(/\d{6,}/g, '###').slice(0, 300)
          : undefined;
      console.log({
        error: codigo(cuerpo?.error),
        code: codigo(cuerpo?.code),
        mensaje,
      });
      process.exitCode = 1;
      continue;
    }

    const datos = Array.isArray(cuerpo?.data)
      ? (cuerpo.data as Array<Record<string, unknown>>)
      : null;
    if (!datos) {
      console.log('Respuesta sin lista `data`: el formato no es el esperado.');
      continue;
    }
    const total = (cuerpo?.paging as { total?: unknown } | undefined)?.total;
    console.log({
      total: typeof total === 'number' ? total : '(no informado)',
      en_esta_pagina: datos.length,
      por_estado: contar(datos, 'status'),
      por_etapa: contar(datos, 'stage'),
      por_tipo: contar(datos, 'type'),
      sobre_que: contar(datos, 'resource'),
      trae_related_entities: datos.filter((d) =>
        Array.isArray(d.related_entities),
      ).length,
    });
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : 'Error desconocido');
  process.exitCode = 1;
});
