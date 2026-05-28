'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { setDefaultAddress } from '@/lib/addresses/actions';

export function SetDefaultButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await setDefaultAddress(id);
        });
      }}
    >
      {pending ? 'Marcando...' : 'Marcar como predeterminada'}
    </Button>
  );
}
