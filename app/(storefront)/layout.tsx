import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
// CompareBar va directo (client): el wrapper de servidor que leía el cookie
// acá volvía DINÁMICAS todas las páginas del storefront (audit perf 2026-06-11).
import { CompareBar } from '@/components/compare/compare-bar';
import { CookiesBanner } from '@/components/legal/cookies-banner';
import { BackToTop } from '@/components/ui/back-to-top';
import { FloatingChat } from '@/components/chat/floating-chat';
import { FloatingWhatsapp } from '@/components/ui/floating-whatsapp';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { ToastHost } from '@/components/ui/toast-host';
import { getBusinessInfo } from '@/lib/site/business';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const business = getBusinessInfo();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <CompareBar />
      <BackToTop />
      <FloatingChat />
      {business.whatsappLink && (
        <FloatingWhatsapp
          whatsappLink={business.whatsappLink}
          defaultMessage="Hola, te consulto por anteojos."
        />
      )}
      <CookiesBanner />
      <ToastHost />
    </div>
  );
}
