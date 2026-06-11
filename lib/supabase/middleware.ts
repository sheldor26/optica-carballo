import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Sin cookies de auth de Supabase (`sb-<ref>-auth-token[.N]`) no hay sesión
  // que refrescar: getUser() sería un no-op. Salteamos crear el cliente para
  // no sumar latencia a cada page view anónimo — que es casi todo el tráfico
  // (audit perf 2026-06-11). Los usuarios logueados siguen el flujo completo.
  const hasAuthCookies = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith('sb-'));
  if (!hasAuthCookies) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}
