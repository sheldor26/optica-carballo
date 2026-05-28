import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para contextos sin request scope (build time,
 * generateStaticParams, scripts). Usa la anon key, sin cookies, sin sesión
 * persistente. Para queries con sesión de usuario, usar `lib/supabase/server.ts`.
 */
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
