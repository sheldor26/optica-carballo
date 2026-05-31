import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-jsonld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function InfoPageShell({
  title,
  slug,
  children,
}: {
  title: string;
  slug: string;
  children: React.ReactNode;
}) {
  const pageUrl = `${SITE_URL}/${slug}`;

  return (
    <main className="container py-12 md:py-20">
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: title, url: pageUrl },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>

      <article className="mx-auto max-w-3xl">
        <header className="mb-12 md:mb-16">
          <p className="text-foreground/60 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
            <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
            Información legal
          </p>
          <h1 className="text-foreground mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </header>

        <div className="text-foreground prose-content space-y-6 text-base leading-relaxed [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-[-0.01em] md:[&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-medium [&_h3]:tracking-tight md:[&_h3]:text-xl [&_p]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 md:text-lg">
          {children}
        </div>
      </article>
    </main>
  );
}
