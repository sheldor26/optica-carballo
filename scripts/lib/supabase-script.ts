/**
 * Cliente de Supabase con service_role para los scripts de terminal.
 *
 * `lib/supabase/admin.ts` no sirve acá: lleva `import 'server-only'`, que en un
 * `tsx script.ts` tira error al importarse. Este helper hace lo mismo pero sin
 * ese marcador, y valida las env vars con un mensaje que dice qué falta —
 * el error nativo de Supabase cuando la URL es `undefined` no ayuda en nada.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function crearClienteAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. ' +
        'Los scripts se corren con --env-file=.env.local (ya viene en los comandos de package.json).',
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
