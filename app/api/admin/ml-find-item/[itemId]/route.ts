import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/integrations/mercadolibre/oauth';
import { getActiveMLIntegration } from '@/lib/integrations/mercadolibre/integrations-repo';

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

  // Endpoint que devuelve items del seller con cualquier status.
  // `ids=MLAxxx` filtra a un item específico de su catálogo.
  const url = `https://api.mercadolibre.com/users/${integration.externalUserId}/items/search?ids=${itemId}`;

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
    note: 'Si results array está vacío, el item NO está en esta cuenta. Si está, mirá el campo "status" del item para saber si está active/paused/closed.',
    request: { url, seller_id: integration.externalUserId, item_id: itemId },
    response: {
      status: response.status,
      body: bodyParsed,
    },
  });
}
