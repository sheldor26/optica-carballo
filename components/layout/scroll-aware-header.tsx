'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

export function ScrollAwareHeader({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300 ease-out',
        scrolled
          ? 'bg-background/80 supports-[backdrop-filter]:bg-background/70 border-border/60 border-b shadow-[0_1px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-md'
          : 'bg-background/0 border-transparent border-b backdrop-blur-0',
      )}
    >
      {children}
    </header>
  );
}
