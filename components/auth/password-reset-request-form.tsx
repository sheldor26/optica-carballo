'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFeedback, SubmitButton } from '@/components/auth/form-status';
import { requestPasswordReset, type FormState } from '@/app/(auth)/actions';

const initialState: FormState = { ok: false };

export function PasswordResetRequestForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
      </div>

      <FormFeedback state={state} />

      <SubmitButton>Enviar link</SubmitButton>
    </form>
  );
}
