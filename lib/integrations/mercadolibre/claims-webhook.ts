import { mlAvisoReclamoSchema, TEMAS_DE_RECLAMOS } from './schemas';

/**
 * Los avisos de Mercado Libre sobre reclamos (tema `post_purchase`): guardar el
 * evento, contestar 200 enseguida y recién después traer el reclamo. Sin IO
 * propio: la base, `after()` y el recorrido llegan como dependencias.
 */

export function esTemaDeReclamos(body: unknown): boolean {
  const tema = (body as { topic?: unknown } | null)?.topic;
  return (TEMAS_DE_RECLAMOS as readonly unknown[]).includes(tema);
}

/** El número de reclamo de un `resource` como `/post-purchase/v1/claims/123`. */
export function reclamoDelRecurso(resource: string): string | null {
  return /(?:^|\/)claims\/(\d{1,25})(?=$|[/?])/.exec(resource)?.[1] ?? null;
}

export type EventoDeAviso = {
  id: string;
  marketplace: 'mercadolibre';
  topic: string;
  resource: string;
  external_user_id: string | null;
  status: 'processed' | 'failed' | 'ignored';
  payload: Record<string, unknown>;
  error_message: string | null;
};

export type DependenciasAviso = {
  eventos: {
    existe(id: string): Promise<boolean>;
    /** 'repetido' si otro pedido ya lo había guardado. */
    guardar(evento: EventoDeAviso): Promise<'guardado' | 'repetido' | 'fallo'>;
    resultado(
      id: string,
      status: 'processed' | 'failed',
      error: string | null,
    ): Promise<void>;
  };
  /** `after()` de Next: corre después de contestar. */
  despues(tarea: () => Promise<void>): void;
  procesar(claimId: string): Promise<{ ok: boolean; error: string | null }>;
};

export async function recibirAvisoDeReclamo(
  body: unknown,
  deps: DependenciasAviso,
): Promise<Record<string, unknown>> {
  const parsed = mlAvisoReclamoSchema.safeParse(body);
  if (!parsed.success) return { ok: true, ignored: 'invalid_shape' };
  const aviso = parsed.data;
  const id = aviso._id ?? `${aviso.topic}:${aviso.resource}:${aviso.sent ?? ''}`;

  if (await deps.eventos.existe(id)) return { ok: true, deduped: true };

  const claimId = reclamoDelRecurso(aviso.resource);
  const guardado = await deps.eventos.guardar({
    id,
    marketplace: 'mercadolibre',
    topic: aviso.topic,
    resource: aviso.resource,
    external_user_id:
      aviso.user_id === undefined ? null : String(aviso.user_id),
    // La tabla no admite un estado "pendiente": se corrige al terminar.
    status: 'ignored',
    payload: aviso,
    error_message: claimId ? 'por_procesar' : 'invalid_resource_path',
  });
  if (guardado === 'repetido') return { ok: true, deduped: true };
  if (!claimId) return { ok: true, status: 'ignored' };

  deps.despues(async () => {
    const r = await deps.procesar(claimId);
    await deps.eventos.resultado(id, r.ok ? 'processed' : 'failed', r.error);
  });
  return { ok: true, status: 'received' };
}
