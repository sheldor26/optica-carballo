import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthFormShell } from '@/components/auth/auth-form-shell';
import { LoginForm } from '@/components/auth/login-form';
import { safeNextPath } from '@/lib/auth/schemas';

export const metadata: Metadata = {
  title: { absolute: 'Ingresar | Óptica Carballo' },
  description: 'Ingresá a tu cuenta de Óptica Carballo.',
  robots: { index: false, follow: true },
};

type SearchParams = { next?: string };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { next } = await searchParams;
  const safeNext = safeNextPath(next);

  return (
    <AuthFormShell
      title="Ingresar"
      description="Accedé a tu cuenta para ver tus pedidos y guardar tus datos."
      footer={
        <>
          <p>
            ¿Olvidaste tu contraseña?{' '}
            <Link
              href="/recuperar-clave"
              className="text-foreground font-medium underline underline-offset-4"
            >
              Recuperala acá
            </Link>
            .
          </p>
          <p className="mt-3">
            ¿No tenés cuenta?{' '}
            <Link
              href={`/registro${next ? `?next=${encodeURIComponent(safeNext)}` : ''}`}
              className="text-foreground font-medium underline underline-offset-4"
            >
              Creá una en 30 segundos
            </Link>
            .
          </p>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthFormShell>
  );
}
