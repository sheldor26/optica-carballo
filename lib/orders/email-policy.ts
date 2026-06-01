import type { OrderStatus } from './types';

/**
 * Estados ante cuyo cambio se le manda email automático al cliente.
 * Decisión founder (Iter 2): preparing, reviewed, shipped, delivered.
 *
 * NO incluye `paid` (ya cubierto por el email de confirmación de pago al
 * cerrar la compra) ni `pending`/`cancelled`/`refunded` (se comunican por
 * otros canales). Single source of truth para el panel admin y la action.
 */
export const CUSTOMER_NOTIFY_STATUSES = [
  'preparing',
  'reviewed',
  'shipped',
  'delivered',
] as const satisfies readonly OrderStatus[];

export function shouldNotifyCustomer(status: OrderStatus): boolean {
  return (CUSTOMER_NOTIFY_STATUSES as readonly OrderStatus[]).includes(status);
}
