import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  PRESCRIPTIONS_ALLOWED_MIME,
  PRESCRIPTIONS_BUCKET,
  PRESCRIPTIONS_MAX_BYTES,
  PRESCRIPTIONS_MIME_TO_EXT,
  PRESCRIPTIONS_SIGNED_URL_TTL_SECONDS,
  type PrescriptionMime,
} from '@/lib/storage/constants';

function isAllowedMime(mime: string): mime is PrescriptionMime {
  return (PRESCRIPTIONS_ALLOWED_MIME as readonly string[]).includes(mime);
}

/** Path canónico: <user_id>/<prescription_id>/original.<ext> */
function buildPath(
  userId: string,
  prescriptionId: string,
  mime: PrescriptionMime,
): string {
  const ext = PRESCRIPTIONS_MIME_TO_EXT[mime];
  return `${userId}/${prescriptionId}/original.${ext}`;
}

export type UploadResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

/**
 * Sube un archivo de receta al bucket privado. Valida mime + size antes de
 * tocar Storage. Usa service_role (bypassa RLS) — solo desde server actions
 * que ya validaron auth del user. El caller es responsable de pasar el
 * `userId` correcto (que debe coincidir con `auth.uid()` del request actual).
 *
 * Reemplaza si ya existe (upsert: true) — útil para re-subir corregido.
 */
export async function uploadPrescriptionImage(args: {
  userId: string;
  prescriptionId: string;
  file: Blob;
  mime: string;
}): Promise<UploadResult> {
  if (!isAllowedMime(args.mime)) {
    return {
      ok: false,
      error: `Formato no permitido. Aceptamos: ${PRESCRIPTIONS_ALLOWED_MIME.join(', ')}.`,
    };
  }
  if (args.file.size === 0) {
    return { ok: false, error: 'El archivo está vacío.' };
  }
  if (args.file.size > PRESCRIPTIONS_MAX_BYTES) {
    const mb = (PRESCRIPTIONS_MAX_BYTES / 1024 / 1024).toFixed(0);
    return { ok: false, error: `El archivo supera el máximo de ${mb} MB.` };
  }

  const path = buildPath(args.userId, args.prescriptionId, args.mime);
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(PRESCRIPTIONS_BUCKET)
    .upload(path, args.file, {
      contentType: args.mime,
      upsert: true,
      cacheControl: '3600',
    });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, path };
}

/**
 * Genera una signed URL HTTPS con TTL corto para mostrar el archivo al user.
 * El bucket es privado, así que sin signed URL no hay acceso desde el browser.
 * Pasa `ttlSeconds` para override si necesitás más tiempo (raro).
 */
export async function getPrescriptionSignedUrl(
  path: string,
  ttlSeconds: number = PRESCRIPTIONS_SIGNED_URL_TTL_SECONDS,
): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(PRESCRIPTIONS_BUCKET)
    .createSignedUrl(path, ttlSeconds);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/** Elimina un archivo del bucket. No falla si no existe. */
export async function deletePrescriptionImage(path: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.storage.from(PRESCRIPTIONS_BUCKET).remove([path]);
}
