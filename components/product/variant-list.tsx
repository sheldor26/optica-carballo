'use client';

import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { VariantWhatsappCta } from '@/components/product/variant-whatsapp-cta';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { formatPriceCents } from '@/lib/format/currency';
import { cn } from '@/lib/utils';

type AttributesJson = Record<string, unknown>;

export type VariantListItem = {
  id: string;
  sku: string;
  priceCents: number;
  stockQty: number;
  attributes: AttributesJson;
};

const FRAME_COLOR_LABELS: Record<string, string> = {
  negro: 'Negro',
  carey: 'Carey',
  dorado: 'Dorado',
  plata: 'Plata',
  azul: 'Azul',
  marron: 'Marrón',
  blanco: 'Blanco',
  rojo: 'Rojo',
  verde: 'Verde',
};

const LENS_COLOR_LABELS: Record<string, string> = {
  gris: 'Gris',
  marron: 'Marrón',
  verde: 'Verde',
  azul: 'Azul',
  'marron-degrade': 'Marrón degradé',
  'gris-degrade': 'Gris degradé',
  espejado: 'Espejado',
};

function toTitleCase(s: string): string {
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function lookup(map: Record<string, string>, key: unknown): string | null {
  if (typeof key !== 'string') return null;
  if (map[key]) return map[key];
  return toTitleCase(key);
}

function describeVariant(attrs: AttributesJson): string {
  const frame = lookup(FRAME_COLOR_LABELS, attrs.frame_color);
  const lens = lookup(LENS_COLOR_LABELS, attrs.lens_color);
  const size = typeof attrs.size === 'string' ? attrs.size : null;
  const parts = [frame, lens, size].filter((v): v is string => Boolean(v));
  return parts.length > 0 ? parts.join(' / ') : 'Variante';
}

export function VariantList({
  variants,
  productName,
  brandName,
  showVariantCta,
  checkoutEnabled,
}: {
  variants: VariantListItem[];
  productName: string;
  brandName: string;
  /**
   * `false` para productos `[PH]` placeholder — sin CTA por variante.
   */
  showVariantCta: boolean;
  /**
   * `true` → muestra "Agregar al carrito". `false` → muestra "Consultar
   * por WhatsApp". Controlado por `lib/features.isCheckoutEnabled()`.
   */
  checkoutEnabled: boolean;
}) {
  const { selectedVariantId, selectVariant } = useVariantSelection();

  if (variants.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Sin variantes disponibles en este momento.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-foreground text-sm font-semibold tracking-tight">
        Variantes disponibles
      </h2>
      <ul className="mt-3 divide-y rounded-md border">
        {variants.map((v) => {
          const inStock = v.stockQty > 0;
          const label = describeVariant(v.attributes);
          const isSelected = v.id === selectedVariantId;
          return (
            <li
              key={v.sku}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm transition-colors duration-150',
                isSelected ? 'bg-muted/50' : 'hover:bg-muted/30',
              )}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => selectVariant(v.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectVariant(v.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    isSelected
                      ? 'border-foreground'
                      : 'border-muted-foreground/40',
                  )}
                >
                  {isSelected && (
                    <span className="bg-foreground size-2 rounded-full" />
                  )}
                </span>
                <div>
                  <p className="text-foreground font-medium">{label}</p>
                  <p className="text-muted-foreground text-xs">SKU: {v.sku}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-right">
                  <p className="text-foreground font-semibold">
                    {formatPriceCents(v.priceCents)}
                  </p>
                  <p
                    className={
                      inStock
                        ? 'text-muted-foreground text-xs'
                        : 'text-destructive text-xs'
                    }
                  >
                    {inStock ? `${v.stockQty} en stock` : 'Sin stock'}
                  </p>
                </div>
                {showVariantCta &&
                  (checkoutEnabled ? (
                    <AddToCartButton
                      variantId={v.id}
                      variantLabel={label}
                      disabled={!inStock}
                    />
                  ) : (
                    <VariantWhatsappCta
                      productName={productName}
                      brandName={brandName}
                      sku={v.sku}
                      variantLabel={label}
                      priceCents={v.priceCents}
                      inStock={inStock}
                    />
                  ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
