import type { OrderStatus, OrderStatusEvent } from './types';

/**
 * Tracker de pedido en vivo (Opción Z).
 *
 * Los 8 estados técnicos de `orders.status` se proyectan sobre 5 pasos
 * visibles del "happy path" que ve el cliente. `pending` (pre-pago) y los
 * estados terminales fuera de camino (`cancelled`, `refunded`) no son pasos
 * del stepper — se manejan aparte.
 *
 * El paso "Revisado por óptica" es nuestro diferencial: comunica que una
 * óptica matriculada controló el armado antes de despachar. No es marketing
 * vacío — María Carlota es la regente matriculada real (regla de negocio).
 */
export const TRACKER_STEPS = [
  'paid',
  'preparing',
  'reviewed',
  'shipped',
  'delivered',
] as const satisfies readonly OrderStatus[];

export type TrackerStep = (typeof TRACKER_STEPS)[number];

export const TRACKER_STEP_LABELS: Record<TrackerStep, string> = {
  paid: 'Pago confirmado',
  preparing: 'En preparación',
  reviewed: 'Revisado por óptica matriculada',
  shipped: 'Enviado',
  delivered: 'Entregado',
};

/** Descripción corta de cada paso (debajo del label en el stepper). */
export const TRACKER_STEP_DESCRIPTIONS: Record<TrackerStep, string> = {
  paid: 'Recibimos tu pago y tu pedido entró en cola.',
  preparing: 'Estamos armando tu pedido con tus productos.',
  reviewed: 'Una óptica matriculada controló y aprobó tu pedido.',
  shipped: 'Tu pedido salió en camino a destino.',
  delivered: 'Tu pedido llegó. ¡Que lo disfrutes!',
};

export type TrackerNodeState = 'completed' | 'current' | 'pending';

export type TrackerNode = {
  step: TrackerStep;
  label: string;
  description: string;
  state: TrackerNodeState;
  /** Timestamp ISO en que se alcanzó este paso (del timeline), o null. */
  at: string | null;
};

export type Tracker = {
  nodes: TrackerNode[];
  /** true si el pedido está cancelado o reembolsado (fuera del camino). */
  offPath: boolean;
  offPathStatus: Extract<OrderStatus, 'cancelled' | 'refunded'> | null;
  /** true si aún no se confirmó el pago (status `pending`). */
  awaitingPayment: boolean;
};

/**
 * Dado el status actual + los eventos del timeline, arma el stepper.
 * Función pura — testeable y usable en server o client.
 */
export function buildTracker(
  currentStatus: OrderStatus,
  events: OrderStatusEvent[],
): Tracker {
  const offPathStatus =
    currentStatus === 'cancelled' || currentStatus === 'refunded'
      ? currentStatus
      : null;
  const awaitingPayment = currentStatus === 'pending';

  // Primer timestamp en que se registró cada status (los eventos vienen
  // ordenados ASC por created_at, así que el primero gana).
  const reachedAt = new Map<OrderStatus, string>();
  for (const ev of events) {
    if (!reachedAt.has(ev.status)) reachedAt.set(ev.status, ev.createdAt);
  }

  // Índice del paso actual dentro del happy path. -1 si el status no es un
  // paso visible (pending / cancelled / refunded).
  const currentIndex = (TRACKER_STEPS as readonly OrderStatus[]).indexOf(
    currentStatus,
  );

  const nodes: TrackerNode[] = TRACKER_STEPS.map((step, i) => {
    let state: TrackerNodeState;
    if (currentIndex < 0) {
      // pending u off-path: nada del happy path está activo.
      state = 'pending';
    } else if (i < currentIndex) {
      state = 'completed';
    } else if (i === currentIndex) {
      // El último paso (delivered) alcanzado se considera completado.
      state = step === 'delivered' ? 'completed' : 'current';
    } else {
      state = 'pending';
    }

    return {
      step,
      label: TRACKER_STEP_LABELS[step],
      description: TRACKER_STEP_DESCRIPTIONS[step],
      state,
      at: reachedAt.get(step) ?? null,
    };
  });

  return { nodes, offPath: offPathStatus !== null, offPathStatus, awaitingPayment };
}
