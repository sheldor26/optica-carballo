import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPriceCents } from '@/lib/format/currency';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

/**
 * Botón "Consultar por WhatsApp" inline en cada variante, con mensaje
 * pre-llenado contextual (marca + modelo + variante + SKU + precio).
 *
 * Reemplazó al AddToCartButton mientras el checkout online no está
 * activo. Cuando se reactive el cart, se vuelve a swap en VariantList.
 */
export function VariantWhatsappCta({
  productName,
  brandName,
  sku,
  variantLabel,
  priceCents,
  inStock,
  size = 'sm',
  fullWidth = false,
  label = 'Consultar',
  className,
}: {
  productName: string;
  brandName: string;
  sku: string;
  variantLabel: string;
  priceCents: number;
  inStock: boolean;
  /** `lg` + `fullWidth` para el CTA primario de la PDP. Default `sm` inline. */
  size?: 'sm' | 'lg';
  fullWidth?: boolean;
  label?: string;
  /** Override puntual (ej. subir la altura táctil en la sticky bar mobile
   * sin cambiar `size` — hallazgo #17, audit 2026-08-01). */
  className?: string;
}) {
  const priceText = formatPriceCents(priceCents);
  const message =
    `Hola! Quería consultar por el modelo ${brandName} ${productName} ` +
    `(${variantLabel}, SKU ${sku}, ${priceText}).`;
  const link = getWhatsappLinkWithContext(message);
  if (!link) return null;

  return (
    <Button
      asChild
      size={size}
      variant={inStock ? 'default' : 'outline'}
      disabled={!inStock}
      className={cn(fullWidth && 'w-full', className)}
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Consultar por WhatsApp sobre ${productName} ${variantLabel}`}
      >
        <WhatsappIcon className="size-4" />
        {label}
      </a>
    </Button>
  );
}
