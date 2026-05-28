'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

/**
 * Slot client que muestra "Ingresar" o "Mi cuenta" según haya sesión.
 * Vive en el SiteHeader (Server Component) para no forzar la página entera
 * a ser dynamic — el árbol del Header se mantiene estático y este slot
 * se hidrata en el browser con el estado real de auth.
 */
export function AuthMenu() {
  const [state, setState] = useState<'loading' | 'in' | 'out'>('loading');
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setState(data.user ? 'in' : 'out');
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setState(session?.user ? 'in' : 'out');
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === 'loading') {
    // Reserva el espacio para evitar layout shift cuando se hidrata.
    return <div className="size-9 md:w-24" aria-hidden="true" />;
  }

  if (state === 'in') {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/mi-cuenta">
          <User className="size-4" />
          <span className="hidden md:inline">Mi cuenta</span>
        </Link>
      </Button>
    );
  }

  const next = pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : '';
  return (
    <Button asChild variant="ghost" size="sm">
      <Link href={`/ingresar${next}`}>
        <User className="size-4" />
        <span className="hidden md:inline">Ingresar</span>
      </Link>
    </Button>
  );
}
