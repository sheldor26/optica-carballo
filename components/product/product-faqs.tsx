import { ChevronDown } from 'lucide-react';

type Faq = {
  q: string;
  a: string;
};

const SOL_FAQS: Faq[] = [
  {
    q: '¿Tienen protección contra rayos UV?',
    a: 'Sí. Todos nuestros anteojos de sol cumplen filtro UV400 (bloquean rayos UVA y UVB). El nivel exacto figura en la ficha técnica del modelo o lo podés consultar por WhatsApp.',
  },
  {
    q: '¿Cómo los limpio sin rayar el lente?',
    a: 'Con la franela de microfibra incluida + agua tibia y jabón neutro si es necesario. Nunca usar la remera, papel, alcohol ni productos abrasivos. La garantía no cubre rayaduras de uso.',
  },
  {
    q: '¿Se les puede poner graduación?',
    a: 'Sí. Si necesitás graduación, escribinos por WhatsApp con tu receta para coordinarlo. El armado de lentes graduados se hace presencial en nuestro local.',
  },
  {
    q: '¿Y si no me gustan cuando los pruebo?',
    a: 'Tenés 30 días para cambiarlos por otro modelo, siempre sin uso y conservando estuche y etiquetas. Si te arrepentís de la compra, podés ejercer el botón de arrepentimiento dentro de los 10 días (ley 24.240).',
  },
];

const RECETA_FAQS: Faq[] = [
  {
    q: '¿Necesito receta médica para comprar?',
    a: 'Sí, sin excepción. Es legal, ético y para tu salud visual. Podés subirla al checkout o enviárnosla por WhatsApp. La verificamos antes de armar el anteojo.',
  },
  {
    q: '¿Hacen multifocales o bifocales?',
    a: 'Sí, pero el armado de multifocales, bifocales y graduaciones elevadas se realiza únicamente de manera presencial en nuestro local. Necesitamos tomar medidas precisas para que el lente quede correcto. Coordinamos por WhatsApp.',
  },
  {
    q: '¿Cuánto tarda el armado?',
    a: 'Depende del tipo de cristal y de stock del laboratorio. Una vez recibida tu receta confirmamos plazos estimados por WhatsApp antes de empezar el armado.',
  },
  {
    q: '¿Puedo cambiar el armazón después?',
    a: 'Los armazones sin cristal graduado se pueden cambiar hasta 30 días sin uso. Una vez que el armazón tiene los cristales graduados, el cambio ya no es posible por la naturaleza del producto.',
  },
];

/**
 * Mini-FAQs contextuales según categoría. Acordeón nativo con `<details>` —
 * accesible, sin JS, sin hydration mismatch. Cada categoría tiene 4 FAQs
 * curadas que responden las dudas más frecuentes en venta online de óptica.
 *
 * Las FAQs cumplen las reglas de BUSINESS_POLICIES.md:
 * - Cero claims de "garantía total" / "garantía de por vida".
 * - Honestidad sobre limitaciones (multifocales solo presencial, rayaduras NO cubiertas).
 * - Plazos legales correctos (10 días arrepentimiento, 30 días cambio sin uso).
 *
 * NOTA: si en el futuro este componente crece a 8+ FAQs por categoría
 * o necesitamos personalización por producto, considerar mover el contenido
 * a `lib/business/product-faqs.ts` o cargarlo desde DB.
 */
export function ProductFaqs({ categorySlug }: { categorySlug: string }) {
  const faqs = categorySlug === 'anteojos-de-receta' ? RECETA_FAQS : SOL_FAQS;

  return (
    <section className="mt-16 max-w-3xl" aria-label="Preguntas frecuentes del producto">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em]">
        Dudas frecuentes
      </p>
      <h2 className="text-foreground mt-2 text-balance font-serif text-3xl font-medium tracking-[-0.015em] md:text-4xl">
        Antes de <span className="italic font-normal">comprar</span>
      </h2>

      <ul className="mt-8 space-y-2">
        {faqs.map((faq) => (
          <li key={faq.q}>
            <details className="border-border/60 group bg-muted/20 rounded-xl border transition-colors duration-200 open:bg-muted/40">
              <summary className="hover:text-foreground flex cursor-pointer items-center justify-between gap-4 p-4 text-sm font-medium leading-snug text-foreground/90 transition-colors sm:p-5 sm:text-base">
                <span className="flex-1">{faq.q}</span>
                <ChevronDown
                  className="text-muted-foreground size-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden
                />
              </summary>
              <div className="text-muted-foreground border-border/40 border-t px-4 pb-4 pt-3 text-sm leading-relaxed sm:px-5 sm:pb-5 sm:text-[15px]">
                {faq.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
