import type { FaqItem } from '@/lib/content/faqs';

type Props = {
  items: FaqItem[];
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
 */
export function FaqJsonLd({ items }: Props) {
  if (items.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
