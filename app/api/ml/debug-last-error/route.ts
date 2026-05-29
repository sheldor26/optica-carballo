import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * Endpoint TEMPORAL de debugging para ver el último error de sync con ML.
 * Lee `marketplace_sync_errors` table.
 *
 * **Eliminar este endpoint después de que Sprint 2b esté operativo + estable**.
 * Sprint 3 va a tener admin UI propia en `/mi-cuenta/marketplace` para esto.
 *
 * Acceso: por ahora abierto (estamos en setup). No expone tokens — solo
 * error payloads que ya están sanitizados al guardar.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('marketplace_sync_errors')
      .select(
        'id, marketplace, operation, external_item_id, error_payload, retry_count, created_at',
      )
      .eq('marketplace', 'mercadolibre')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json(
        { ok: false, error: 'db_error', details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      note: 'Endpoint temporal de debug. Eliminar después de Sprint 2b.',
      count: data?.length ?? 0,
      errors: data ?? [],
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'unexpected',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
