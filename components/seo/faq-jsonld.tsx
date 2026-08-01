import type { FaqEntry } from '@/lib/content/faqs';
import { safeJsonLd } from '@/lib/seo/json-ld';

type Props = {
  items: FaqEntry[];
};

/**
 * Schema.org `FAQPage` JSON-LD. Google usa esto para mostrar rich snippets
 * (preguntas+respuestas expandibles directamente en la SERP, debajo del
 * resultado normal). Aumenta CTR significativamente para queries informacionales.
 *
 * Restricciones del schema (Google guidelines):
 * - Cada FAQ debe ser pregunta + respuesta auto-contenida (no requiere contexto extra).
 * - El contenido visible en la página DEBE matchear el del schema.
 * - No incluir CTAs ni texto promocional en las respuestas.
 * - Mínimo 1 FAQ, recomendado 3+. Sin máximo.
 *
 * Respuestas con `[A CONFIRMAR` (dato pendiente del founder, ver
 * `lib/content/faqs.ts`) se excluyen del schema — siguen visibles en el
 * accordion de la página, pero no se publican a Google como dato definitivo
 * (hallazgo #5, audit 2026-08-01).
 */
export function FaqJsonLd({ items }: Props) {
  const confirmedItems = items.filter(
    (item) => !item.answer.includes('[A CONFIRMAR'),
  );
  if (confirmedItems.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: confirmedItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
