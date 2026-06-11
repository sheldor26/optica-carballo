'use client';

import { useEffect, useState, useTransition } from 'react';
import { Bell, BellRing, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAlert, getMyAlertFor } from '@/lib/alerts/actions';
import { ALERT_TYPE_LABEL, type AlertType } from '@/lib/alerts/types';
import { useRouter } from 'next/navigation';

type Props = {
  productId: string;
  variantId: string | null;
  productName: string;
  /** Si el producto/variante está sin stock, pre-seleccionamos stock_back. */
  inStock: boolean;
};

/**
 * Resuelve sesión + alerta existente CLIENT-SIDE (antes la PDP lo hacía
 * server-side con `getCurrentUser()` — eso volvía DINÁMICA cada página de
 * producto y anulaba el ISR; audit perf 2026-06-11). Para anónimos no hay
 * round-trip: la sesión se lee del cookie local. Solo logueados disparan la
 * action que consulta la alerta existente.
 */
export function CreateAlertButton({
  productId,
  variantId,
  productName,
  inStock,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  // null = resolviendo: se trata como anónimo (botón lleva a /ingresar — en
  // la práctica resuelve en ms, antes de cualquier click).
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasExistingAlert, setHasExistingAlert] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>(
    inStock ? 'price_drop' : 'stock_back',
  );
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Heurística sin bundle: si existe el cookie de auth de Supabase
    // (`sb-<ref>-auth-token[.N]`) lo tratamos como logueado. Importar
    // supabase-js acá solo para esto sumaba ~64kB al bundle de la PDP.
    // Si el token está vencido/inválido, las actions igual devuelven
    // unauthenticated y el flujo lo maneja.
    const authed = document.cookie
      .split('; ')
      .some((c) => c.startsWith('sb-') && c.includes('-auth-token'));
    setIsAuthenticated(authed);
    if (!authed) return;

    getMyAlertFor({ productId, variantId, alertType: 'both' })
      .then((existing) => {
        if (!cancelled) setHasExistingAlert(existing !== null);
      })
      .catch(() => {
        // Sin info de alerta: el server igual rechaza duplicados.
      });
    return () => {
      cancelled = true;
    };
  }, [productId, variantId]);

  if (hasExistingAlert) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <BellRing className="size-4" />
        Alerta activa
      </Button>
    );
  }

  if (isAuthenticated !== true) {
    const nextPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => router.push(`/ingresar?next=${encodeURIComponent(nextPath)}`)}
      >
        <Bell className="size-4" />
        Crear alerta
      </Button>
    );
  }

  const handleSubmit = () => {
    setError(null);
    const targetPriceCents =
      alertType !== 'stock_back' && targetPrice.trim().length > 0
        ? Math.round(Number(targetPrice) * 100)
        : null;

    if (targetPriceCents !== null && (Number.isNaN(targetPriceCents) || targetPriceCents <= 0)) {
      setError('Precio objetivo inválido.');
      return;
    }

    startTransition(async () => {
      const result = await createAlert({
        productId,
        variantId,
        alertType,
        targetPriceCents,
      });
      if (result.ok) {
        setOpen(false);
        router.refresh();
      } else if (result.error === 'duplicate') {
        setError('Ya tenés una alerta de este tipo para este producto.');
      } else if (result.error === 'unauthenticated') {
        setError('Tu sesión expiró. Volvé a ingresar.');
      } else {
        setError('No se pudo crear la alerta. Probá de nuevo.');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="size-4" />
          Crear alerta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-1.5">
          <DialogTitle>Alerta de {productName}</DialogTitle>
          <DialogDescription>
            Te avisamos por email cuando se cumpla la condición. Podés gestionar
            tus alertas desde mi cuenta.
          </DialogDescription>
        </div>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="alert-type">¿Qué querés que te avisemos?</Label>
            <select
              id="alert-type"
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as AlertType)}
              className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
            >
              <option value="price_drop">{ALERT_TYPE_LABEL.price_drop}</option>
              <option value="stock_back">{ALERT_TYPE_LABEL.stock_back}</option>
              <option value="both">{ALERT_TYPE_LABEL.both}</option>
            </select>
          </div>

          {alertType !== 'stock_back' && (
            <div className="space-y-2">
              <Label htmlFor="target-price">
                Precio objetivo en pesos (opcional)
              </Label>
              <Input
                id="target-price"
                type="number"
                min="1"
                step="100"
                inputMode="numeric"
                placeholder="ej: 75000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Si lo dejás vacío, te avisamos en cualquier baja.
              </p>
            </div>
          )}

          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Crear alerta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
