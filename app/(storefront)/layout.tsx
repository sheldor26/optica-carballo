import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { CompareBarWrapper } from '@/components/compare/compare-bar-wrapper';
import { BackToTop } from '@/components/ui/back-to-top';
import { CursorFollower } from '@/components/ui/cursor-follower';
import { FloatingWhatsapp } from '@/components/ui/floating-whatsapp';
import { ScrollProgress } from '@/components/ui/scroll-progress';
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
      <CursorFollower />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <CompareBarWrapper />
      <BackToTop />
      {business.whatsappLink && (
        <FloatingWhatsapp
          whatsappLink={business.whatsappLink}
          defaultMessage="Hola, te consulto por anteojos."
        />
      )}
    </div>
  );
}
