import 'server-only';
import { cookies } from 'next/headers';

/**
 * Atribución de la compra a un anuncio/campaña.
 *
 * La cookie propia `oc_attr` la escribe el navegador al aterrizar con
 * parámetros `utm_*` / `twclid` / `gclid` (ver
 * `components/analytics/attribution-capture.tsx`). Acá se LEE en el servidor al
 * crear el pedido y se valida, porque viene del navegador: es un dato no
 * confiable (solo whitelist de claves, largo acotado y sin caracteres de
 * control). Se guarda en `orders.attribution` (jsonb).
 */
export const ATTRIBUTION_COOKIE = 'oc_attr';

export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  twclid?: string;
  gclid?: string;
  landing?: string;
  capturedAt?: number;
};

const MAX_LEN = 120;

function clean(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  // eslint-disable-next-line no-control-regex
  const v = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, MAX_LEN);
  return v.length > 0 ? v : undefined;
}

/** Lee y valida la cookie de atribución. `null` si no hay o está vacía/rota. */
export async function readAttributionCookie(): Promise<Attribution | null> {
  try {
    const store = await cookies();
    const raw = store.get(ATTRIBUTION_COOKIE)?.value;
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>;

    const out: Attribution = {
      source: clean(parsed.s),
      medium: clean(parsed.m),
      campaign: clean(parsed.c),
      content: clean(parsed.ct),
      term: clean(parsed.tm),
      twclid: clean(parsed.tw),
      gclid: clean(parsed.g),
      landing: clean(parsed.lp),
      capturedAt:
        typeof parsed.t === 'number' && Number.isFinite(parsed.t)
          ? parsed.t
          : undefined,
    };

    const hasSignal = Object.entries(out).some(
      ([k, v]) => k !== 'capturedAt' && k !== 'landing' && v !== undefined,
    );
    if (!hasSignal) return null;

    // Sin claves undefined (jsonb limpio).
    return Object.fromEntries(
      Object.entries(out).filter(([, v]) => v !== undefined),
    ) as Attribution;
  } catch {
    return null;
  }
}
