'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { generateShipmentAction } from '@/app/admin/pedidos/actions';

/**
 * Botón para dar de alta el envío del pedido en MiCorreo (Correo Argentino).
 * Genera un envío REAL (preimposición). Idempotente: re-apretar no duplica
 * (Correo rechaza el mismo extOrderId). El nº de tracking NO lo devuelve la
 * API — se copia del panel MiCorreo y se carga en "Cambiar estado".
 */
export function ShipmentControl({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  function onGenerate() {
    setFeedback(null);
    startTransition(async () => {
      const res = await generateShipmentAction(orderId);
      if (res.ok) {
        setFeedback({
          type: 'success',
          text: res.alreadyImported
            ? 'Este envío ya estaba dado de alta en Correo.'
            : 'Envío dado de alta en Correo ✅. Entrá al panel de MiCorreo para copiar el nº de seguimiento e imprimir la etiqueta.',
        });
        router.refresh();
      } else {
        setFeedback({ type: 'error', text: res.error });
      }
    });
  }

  return (
    <div className="border-border mt-4 border-t pt-4">
      <Button variant="outline" onClick={onGenerate} disabled={pending}>
        {pending ? 'Generando…' : 'Generar envío en Correo'}
      </Button>
      <p className="text-muted-foreground mt-2 text-xs">
        Da de alta el envío en MiCorreo con los datos del pedido. Después copiá
        el nº de seguimiento del panel de Correo y cargalo en “Cambiar estado”.
      </p>
      {feedback && (
        <p
          className={[
            'mt-2 text-sm',
            feedback.type === 'success'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400',
          ].join(' ')}
          role="status"
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}
