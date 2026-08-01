import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
import { getWhatsappLinkWithContext } from '@/lib/site/business';
import type { CategoryConfig } from '@/lib/catalog/categories';

/**
 * Banner de recomendación humana por WhatsApp+foto, alternativa al quiz
 * automático (mismo lugar, mismo peso visual — conversion-optimizer 2026-08-01:
 * dos caminos válidos, ninguno se posiciona como fallback del otro).
 * `null` si falta `NEXT_PUBLIC_WHATSAPP_NUMBER` — el caller decide el layout.
 */
export function WhatsappPhotoBanner({
  category,
}: {
  category: CategoryConfig;
}) {
  const message = `Hola! Quiero elegir ${category.metaPhrase}. Les mando una foto mía para que me recomienden el modelo que mejor me queda.`;
  const href = getWhatsappLinkWithContext(message);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border/60 bg-muted/40 hover:border-foreground/40 flex items-center gap-4 rounded-xl border p-4 transition-colors md:p-5"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600/10">
        <WhatsappIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-semibold">
          ¿Preferís que te asesoremos nosotros?
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Mandanos una foto por WhatsApp y te ayudamos a elegir el armazón que
          mejor te queda. Sin compromiso.
        </p>
      </div>
      <span className="text-muted-foreground shrink-0 text-xs font-medium">
        Escribinos →
      </span>
    </a>
  );
}
