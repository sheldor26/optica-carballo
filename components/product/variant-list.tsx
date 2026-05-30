'use client';

import Image from 'next/image';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { VariantWhatsappCta } from '@/components/product/variant-whatsapp-cta';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { formatPriceCents } from '@/lib/format/currency';
import { getProductImageUrl } from '@/lib/storage/product-image-url';
import { cn } from '@/lib/utils';

type AttributesJson = Record<string, unknown>;

export type VariantListItem = {
  id: string;
  sku: string;
  priceCents: number;
  stockQty: number;
  attributes: AttributesJson;
  primaryImagePath: string | null;
};

const FRAME_COLOR_LABELS: Record<string, string> = {
  negro: 'Negro',
  'negro-mate': 'Negro mate',
  'negro-brillo': 'Negro brillo',
  'negro-satinado': 'Negro satinado',
  carey: 'Carey',
  'carey-mate-y-negro-mate': 'Frente carey mate / patillas negro mate',
  transparente: 'Transparente',
  'azul-mate': 'Azul mate',
  'gris-oscuro-transparente': 'Gris oscuro transparente',
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

/** Detecta si una variante tiene lentes polarizadas. Chequea (a) flag
 * explícito `is_polarized=true` y (b) `lens_treatment` que incluya 'polarized'.
 * Útil para casos donde algunas variantes del mismo producto son polarizadas
 * y otras no (ej. Vulk Yamain SBLK POL). */
function isPolarized(attrs: AttributesJson): boolean {
  if (attrs.is_polarized === true) return true;
  if (Array.isArray(attrs.lens_treatment)) {
    return attrs.lens_treatment.some(
      (t) => typeof t === 'string' && t === 'polarized',
    );
  }
  return false;
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
                {v.primaryImagePath && (
                  <div
                    aria-hidden="true"
                    className="bg-background border-border/40 relative size-11 shrink-0 overflow-hidden rounded-md border"
                  >
                    <Image
                      src={getProductImageUrl(v.primaryImagePath)}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground truncate font-medium">{label}</p>
                    {isPolarized(v.attributes) && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-700">
                        Polarizado
                      </span>
                    )}
                  </div>
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
                    className={cn(
                      'text-xs',
                      !inStock
                        ? 'text-destructive'
                        : v.stockQty <= 3
                          ? 'font-medium text-amber-600 dark:text-amber-500'
                          : 'text-muted-foreground',
                    )}
                  >
                    {!inStock
                      ? 'Sin stock'
                      : v.stockQty === 1
                        ? '¡Última unidad!'
                        : v.stockQty <= 3
                          ? `Solo quedan ${v.stockQty}`
                          : `${v.stockQty} en stock`}
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
