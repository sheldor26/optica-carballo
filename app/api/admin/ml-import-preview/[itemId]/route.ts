import { NextResponse } from 'next/server';
import { mlFetch } from '@/lib/integrations/mercadolibre/api-client';
import { requireAdminApi } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

/**
 * Endpoint TEMPORAL para fetchear un item de ML usando el token OAuth
 * guardado en `marketplace_integrations`. Devuelve el JSON crudo del item
 * para que el founder me lo pase y yo genere SQL de import.
 *
 * Requiere admin + PIN (`requireAdminApi`) — endpoint temporal de admin.
 * Sprint 3 va a tener admin UI propia en `/mi-cuenta/marketplace`.
 *
 * Uso: `GET /api/admin/ml-import-preview/MLA1234567890`.
 *
 * TODO: eliminar este endpoint cuando admin UI esté operativo.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const { itemId } = await params;

  if (!itemId || !/^MLA\d+$/.test(itemId)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_item_id', expected: 'MLA followed by digits' },
      { status: 400 },
    );
  }

  const result = await mlFetch<Record<string, unknown>>(`/items/${itemId}`, {
    operation: 'fetch_item_admin',
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        retryable: result.retryable,
        note: 'Si error es token_expired o token_invalid, re-autorizar en /api/ml/oauth/initiate.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    note: 'Endpoint temporal de import. JSON crudo del item ML — copialo y mandámelo para que genere SQL.',
    item: result.data,
  });
}
