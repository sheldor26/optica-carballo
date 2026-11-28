/**
 * Lectura real de reclamos, devoluciones y reputación: qué campos entrega Mercado Libre.
 *
 * Sólo GET. No renueva el token ni escribe nada. Muestra la FORMA de cada respuesta:
 * nombres de campos, códigos cortos (estados, motivos) y fechas. Nunca textos libres,
 * nombres, apodos, direcciones ni números de identificación.
 *
 * Uso: pnpm exec tsx --env-file=../../../.env.local scripts/ml-reclamos-lectura.ts --confirmar
 */
import { obtenerIntegracionML } from './lib/ml-auth';

type Json = unknown;

/** Campos cuyo valor es un código o una cifra de la cuenta, no un dato de alguien. */
const SE_VE = /^(status|stage|type|resource|reason_id|role|sub_?type|substatus|status_money|refund_at|benefited|closed_by|reason|action|mandatory|level_id|power_seller_status|period|rate|value|completed|canceled|total|site_id|currency_id|version|affects_reputation|has_incentive|product_condition|product_destination|seller_status|reason_status|destination|logistic_type|mode|tracking_method|resolution|group|name|key)$/;
const CODIGO = /^[a-zA-Z_]{1,50}$|^[A-Z]{2,4}\d{2,6}$/;
const FECHA = /^\d{4}-\d{2}-\d{2}/;

function forma(v: Json, campo = ''): Json {
  if (v === null || v === undefined) return null;
  if (Array.isArray(v)) {
    if (!v.length) return [];
    return v.length > 3 ? [...v.slice(0, 3).map((x) => forma(x, campo)), `… ${v.length} en total`] : v.map((x) => forma(x, campo));
  }
  if (typeof v === 'object') {
    return Object.fromEntries(Object.entries(v as Record<string, Json>).map(([k, x]) => [k, forma(x, k)]));
  }
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return SE_VE.test(campo) ? v : '(número)';
  const s = String(v);
  // Valores de lista cerrada que traen espacios o números.
  if (/^(period|level_id|action_responsible|related_entities|return_quantity|total_quantity|quantity_type|context_type|resource_type)$/.test(campo) && /^[\w ]{1,30}$/.test(s)) return s;
  if (FECHA.test(s)) return s.slice(0, 19);
  if (SE_VE.test(campo) && campo !== 'name' && CODIGO.test(s)) return s;
  return `(texto ${s.length})`;
}

async function main() {
  if (!process.argv.includes('--confirmar')) {
    console.log('No se hizo nada. Corré con --confirmar.');
    return;
  }
  const { token, externalUserId } = await obtenerIntegracionML();
  let llamadas = 0;
  async function leer(ruta: string) {
    llamadas++;
    const r = await fetch(`https://api.mercadolibre.com${ruta}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    const cuerpo = (await r.json().catch(() => null)) as Record<string, Json> | null;
    const ruta2 = ruta.replace(/\d{5,}/g, '###');
    console.log(`\n== GET ${ruta2} -> ${r.status}`);
    if (!r.ok) {
      console.log({ error: forma(cuerpo?.error, 'status'), mensaje: String(cuerpo?.message ?? '').replace(/\d{5,}/g, '###').slice(0, 200) });
      return null;
    }
    return cuerpo as Record<string, Json>;
  }
  const mostrar = (x: Json) => console.log(JSON.stringify(forma(x), null, 1));

  const q = new URLSearchParams({ 'players.role': 'respondent', 'players.user_id': externalUserId, status: 'opened', limit: '10' });
  const abiertos = await leer(`/post-purchase/v1/claims/search?${q}`);
  const lista = (abiertos?.data as Array<Record<string, Json>> | undefined) ?? [];
  console.log({ abiertos_como_vendedor: (abiertos?.paging as { total?: number } | undefined)?.total ?? lista.length });

  // Cuántos cerrados son como vendedor (el resto serían compras propias).
  for (const rol of ['respondent', 'complainant']) {
    const p = new URLSearchParams({ 'players.role': rol, 'players.user_id': externalUserId, status: 'closed', limit: '1' });
    const c = await leer(`/post-purchase/v1/claims/search?${p}`);
    console.log({ cerrados_como: rol, total: (c?.paging as { total?: number } | undefined)?.total });
  }

  // Si no hubiera abiertos, se mira la forma con los últimos cerrados con devolución.
  let aMirar = lista.slice(0, 2);
  const p = new URLSearchParams({ 'players.role': 'respondent', 'players.user_id': externalUserId, status: 'closed', sort: 'date_created:desc', limit: '30' });
  const cerrados = await leer(`/post-purchase/v1/claims/search?${p}`);
  const conDevolucion = ((cerrados?.data as Array<Record<string, Json>> | undefined) ?? []).find((c) =>
    Array.isArray(c.related_entities) && (c.related_entities as string[]).includes('return'));
  if (conDevolucion) aMirar = [...aMirar, conDevolucion];
  else aMirar = [...aMirar, ...(((cerrados?.data as Array<Record<string, Json>> | undefined) ?? []).slice(0, 1))];
  mostrar({ un_resultado_de_busqueda: lista[0] ?? (cerrados?.data as Json[] | undefined)?.[0] });

  for (const reclamo of aMirar) {
    const id = String(reclamo.id);
    console.log(`\n######## reclamo ${reclamo.status}`);
    const det = await leer(`/post-purchase/v1/claims/${id}`);
    if (det) mostrar(det);
    const jugadores = (det?.players as Array<Record<string, Json>> | undefined) ?? [];
    console.log({ comprador_identificado: jugadores.some((j) => j.role === 'complainant' && j.user_id) });
    const imp = await leer(`/post-purchase/v1/claims/${id}/affects-reputation`);
    if (imp) mostrar(imp);
    const detalle = await leer(`/post-purchase/v1/claims/${id}/detail`);
    if (detalle) mostrar(detalle);
    const dev = await leer(`/post-purchase/v2/claims/${id}/returns`);
    if (dev) {
      mostrar(dev);
      const idDev = (dev.id ?? (dev.data as Array<Record<string, Json>> | undefined)?.[0]?.id) as string | number | undefined;
      if (idDev) {
        const rev = await leer(`/post-purchase/v1/returns/${idDev}/reviews`);
        if (rev) mostrar(rev);
      }
      const envio = ((dev.shipments as Array<Record<string, Json>> | undefined)?.[0]?.shipment_id) as string | number | undefined;
      if (envio) {
        const s = await leer(`/shipments/${envio}`);
        if (s) mostrar({ status: s.status, substatus: s.substatus, claves: Object.keys(s) });
      }
    }
    const motivo = (det?.reason_id ?? reclamo.reason_id) as string | undefined;
    if (motivo) {
      const m = await leer(`/post-purchase/v1/claims/reasons/${motivo}`);
      // El nombre y el detalle del motivo son textos genéricos de Mercado Libre.
      if (m) console.log({ id: m.id, name: m.name, detail: m.detail, claves: Object.keys(m) });
    }
    if (det?.resource === 'order') {
      const o = await leer(`/orders/${det.resource_id}`);
      if (o) {
        console.log({ orden_claves: Object.keys(o), estado: o.status, pack: !!o.pack_id, comprador_id: !!(o.buyer as { id?: unknown } | undefined)?.id,
          items: Array.isArray(o.order_items) ? o.order_items.length : 0 });
      }
    }
  }

  const yo = await leer(`/users/${externalUserId}`);
  if (yo) mostrar({ seller_reputation: yo.seller_reputation });
  console.log(`\nLlamadas hechas: ${llamadas}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : 'Error desconocido');
  process.exitCode = 1;
});
