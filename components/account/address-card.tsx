import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteAddressButton } from '@/components/account/delete-address-button';
import { SetDefaultButton } from '@/components/account/set-default-button';
import type { Address } from '@/lib/addresses/types';

export function AddressCard({ address }: { address: Address }) {
  const title = address.label || address.recipient_name;
  const line1 = `${address.street} ${address.number}${
    address.apartment ? ` · ${address.apartment}` : ''
  }`;
  const line2 = `${address.city}, ${address.province} (${address.postal_code})`;

  return (
    <article className="border-border flex flex-col gap-3 rounded-lg border p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground text-base font-semibold">{title}</h3>
            {address.is_default && (
              <Badge variant="secondary">Predeterminada</Badge>
            )}
          </div>
          {address.label && (
            <p className="text-muted-foreground mt-0.5 text-sm">
              {address.recipient_name}
            </p>
          )}
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={`/mi-cuenta/direcciones/${address.id}/editar`}
            aria-label={`Editar ${title}`}
          >
            <Pencil className="size-4" />
            Editar
          </Link>
        </Button>
      </header>

      <div className="text-muted-foreground text-sm">
        <p>{line1}</p>
        <p>{line2}</p>
        {address.phone && <p className="mt-1">Tel: {address.phone}</p>}
      </div>

      <footer className="border-border flex flex-wrap items-center gap-2 border-t pt-3">
        {!address.is_default && <SetDefaultButton id={address.id} />}
        <div className="ml-auto">
          <DeleteAddressButton id={address.id} label={title} />
        </div>
      </footer>
    </article>
  );
}
