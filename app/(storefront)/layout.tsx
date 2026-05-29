import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { CompareBarWrapper } from '@/components/compare/compare-bar-wrapper';
import { CursorFollower } from '@/components/ui/cursor-follower';
import { ScrollProgress } from '@/components/ui/scroll-progress';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <CursorFollower />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <CompareBarWrapper />
    </div>
  );
}
