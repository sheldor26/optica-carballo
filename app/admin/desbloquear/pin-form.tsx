'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { unlockAdminAction, type UnlockState } from './actions';

const INITIAL: UnlockState = { error: null };

/**
 * Formulario del segundo factor (PIN de 4 dígitos). La verificación corre en la
 * server action `unlockAdminAction` (que re-valida el email admin + límite de
 * intentos). En éxito, la action redirige; no hace falta manejar navegación acá.
 */
export function AdminPinForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(unlockAdminAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <label htmlFor="pin" className="text-sm font-medium text-neutral-700">
        Código de seguridad
      </label>
      <input
        id="pin"
        name="pin"
        type="password"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        autoFocus
        autoComplete="off"
        placeholder="••••"
        aria-invalid={state.error ? true : undefined}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-center text-2xl tracking-[0.6em] outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Verificando…' : 'Entrar'}
      </Button>
    </form>
  );
}
