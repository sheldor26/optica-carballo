import 'server-only';
import { getCorreoToken, invalidateCorreoToken } from './auth';
import { getCorreoConfig } from './constants';
import { provinceCodeFor } from './provinces';
import type { CorreoBranch } from './types';

export type { CorreoBranch };

/** Forma cruda de una sucursal en la respuesta de /agencies (subset usado). */
type CorreoAgencyRaw = {
  code: string;
  name: string;
  phone?: string | null;
  services?: { packageReception?: boolean; pickupAvailability?: boolean };
  location?: {
    address?: {
      streetName?: string | null;
      streetNumber?: string | null;
      locality?: string | null;
      city?: string | null;
      postalCode?: string | null;
    };
  };
  status?: string;
};

const CACHE_TTL_MS = 24 * 60 * 60_000; // 24h — las sucursales no cambian seguido.
const cache = new Map<string, { branches: CorreoBranch[]; atMs: number }>();

function toBranch(a: CorreoAgencyRaw): CorreoBranch {
  const addr = a.location?.address;
  const address = [
    addr?.streetName,
    addr?.streetNumber,
    addr?.locality ?? addr?.city,
  ]
    .filter((v): v is string => Boolean(v && v.trim()))
    .join(' ');
  return {
    code: a.code,
    name: a.name,
    address: address || a.name,
    postalCode: addr?.postalCode ?? null,
  };
}

/**
 * Lista las sucursales del Correo que RECIBEN paquetes en una provincia,
 * para que el cliente elija dónde retirar. Cacheado 24h por provincia.
 * Devuelve [] si la provincia no matchea, la API no está o falla — el
 * caller decide el fallback (ej: ocultar la opción sucursal).
 */
export async function listBranches(provinceName: string): Promise<CorreoBranch[]> {
  const provinceCode = provinceCodeFor(provinceName);
  if (!provinceCode) return [];

  const cached = cache.get(provinceCode);
  if (cached && Date.now() - cached.atMs < CACHE_TTL_MS) {
    return cached.branches;
  }

  const { baseUrl, customerId } = getCorreoConfig();
  const url = new URL(`${baseUrl}/agencies`);
  url.searchParams.set('customerId', customerId);
  url.searchParams.set('provinceCode', provinceCode);

  try {
    const doFetch = async () => {
      const token = await getCorreoToken();
      return fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
    };

    let res = await doFetch();
    if (res.status === 401) {
      invalidateCorreoToken();
      res = await doFetch();
    }
    if (!res.ok) {
      console.error(`[agencies] /agencies ${res.status} para ${provinceCode}`);
      return [];
    }

    const raw = (await res.json()) as CorreoAgencyRaw[];
    const branches = (Array.isArray(raw) ? raw : [])
      .filter(
        (a) =>
          a.status === 'ACTIVE' && a.services?.packageReception !== false,
      )
      .map(toBranch);

    cache.set(provinceCode, { branches, atMs: Date.now() });
    return branches;
  } catch (err) {
    console.error('[agencies] error listando sucursales:', err);
    return [];
  }
}
