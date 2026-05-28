import { VariantWhatsappCta } from '@/components/product/variant-whatsapp-cta';
import { formatPriceCents } from '@/lib/format/currency';

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

function lookup(map: Record<string, string>, key: unknown): string | null {
  if (typeof key !== 'string') return null;
  return map[key] ?? key;
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
}: {
  variants: VariantListItem[];
  productName: string;
  brandName: string;
  /**
   * Si es `false` (producto `[PH]` placeholder), no muestra CTA por variante.
   * Hoy el CTA por variante es WhatsApp contextual; cuando se reactive el
   * checkout online, este flag controla "Agregar al carrito" en su lugar.
   */
  showVariantCta: boolean;
}) {
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
          return (
            <li
              key={v.sku}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <div>
                <p className="text-foreground font-medium">{label}</p>
                <p className="text-muted-foreground text-xs">SKU: {v.sku}</p>
              </div>
              <div className="flex items-center gap-4">
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
                {showVariantCta && (
                  <VariantWhatsappCta
                    productName={productName}
                    brandName={brandName}
                    sku={v.sku}
                    variantLabel={label}
                    priceCents={v.priceCents}
                    inStock={inStock}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
