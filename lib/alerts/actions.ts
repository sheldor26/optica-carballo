'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import type { AlertType, ProductAlert } from './types';

const CreateAlertSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable(),
  alertType: z.enum(['price_drop', 'stock_back', 'both']),
  targetPriceCents: z.number().int().positive().nullable(),
});

type CreateAlertInput = z.infer<typeof CreateAlertSchema>;

export type CreateAlertResult =
  | { ok: true; alertId: string }
  | { ok: false; error: 'unauthenticated' | 'duplicate' | 'invalid' | 'unknown'; message?: string };

/**
 * Crea una alerta para el usuario logueado. Si ya existe una idéntica
 * (mismo product/variant/type), retorna `duplicate` (UX: el botón cambia
 * a "Alerta ya creada" en lugar de duplicar).
 */
export async function createAlert(input: CreateAlertInput): Promise<CreateAlertResult> {
  const parsed = CreateAlertSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid', message: parsed.error.message };
  }

  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'unauthenticated' };

  const supabase = await createClient();

  // Snapshot del estado actual para que el CRON pueda detectar cambios.
  const { data: variant } = parsed.data.variantId
    ? await supabase
        .from('product_variants')
        .select('price_cents, stock_qty')
        .eq('id', parsed.data.variantId)
        .maybeSingle()
    : { data: null };

  const { data: minVariant } = !parsed.data.variantId
    ? await supabase
        .from('product_variants')
        .select('price_cents, stock_qty')
        .eq('product_id', parsed.data.productId)
        .eq('is_active', true)
        .order('price_cents', { ascending: true })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const baseline = variant ?? minVariant;
  const baselinePrice = baseline?.price_cents ?? null;
  const baselineInStock = baseline ? baseline.stock_qty > 0 : null;

  const { data, error } = await supabase
    .from('product_alerts')
    .insert({
      user_id: user.id,
      product_id: parsed.data.productId,
      variant_id: parsed.data.variantId,
      alert_type: parsed.data.alertType,
      target_price_cents: parsed.data.targetPriceCents,
      baseline_price_cents: baselinePrice,
      baseline_in_stock: baselineInStock,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    if (error.code === '23505') return { ok: false, error: 'duplicate' };
    return { ok: false, error: 'unknown', message: error.message };
  }

  if (!data) return { ok: false, error: 'unknown' };

  revalidatePath('/mi-cuenta/alertas');
  return { ok: true, alertId: data.id };
}

export async function deleteAlert(alertId: string): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from('product_alerts')
    .delete()
    .eq('id', alertId)
    .eq('user_id', user.id);

  if (error) return { ok: false };
  revalidatePath('/mi-cuenta/alertas');
  return { ok: true };
}

export async function toggleAlert(alertId: string, isActive: boolean): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from('product_alerts')
    .update({ is_active: isActive })
    .eq('id', alertId)
    .eq('user_id', user.id);

  if (error) return { ok: false };
  revalidatePath('/mi-cuenta/alertas');
  return { ok: true };
}

/**
 * Check sin SELECT count para que el UI pueda mostrar "Ya tenés alerta"
 * sin abrir el modal otra vez. Devuelve la alert si existe.
 */
export async function getMyAlertFor(args: {
  productId: string;
  variantId: string | null;
  alertType: AlertType;
}): Promise<ProductAlert | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  let query = supabase
    .from('product_alerts')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', args.productId)
    .eq('alert_type', args.alertType);

  query = args.variantId
    ? query.eq('variant_id', args.variantId)
    : query.is('variant_id', null);

  const { data } = await query.maybeSingle<ProductAlert>();
  return data;
}
