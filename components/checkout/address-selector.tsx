'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import type { Address } from '@/lib/addresses/types';

/**
 * Selector de direcciones del user. Radios visuales (mejor UX que select
 * para 1-5 opciones, que es el rango esperable). Cuando hay sólo 1
 * dirección, la pre-selecciona y la presenta como confirmación.
 */
export function AddressSelector({
  addresses,
  defaultAddressId,
  onSelect,
}: {
  addresses: Address[];
  defaultAddressId?: string | null;
  /** Notifica la dirección elegida (para re-cotizar envío en el checkout). */
  onSelect?: (addressId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(
    defaultAddressId ?? addresses[0]?.id ?? '',
  );

  function handleSelect(id: string) {
    setSelectedId(id);
    onSelect?.(id);
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-foreground text-sm font-semibold">
        Dirección de envío
      </legend>

      {addresses.map((address) => {
        const isSelected = selectedId === address.id;
        return (
          <Label
            key={address.id}
            htmlFor={`address-${address.id}`}
            className={[
              'flex cursor-pointer items-start gap-3 rounded-md border p-4 text-sm transition-colors',
              isSelected
                ? 'border-foreground bg-muted/30'
                : 'border-border hover:border-muted-foreground',
            ].join(' ')}
          >
            <input
              id={`address-${address.id}`}
              type="radio"
              name="address_id"
              value={address.id}
              defaultChecked={isSelected}
              onChange={() => handleSelect(address.id)}
              className="mt-0.5 size-4"
              required
            />
            <span className="flex-1">
              <span className="text-foreground block font-medium">
                {address.label || address.recipient_name}
                {address.is_default && (
                  <span className="bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 text-[10px] font-normal">
                    Predeterminada
                  </span>
                )}
              </span>
              <span className="text-muted-foreground mt-1 block text-xs">
                {address.recipient_name} ·{' '}
                {[address.street, address.number].filter(Boolean).join(' ')}
                {address.apartment && ` · ${address.apartment}`}
              </span>
              <span className="text-muted-foreground block text-xs">
                {address.city}, {address.province} ({address.postal_code})
              </span>
            </span>
          </Label>
        );
      })}
    </fieldset>
  );
}
