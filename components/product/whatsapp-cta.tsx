import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsappLinkWithContext } from '@/lib/site/business';

export function WhatsappCta({
  productName,
  inStock,
}: {
  productName: string;
  inStock: boolean;
}) {
  const message = inStock
    ? `Hola, me interesa el ${productName}. ¿Está disponible?`
    : `Hola, te consulto por la disponibilidad del ${productName}.`;
  const href = getWhatsappLinkWithContext(message);

  if (!href) return null;

  return (
    <Button asChild size="lg" className="w-full sm:w-auto">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-5" />
        {inStock ? 'Consultar por WhatsApp' : 'Consultar disponibilidad'}
      </a>
    </Button>
  );
}
