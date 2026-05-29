'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MagneticButton } from '@/components/ui/magnetic-button';
import {
  buildMarcasMegaColumns,
  buildRecetaMegaColumns,
  buildSolMegaColumns,
  type MegaColumn,
} from '@/lib/site/mega-nav';
import type { NavLink } from '@/lib/site/nav';

const HOVER_OPEN_DELAY_MS = 120;
const HOVER_CLOSE_DELAY_MS = 220;

function getMegaColumns(href: string): MegaColumn[] | null {
  if (href === '/anteojos-de-sol') return buildSolMegaColumns();
  if (href === '/anteojos-de-receta') return buildRecetaMegaColumns();
  if (href === '/marcas') return buildMarcasMegaColumns();
  return null;
}

/**
 * Desktop nav con mega-menu. Algunos links (sol/receta/marcas) abren panel
 * grande al hover con subcategorías + filtros + marcas. Otros links hacen
 * navegación directa.
 *
 * - Hover-intent: 120ms para abrir, 220ms para cerrar (evita flickering).
 * - ESC cierra el mega activo.
 * - Click en cualquier link del mega también cierra (navigation).
 * - Mobile: este componente no se renderiza (md:flex) — drawer aparte.
 */
export function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMega = (href: string) => {
    clearTimers();
    openTimer.current = window.setTimeout(() => {
      setActiveMega(href);
    }, HOVER_OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = window.setTimeout(() => {
      setActiveMega(null);
    }, HOVER_CLOSE_DELAY_MS);
  };

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeMega !== null) {
        clearTimers();
        setActiveMega(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeMega]);

  useEffect(() => () => clearTimers(), []);

  const activeColumns = activeMega ? getMegaColumns(activeMega) : null;

  return (
    <nav
      className="hidden md:flex md:items-center md:gap-1"
      onMouseLeave={scheduleClose}
    >
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        const hasMega = getMegaColumns(link.href) !== null;

        return (
          <div
            key={link.href}
            onMouseEnter={() => {
              cancelClose();
              if (hasMega) openMega(link.href);
            }}
          >
            <MagneticButton strength={0.18}>
              <Link
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                aria-haspopup={hasMega ? 'true' : undefined}
                aria-expanded={hasMega ? activeMega === link.href : undefined}
                className={cn(
                  'group relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'bg-brand pointer-events-none absolute bottom-1 left-1/2 h-[1.5px] -translate-x-1/2 transition-all duration-300 ease-out',
                    isActive
                      ? 'w-[calc(100%-1.5rem)]'
                      : 'w-0 group-hover:w-[calc(100%-1.5rem)]',
                  )}
                />
              </Link>
            </MagneticButton>
          </div>
        );
      })}

      <AnimatePresence>
        {activeMega && activeColumns && (
          <motion.div
            key={activeMega}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="border-border/60 bg-background/95 fixed inset-x-0 top-14 z-30 border-t shadow-lg backdrop-blur-md md:top-16"
            role="region"
            aria-label="Submenú de navegación"
          >
            <div className="container py-6 md:py-8">
              <div
                className={cn(
                  'grid gap-8',
                  activeColumns.length === 1
                    ? 'md:max-w-md md:grid-cols-1'
                    : activeColumns.length === 2
                      ? 'md:grid-cols-2'
                      : activeColumns.length === 3
                        ? 'md:grid-cols-3'
                        : 'md:grid-cols-4',
                )}
              >
                {activeColumns.map((col) => (
                  <div key={col.heading}>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]">
                      {col.heading}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-foreground hover:text-brand text-sm font-medium transition-colors"
                            onClick={() => setActiveMega(null)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
