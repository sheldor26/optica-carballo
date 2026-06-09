'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { unlockAdminAction, type UnlockState } from './actions';

const INITIAL: UnlockState = { error: null };

/**
 * Formulario del segundo factor (PIN de 4 dígitos). La verificación corre en la
 * server action `unlockAdminAction` (que re-valida el email admin + límite de
 * intentos). En éxito, la action redirige; no hace falta manejar navegación acá.
 *
 * UX: solo acepta dígitos, se auto-envía al 4º (como una pantalla de bloqueo) y
 * se limpia solo si el PIN fue incorrecto, listo para reintentar sin fricción.
 */
export function AdminPinForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(unlockAdminAction, INITIAL);
  const [pin, setPin] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Tras un intento fallido, limpiar el campo para reintentar de cero.
  useEffect(() => {
    if (state.error) setPin('');
  }, [state]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(digits);
    if (digits.length === 4 && !pending) {
      // Auto-enviar al completar los 4 dígitos.
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <label htmlFor="pin" className="text-sm font-medium text-neutral-700">
        Código de seguridad
      </label>
      <input
        id="pin"
        name="pin"
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
        autoFocus
        value={pin}
        onChange={handleChange}
        disabled={pending}
        placeholder="••••"
        aria-invalid={state.error ? true : undefined}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-center text-2xl tracking-[0.6em] outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || pin.length !== 4} className="w-full">
        {pending ? 'Verificando…' : 'Entrar'}
      </Button>
    </form>
  );
}
