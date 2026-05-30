'use server';

import { revalidatePath } from 'next/cache';
import {
  deletePrescriptionCookie,
  readPrescriptionCookie,
  writePrescriptionCookie,
} from './cookie';
import {
  prescriptionCookieSchema,
  type PrescriptionCookie,
} from './types';

/**
 * Guarda la receta del usuario en la cookie firmada. Solo se llama desde
 * el lector cuando la receta es simple (monofocal sin patología) — los
 * casos presenciales NUNCA llegan acá.
 *
 * Valida el shape con Zod antes de escribir — defensa contra payloads
 * malformados que vengan del cliente.
 *
 * NUNCA loguear el payload — datos médicos sensibles (LPDP 25.326).
 */
export async function savePrescriptionToCookie(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = prescriptionCookieSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Receta inválida.' };
  }

  await writePrescriptionCookie(parsed.data);
  // Refresca páginas que muestran el banner — el server las re-rendereaba
  // con cookie vieja sin esta invalidación.
  revalidatePath('/anteojos-de-receta');
  return { ok: true };
}

/**
 * Borra la receta de la cookie. Llamado desde el banner ("Quitar receta")
 * o desde un boton explícito del usuario.
 */
export async function clearPrescriptionCookie(): Promise<void> {
  await deletePrescriptionCookie();
  revalidatePath('/anteojos-de-receta');
}

/**
 * Helper para Server Components que necesitan saber si hay receta cargada.
 * Devuelve null si no hay o si la cookie está rota.
 */
export async function getPrescriptionFromCookie(): Promise<PrescriptionCookie | null> {
  return await readPrescriptionCookie();
}
