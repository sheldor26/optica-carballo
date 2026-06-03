'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MagneticButton } from '@/components/ui/magnetic-button';
import {
  buildMarcasMegaMenu,
  buildRecetaMegaMenu,
  buildSolMegaMenu,
  type MegaCtaPanel,
  type MegaMenu,
  type MegaSection,
} from '@/lib/site/mega-nav';
import type { NavLink } from '@/lib/site/nav';

const HOVER_OPEN_DELAY_MS = 120;
const HOVER_CLOSE_DELAY_MS = 220;

function getMegaMenu(href: string): MegaMenu | null {
  if (href === '/anteojos-de-sol') return buildSolMegaMenu();
  if (href === '/anteojos-de-receta') return buildRecetaMegaMenu();
  if (href === '/marcas') return buildMarcasMegaMenu();
  return null;
}

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

  const activeMenu = activeMega ? getMegaMenu(activeMega) : null;
  const close = () => setActiveMega(null);

  return (
    <nav
      className="hidden md:flex md:items-center md:gap-1"
      onMouseLeave={scheduleClose}
    >
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        const hasMega = getMegaMenu(link.href) !== null;

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
        {activeMega && activeMenu && (
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
            <div className="container py-8 md:py-10">
              <div
                className={cn(
                  'grid gap-8 md:gap-10',
                  activeMenu.columns.length === 2
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-4',
                )}
              >
                {activeMenu.columns.map((col, idx) => {
                  if (col.type === 'cta') {
                    return (
                      <CtaColumn
                        key={`cta-${idx}`}
                        panel={col.panel}
                        onLinkClick={close}
                      />
                    );
                  }
                  return (
                    <div key={`content-${idx}`} className="space-y-7">
                      {col.sections.map((section) => (
                        <SectionBlock
                          key={section.heading}
                          section={section}
                          onLinkClick={close}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function SectionBlock({
  section,
  onLinkClick,
}: {
  section: MegaSection;
  onLinkClick: () => void;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]">
        {section.heading}
      </p>
      <ul className="mt-3 space-y-2">
        {section.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-foreground hover:text-brand text-sm font-medium transition-colors"
              onClick={onLinkClick}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaColumn({
  panel,
  onLinkClick,
}: {
  panel: MegaCtaPanel;
  onLinkClick: () => void;
}) {
  return (
    <div className="bg-accent/40 border-border/60 -mx-2 rounded-2xl border p-6 md:mx-0">
      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]">
        Ayuda
      </p>
      <h3 className="text-foreground mt-2 font-serif text-xl font-medium leading-tight md:text-2xl">
        {panel.title}
      </h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {panel.body}
      </p>
      <Link
        href={panel.primaryCta.href}
        onClick={onLinkClick}
        {...(panel.primaryCta.external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className="bg-foreground text-background hover:bg-foreground/90 mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
      >
        {panel.primaryCta.label}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
      {panel.secondaryHeading && panel.secondaryLinks && panel.secondaryLinks.length > 0 && (
        <div className="border-border/60 mt-6 border-t pt-4">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.18em]">
            {panel.secondaryHeading}
          </p>
          <ul className="mt-2 space-y-1.5">
            {panel.secondaryLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  {...(item.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="text-foreground/80 hover:text-foreground text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
