import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthFormShell } from '@/components/auth/auth-form-shell';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: { absolute: 'Crear cuenta | Óptica Carballo' },
  description: 'Creá tu cuenta para comprar y guardar tus datos en Óptica Carballo.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <AuthFormShell
      title="Crear cuenta"
      description="Te enviamos un email para confirmar."
      footer={
        <p>
          ¿Ya tenés cuenta?{' '}
          <Link
            href="/ingresar"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Ingresá
          </Link>
          .
        </p>
      }
    >
      <SignupForm />
    </AuthFormShell>
  );
}
