import {
  Award,
  Globe,
  Heart,
  MapPin,
  Mountain,
  Shield,
  Sparkles,
  Sun,
  Waves,
} from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import {
  getBrandCopy,
  type BrandDifferential,
} from '@/lib/brands/copy';

const ICON_MAP = {
  Award,
  Globe,
  Heart,
  MapPin,
  Mountain,
  Shield,
  Sparkles,
  Sun,
  Waves,
} as const;

type Props = {
  brandSlug: string;
  brandName: string;
};

/**
 * Sección editorial de una marca: tagline + historia + meta strip (país,
 * año, segmento, target) + 3 differentials.
 *
 * Se renderiza arriba de la grid de productos en la página de marca.
 *
 * Si la marca NO tiene entry en `lib/brands/copy.ts`, no renderiza nada
 * (la página queda como antes, con su `<header>` simple).
 */
export function BrandStorySection({ brandSlug, brandName }: Props) {
  const copy = getBrandCopy(brandSlug);
  if (!copy) return null;

  return (
    <RevealOnScroll
      as="section"
      className="mb-14 md:mb-20"
      aria-label={`Sobre ${brandName}`}
    >
      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
        <div className="max-w-2xl">
          <p className="text-brand text-xs font-medium uppercase tracking-[0.2em]">
            Sobre la marca
          </p>
          <p className="text-foreground mt-3 font-serif text-xl font-medium leading-snug tracking-tight md:text-2xl">
            {copy.tagline}
          </p>
          <div className="text-muted-foreground mt-6 space-y-3 text-sm leading-relaxed md:text-base">
            {copy.story.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <BrandMetaStrip copy={copy} />
      </div>

      <ul className="border-border/60 mt-12 grid gap-6 border-t pt-10 sm:grid-cols-3 md:gap-8 md:pt-12">
        {copy.differentials.map((diff) => (
          <DifferentialCard key={diff.title} differential={diff} />
        ))}
      </ul>
    </RevealOnScroll>
  );
}

function BrandMetaStrip({ copy }: { copy: ReturnType<typeof getBrandCopy> }) {
  if (!copy) return null;

  const rows: { label: string; value: string }[] = [
    { label: 'Origen', value: copy.country },
  ];
  if (copy.foundedYear) {
    rows.push({ label: 'Año', value: String(copy.foundedYear) });
  }
  rows.push({ label: 'Segmento', value: copy.segment });
  rows.push({ label: 'Target', value: copy.audience });

  return (
    <dl className="border-border/60 bg-muted/30 grid w-full grid-cols-2 gap-x-6 gap-y-4 rounded-xl border p-5 sm:max-w-sm md:min-w-[260px]">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.15em]">
            {row.label}
          </dt>
          <dd className="text-foreground mt-1 text-sm font-semibold leading-tight">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DifferentialCard({
  differential,
}: {
  differential: BrandDifferential;
}) {
  const Icon = ICON_MAP[differential.icon];

  return (
    <li className="flex flex-col gap-3">
      <span
        aria-hidden="true"
        className="border-border/60 bg-background flex size-10 items-center justify-center rounded-full border"
      >
        <Icon className="text-foreground/80 size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-foreground text-sm font-semibold sm:text-base">
          {differential.title}
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
          {differential.description}
        </p>
      </div>
    </li>
  );
}
