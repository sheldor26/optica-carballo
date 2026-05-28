import { Package, Sparkles, ShieldCheck } from 'lucide-react';
import { resolveProductIncludes } from '@/lib/business/product-includes';

type AttributesJson = Record<string, unknown>;

const ICONS: Record<string, typeof Package> = {
  case: Package,
  cloth: Sparkles,
  warranty: ShieldCheck,
};

export function ProductIncludes({
  attributes,
}: {
  attributes: AttributesJson;
}) {
  const items = resolveProductIncludes(attributes);
  if (items.length === 0) return null;

  return (
    <div className="border-border/60 bg-muted/30 mt-6 rounded-xl border p-5">
      <h2 className="text-foreground text-sm font-semibold uppercase tracking-wider">
        Lo que incluye tu compra
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = ICONS[item.key] ?? Package;
          return (
            <li
              key={item.key}
              className="flex items-start gap-3 transition-all duration-300"
            >
              <span
                aria-hidden="true"
                className="bg-foreground text-background flex size-9 shrink-0 items-center justify-center rounded-full"
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-semibold">
                  {item.label}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
