import type { Metadata } from 'next';
import { LogoutButton } from '@/components/auth/logout-button';
import { getCurrentProfile } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Mi cuenta | Óptica Carballo' },
  robots: { index: false, follow: false },
};

export default async function Page() {
  const data = await getCurrentProfile();
  if (!data) {
    redirect('/ingresar?next=%2Fmi-cuenta');
  }

  const { user, profile } = data;
  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'usuario';

  return (
    <main className="container max-w-3xl py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Hola, {displayName}
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Bienvenido a tu cuenta de Óptica Carballo.
        </p>
      </header>

      <section className="border-border rounded-lg border p-6">
        <h2 className="text-foreground text-lg font-semibold">Tus datos</h2>
        <dl className="text-muted-foreground mt-4 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="font-medium">Email</dt>
          <dd className="text-foreground">{user.email}</dd>
          {profile?.display_name && (
            <>
              <dt className="font-medium">Nombre</dt>
              <dd className="text-foreground">{profile.display_name}</dd>
            </>
          )}
          {profile?.phone && (
            <>
              <dt className="font-medium">Teléfono</dt>
              <dd className="text-foreground">{profile.phone}</dd>
            </>
          )}
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-foreground text-lg font-semibold">Cerrar sesión</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Cerrá tu sesión en este dispositivo.
        </p>
        <div className="mt-3">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
