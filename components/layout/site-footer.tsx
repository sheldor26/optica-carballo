import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/newsletter-form';
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
    <footer className="border-foreground/10 bg-zinc-50 mt-20 border-t md:mt-28">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-8">
          <div>
            <p className="text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
              {business.siteName}
            </p>
            {location && (
              <p className="text-muted-foreground mt-3 text-sm">
                {location} — Argentina
              </p>
            )}
            {business.regenteName && (
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Regente: <span className="text-foreground/80 font-medium">{business.regenteName}</span>
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

          <FooterColumn label="Catálogo" links={PRIMARY_NAV} />
          <FooterColumn label="Herramientas" links={TOOLS_LINKS} />
          <FooterColumn label="Información" links={FOOTER_INFO_LINKS} />

          {hasContactColumn && (
            <div>
              <p className="text-foreground/60 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em]">
                <span
                  className="bg-brand size-1 rounded-full"
                  aria-hidden="true"
                />
                Atención
              </p>
              <ul className="mt-4 space-y-3">
                {business.whatsappLink && (
                  <li>
                    <a
                      href={business.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <MessageCircle className="size-4" strokeWidth={1.75} />
                      WhatsApp
                    </a>
                  </li>
                )}
                {business.phone && (
                  <li>
                    <a
                      href={`tel:${business.phone}`}
                      className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
                    >
                      {business.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="border-foreground/10 mt-12 grid gap-6 border-t pt-10 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          <div className="max-w-md">
            <p className="text-foreground/60 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em]">
              <span
                className="bg-brand size-1 rounded-full"
                aria-hidden="true"
              />
              Newsletter
            </p>
            <p className="text-foreground mt-3 font-serif text-xl font-medium tracking-tight md:text-2xl">
              Sumate a las novedades.
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Te avisamos cuando llega algo que valga la pena. Sin spam.
            </p>
          </div>
          <div className="md:w-80">
            <NewsletterForm source="footer" variant="footer" />
          </div>
        </div>

        <div className="border-foreground/10 mt-10 flex flex-col items-start gap-6 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs">
            © {year} {business.siteName}. Todos los derechos reservados.
          </p>

          {/*
            Data Fiscal — ARCA (ex AFIP). Obligatorio para e-commerce AR.
            Badge externo: <img> plano (no next/image) + URLs en https para
            evitar mixed-content. El QR es el del CUIT del negocio.
          */}
          <a
            href="https://qr.afip.gob.ar/?qr=fLstQR06di9YY-9R4_zb6g,,"
            target="_F960AFIPInfo"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.afip.gob.ar/images/f960/DATAWEB.jpg"
              alt="Data Fiscal — ARCA (AFIP)"
              width={60}
              height={90}
              className="h-auto w-[60px]"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-foreground/60 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em]">
        <span className="bg-brand size-1 rounded-full" aria-hidden="true" />
        {label}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
