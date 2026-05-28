'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormSubmitButton } from '@/components/account/form-submit-button';
import { AR_PROVINCES } from '@/lib/addresses/constants';
import type { Address, AddressFormState } from '@/lib/addresses/types';

const initialState: AddressFormState = { ok: false };

export function AddressForm({
  action,
  address,
  submitLabel = 'Guardar dirección',
}: {
  action: (
    prev: AddressFormState,
    formData: FormData,
  ) => Promise<AddressFormState>;
  address?: Address | null;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="label">Etiqueta (opcional)</Label>
        <Input
          id="label"
          name="label"
          defaultValue={address?.label ?? ''}
          placeholder="Casa, trabajo, depósito..."
          maxLength={30}
        />
        {fe.label && <p className="text-destructive text-xs">{fe.label}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipient_name">Recibe</Label>
        <Input
          id="recipient_name"
          name="recipient_name"
          required
          autoComplete="name"
          defaultValue={address?.recipient_name ?? ''}
        />
        {fe.recipient_name && (
          <p className="text-destructive text-xs">{fe.recipient_name}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <div className="space-y-2">
          <Label htmlFor="street">Calle</Label>
          <Input
            id="street"
            name="street"
            required
            autoComplete="address-line1"
            defaultValue={address?.street ?? ''}
          />
          {fe.street && <p className="text-destructive text-xs">{fe.street}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            name="number"
            required
            defaultValue={address?.number ?? ''}
            placeholder="1234"
          />
          {fe.number && <p className="text-destructive text-xs">{fe.number}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apartment">Piso / departamento (opcional)</Label>
        <Input
          id="apartment"
          name="apartment"
          autoComplete="address-line2"
          defaultValue={address?.apartment ?? ''}
          placeholder="3° B"
        />
        {fe.apartment && (
          <p className="text-destructive text-xs">{fe.apartment}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad / localidad</Label>
          <Input
            id="city"
            name="city"
            required
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
          />
          {fe.city && <p className="text-destructive text-xs">{fe.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Código postal</Label>
          <Input
            id="postal_code"
            name="postal_code"
            required
            autoComplete="postal-code"
            defaultValue={address?.postal_code ?? ''}
            placeholder="1900"
          />
          {fe.postal_code && (
            <p className="text-destructive text-xs">{fe.postal_code}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="province">Provincia</Label>
        <select
          id="province"
          name="province"
          required
          defaultValue={address?.province ?? ''}
          className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Elegí una provincia
          </option>
          {AR_PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {fe.province && (
          <p className="text-destructive text-xs">{fe.province}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono de contacto (opcional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={address?.phone ?? ''}
          placeholder="+54 11 1234-5678"
        />
        {fe.phone && <p className="text-destructive text-xs">{fe.phone}</p>}
        <p className="text-muted-foreground text-xs">
          Lo usamos solo si el correo necesita coordinar la entrega.
        </p>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="is_default"
          name="is_default"
          type="checkbox"
          defaultChecked={address?.is_default ?? false}
          className="border-input mt-0.5 size-4 rounded border"
        />
        <Label htmlFor="is_default" className="text-sm font-normal">
          Usar como dirección predeterminada
        </Label>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <FormSubmitButton>{submitLabel}</FormSubmitButton>
    </form>
  );
}
