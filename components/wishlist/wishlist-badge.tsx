'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { readWishlistClientSide } from '@/lib/wishlist/client';

/**
 * Badge para el header con count del wishlist. Lee el cookie client-side
 * (sin server round-trip). Se actualiza al toggle vía evento custom.
 */
export function WishlistBadge() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setCount(readWishlistClientSide().length);
    update();

    // Re-leer cuando focus vuelve a la ventana (otro tab pudo modificarlo).
    window.addEventListener('focus', update);
    // Polling ligero — el cookie puede cambiar sin evento del browser.
    const interval = setInterval(update, 1500);

    return () => {
      window.removeEventListener('focus', update);
      clearInterval(interval);
    };
  }, []);

  // Evitar hydration mismatch
  if (!mounted) {
    return (
      <Link
        href="/favoritos"
        aria-label="Mis favoritos"
        className="hover:bg-muted/40 relative flex size-9 items-center justify-center rounded-full transition-colors"
      >
        <Heart className="text-foreground/70 size-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/favoritos"
      aria-label={`Mis favoritos${count > 0 ? ` (${count})` : ''}`}
      className="hover:bg-muted/40 relative flex size-9 items-center justify-center rounded-full transition-colors"
    >
      <Heart
        className={
          count > 0
            ? 'size-4 fill-red-500 text-red-500'
            : 'text-foreground/70 size-4'
        }
      />
      {count > 0 && (
        <span className="bg-foreground text-background absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
