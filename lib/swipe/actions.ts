'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Server actions para "Tinder de monturas" — persisten matches de usuarios
 * logueados en tabla `swipe_matches`. Usuarios anónimos siguen usando
 * localStorage (sync se hace al loguearse via `syncMatchesFromLocalStorage`).
 *
 * Política de privacidad: solo el propio user ve/modifica sus matches (RLS
 * activo en la tabla).
 */

const SlugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/, 'invalid slug format');

/** Agrega match (idempotente: ignora si ya existe). */
export async function addMatch(productSlug: string): Promise<{ ok: boolean }> {
  const slugParsed = SlugSchema.safeParse(productSlug);
  if (!slugParsed.success) return { ok: false };

  const user = await getCurrentUser();
  if (!user) return { ok: false };

  const supabase = await createClient();
  // UPSERT con ignore para idempotencia (re-swipe del mismo producto no
  // duplica ni falla).
  const { error } = await supabase
    .from('swipe_matches')
    .upsert(
      { user_id: user.id, product_slug: slugParsed.data },
      { onConflict: 'user_id,product_slug', ignoreDuplicates: true },
    );

  if (error) {
    console.error('[swipe] addMatch failed:', error.message);
    return { ok: false };
  }

  revalidatePath('/mi-cuenta/matches');
  return { ok: true };
}

/** Quita match (idempotente). */
export async function removeMatch(productSlug: string): Promise<{ ok: boolean }> {
  const slugParsed = SlugSchema.safeParse(productSlug);
  if (!slugParsed.success) return { ok: false };

  const user = await getCurrentUser();
  if (!user) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from('swipe_matches')
    .delete()
    .eq('user_id', user.id)
    .eq('product_slug', slugParsed.data);

  if (error) {
    console.error('[swipe] removeMatch failed:', error.message);
    return { ok: false };
  }

  revalidatePath('/mi-cuenta/matches');
  return { ok: true };
}

/** Lista los slugs de matches del usuario logueado. */
export async function listMyMatches(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('swipe_matches')
    .select('product_slug')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    if (error) console.error('[swipe] listMyMatches failed:', error.message);
    return [];
  }

  return data.map((row) => row.product_slug);
}

/**
 * Sincroniza array de slugs (típicamente desde localStorage de visitante
 * anónimo) al recién loguearse. UPSERT idempotente: si ya estaban, no falla.
 *
 * Llamada esperada: al detectar que user se acaba de loguear Y existe
 * localStorage con matches, el componente cliente llama a esta action
 * con los slugs. Después puede limpiar localStorage si quiere.
 */
const SyncSchema = z.object({
  slugs: z.array(SlugSchema).max(100),
});

export async function syncMatchesFromLocalStorage(input: {
  slugs: string[];
}): Promise<{ ok: boolean; synced: number }> {
  const parsed = SyncSchema.safeParse(input);
  if (!parsed.success) return { ok: false, synced: 0 };

  const user = await getCurrentUser();
  if (!user) return { ok: false, synced: 0 };

  if (parsed.data.slugs.length === 0) return { ok: true, synced: 0 };

  const supabase = await createClient();
  const rows = parsed.data.slugs.map((slug) => ({
    user_id: user.id,
    product_slug: slug,
  }));

  const { error } = await supabase
    .from('swipe_matches')
    .upsert(rows, {
      onConflict: 'user_id,product_slug',
      ignoreDuplicates: true,
    });

  if (error) {
    console.error('[swipe] sync failed:', error.message);
    return { ok: false, synced: 0 };
  }

  revalidatePath('/mi-cuenta/matches');
  return { ok: true, synced: parsed.data.slugs.length };
}
