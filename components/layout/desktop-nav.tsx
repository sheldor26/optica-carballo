'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MagneticButton } from '@/components/ui/magnetic-button';
import type { NavLink } from '@/lib/site/nav';

export function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:items-center md:gap-1">
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <MagneticButton key={link.href} strength={0.18}>
            <Link
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
              {/* Underline animado — siempre visible si active, anima
                  desde el centro al hover si no */}
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
        );
      })}
    </nav>
  );
}
