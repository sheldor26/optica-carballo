import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { catalogUrlIsValid } from '@/lib/catalog/existence-check';

/**
 * Soft-404 fix (AUDIT_2026-08-01.md addendum, bug conocido de Next.js:
 * https://github.com/vercel/next.js/issues/43831 — ISR cachea el HTML de
 * `notFound()` pero no el status code, así que marca/producto inválidos
 * terminan sirviendo HTTP 200). Acá chequeamos existencia ANTES de que la
 * request llegue a la página, y si no existe, reescribimos a un path que
 * Next.js no puede matchear con NINGUNA ruta — su propio manejo nativo de
 * "ruta no encontrada" (verificado que SÍ devuelve 404 real) toma control,
 * mostrando `app/not-found.tsx` con el status code correcto.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const valid = await catalogUrlIsValid(pathname);
  if (!valid) {
    const url = request.nextUrl.clone();
    url.pathname = '/__soft_404_rewrite__';
    return NextResponse.rewrite(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
