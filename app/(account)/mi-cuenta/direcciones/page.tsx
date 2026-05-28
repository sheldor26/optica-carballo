import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressCard } from '@/components/account/address-card';
import { requireAuth } from '@/lib/auth/server';
import { fetchUserAddresses } from '@/lib/addresses/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Mis direcciones | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  await requireAuth('/mi-cuenta/direcciones');
  const addresses = await fetchUserAddresses();

  return (
    <main className="container max-w-3xl py-8 md:py-12">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">
            <Link
              href="/mi-cuenta"
              className="hover:text-foreground underline-offset-2 hover:underline"
            >
              ← Volver a mi cuenta
            </Link>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Mis direcciones
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Guardá las direcciones donde querés recibir tus compras.
          </p>
        </div>
        {addresses.length > 0 && (
          <Button asChild>
            <Link href="/mi-cuenta/direcciones/nueva">
              <Plus className="size-4" />
              Agregar
            </Link>
          </Button>
        )}
      </header>

      {addresses.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-foreground text-base font-medium">
            Todavía no agregaste direcciones
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Vas a necesitar al menos una dirección al momento de comprar.
          </p>
          <Button asChild className="mt-5">
            <Link href="/mi-cuenta/direcciones/nueva">
              <Plus className="size-4" />
              Agregar mi primera dirección
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((a) => (
            <AddressCard key={a.id} address={a} />
          ))}
        </div>
      )}
    </main>
  );
}
