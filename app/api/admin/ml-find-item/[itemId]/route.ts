import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';
import { getActiveMLIntegration } from '@/lib/integrations/mercadolibre/integrations-repo';
import { getAdminUserOrNull } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

/**
 * Endpoint TEMPORAL admin para diagnosticar si un MLA específico existe en
 * la cuenta autorizada, en CUALQUIER status (active, paused, closed, etc).
 *
 * Llama `/users/{seller_id}/items/search?ids=MLA...` que devuelve el item
 * con su status sin importar si está cerrado (el endpoint /items/{id} 404ea
 * items closed/finalized — este los muestra).
 *
 * Sin auth iter 1 — temporal.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  if (!(await getAdminUserOrNull())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const { itemId } = await params;

  if (!itemId || !/^MLA\d+$/.test(itemId)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_item_id' },
      { status: 400 },
    );
  }

  const integration = await getActiveMLIntegration();
  if (!integration) {
    return NextResponse.json(
      { ok: false, error: 'no_integration' },
      { status: 500 },
    );
  }

  const tokenResult = await getValidAccessToken();
  if (!tokenResult.ok) {
    return NextResponse.json(
      { ok: false, error: tokenResult.error, retryable: tokenResult.retryable },
      { status: 500 },
    );
  }

  // Endpoint multi-get `/items?ids=...` devuelve array con {code, body} por
  // cada ID. Si el item existe en cualquier status (active/paused/closed),
  // code=200 + body con detalle. Si no existe o no es accesible, code=404.
  // Más confiable que /items/{id} singular que 404 silencioso para no-active.
  const url = `https://api.mercadolibre.com/items?ids=${itemId}`;

  let response: Response;
  let bodyText: string;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${tokenResult.data.accessToken}`,
        Accept: 'application/json',
      },
    });
    bodyText = await response.text();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'network_error',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }

  let bodyParsed: unknown;
  try {
    bodyParsed = JSON.parse(bodyText);
  } catch {
    bodyParsed = bodyText;
  }

  return NextResponse.json({
    ok: response.ok,
    note: 'Mirá response.body[0].code: 200 = item existe (su status en body.body.status), 404 = no existe. Si existe pero status != active, eso explica el 404 de /items/{id}.',
    request: { url, seller_id: integration.externalUserId, item_id: itemId },
    response: {
      status: response.status,
      body: bodyParsed,
    },
  });
}
