import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAdminEmail } from '@/lib/auth/admin';
import {
  isAdminPinEnabled,
  hasValidAdminPinCookie,
  safeAdminNext,
} from '@/lib/auth/admin-pin';
import { AdminPinForm } from './pin-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Desbloquear — Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Pantalla del segundo factor. Requiere email admin (404 si no). Si el PIN no
 * está configurado o el navegador ya lo ingresó → directo al panel.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  await requireAdminEmail();

  const { next } = await searchParams;
  const target = safeAdminNext(next);

  if (!isAdminPinEnabled() || (await hasValidAdminPinCookie())) {
    redirect(target);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-neutral-900">Panel admin</h1>
        <p className="mt-1 mb-6 text-sm text-neutral-500">
          Ingresá tu código de 4 dígitos para continuar.
        </p>
        <AdminPinForm next={target} />
      </div>
    </main>
  );
}
