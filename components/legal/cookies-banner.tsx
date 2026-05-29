'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'oc_cookies_consent';
const VERSION = 1; // bump si cambian las categorías para forzar re-consent

type ConsentChoice = 'all' | 'necessary_only';

type StoredConsent = {
  version: number;
  choice: ConsentChoice;
  timestamp: number;
};

function readConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'version' in parsed &&
      'choice' in parsed
    ) {
      const stored = parsed as StoredConsent;
      // Si la versión cambió, ignoramos el consent viejo.
      if (stored.version !== VERSION) return null;
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

function saveConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return;
  try {
    const data: StoredConsent = {
      version: VERSION,
      choice,
      timestamp: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage puede estar bloqueado en modo privado — silencioso.
  }
}

/**
 * Banner de cookies compliance ley 25.326.
 *
 * Aparece al primer visit si no hay consent guardado en localStorage.
 * Desaparece tras elegir "Aceptar todas" o "Solo necesarias".
 *
 * Niveles:
 * - **Necesarias**: siempre activas (carrito, wishlist, comparador, sesión). Sin estas el sitio no funciona — no requieren consent.
 * - **Analíticas/opcionales**: opt-in. Si el founder activa GA4 en el futuro, leer el consent antes de cargar el script.
 *
 * Storage: `oc_cookies_consent` en localStorage con `{version, choice, timestamp}`.
 * Bump VERSION si cambian las categorías → fuerza re-consent.
 */
export function CookiesBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Pequeño delay para no competir con LCP.
    const t = window.setTimeout(() => {
      const consent = readConsent();
      if (!consent) {
        setVisible(true);
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, []);

  const handleChoice = (choice: ConsentChoice) => {
    saveConsent(choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookies-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4"
          role="region"
          aria-label="Aviso de cookies"
        >
          <div
            className={cn(
              'border-border/60 bg-background/95 mx-auto max-w-3xl rounded-2xl border p-4 shadow-lg backdrop-blur-md sm:p-5',
            )}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="border-border/60 bg-muted/40 hidden size-9 shrink-0 items-center justify-center rounded-full border sm:flex"
              >
                <Cookie
                  className="text-foreground/70 size-4"
                  strokeWidth={1.75}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-semibold leading-tight sm:text-base">
                  Usamos cookies
                </p>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed sm:text-sm">
                  Las cookies necesarias (carrito, wishlist, comparador) siempre
                  están activas porque sin ellas el sitio no funciona. Las
                  opcionales (analítica) solo si las aceptás. Más info en{' '}
                  <Link
                    href="/politica-de-privacidad"
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    nuestra política de privacidad
                  </Link>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChoice('necessary_only')}
                aria-label="Cerrar y aceptar solo necesarias"
                className="text-muted-foreground hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-full transition-colors sm:hidden"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleChoice('necessary_only')}
                className="border-border/60 text-foreground hover:bg-muted/40 rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm"
              >
                Solo necesarias
              </button>
              <button
                type="button"
                onClick={() => handleChoice('all')}
                className="bg-foreground text-background hover:bg-foreground/85 rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
