'use client';

import { useState, useTransition } from 'react';
import { Tag, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPriceCents } from '@/lib/format/currency';
import { applyCouponToCart, removeCouponFromCart } from '@/lib/cart/actions';
import { useRouter } from 'next/navigation';
import type { AppliedCoupon } from '@/lib/cart/types';

type Props = {
  /** Cupón ya validado y aplicado. null si no hay. */
  appliedCoupon: AppliedCoupon | null;
  /** Mensaje de error si el código guardado no validó (ej: expirado). */
  couponError: string | null;
};

export function CouponInput({ appliedCoupon, couponError }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(couponError);
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    setError(null);
    startTransition(async () => {
      const result = await applyCouponToCart(code);
      if (!result.ok) {
        setError(result.error ?? 'No pudimos aplicar el código.');
      } else {
        setCode('');
        router.refresh();
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCouponFromCart();
      setError(null);
      router.refresh();
    });
  };

  if (appliedCoupon) {
    return (
      <div className="border-brand/40 bg-brand/5 mt-4 flex items-start gap-2 rounded-lg border p-3">
        <Tag className="text-brand mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-xs font-semibold">
            Cupón <span className="font-mono">{appliedCoupon.code}</span> aplicado
          </p>
          {appliedCoupon.description && (
            <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
              {appliedCoupon.description}
            </p>
          )}
          <p className="text-brand mt-1 text-xs font-medium">
            {appliedCoupon.removeShipping
              ? 'Envío gratis'
              : `Descuento: -${formatPriceCents(appliedCoupon.discountCents)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          aria-label="Quitar cupón"
          className="text-muted-foreground hover:text-foreground"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-1.5 text-xs underline-offset-2 hover:underline"
      >
        <Tag className="size-3.5" aria-hidden="true" />
        ¿Tenés un código de descuento?
      </button>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código"
          autoFocus
          className="h-9 uppercase"
          maxLength={40}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApply();
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          onClick={handleApply}
          disabled={isPending || code.trim().length === 0}
          className="shrink-0"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : 'Aplicar'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setCode('');
            setError(null);
          }}
          className="shrink-0"
        >
          <X className="size-3.5" />
        </Button>
      </div>
      {error && (
        <p className="text-destructive mt-2 text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
