'use client';

import { useState, useTransition } from 'react';
import { Check, Loader2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addToCart } from '@/lib/cart/actions';
import { flyToCart } from '@/lib/cart/fly-to-cart';
import { showToast } from '@/lib/ui/toast';

/**
 * Botón redondo "Agregar" sobre la foto de la card del catálogo. Suma la
 * variante mostrada al carrito sin entrar a la PDP, dispara el vuelo al
 * carrito y muestra un toast con link al carrito.
 *
 * Va como sibling del <Link> de la card (no adentro: <button> dentro de <a>
 * es HTML inválido). Por eso frena la propagación para que el click no
 * navegue a la PDP.
 */
export function QuickAddButton({
  variantId,
  productName,
  getOrigin,
  className,
}: {
  variantId: string;
  productName: string;
  /** Devuelve el elemento desde donde "vuela" la foto (la imagen de la card). */
  getOrigin: () => HTMLElement | null;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    startTransition(async () => {
      const res = await addToCart({ variantId, quantity: 1 });
      if (res.ok) {
        setJustAdded(true);
        flyToCart(getOrigin());
        window.dispatchEvent(new CustomEvent('oc:cart-changed'));
        showToast({
          message: `${productName} · agregado`,
          actionLabel: 'Ver carrito',
          actionHref: '/carrito',
        });
        setTimeout(() => setJustAdded(false), 1500);
      } else {
        showToast({ message: res.error, variant: 'error' });
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={`Agregar ${productName} al carrito`}
      className={cn(
        'bg-background text-foreground border-border/60 hover:bg-foreground hover:text-background flex size-9 items-center justify-center rounded-full border shadow-sm transition-colors duration-200 disabled:opacity-70',
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : justAdded ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Plus className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
