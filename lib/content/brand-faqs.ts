/**
 * FAQs específicas por marca. Renderizadas en `/anteojos-de-sol/[brand]` con:
 * - Sección visible (cumple regla Google: schema debe matchear contenido visible)
 * - `FAQPage` JSON-LD (rich snippet en SERP — preguntas expandibles bajo el resultado)
 *
 * Estrategia: 3-5 preguntas por marca, específicas (NO duplicar genéricas de
 * `lib/content/faqs.ts`). Buscamos:
 * - Preguntas que un usuario hace en Google ANTES de comprar esa marca puntual.
 * - Respuestas honestas, no marketing puro.
 * - Información técnica útil que diferencie a la marca.
 *
 * Si una marca no tiene entrada acá, la página renderiza sin FAQ section
 * (mejor sin contenido que con contenido genérico).
 */

import type { FaqItem } from './faqs';

type BrandFaqMap = Record<string, FaqItem[]>;

export const BRAND_FAQS: BrandFaqMap = {
  rusty: [
    {
      id: 'rusty-origen',
      category: 'nosotros',
      question: '¿Rusty es una marca argentina?',
      answer:
        'Rusty es una marca de origen australiano vinculada al mundo del surf y skate. En Argentina tiene presencia consolidada, con fabricación y distribución local, y un catálogo de anteojos pensado para el público joven.',
    },
    {
      id: 'rusty-publico',
      category: 'nosotros',
      question: '¿A qué público apuntan los anteojos Rusty?',
      answer:
        'Apuntan al público joven (15-35 años) con estética surf, skate y lifestyle relajado. Los modelos son robustos, con diseños actuales y precios medios — buenos para uso diario, actividades al aire libre y deportes.',
    },
    {
      id: 'rusty-polarizados',
      category: 'tecnicas',
      question: '¿Los anteojos Rusty vienen polarizados?',
      answer:
        'Algunos modelos Rusty vienen con lentes polarizadas (eliminan reflejos del agua y asfalto, ideales para conducir o playa) y otros con lentes estándar UV400. En cada ficha de producto indicamos si la variante es polarizada o no.',
    },
    {
      id: 'rusty-garantia',
      category: 'garantia',
      question: '¿Qué garantía tienen los anteojos Rusty?',
      answer:
        '1 año de garantía oficial del fabricante contra defectos. Cubre fallas de fabricación (bisagras, soldaduras, delaminación de cristales). No cubre rotura por golpe, caída o uso indebido.',
    },
    {
      id: 'rusty-receta',
      category: 'receta',
      question: '¿Puedo usar un armazón Rusty con lentes de receta?',
      answer:
        'Sí, varios modelos Rusty admiten armado con lentes recetadas. Si tu receta es de visión simple, lo gestionamos online; si es multifocal o tenés graduación elevada, lo coordinamos de forma presencial en nuestra óptica de Virasoro.',
    },
  ],

  vulk: [
    {
      id: 'vulk-origen',
      category: 'nosotros',
      question: '¿Vulk es una marca argentina?',
      answer:
        'Sí, Vulk es una marca argentina con catálogo amplio de anteojos de sol y armazones para receta. Buena relación precio/calidad y modelos con tendencia actual.',
    },
    {
      id: 'vulk-receta',
      category: 'receta',
      question: '¿Vulk fabrica armazones para anteojos de receta?',
      answer:
        'Sí, Vulk tiene línea específica de armazones recetables además de la línea de anteojos de sol. Trabajamos ambas líneas — para receta, escribinos por WhatsApp con tu prescripción y te asesoramos qué modelo te conviene.',
    },
    {
      id: 'vulk-polarizados',
      category: 'tecnicas',
      question: '¿Los Vulk traen lentes polarizadas?',
      answer:
        'Depende del modelo. Algunos vienen polarizados de fábrica (lo marcamos explícitamente en cada producto) y otros traen lentes estándar con filtro UV400. Si necesitás polarizados, filtramos por esa característica.',
    },
    {
      id: 'vulk-garantia',
      category: 'garantia',
      question: '¿Qué garantía oficial tienen los Vulk?',
      answer:
        '1 año de garantía oficial Vulk Argentina contra defectos de fabricación. Si detectás una falla (bisagra suelta, despegado de cristal, soldadura), escribinos por WhatsApp y gestionamos el cambio o la reparación.',
    },
  ],

  reef: [
    {
      id: 'reef-origen',
      category: 'nosotros',
      question: '¿Reef es una marca argentina?',
      answer:
        'Reef es una marca de origen estadounidense (California) con identidad beach y surf. En Argentina se distribuye oficialmente con stock local y respaldo de garantía.',
    },
    {
      id: 'reef-estilo',
      category: 'nosotros',
      question: '¿Qué estilo tienen los anteojos Reef?',
      answer:
        'Estética relajada de playa y surf — modelos clásicos como wayfarer y aviador, con paletas de color luminosas y materiales resistentes pensados para uso intenso al aire libre.',
    },
    {
      id: 'reef-polarizados',
      category: 'tecnicas',
      question: '¿Los Reef vienen con lentes polarizadas?',
      answer:
        'Varios modelos Reef vienen polarizados — ideales si los vas a usar en playa, pesca o conduciendo. En el listado podés filtrar por polarizados, y en cada ficha lo aclaramos explícitamente.',
    },
    {
      id: 'reef-garantia',
      category: 'garantia',
      question: '¿Qué garantía tienen los Reef?',
      answer:
        '1 año contra defectos de fabricación con respaldo oficial. La garantía cubre fallas internas (bisagras, soldaduras, despegado de cristal); no cubre uso indebido, golpes ni rayaduras.',
    },
  ],

  mormaii: [
    {
      id: 'mormaii-origen',
      category: 'nosotros',
      question: '¿De dónde es la marca Mormaii?',
      answer:
        'Mormaii nació en Brasil ligada al mundo del surf, y hoy tiene presencia consolidada en Argentina con distribución oficial. Es una marca pensada para deporte, outdoor y uso intensivo al sol.',
    },
    {
      id: 'mormaii-deporte',
      category: 'tecnicas',
      question: '¿Los Mormaii sirven para hacer deporte?',
      answer:
        'Sí — varios modelos Mormaii tienen patillas de goma antideslizante, materiales flexibles y diseños que no se mueven con la actividad. Son una de las marcas más elegidas para correr, andar en bici, surf y deportes náuticos.',
    },
    {
      id: 'mormaii-polarizados',
      category: 'tecnicas',
      question: '¿Mormaii tiene modelos polarizados?',
      answer:
        'Sí, Mormaii tiene varios modelos polarizados — recomendados especialmente para actividades cerca del agua (surf, pesca, kayak) donde los reflejos son intensos. Cada variante aclara si es polarizada o estándar.',
    },
    {
      id: 'mormaii-garantia',
      category: 'garantia',
      question: '¿Qué garantía tienen los Mormaii?',
      answer:
        '1 año de garantía oficial contra defectos de fabricación. No cubre rotura accidental ni desgaste por uso intensivo (esperable en una marca pensada para deporte).',
    },
  ],

  'paula-cahen-danvers': [
    {
      id: 'pcd-origen',
      category: 'nosotros',
      question: '¿Quién es Paula Cahen D\'Anvers y por qué tiene anteojos?',
      answer:
        'Paula Cahen D\'Anvers es una marca de moda argentina con décadas de trayectoria. Su línea de anteojos extiende la identidad de la marca: diseño femenino, atemporal y elegante, con foco en armazones que combinan con propuestas de indumentaria.',
    },
    {
      id: 'pcd-publico',
      category: 'nosotros',
      question: '¿Los anteojos Paula Cahen D\'Anvers son solo para mujer?',
      answer:
        'La marca está principalmente dirigida al público femenino — los modelos privilegian formas cat-eye, redondas y aviador con paletas suaves. Dicho esto, varios modelos son neutros y los usan personas de cualquier género.',
    },
    {
      id: 'pcd-receta',
      category: 'receta',
      question: '¿Paula Cahen D\'Anvers tiene armazones de receta?',
      answer:
        'Sí, además de la línea de anteojos de sol, tiene armazones específicos para anteojos de receta. Si querés graduarlos, escribinos por WhatsApp con tu receta y armamos el presupuesto completo.',
    },
    {
      id: 'pcd-garantia',
      category: 'garantia',
      question: '¿Qué garantía tienen los Paula Cahen D\'Anvers?',
      answer:
        '1 año de garantía oficial contra defectos de fabricación. Cubre fallas internas (bisagras, soldaduras); no cubre uso indebido ni rotura accidental.',
    },
  ],
};

/**
 * Devuelve las FAQs para una marca, o array vacío si no hay entrada.
 */
export function getBrandFaqs(brandSlug: string): FaqItem[] {
  return BRAND_FAQS[brandSlug] ?? [];
}
