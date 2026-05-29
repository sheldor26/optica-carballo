'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeNewsletterAction } from '@/lib/newsletter/actions';
import type { NewsletterSource } from '@/lib/newsletter/types';

type Props = {
  source: NewsletterSource;
  /** 'hero' = bloque destacado en home. 'footer' = inline compact. */
  variant?: 'hero' | 'footer';
  className?: string;
};

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; alreadyExisted: boolean }
  | { kind: 'error'; message: string };

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: 'El email no parece válido. Revisalo y probá de nuevo.',
  rate_limited: 'Demasiados intentos. Esperá un momento.',
  server_error: 'Algo salió mal. Probá de nuevo en un instante.',
};

export function NewsletterForm({ source, variant = 'hero', className }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const [, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind === 'submitting') return;

    setState({ kind: 'submitting' });

    startTransition(async () => {
      try {
        const result = await subscribeNewsletterAction({ email, source });
        if (result.ok) {
          setState({
            kind: 'success',
            alreadyExisted: result.alreadyExisted,
          });
          setEmail('');
        } else {
          setState({
            kind: 'error',
            message: ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.server_error!,
          });
        }
      } catch {
        setState({ kind: 'error', message: ERROR_MESSAGES.server_error! });
      }
    });
  };

  if (variant === 'hero') {
    return (
      <div className={cn('w-full', className)}>
        <NewsletterFormBody
          variant="hero"
          email={email}
          setEmail={setEmail}
          state={state}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

  // footer compact
  return (
    <div className={cn('w-full', className)}>
      <NewsletterFormBody
        variant="footer"
        email={email}
        setEmail={setEmail}
        state={state}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function NewsletterFormBody({
  variant,
  email,
  setEmail,
  state,
  onSubmit,
}: {
  variant: 'hero' | 'footer';
  email: string;
  setEmail: (v: string) => void;
  state: FormState;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const isSubmitting = state.kind === 'submitting';
  const isSuccess = state.kind === 'success';
  const isError = state.kind === 'error';

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4',
            'border-green-200 bg-green-50 text-green-900',
            'dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-200',
            variant === 'footer' && 'p-3 text-sm',
          )}
          role="status"
        >
          <span className="bg-green-600 text-white flex size-7 shrink-0 items-center justify-center rounded-full">
            <Check className="size-4" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {state.alreadyExisted
                ? 'Ya estabas suscripto'
                : '¡Listo, te sumamos!'}
            </p>
            <p className="mt-0.5 text-sm opacity-90">
              {state.alreadyExisted
                ? 'No tocamos nada — ya recibís nuestras novedades.'
                : 'Te vamos a avisar cuando llegue algo que valga la pena.'}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={onSubmit}
          className={cn(
            'flex w-full flex-col gap-2',
            variant === 'hero' && 'sm:flex-row',
          )}
        >
          <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
            Tu email
          </label>
          <div className="relative flex-1">
            <Mail
              className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              id={`newsletter-email-${variant}`}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="tu@email.com"
              className={cn(
                'border-border/60 bg-background placeholder:text-muted-foreground/70 focus-visible:border-foreground/40 focus-visible:ring-foreground/10 h-11 w-full rounded-full border pl-9 pr-4 text-sm outline-none transition-colors focus-visible:ring-4 disabled:opacity-60',
                variant === 'hero' && 'sm:h-12 sm:text-base',
              )}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || email.length === 0}
            className={cn(
              'bg-foreground text-background hover:bg-foreground/85 disabled:bg-foreground/40 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors',
              variant === 'hero' && 'sm:h-12 sm:text-base sm:px-7',
            )}
          >
            {isSubmitting ? (
              <>
                <span
                  className="border-background/40 border-t-background size-4 animate-spin rounded-full border-2"
                  aria-hidden
                />
                Enviando
              </>
            ) : (
              'Suscribirme'
            )}
          </button>
        </motion.form>
      )}

      {isError && (
        <motion.p
          key="error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 inline-flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          {state.message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
