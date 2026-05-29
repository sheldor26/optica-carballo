import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { encrypt, decrypt } from '@/lib/integrations/mercadolibre/encryption';
import type {
  IntegrationStatus,
  MarketplaceIntegration,
} from '@/lib/integrations/mercadolibre/types';

/**
 * Repo para `marketplace_integrations` (Mercado Libre).
 *
 * Todas las operaciones pasan por `createAdminClient` (service_role)
 * porque la tabla tiene RLS estricto. Los tokens se cifran/descifran
 * automáticamente al entrar/salir de DB.
 *
 * Iter 1: una sola integración activa por marketplace (founder único).
 * Si en el futuro hay multi-tenant, expandir las queries.
 */

const MARKETPLACE = 'mercadolibre';

type DbRow = {
  id: string;
  marketplace: string;
  external_user_id: string;
  access_token: string; // cifrado
  refresh_token: string; // cifrado
  token_expires_at: string;
  status: string;
  last_sync_at: string | null;
  last_error_at: string | null;
  last_error_message: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

function rowToIntegration(row: DbRow): MarketplaceIntegration {
  return {
    id: row.id,
    marketplace: 'mercadolibre',
    externalUserId: row.external_user_id,
    accessToken: decrypt(row.access_token),
    refreshToken: decrypt(row.refresh_token),
    tokenExpiresAt: new Date(row.token_expires_at),
    status: row.status as IntegrationStatus,
    lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : null,
    lastErrorAt: row.last_error_at ? new Date(row.last_error_at) : null,
    lastErrorMessage: row.last_error_message,
    metadata: row.metadata,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Devuelve la integración activa con ML (solo una por seller en iter 1).
 * NULL si no hay integración o si está revoked/error.
 */
export async function getActiveMLIntegration(): Promise<MarketplaceIntegration | null> {
  const supabase = createAdminClient();
  // Defensa de borde: en single-account model debería haber MÁXIMO 1 row activa,
  // pero si el founder autoriza con múltiples cuentas (re-auth con seller distinto)
  // y la limpieza de las viejas falla, queda inconsistente. Order by updated_at DESC
  // + limit 1 devuelve la MÁS RECIENTE — siempre la correcta para uso productivo.
  const { data, error } = await supabase
    .from('marketplace_integrations')
    .select('*')
    .eq('marketplace', MARKETPLACE)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('[ml-repo] getActiveMLIntegration error', error);
    return null;
  }
  if (!data || data.length === 0) return null;

  try {
    return rowToIntegration(data[0] as unknown as DbRow);
  } catch (err) {
    console.error('[ml-repo] error decrypting tokens', err);
    return null;
  }
}

/**
 * UPSERT de la integración. Cifra tokens antes de persistir.
 * Acepta UPDATE de tokens (refresh) y marca status='active' + clear errors.
 *
 * Single-account enforcement: ANTES del upsert, marca como 'revoked' cualquier
 * otra integración activa del mismo marketplace con distinto external_user_id.
 * Sin esto, re-autorizar con otra cuenta deja dos rows activas → break en
 * lectura (incidente 2026-05-29 con cuenta `1975674` vieja interfiriendo).
 */
export async function upsertMLIntegration(args: {
  externalUserId: string;
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  metadata?: Record<string, unknown>;
}): Promise<MarketplaceIntegration | null> {
  const supabase = createAdminClient();
  const expiresAt = new Date(Date.now() + args.expiresInSeconds * 1000);

  const encryptedAccess = encrypt(args.accessToken);
  const encryptedRefresh = encrypt(args.refreshToken);

  // Revoke otras integraciones activas del mismo marketplace con distinto user_id
  // (single-account model). No bloquea el upsert si falla — log + continúa.
  const { error: revokeError } = await supabase
    .from('marketplace_integrations')
    .update({ status: 'revoked' })
    .eq('marketplace', MARKETPLACE)
    .eq('status', 'active')
    .neq('external_user_id', args.externalUserId);
  if (revokeError) {
    console.warn(
      '[ml-repo] no se pudo revocar integraciones viejas (no crítico)',
      revokeError,
    );
  }

  const { data, error } = await supabase
    .from('marketplace_integrations')
    .upsert(
      {
        marketplace: MARKETPLACE,
        external_user_id: args.externalUserId,
        access_token: encryptedAccess,
        refresh_token: encryptedRefresh,
        token_expires_at: expiresAt.toISOString(),
        status: 'active',
        last_error_at: null,
        last_error_message: null,
        metadata: args.metadata ?? {},
      },
      { onConflict: 'marketplace,external_user_id' },
    )
    .select('*')
    .single();

  if (error) {
    console.error('[ml-repo] upsertMLIntegration error', error);
    return null;
  }
  if (!data) return null;

  return rowToIntegration(data as unknown as DbRow);
}

/**
 * Marca la integración con estado de error. Útil cuando un refresh falla
 * o tokens son rechazados — para que la admin UI muestre que hay que
 * re-autorizar.
 */
export async function markMLIntegrationError(args: {
  externalUserId: string;
  message: string;
  status?: 'expired' | 'revoked' | 'error';
}): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('marketplace_integrations')
    .update({
      status: args.status ?? 'error',
      last_error_at: new Date().toISOString(),
      last_error_message: args.message.slice(0, 500),
    })
    .eq('marketplace', MARKETPLACE)
    .eq('external_user_id', args.externalUserId);
}

/**
 * Bump `last_sync_at` cuando hay actividad exitosa con ML.
 * No falla si la integración no existe (ej: webhook llegó antes de OAuth).
 */
export async function touchMLIntegrationSync(externalUserId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('marketplace_integrations')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('marketplace', MARKETPLACE)
    .eq('external_user_id', externalUserId);
}

/**
 * Logging de errores a `marketplace_sync_errors` para observabilidad.
 * Best-effort: si falla, log a console pero no propaga.
 */
export async function logMLSyncError(args: {
  operation: string;
  variantId?: string | null;
  externalItemId?: string | null;
  errorPayload: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from('marketplace_sync_errors').insert({
      marketplace: MARKETPLACE,
      operation: args.operation,
      variant_id: args.variantId ?? null,
      external_item_id: args.externalItemId ?? null,
      error_payload: args.errorPayload,
    });
  } catch (err) {
    console.error('[ml-repo] logMLSyncError failed', err);
  }
}
