import {
  Info,
  Lightbulb,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

type AttributesJson = Record<string, unknown>;

type CalloutType = 'info' | 'tip' | 'recommendation' | 'warning';
type CalloutPosition = 'top' | 'middle' | 'bottom';

type ProductCallout = {
  type: CalloutType;
  position: CalloutPosition;
  title?: string;
  body: string;
};

const CALLOUT_STYLE: Record<
  CalloutType,
  { container: string; icon: LucideIcon; iconWrap: string; title: string }
> = {
  info: {
    container:
      'border-l-[3px] border-l-blue-500/80 bg-blue-50/60 dark:bg-blue-950/30',
    icon: Info,
    iconWrap:
      'bg-blue-500/10 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300',
    title: 'text-blue-900 dark:text-blue-200',
  },
  tip: {
    container:
      'border-l-[3px] border-l-amber-500/80 bg-amber-50/60 dark:bg-amber-950/30',
    icon: Lightbulb,
    iconWrap:
      'bg-amber-500/10 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300',
    title: 'text-amber-900 dark:text-amber-200',
  },
  recommendation: {
    container:
      'border-l-[3px] border-l-emerald-500/80 bg-emerald-50/60 dark:bg-emerald-950/30',
    icon: Sparkles,
    iconWrap:
      'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300',
    title: 'text-emerald-900 dark:text-emerald-200',
  },
  warning: {
    container:
      'border-l-[3px] border-l-red-500/80 bg-red-50/60 dark:bg-red-950/30',
    icon: TriangleAlert,
    iconWrap:
      'bg-red-500/10 text-red-700 dark:bg-red-400/20 dark:text-red-300',
    title: 'text-red-900 dark:text-red-200',
  },
};

function isValidType(v: unknown): v is CalloutType {
  return v === 'info' || v === 'tip' || v === 'recommendation' || v === 'warning';
}

function isValidPosition(v: unknown): v is CalloutPosition {
  return v === 'top' || v === 'middle' || v === 'bottom';
}

export function parseProductCallouts(raw: unknown): ProductCallout[] {
  if (!Array.isArray(raw)) return [];
  const out: ProductCallout[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const obj = item as Record<string, unknown>;
    if (!isValidType(obj.type)) continue;
    if (typeof obj.body !== 'string' || obj.body.length === 0) continue;
    out.push({
      type: obj.type,
      position: isValidPosition(obj.position) ? obj.position : 'bottom',
      title: typeof obj.title === 'string' ? obj.title : undefined,
      body: obj.body,
    });
  }
  return out;
}

export function getCalloutByPosition(
  attributes: AttributesJson,
  position: CalloutPosition,
): ProductCallout | null {
  const all = parseProductCallouts(attributes.callouts);
  return all.find((c) => c.position === position) ?? null;
}

export function ProductCallout({ callout }: { callout: ProductCallout }) {
  const style = CALLOUT_STYLE[callout.type];
  const Icon = style.icon;
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm',
        style.container,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full',
          style.iconWrap,
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        {callout.title && (
          <p
            className={cn(
              'mb-0.5 text-sm font-semibold tracking-tight',
              style.title,
            )}
          >
            {callout.title}
          </p>
        )}
        <p className="text-foreground/85 text-sm leading-relaxed">
          {callout.body}
        </p>
      </div>
    </div>
  );
}

export function ProductCalloutAt({
  attributes,
  position,
}: {
  attributes: AttributesJson;
  position: CalloutPosition;
}) {
  const callout = getCalloutByPosition(attributes, position);
  if (!callout) return null;
  return (
    <RevealOnScroll>
      <ProductCallout callout={callout} />
    </RevealOnScroll>
  );
}
