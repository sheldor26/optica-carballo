import 'server-only';

/**
 * Rate limit + cache TTL EN MEMORIA (fixed window). V1 sin Redis/Upstash.
 *
 * ⚠️ El estado vive por-instancia del server (en Vercel serverless cada lambda
 * tiene el suyo) → NO es un límite global exacto. Sirve como freno básico de
 * abuso/scraping en endpoints públicos que proxean APIs con cuota (ej. Correo).
 * Si se necesita un límite global real, migrar a Upstash Redis (requiere dep
 * nueva + decisión del founder).
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Devuelve si la request está permitida bajo el límite `limit` por `windowMs`.
 * Hace una limpieza perezosa de buckets vencidos cuando el Map crece.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Prune perezoso para que el Map no crezca sin techo.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k);
    }
  }

  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (b.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

type CacheEntry<T> = { value: T; expiresAt: number };

/** Cache TTL en memoria, genérico. Mismo caveat por-instancia que el rate limit. */
export class TtlCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  constructor(private ttlMs: number, private maxEntries = 2000) {}

  get(key: string): T | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (Date.now() >= e.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return e.value;
  }

  set(key: string, value: T): void {
    if (this.store.size > this.maxEntries) {
      // Prune perezoso de vencidos; si igual está lleno, limpia todo (V1 simple).
      const now = Date.now();
      for (const [k, e] of this.store) {
        if (now >= e.expiresAt) this.store.delete(k);
      }
      if (this.store.size > this.maxEntries) this.store.clear();
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
