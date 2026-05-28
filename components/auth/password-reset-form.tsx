'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFeedback, SubmitButton } from '@/components/auth/form-status';
import { resetPassword, type FormState } from '@/app/(auth)/actions';

const initialState: FormState = { ok: false };

export function PasswordResetForm() {
  const [state, formAction] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          autoFocus
        />
        <p className="text-muted-foreground text-xs">Mínimo 8 caracteres.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmar contraseña</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <FormFeedback state={state} />

      <SubmitButton>Restablecer contraseña</SubmitButton>
    </form>
  );
}
