import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { Address } from './types';

/**
 * Trae todas las addresses del user actual (RLS filtra automáticamente).
 * Ordena default primero, luego por updated_at DESC.
 */
export async function fetchUserAddresses(): Promise<Address[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('addresses')
    .select(
      'id, user_id, label, recipient_name, street, number, apartment, city, province, postal_code, country, phone, is_default, created_at, updated_at',
    )
    .order('is_default', { ascending: false })
    .order('updated_at', { ascending: false })
    .returns<Address[]>();
  return data ?? [];
}

/**
 * Trae una address por id. RLS bloquea acceso a addresses de otros users —
 * devuelve null si no es del user actual o no existe.
 */
export async function fetchAddressById(id: string): Promise<Address | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('addresses')
    .select(
      'id, user_id, label, recipient_name, street, number, apartment, city, province, postal_code, country, phone, is_default, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle()
    .returns<Address>();
  return data ?? null;
}
