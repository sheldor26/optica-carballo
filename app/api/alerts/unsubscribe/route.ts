import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opticacarballo.com.ar';

/**
 * Unsubscribe sin login — usa `unsubscribe_token` único de cada alerta.
 * Sirve cuando el usuario clickea el link del email y no recuerda contraseña.
 * Marca la alerta como `is_active=false` (no la elimina — el user puede
 * reactivar desde /mi-cuenta/alertas).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token || token.length < 16) {
    return NextResponse.redirect(`${SITE_URL}/?alert_unsub=invalid`);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('product_alerts')
    .update({ is_active: false })
    .eq('unsubscribe_token', token)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(`${SITE_URL}/?alert_unsub=notfound`);
  }

  return NextResponse.redirect(`${SITE_URL}/?alert_unsub=ok`);
}
