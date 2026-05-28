import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNextPath } from '@/lib/auth/schemas';

/**
 * Callback de Supabase Auth para:
 * - Confirmación de email post-signup (link de confirmación).
 * - Magic link (futuro).
 * - Recuperación de contraseña (el link va directamente a /recuperar-clave/restablecer
 *   con sesión temporal seteada por Supabase).
 *
 * Supabase manda al usuario acá con `?code=...&next=/path`. Intercambiamos
 * el code por sesión y redirigimos a `next` (con validación anti open-redirect).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Sin code o error en el intercambio: redirigir a /ingresar con mensaje.
  return NextResponse.redirect(
    `${origin}/ingresar?next=${encodeURIComponent(next)}`,
  );
}
