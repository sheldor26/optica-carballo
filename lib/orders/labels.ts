import type { OrderStatus } from './types';

/**
 * Mapeo de status interno a label visible para el cliente. Algunos
 * statuses internos no se muestran tal cual (ej: `pending` aparece como
 * "Pago pendiente" para que el cliente sepa qué pasa).
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pago pendiente',
  paid: 'Pagado',
  preparing: 'En preparación',
  reviewed: 'Revisado por óptica',
  shipped: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

/**
 * Tono visual del badge por status. Sin colores hard-coded — usamos
 * clases de Tailwind para que respeten el theme.
 */
export const ORDER_STATUS_TONE: Record<
  OrderStatus,
  'neutral' | 'success' | 'info' | 'warning' | 'destructive'
> = {
  pending: 'warning',
  paid: 'success',
  preparing: 'info',
  reviewed: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'destructive',
  refunded: 'neutral',
};

/**
 * Fecha + hora corta en español argentino. Acepta ISO o Date.
 */
export function formatOrderDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  });
}

/**
 * Solo fecha (sin hora) en español argentino.
 */
export function formatOrderDateShort(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  });
}
