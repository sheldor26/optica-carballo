import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Devuelve el usuario autenticado o null. No redirige.
 * Usado en componentes que tienen comportamiento condicional (Header).
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Devuelve el usuario autenticado o redirige a `/ingresar?next=<currentPath>`.
 * Usado en páginas protegidas (account, checkout).
 */
export async function requireAuth(currentPath: string) {
  const user = await getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(currentPath);
    redirect(`/ingresar?next=${next}`);
  }
  return user;
}

/**
 * Devuelve el profile del usuario autenticado (display_name, phone, etc.)
 * o null si no hay sesión. Hace una query a public.profiles.
 */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, phone, dni, cuit_cuil')
    .eq('id', user.id)
    .maybeSingle();

  return profile ? { user, profile } : { user, profile: null };
}
