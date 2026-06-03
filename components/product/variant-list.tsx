'use client';

import Image from 'next/image';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { VariantWhatsappCta } from '@/components/product/variant-whatsapp-cta';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { isPolarizedVariant as isPolarized } from '@/lib/catalog/polarized';
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
  'negro-brillo-carey': 'Frente negro brillo / patillas carey',
  'steelblue-negro-mate': 'Frente azul acero / patillas negro mate',
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

/** Extrae el código de modelo del fabricante (`model_code`) para mostrarlo
 * junto al label de la variante. Founder 2026-05-31: "agregar la variante
 * al lado C..." — quiere ver C1/C2/C3 del Vrast, GB10/SG91 del Dearly, etc.
 * Devuelve string para renderizar o null si no hay code. */
function extractDisplayCode(attrs: AttributesJson): string | null {
  const code = attrs.model_code;
  if (typeof code !== 'string' || code.trim().length === 0) return null;
  return code.trim();
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

  // Variante activa para el CTA primario: la seleccionada, fallback a la 1ª.
  const selected =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0]!;
  const selectedLabel = describeVariant(selected.attributes);
  const selectedInStock = selected.stockQty > 0;

  return (
    <div>
      {/* CTA primario: refleja la variante elegida y es la acción dominante de
          la página (audit CRO — antes el CTA grande estaba al fondo y los de
          variante competían). Listo para swap WhatsApp↔carrito según el flag. */}
      {showVariantCta && (
        <div className="mb-5">
          <p className="text-muted-foreground mb-2 text-xs">
            Elegiste:{' '}
            <span className="text-foreground font-medium">{selectedLabel}</span>
            {isPolarized(selected.attributes) && (
              <span className="text-blue-700"> · Polarizado</span>
            )}
            {/* Precio solo si la variante elegida tiene stock. */}
            {selectedInStock && <> · {formatPriceCents(selected.priceCents)}</>}
          </p>
          {checkoutEnabled ? (
            <AddToCartButton
              variantId={selected.id}
              variantLabel={selectedLabel}
              disabled={!selectedInStock}
              size="lg"
              fullWidth
            />
          ) : (
            <VariantWhatsappCta
              productName={productName}
              brandName={brandName}
              sku={selected.sku}
              variantLabel={selectedLabel}
              priceCents={selected.priceCents}
              inStock={selectedInStock}
              size="lg"
              fullWidth
              label="Consultar por WhatsApp"
            />
          )}
          {!selectedInStock && (
            <p className="text-muted-foreground mt-1.5 text-xs">
              Esta variante está sin stock. Mirá las demás abajo.
            </p>
          )}
        </div>
      )}

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
                  {/* Línea 1: nombre legible + badge polarizado (si aplica).
                      Founder 2026-05-31: badge debe quedar pegado al nombre,
                      no saltar a línea separada. */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-foreground truncate font-medium">
                      {label}
                    </p>
                    {isPolarized(v.attributes) && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-700">
                        Polarizado
                      </span>
                    )}
                  </div>
                  {/* Línea 2: metadata secundaria gris (model_code + SKU).
                      Code primero (más identificable para founder/clientes
                      familiarizados con la marca), SKU al final. */}
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {(() => {
                      const code = extractDisplayCode(v.attributes);
                      return code ? (
                        <>
                          <span>{code}</span>
                          <span aria-hidden="true"> · </span>
                        </>
                      ) : null;
                    })()}
                    <span>SKU: {v.sku}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                {/* Precio SOLO si hay stock (founder 2026-06-02): una variante
                    agotada no muestra precio, solo "Sin stock". */}
                {inStock && (
                  <p className="text-foreground font-semibold">
                    {formatPriceCents(v.priceCents)}
                  </p>
                )}
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
