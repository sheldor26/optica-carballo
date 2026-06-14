/**
 * Toast minimalista, sin librerías (regla del proyecto: no sumar deps sin
 * preguntar). `showToast()` dispara un evento `oc:toast` que escucha el
 * `<ToastHost>` montado una vez en el layout del storefront.
 *
 * Pensado para feedback efímero de acciones (ej "Agregado al carrito"),
 * no para errores críticos ni formularios.
 */

export type ToastVariant = 'default' | 'error';

export interface ToastInput {
  message: string;
  /** Texto del link de acción (ej "Ver carrito"). Requiere `actionHref`. */
  actionLabel?: string;
  /** Ruta del link de acción (ej "/carrito"). */
  actionHref?: string;
  variant?: ToastVariant;
}

export const TOAST_EVENT = 'oc:toast';

export function showToast(input: ToastInput): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ToastInput>(TOAST_EVENT, { detail: input }));
}
