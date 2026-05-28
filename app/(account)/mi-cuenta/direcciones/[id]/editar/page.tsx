import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddressForm } from '@/components/account/address-form';
import { requireAuth } from '@/lib/auth/server';
import { fetchAddressById } from '@/lib/addresses/queries';
import { updateAddress } from '@/lib/addresses/actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Editar dirección | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAuth(`/mi-cuenta/direcciones/${id}/editar`);

  const address = await fetchAddressById(id);
  if (!address) notFound();

  const action = updateAddress.bind(null, address.id);

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
          Editar dirección
        </h1>
      </header>

      <AddressForm
        action={action}
        address={address}
        submitLabel="Guardar cambios"
      />
    </main>
  );
}
