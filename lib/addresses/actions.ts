'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { addressInputSchema, type AddressFormState } from './types';

const idSchema = z.uuid({ error: 'Dirección inválida.' });
const GENERIC_ERROR = 'No pudimos completar la acción. Probá de nuevo.';

function parseRaw(formData: FormData) {
  return {
    label: (formData.get('label') as string | null) ?? undefined,
    recipient_name: (formData.get('recipient_name') as string | null) ?? '',
    street: (formData.get('street') as string | null) ?? '',
    number: (formData.get('number') as string | null) ?? '',
    apartment: (formData.get('apartment') as string | null) ?? undefined,
    city: (formData.get('city') as string | null) ?? '',
    province: (formData.get('province') as string | null) ?? '',
    postal_code: (formData.get('postal_code') as string | null) ?? '',
    phone: (formData.get('phone') as string | null) ?? undefined,
    is_default: formData.get('is_default') === 'on',
  };
}

function fieldErrorsFromZod(
  error: z.ZodError,
): AddressFormState['fieldErrors'] {
  const result: AddressFormState['fieldErrors'] = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in result)) {
      // @ts-expect-error — narrowing key dinámico
      result[key] = issue.message;
    }
  }
  return result;
}

export async function createAddress(
  _prev: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Iniciá sesión para continuar.' };

  const parsed = addressInputSchema.safeParse(parseRaw(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Revisá los datos del formulario.',
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }
  const input = parsed.data;

  // Si el user no tiene addresses todavía, forzamos is_default = true.
  const { count } = await supabase
    .from('addresses')
    .select('*', { count: 'exact', head: true });
  const isFirst = (count ?? 0) === 0;
  const willBeDefault = isFirst || input.is_default;

  // Si pidió default y ya tenía otras, desmarcamos la anterior primero.
  if (willBeDefault && !isFirst) {
    const { error: unsetError } = await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('is_default', true);
    if (unsetError) return { ok: false, error: GENERIC_ERROR };
  }

  const { error } = await supabase.from('addresses').insert({
    user_id: user.id,
    label: input.label ?? null,
    recipient_name: input.recipient_name,
    street: input.street,
    number: input.number,
    apartment: input.apartment ?? null,
    city: input.city,
    province: input.province,
    postal_code: input.postal_code,
    country: 'AR',
    phone: input.phone ?? null,
    is_default: willBeDefault,
  });

  if (error) return { ok: false, error: GENERIC_ERROR };

  revalidatePath('/mi-cuenta/direcciones');
  redirect('/mi-cuenta/direcciones');
}

export async function updateAddress(
  id: string,
  _prev: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: 'Dirección inválida.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Iniciá sesión para continuar.' };

  const parsed = addressInputSchema.safeParse(parseRaw(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Revisá los datos del formulario.',
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }
  const input = parsed.data;

  // Ownership check + estado previo del default.
  const { data: current } = await supabase
    .from('addresses')
    .select('id, is_default')
    .eq('id', parsedId.data)
    .maybeSingle();
  if (!current) return { ok: false, error: 'No encontramos la dirección.' };

  // Si está marcando como default y antes no lo era, desmarcamos la otra.
  if (input.is_default && !current.is_default) {
    const { error: unsetError } = await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('is_default', true);
    if (unsetError) return { ok: false, error: GENERIC_ERROR };
  }

  // Si está desmarcando el default actual sin pasar a otro: lo dejamos
  // hacer (queda sin default). El user puede elegir otro después.
  const { error } = await supabase
    .from('addresses')
    .update({
      label: input.label ?? null,
      recipient_name: input.recipient_name,
      street: input.street,
      number: input.number,
      apartment: input.apartment ?? null,
      city: input.city,
      province: input.province,
      postal_code: input.postal_code,
      phone: input.phone ?? null,
      is_default: input.is_default,
    })
    .eq('id', parsedId.data);

  if (error) return { ok: false, error: GENERIC_ERROR };

  revalidatePath('/mi-cuenta/direcciones');
  redirect('/mi-cuenta/direcciones');
}

export async function deleteAddress(id: string): Promise<void> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Si era default, después de borrar promovemos la más reciente a default.
  const { data: target } = await supabase
    .from('addresses')
    .select('is_default')
    .eq('id', parsedId.data)
    .maybeSingle();

  await supabase.from('addresses').delete().eq('id', parsedId.data);

  if (target?.is_default) {
    const { data: next } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (next?.id) {
      await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', next.id);
    }
  }

  revalidatePath('/mi-cuenta/direcciones');
}

export async function setDefaultAddress(id: string): Promise<void> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Desmarcar la actual default, marcar la nueva. RLS limita al user.
  await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true);

  await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', parsedId.data);

  revalidatePath('/mi-cuenta/direcciones');
}
