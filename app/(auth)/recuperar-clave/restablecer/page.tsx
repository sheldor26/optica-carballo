import type { Metadata } from 'next';
import { AuthFormShell } from '@/components/auth/auth-form-shell';
import { PasswordResetForm } from '@/components/auth/password-reset-form';

export const metadata: Metadata = {
  title: { absolute: 'Restablecer contraseña | Óptica Carballo' },
  description: 'Creá tu nueva contraseña.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <AuthFormShell
      title="Restablecer contraseña"
      description="Elegí una nueva contraseña para tu cuenta."
    >
      <PasswordResetForm />
    </AuthFormShell>
  );
}
