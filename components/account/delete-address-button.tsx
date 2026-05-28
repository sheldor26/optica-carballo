'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAddress } from '@/lib/addresses/actions';

export function DeleteAddressButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(true)}
        aria-label={`Eliminar ${label}`}
      >
        <Trash2 className="size-4" />
        Eliminar
      </Button>
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground text-xs">¿Eliminar?</span>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await deleteAddress(id);
            setConfirming(false);
          });
        }}
      >
        {pending ? 'Eliminando...' : 'Sí'}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={() => setConfirming(false)}
      >
        Cancelar
      </Button>
    </span>
  );
}
