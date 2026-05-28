'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Badge del carrito en el header. Lee el count desde /api/cart/count para
 * no forzar el layout entero a Dynamic — el header sigue estático y este
 * slot se hidrata. Listener `oc:cart-changed` permite actualizar el count
 * desde server actions sin recargar.
 */
export function CartBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/cart/count', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { count: number };
        if (!cancelled) setCount(data.count);
      } catch {
        // silent — el badge no se muestra hasta que tenga un count real
      }
    };
    load();

    const handler = () => load();
    window.addEventListener('oc:cart-changed', handler);
    return () => {
      cancelled = true;
      window.removeEventListener('oc:cart-changed', handler);
    };
  }, []);

  const showBadge = count !== null && count > 0;

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/carrito" aria-label={`Carrito${count ? ` (${count})` : ''}`}>
        <ShoppingBag className="size-5" />
        {showBadge && (
          <span
            aria-hidden="true"
            className="bg-foreground text-background absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold"
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
