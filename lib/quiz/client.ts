'use client';

import type { QuizAnswers } from '@/lib/quiz/types';

const COOKIE_NAME = 'oc_quiz';
const MAX_AGE = 60 * 60 * 24 * 90; // 90 días

// Valores válidos por campo (defensa contra cookies manipuladas).
const VALID: Record<keyof QuizAnswers, readonly string[]> = {
  uso: ['sol', 'receta', 'ambos'],
  cara: ['ovalada', 'redonda', 'cuadrada', 'corazon', 'no_se'],
  precio: ['bajo', 'medio', 'alto'],
  genero: ['hombre', 'mujer', 'unisex'],
  correccion: ['si', 'no'],
};

/**
 * Persiste las respuestas del quiz en una cookie del browser (no httpOnly),
 * mismo patrón que `lib/recently-viewed/client.ts`. Permite mostrar el riel
 * "Pensado para vos" sin leer cookie server-side (que rompería el ISR del home)
 * y SIN migración de DB — el riel se hidrata client-side.
 */
export function saveQuizAnswers(answers: QuizAnswers): void {
  if (typeof document === 'undefined') return;
  const raw = encodeURIComponent(JSON.stringify(answers));
  document.cookie = `${COOKIE_NAME}=${raw}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function readQuizAnswers(): QuizAnswers | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return null;
  const raw = decodeURIComponent(cookie.split('=')[1] ?? '');
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as Record<string, unknown>;
    const ok = (Object.keys(VALID) as (keyof QuizAnswers)[]).every(
      (k) => typeof p[k] === 'string' && VALID[k].includes(p[k] as string),
    );
    return ok ? (p as unknown as QuizAnswers) : null;
  } catch {
    return null;
  }
}
