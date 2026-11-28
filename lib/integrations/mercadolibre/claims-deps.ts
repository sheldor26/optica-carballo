import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';
import {
  destinoDeAvisosML,
  enviarAvisoML,
} from '@/lib/emails/send-ml-claims-email';
import type { EstadoSync } from '@/lib/integrations/mercadolibre/claims-avisos';
import type {
  Dependencias,
  PedirML,
  RepoReclamos,
  VentaGuardada,
} from '@/lib/integrations/mercadolibre/claims';
import type { ReclamoGuardado } from '@/lib/integrations/mercadolibre/claims-mapping';

/** Mercado Libre, la base y el correo de verdad, para claims.ts y sus vecinos. */

/** Un pedido colgado no puede comerse el tiempo de la función. */
const PEDIDO_MAX_MS = 10_000;

function repoSupabase(): RepoReclamos {
  const supabase = createAdminClient();
  const claims = () => supabase.from('marketplace_claims');
  const estados = () => supabase.from('marketplace_sync_state');

  function exigir(error: { message: string } | null, que: string) {
    if (error) throw new Error(`${que}: ${error.message}`);
  }
  const comoFilas = (data: unknown) => (data ?? []) as ReclamoGuardado[];

  return {
    async pendientes(limite) {
      const { data, error } = await claims()
        .select('*')
        .eq('marketplace', 'mercadolibre')
        .eq('needs_refresh', true)
        .order('synced_at', { ascending: true })
        .limit(limite);
      exigir(error, 'leer pendientes');
      return comoFilas(data);
    },

    async leer(ids) {
      const filas: ReclamoGuardado[] = [];
      // De a 100, para no armar una URL interminable.
      for (let i = 0; i < ids.length; i += 100) {
        const { data, error } = await claims()
          .select('*')
          .eq('marketplace', 'mercadolibre')
          .in('claim_id', ids.slice(i, i + 100));
        exigir(error, 'leer reclamos');
        filas.push(...comoFilas(data));
      }
      return filas;
    },

    async buscarVenta({ ordenOPack, envio, pago }) {
      const ventas = () =>
        supabase
          .from('marketplace_orders')
          .select('external_id, pack_id, shipment_id')
          .eq('marketplace', 'mercadolibre');

      // Sólo dígitos: lo que no sea un id de ML no se busca.
      const esId = (v: string | null): v is string => !!v && /^\d+$/.test(v);
      const intentos = [
        esId(ordenOPack) && (() => ventas().eq('external_id', ordenOPack)),
        esId(ordenOPack) && (() => ventas().eq('pack_id', ordenOPack)),
        esId(envio) && (() => ventas().eq('shipment_id', envio)),
        esId(pago) &&
          (() =>
            ventas().contains('payload', { payments: [{ id: Number(pago) }] })),
      ];
      for (const intento of intentos) {
        if (!intento) continue;
        const { data, error } = await intento().order('external_id').limit(1);
        exigir(error, 'buscar la venta');
        if (data?.[0]) return data[0] as VentaGuardada;
      }
      return null;
    },

    async guardar(fila) {
      const { data, error } = await claims()
        .upsert(fila, { onConflict: 'marketplace,claim_id' })
        .select('*')
        .single();
      exigir(error, 'guardar');
      return data as ReclamoGuardado;
    },

    async marcar(claimId, cambios) {
      const { error } = await claims()
        .update(cambios)
        .eq('marketplace', 'mercadolibre')
        .eq('claim_id', claimId);
      exigir(error, 'marcar');
    },

    async abiertosYEnCamino() {
      const { data, error } = await claims()
        .select('*')
        .eq('marketplace', 'mercadolibre')
        .or(
          'status.eq.opened,and(needs_refresh.eq.true,return_status.not.is.null)',
        )
        .order('opened_at', { ascending: false })
        .limit(200);
      exigir(error, 'leer abiertos');
      return comoFilas(data);
    },

    async anotarAvisos(claimId, estado, nuevos) {
      const { error } = await supabase.rpc('marketplace_claim_anotar_avisos', {
        p_claim_id: claimId,
        p_estado: estado,
        p_hechos: nuevos,
      });
      exigir(error, 'anotar avisos');
    },

    async tomarAvisos(claimId, ahora) {
      const { data, error } = await supabase.rpc(
        'marketplace_claim_tomar_avisos',
        { p_claim_id: claimId, p_ahora: ahora },
      );
      exigir(error, 'tomar avisos');
      return (data ?? []) as string[];
    },

    async cerrarAvisos(claimId, claves, resultado, ahora) {
      const { error } = await supabase.rpc('marketplace_claim_cerrar_avisos', {
        p_claim_id: claimId,
        p_claves: claves,
        p_resultado: resultado,
        p_ahora: ahora,
      });
      exigir(error, 'cerrar avisos');
    },

    async conAvisosPendientes(limite, ahora) {
      const { data, error } = await supabase.rpc(
        'marketplace_claims_con_avisos_pendientes',
        { p_limite: limite, p_ahora: ahora },
      );
      exigir(error, 'leer avisos pendientes');
      return (data ?? []) as string[];
    },

    async leerEstado(clave) {
      const { data, error } = await estados()
        .select('clave, ok_at, intento_at, incompleto, detalle')
        .eq('clave', clave)
        .maybeSingle();
      exigir(error, 'leer el estado');
      return (data ?? null) as EstadoSync | null;
    },

    async guardarEstado(clave, cambios) {
      const { error } = await estados().upsert(
        { clave, ...cambios },
        { onConflict: 'clave' },
      );
      exigir(error, 'guardar el estado');
    },

    async tomarTurno(clave, ahora, margenMs) {
      const alta = await estados().upsert(
        { clave },
        { onConflict: 'clave', ignoreDuplicates: true },
      );
      exigir(alta.error, 'crear el estado');
      // Un solo UPDATE con la condición: de dos que llegan juntos, gana uno.
      const limite = new Date(ahora - margenMs).toISOString();
      const { data, error } = await estados()
        .update({ intento_at: new Date(ahora).toISOString() })
        .eq('clave', clave)
        .or(`intento_at.is.null,intento_at.lt."${limite}"`)
        .select('clave');
      exigir(error, 'tomar el turno');
      return (data?.length ?? 0) > 0;
    },

    async ultimaReputacion() {
      const { data, error } = await supabase
        .from('marketplace_reputation')
        .select('fetched_at')
        .order('fetched_at', { ascending: false })
        .limit(1);
      exigir(error, 'leer la reputación');
      return (data?.[0]?.fetched_at as string | undefined) ?? null;
    },

    async guardarReputacion(fila) {
      const { error } = await supabase
        .from('marketplace_reputation')
        .insert(fila);
      exigir(error, 'guardar la reputación');
    },
  };
}

export function dependenciasReales(): Dependencias {
  return {
    vendedor: getValidAccessToken,
    // `method` fijo a propósito: este módulo no puede escribir en ML.
    pedir: <T>(path: string, opciones: Parameters<PedirML>[1]) =>
      mlFetch<T>(path, {
        ...opciones,
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(PEDIDO_MAX_MS),
      }),
    repo: repoSupabase(),
    cartero: { destino: destinoDeAvisosML, enviar: enviarAvisoML },
    ahora: () => Date.now(),
    esperar: (ms) => new Promise((listo) => setTimeout(listo, ms)),
  };
}
