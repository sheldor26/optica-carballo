import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { FOOTER_INFO_LINKS, PRIMARY_NAV, TOOLS_LINKS } from '@/lib/site/nav';
import { getBusinessInfo } from '@/lib/site/business';

export function SiteFooter() {
  const business = getBusinessInfo();
  const year = new Date().getFullYear();

  const locationParts = [business.street, business.locality, business.region].filter(
    (v): v is string => v !== null,
  );
  const location = locationParts.length > 0 ? locationParts.join(', ') : null;

  const hasContactColumn = Boolean(
    business.whatsappLink || business.phone,
  );

  return (
    <footer className="border-border bg-muted/40 mt-16 border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div>
            <p className="text-foreground text-base font-semibold">
              {business.siteName}
            </p>
            {location && (
              <p className="text-muted-foreground mt-1 text-sm">
                {location} — Argentina
              </p>
            )}
            {business.regenteName && (
              <p className="text-muted-foreground mt-3 text-sm">
                Regente: {business.regenteName}
                {business.regenteMatricula && (
                  <>
                    {' '}
                    <span className="text-muted-foreground/80">
                      (Mat. {business.regenteMatricula})
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          <div>
            <p className="text-foreground text-sm font-semibold">Catálogo</p>
            <ul className="mt-3 space-y-2">
              {PRIMARY_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-foreground text-sm font-semibold">Herramientas</p>
            <ul className="mt-3 space-y-2">
              {TOOLS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-foreground text-sm font-semibold">Información</p>
            <ul className="mt-3 space-y-2">
              {FOOTER_INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasContactColumn && (
            <div>
              <p className="text-foreground text-sm font-semibold">Atención</p>
              <ul className="mt-3 space-y-2">
                {business.whatsappLink && (
                  <li>
                    <a
                      href={business.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp
                    </a>
                  </li>
                )}
                {business.phone && (
                  <li>
                    <a
                      href={`tel:${business.phone}`}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      Teléfono: {business.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <p className="text-muted-foreground mt-10 border-t pt-6 text-xs">
          © {year} {business.siteName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
