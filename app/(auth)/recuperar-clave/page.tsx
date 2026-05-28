import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthFormShell } from '@/components/auth/auth-form-shell';
import { PasswordResetRequestForm } from '@/components/auth/password-reset-request-form';

export const metadata: Metadata = {
  title: { absolute: 'Recuperar contraseña | Óptica Carballo' },
  description: 'Te enviamos un link para restablecer tu contraseña.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <AuthFormShell
      title="Recuperar contraseña"
      description="Ingresá tu email y te mandamos un link para crear una nueva."
      footer={
        <p>
          ¿La recordaste?{' '}
          <Link
            href="/ingresar"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Volver a ingresar
          </Link>
          .
        </p>
      }
    >
      <PasswordResetRequestForm />
    </AuthFormShell>
  );
}
