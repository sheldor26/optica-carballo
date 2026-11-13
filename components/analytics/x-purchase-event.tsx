'use client';

import { useEffect } from 'react';

const COOKIES_CONSENT_KEY = 'oc_cookies_consent';

/**
 * ID del evento "Compra completada" (tipo Purchase) creado en el Administrador
 * de eventos de X de la cuenta "Óptica Carballo" el 2026-11-12. Se puede
 * pisar con `NEXT_PUBLIC_X_PURCHASE_EVENT_ID`.
 */
const X_PURCHASE_EVENT_ID =
  process.env.NEXT_PUBLIC_X_PURCHASE_EVENT_ID ?? 'tw-rixqc-rixrl';

type Twq = (...args: unknown[]) => void;

function consentGranted(): boolean {
  try {
    const raw = window.localStorage.getItem(COOKIES_CONSENT_KEY);
    if (!raw) return false;
    return (JSON.parse(raw) as { choice?: string }).choice === 'all';
  } catch {
    return false;
  }
}

/**
 * Le avisa a X que hubo una compra (conversión), con el valor del pedido en
 * pesos. Se renderiza SOLO en `/checkout/exito` cuando el pedido existe.
 *
 * - Solo dispara con consentimiento "Aceptar todas" (el píxel base tampoco
 *   carga sin él) y espera hasta ~20 s a que el píxel esté listo.
 * - `conversion_id` = número de pedido: X descarta duplicados con el mismo id.
 * - Se marca en `localStorage` que ese pedido ya se informó, para que recargar
 *   la página de éxito no cuente la compra dos veces.
 * - No muestra nada.
 */
export function XPurchaseEvent({
  orderNumber,
  valueCents,
}: {
  orderNumber: string;
  valueCents: number;
}) {
  useEffect(() => {
    if (!X_PURCHASE_EVENT_ID) return;
    const sentKey = `oc_x_purchase_${orderNumber}`;
    try {
      if (window.localStorage.getItem(sentKey)) return;
    } catch {
      // sin storage: igual intentamos (X deduplica por conversion_id)
    }

    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      const twq = (window as unknown as { twq?: Twq }).twq;
      if (consentGranted() && typeof twq === 'function') {
        twq('event', X_PURCHASE_EVENT_ID, {
          value: (valueCents / 100).toFixed(2),
          currency: 'ARS',
          conversion_id: orderNumber,
        });
        try {
          window.localStorage.setItem(sentKey, String(Date.now()));
        } catch {
          // ignorar
        }
        window.clearInterval(timer);
      } else if (tries >= 40) {
        window.clearInterval(timer);
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, [orderNumber, valueCents]);

  return null;
}
