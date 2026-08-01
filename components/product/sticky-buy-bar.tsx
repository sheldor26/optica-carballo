'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useVariantSelection } from '@/lib/product/variant-selection';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { VariantWhatsappCta } from '@/components/product/variant-whatsapp-cta';
import { formatPriceCents } from '@/lib/format/currency';

type BarVariant = {
  id: string;
  sku: string;
  priceCents: number;
  stockQty: number;
};

/**
 * Barra de compra fija al fondo en MOBILE. Aparece cuando el CTA principal de
 * la PDP se scrollea fuera de vista (la PDP es larga: descripción + FAQ +
 * specs + relacionados), así el comprador siempre tiene el precio + "Agregar"
 * a mano sin volver arriba. Refleja la variante elegida vía el provider.
 *
 * Solo mobile (`md:hidden`). Avisa con el evento `oc:buybar` para que los
 * botones flotantes (WhatsApp/chat) no se solapen en la esquina.
 */
export function StickyBuyBar({
  variants,
  productName,
  brandName,
  checkoutEnabled,
  sentinelId,
}: {
  variants: BarVariant[];
  productName: string;
  brandName: string;
  checkoutEnabled: boolean;
  /** Id del elemento centinela: la barra aparece cuando queda arriba del viewport. */
  sentinelId: string;
}) {
  const { selectedVariantId } = useVariantSelection();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(sentinelId);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Visible cuando el centinela ya pasó por arriba del viewport (scrolleó).
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelId]);

  // Avisar a los flotantes para que no se solapen con la barra.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('oc:buybar', { detail: { visible } }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent('oc:buybar', { detail: { visible: false } }),
      );
    };
  }, [visible]);

  const selected =
    variants.find((v) => v.id === selectedVariantId) ??
    variants.find((v) => v.stockQty > 0) ??
    variants[0];
  if (!selected) return null;

  const inStock = selected.stockQty > 0;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'border-border/60 bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden',
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground truncate text-[11px] uppercase tracking-wide">
            {brandName}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-foreground truncate text-sm font-medium">
              {productName}
            </p>
            {inStock && (
              <span className="text-foreground shrink-0 text-sm font-semibold tabular-nums">
                {formatPriceCents(selected.priceCents)}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0">
          {checkoutEnabled ? (
            <AddToCartButton
              variantId={selected.id}
              variantLabel={productName}
              disabled={!inStock}
              size="sm"
              className="h-11"
            />
          ) : (
            <VariantWhatsappCta
              productName={productName}
              brandName={brandName}
              sku={selected.sku}
              variantLabel={productName}
              priceCents={selected.priceCents}
              inStock={inStock}
              size="sm"
              label="WhatsApp"
              className="h-11"
            />
          )}
        </div>
      </div>
    </div>
  );
}
