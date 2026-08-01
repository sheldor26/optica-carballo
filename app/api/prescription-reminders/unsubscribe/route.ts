import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opticacarballo.com.ar';

/**
 * Unsubscribe sin login del recordatorio de receta — token propio
 * (`reminder_unsubscribe_token`), separado de `product_alerts.unsubscribe_token`
 * para no mezclar preferencias (argentine-ecom 2026-08-01). Marca
 * `reminder_sent_at` como ya enviado (timestamp presente) para que el cron no
 * vuelva a considerar esta receta — es un recordatorio de una sola vez, no
 * hay "reactivar" como en las alertas de stock/precio.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token || token.length < 16) {
    return NextResponse.redirect(`${SITE_URL}/?prescription_reminder_unsub=invalid`);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('prescriptions')
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq('reminder_unsubscribe_token', token)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(`${SITE_URL}/?prescription_reminder_unsub=notfound`);
  }

  return NextResponse.redirect(`${SITE_URL}/?prescription_reminder_unsub=ok`);
}
