import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/server';
import type { AlertWithProduct } from './types';

/**
 * Lista las alertas del usuario logueado con info del producto/variante
 * para renderizar la página `/mi-cuenta/alertas`.
 */
export async function fetchMyAlerts(): Promise<AlertWithProduct[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('product_alerts')
    .select(
      `
        id, user_id, product_id, variant_id, alert_type, target_price_cents,
        is_active, last_notified_at, baseline_price_cents, baseline_in_stock,
        unsubscribe_token, created_at, updated_at,
        product:products!inner(
          slug, name,
          brand:brands!inner(slug, name),
          category:categories!inner(slug)
        ),
        variant:product_variants(sku, price_cents, stock_qty, attributes)
      `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<AlertWithProduct[]>();

  return data ?? [];
}
