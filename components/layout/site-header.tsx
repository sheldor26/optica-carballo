import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DesktopNav } from '@/components/layout/desktop-nav';
import { MobileNav } from '@/components/layout/mobile-nav';
import { PRIMARY_NAV } from '@/lib/site/nav';
import { getBusinessInfo } from '@/lib/site/business';

export function SiteHeader() {
  const business = getBusinessInfo();

  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <div className="container flex h-14 items-center gap-3 md:h-16">
        <MobileNav links={PRIMARY_NAV} />

        <Link
          href="/"
          className="font-semibold tracking-tight text-foreground"
          aria-label={`${business.siteName} — Inicio`}
        >
          {business.siteName}
        </Link>

        <div className="hidden md:ml-6 md:block">
          <DesktopNav links={PRIMARY_NAV} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {business.whatsappLink && (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <a
                href={business.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </Button>
          )}
          {business.whatsappLink && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="sm:hidden"
            >
              <a
                href={business.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
              >
                <MessageCircle className="size-5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
