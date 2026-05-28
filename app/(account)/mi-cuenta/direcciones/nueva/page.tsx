import type { Metadata } from 'next';
import Link from 'next/link';
import { AddressForm } from '@/components/account/address-form';
import { requireAuth } from '@/lib/auth/server';
import { createAddress } from '@/lib/addresses/actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Nueva dirección | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  await requireAuth('/mi-cuenta/direcciones/nueva');

  return (
    <main className="container max-w-2xl py-8 md:py-12">
      <header className="mb-6">
        <p className="text-muted-foreground text-sm">
          <Link
            href="/mi-cuenta/direcciones"
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            ← Mis direcciones
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Nueva dirección
        </h1>
      </header>

      <AddressForm action={createAddress} submitLabel="Guardar dirección" />
    </main>
  );
}
