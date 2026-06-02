'use client';

import { useState, useTransition } from 'react';
import { Check, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addToCart } from '@/lib/cart/actions';

/**
 * Botón "Agregar" inline en cada variante. Usa transition para feedback
 * inmediato sin form submission tradicional (la mutación no necesita
 * recarga; solo dispara el evento `oc:cart-changed` para que el badge se
 * refresque).
 */
export function AddToCartButton({
  variantId,
  disabled = false,
  variantLabel,
  size = 'sm',
  fullWidth = false,
}: {
  variantId: string;
  disabled?: boolean;
  variantLabel: string;
  /** `lg` + `fullWidth` para el CTA primario de la PDP. Default `sm` inline. */
  size?: 'sm' | 'lg';
  fullWidth?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const res = await addToCart({ variantId, quantity: 1 });
      if (res.ok) {
        setJustAdded(true);
        window.dispatchEvent(new CustomEvent('oc:cart-changed'));
        setTimeout(() => setJustAdded(false), 1500);
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <div className={cn('flex flex-col gap-1', fullWidth ? 'items-stretch' : 'items-end')}>
      <Button
        type="button"
        size={size}
        variant={justAdded ? 'secondary' : 'default'}
        disabled={disabled || pending}
        onClick={handleClick}
        aria-label={`Agregar ${variantLabel} al carrito`}
        className={fullWidth ? 'w-full' : undefined}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Agregando
          </>
        ) : justAdded ? (
          <>
            <Check className="size-4" />
            Agregado
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" />
            Agregar
          </>
        )}
      </Button>
      {error && (
        <p className="text-destructive max-w-[200px] text-right text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
