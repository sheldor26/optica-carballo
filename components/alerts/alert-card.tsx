'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, BellOff, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAlert, toggleAlert } from '@/lib/alerts/actions';
import { ALERT_TYPE_LABEL, type AlertWithProduct } from '@/lib/alerts/types';
import { formatPriceCents } from '@/lib/format/currency';

export function AlertCard({ alert }: { alert: AlertWithProduct }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const productUrl = `/${alert.product.category.slug}/${alert.product.brand.slug}/${alert.product.slug}`;
  const currentPrice = alert.variant?.price_cents ?? alert.baseline_price_cents;
  const currentlyInStock = alert.variant ? alert.variant.stock_qty > 0 : null;

  const handleToggle = () =>
    startTransition(async () => {
      await toggleAlert(alert.id, !alert.is_active);
      router.refresh();
    });

  const handleDelete = () =>
    startTransition(async () => {
      if (confirm('¿Eliminar esta alerta?')) {
        await deleteAlert(alert.id);
        router.refresh();
      }
    });

  return (
    <div className="border-border/60 rounded-xl border p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={productUrl}
            className="text-foreground hover:text-brand text-base font-medium leading-tight"
          >
            {alert.product.name}
          </Link>
          <p className="text-muted-foreground mt-1 text-xs">
            {alert.product.brand.name}
            {alert.variant && ` · SKU ${alert.variant.sku}`}
          </p>
          <p className="text-foreground mt-3 text-sm">
            <span className="text-muted-foreground">Te avisamos:</span>{' '}
            {ALERT_TYPE_LABEL[alert.alert_type]}
            {alert.target_price_cents && (
              <>
                {' '}
                · Precio objetivo{' '}
                <span className="font-medium">
                  {formatPriceCents(alert.target_price_cents)}
                </span>
              </>
            )}
          </p>
          {currentPrice !== null && (
            <p className="text-muted-foreground mt-1 text-xs">
              Precio actual: <span className="text-foreground font-medium">{formatPriceCents(currentPrice)}</span>
              {currentlyInStock !== null && (
                <>
                  {' '}· {currentlyInStock ? 'En stock' : 'Sin stock'}
                </>
              )}
            </p>
          )}
          {alert.last_notified_at && (
            <p className="text-muted-foreground mt-1 text-xs">
              Último aviso:{' '}
              {new Date(alert.last_notified_at).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
            title={alert.is_active ? 'Pausar alerta' : 'Reactivar'}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : alert.is_active ? (
              <Bell className="size-4" />
            ) : (
              <BellOff className="text-muted-foreground size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            title="Eliminar alerta"
          >
            <Trash2 className="text-destructive size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
