'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { setOrderInvoiceAction } from '@/app/admin/pedidos/actions';

/**
 * Carga el link de la factura del pedido (V1 por URL, no subimos el PDF). Lo
 * guarda en `orders.invoice_url` → el cliente lo ve como "Ver factura" en su
 * cuenta. Opción de avisarle por mail con el link.
 */
export function InvoiceControl({
  orderId,
  currentInvoiceUrl,
}: {
  orderId: string;
  currentInvoiceUrl: string | null;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(currentInvoiceUrl ?? '');
  const [notify, setNotify] = useState(false);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  function onSave() {
    setFeedback(null);
    startTransition(async () => {
      const res = await setOrderInvoiceAction({
        orderId,
        invoiceUrl: url,
        notify,
      });
      if (res.ok) {
        setFeedback({
          type: 'success',
          text: res.cleared
            ? 'Factura quitada del pedido.'
            : res.emailed
              ? 'Factura guardada y enviada por mail al cliente ✅'
              : res.emailError
                ? `Factura guardada ✅ (el mail falló: ${res.emailError})`
                : 'Factura guardada ✅',
        });
        router.refresh();
      } else {
        setFeedback({ type: 'error', text: res.error });
      }
    });
  }

  return (
    <section className="border-border rounded-lg border p-5">
      <h2 className="text-foreground text-base font-semibold">Factura</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Pegá el link del PDF de la factura (Tusfacturas/AFIP o Drive). El cliente
        lo ve en su cuenta como “Ver factura”.
      </p>

      <input
        type="url"
        inputMode="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="border-border bg-background text-foreground mt-3 w-full rounded-md border px-3 py-2 text-sm focus-visible:border-foreground/40 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
      />

      <label className="text-muted-foreground mt-3 flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
          className="size-4"
        />
        Avisar al cliente por mail con el link
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={onSave} disabled={pending}>
          {pending ? 'Guardando…' : 'Guardar factura'}
        </Button>
        {currentInvoiceUrl && (
          <a
            href={currentInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand text-sm underline-offset-2 hover:underline"
          >
            Ver factura actual
          </a>
        )}
      </div>

      {feedback && (
        <p
          className={cn(
            'mt-2 text-sm',
            feedback.type === 'success'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400',
          )}
          role="status"
        >
          {feedback.text}
        </p>
      )}
    </section>
  );
}
