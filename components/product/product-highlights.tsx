import {
  Shield,
  Eye,
  Feather,
  Sparkles,
  CircleCheck,
  Sun,
} from 'lucide-react';

type AttributesJson = Record<string, unknown>;

type Highlight = {
  key: string;
  label: string;
  icon: typeof Shield;
};

const TREATMENT_HIGHLIGHTS: Record<string, Highlight> = {
  polarized: {
    key: 'polarized',
    label: 'Lentes polarizadas',
    icon: Eye,
  },
  uv400: {
    key: 'uv400',
    label: 'Protección UV400',
    icon: Sun,
  },
  gradient: {
    key: 'gradient',
    label: 'Lentes degradé',
    icon: Sparkles,
  },
  mirrored: {
    key: 'mirrored',
    label: 'Lentes espejadas',
    icon: Sparkles,
  },
  photochromic: {
    key: 'photochromic',
    label: 'Fotocromáticas',
    icon: Sun,
  },
};

function asNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.length > 0);
}

export function ProductHighlights({
  attributes,
}: {
  attributes: AttributesJson;
}) {
  const highlights: Highlight[] = [];

  const treatments = asStringArray(attributes.lens_treatment);
  for (const t of treatments) {
    const h = TREATMENT_HIGHLIGHTS[t];
    if (h && !highlights.find((x) => x.key === h.key)) highlights.push(h);
  }

  const weight = asNumber(attributes.weight_grams);
  if (weight !== null) {
    highlights.push({
      key: 'weight',
      label: `${weight} g · liviano`,
      icon: Feather,
    });
  }

  const gender = asString(attributes.gender);
  if (gender === 'unisex') {
    highlights.push({ key: 'unisex', label: 'Unisex', icon: CircleCheck });
  }

  highlights.push({
    key: 'warranty',
    label: 'Garantía 1 año',
    icon: Shield,
  });

  if (highlights.length === 0) return null;

  return (
    <ul className="-mx-1 mt-5 flex flex-wrap gap-2">
      {highlights.map((h, idx) => {
        const Icon = h.icon;
        return (
          <li
            key={h.key}
            style={{ animationDelay: `${idx * 60}ms` }}
            className="hero-reveal hero-reveal-3 bg-foreground/[0.04] hover:bg-foreground/[0.08] border-border/60 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200"
          >
            <Icon className="size-3.5" aria-hidden="true" />
            <span>{h.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
