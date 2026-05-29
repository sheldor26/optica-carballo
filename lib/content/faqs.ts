/**
 * Fuente de verdad de FAQs del sitio.
 *
 * Editar este archivo + redeploy = nuevo contenido aparece en:
 * - Página `/preguntas-frecuentes` (vista completa)
 * - Home (subset destacado al final)
 * - Sobre nosotros (subset relevante)
 * - `FAQPage` JSON-LD schema en cada página (SEO)
 *
 * Cada FAQ tiene un `id` slug-style usado como anchor (`#envios-todo-el-pais`)
 * y como key del JSON-LD.
 *
 * Para datos que requieren confirmación del founder (precios, plazos,
 * dirección exacta, política puntual), usar marca explícita `[A CONFIRMAR: ...]`
 * en el texto para que sea visible en producción y el founder pueda
 * editarlo después.
 */

export type FaqCategory =
  | 'envios'
  | 'pagos'
  | 'garantia'
  | 'receta'
  | 'nosotros'
  | 'tecnicas';

export type FaqItem = {
  id: string;
  question: string;
  /** Respuesta puede contener bullets simples con `\n- item`. El renderer maneja la conversión. */
  answer: string;
  category: FaqCategory;
  /** Si true, se incluye en el subset destacado del home (máx 6 con featured). */
  featured?: boolean;
};

export const FAQ_CATEGORY_META: Record<
  FaqCategory,
  { label: string; description: string }
> = {
  envios: {
    label: 'Envíos y entregas',
    description: 'Cobertura, plazos, costos y retiro en local.',
  },
  pagos: {
    label: 'Pagos y facturación',
    description: 'Medios de pago, cuotas y facturas electrónicas.',
  },
  garantia: {
    label: 'Garantía y devoluciones',
    description: 'Qué cubre la garantía, plazos para arrepentirse y cambios.',
  },
  receta: {
    label: 'Anteojos con receta',
    description: 'Recetas oftalmológicas, lentes graduadas y casos presenciales.',
  },
  nosotros: {
    label: 'Sobre Óptica Carballo',
    description: 'Quiénes somos, dónde estamos y autenticidad de los productos.',
  },
  tecnicas: {
    label: 'Detalles técnicos',
    description: 'Características de los productos: polarizado, UV, materiales.',
  },
};

export const FAQS: FaqItem[] = [
  // ===========================================================================
  // Envíos (5)
  // ===========================================================================
  {
    id: 'envios-todo-el-pais',
    category: 'envios',
    featured: true,
    question: '¿Hacen envíos a todo el país?',
    answer:
      'Sí, enviamos a toda Argentina con Andreani como operador principal y Correo Argentino donde Andreani no llega. También podés retirar gratis en nuestro local de Virasoro, Corrientes.',
  },
  {
    id: 'cuanto-tarda-envio',
    category: 'envios',
    question: '¿Cuánto tarda en llegar mi pedido?',
    answer:
      'En CABA y GBA suele llegar en 2-4 días hábiles. Al interior, entre 3 y 7 días hábiles según la zona. Te enviamos el código de seguimiento por email apenas despachamos el paquete. [A CONFIRMAR: plazos reales según operador].',
  },
  {
    id: 'costo-envio',
    category: 'envios',
    featured: true,
    question: '¿Cuánto cuesta el envío?',
    answer:
      'El costo depende de la zona. En CABA y GBA arranca en $2.500. En el interior cercano (Litoral, Córdoba, Mendoza) cuesta $4.500. En zonas más alejadas (NEA, NOA, Cuyo) $6.500, y en Patagonia $9.500. Compras superiores a $80.000 tienen envío gratis a todo el país.',
  },
  {
    id: 'retiro-en-local',
    category: 'envios',
    question: '¿Puedo retirar el producto en el local?',
    answer:
      'Sí, el retiro en local es gratis. Te avisamos por WhatsApp cuando tu pedido esté listo. [A CONFIRMAR: dirección exacta del local + horario de atención].',
  },
  {
    id: 'paquete-no-llego',
    category: 'envios',
    question: '¿Qué hago si mi paquete no llegó?',
    answer:
      'Escribinos por WhatsApp con el número de pedido y lo rastreamos con el operador. Si el paquete se pierde o no llega en el plazo estimado, te enviamos uno nuevo sin costo o te devolvemos el dinero.',
  },

  // ===========================================================================
  // Pagos (3)
  // ===========================================================================
  {
    id: 'medios-de-pago',
    category: 'pagos',
    featured: true,
    question: '¿Qué medios de pago aceptan?',
    answer:
      'Aceptamos Mercado Pago (tarjetas de crédito en cuotas, débito, transferencia, dinero en cuenta), MODO y transferencia bancaria directa. [A CONFIRMAR: si aceptan efectivo en local físico].',
  },
  {
    id: 'cuotas-sin-interes',
    category: 'pagos',
    question: '¿Hay cuotas sin interés?',
    answer:
      'Sí, ofrecemos cuotas sin interés según el banco y promoción vigente. [A CONFIRMAR: cantidad de cuotas habituales + bancos / promo del mes].',
  },
  {
    id: 'factura',
    category: 'pagos',
    question: '¿Emiten factura?',
    answer:
      'Sí, todas las compras incluyen factura electrónica AFIP. Si necesitás factura A con CUIT, completá los datos al hacer la compra.',
  },

  // ===========================================================================
  // Garantía y devoluciones (3)
  // ===========================================================================
  {
    id: 'garantia-productos',
    category: 'garantia',
    featured: true,
    question: '¿Qué garantía tienen los productos?',
    answer:
      'Todos nuestros anteojos incluyen 1 año de garantía del fabricante contra defectos de fabricación. La garantía NO cubre uso indebido, golpes, ralladuras de uso ni rotura accidental. Si detectás un defecto, escribinos por WhatsApp y te indicamos cómo proceder.',
  },
  {
    id: 'devolucion-arrepentimiento',
    category: 'garantia',
    question: '¿Puedo devolver el producto si no me gusta?',
    answer:
      'Sí, tenés 10 días corridos desde la recepción para arrepentirte y devolver el producto sin uso, conservando estuche, franela y etiquetas. Es el botón de arrepentimiento que exige Defensa del Consumidor (ley 24.240). [A CONFIRMAR: si el envío de devolución lo paga el cliente o la óptica].',
  },
  {
    id: 'cambio-de-producto',
    category: 'garantia',
    question: '¿Puedo cambiar el producto por otro modelo?',
    answer:
      'Sí, tenés 30 días corridos para cambiar el producto sin uso por otro modelo de igual o mayor valor. Si hay diferencia de precio, la ajustamos. Debe estar en condiciones originales con estuche y etiquetas.',
  },

  // ===========================================================================
  // Receta (5) — incluye limitaciones de venta online vs presencial
  // ===========================================================================
  {
    id: 'venden-con-receta',
    category: 'receta',
    featured: true,
    question: '¿Venden anteojos con receta médica?',
    answer:
      'Sí, vendemos armazones para anteojos de receta. Si tu receta es de visión simple (monofocal) y dentro de graduaciones estándar, te armamos las lentes y te enviamos los anteojos completos. Si necesitás multifocales, bifocales o tenés una graduación elevada, el armado se hace de forma presencial en nuestra óptica de Virasoro — son casos que requieren mediciones que no se pueden tomar a distancia. En esos casos, escribinos por WhatsApp y coordinamos.',
  },
  {
    id: 'que-receta-acepto',
    category: 'receta',
    question: '¿Qué receta necesito enviar?',
    answer:
      'Necesitamos una receta de oftalmólogo o técnico óptico matriculado con OD (ojo derecho) y OI (ojo izquierdo), valores de esférico, cilindro, eje, distancia naso-pupilar (DNP), y adición si corresponde. La foto o scan tiene que estar clara y completa, idealmente con fecha menor a 1 año.',
  },
  {
    id: 'traspaso-de-lentes',
    category: 'receta',
    question: '¿Puedo cambiar las lentes graduadas de mis anteojos viejos a un armazón nuevo?',
    answer:
      'Los traspasos de lentes se hacen solo de forma presencial en el local. Requieren verificar la compatibilidad física del armazón nuevo con las lentes existentes y, en algunos casos, re-bordear las lentes para que calcen bien. Escribinos por WhatsApp y coordinamos tu visita.',
  },
  {
    id: 'multifocales-bifocales',
    category: 'receta',
    question: '¿Hacen lentes multifocales y bifocales online?',
    answer:
      'No, los lentes multifocales y bifocales se hacen solo de forma presencial. Necesitamos medir tu altura pupilar, verificar la postura natural de cabeza y asesorarte sobre la adaptación — mediciones que no se pueden tomar a distancia. Escribinos por WhatsApp y coordinamos tu visita a la óptica.',
  },
  {
    id: 'graduaciones-elevadas',
    category: 'receta',
    question: '¿Y si tengo una graduación elevada?',
    answer:
      'Las graduaciones elevadas se atienden de forma presencial para asegurar mediciones precisas, materiales correctos (alto índice cuando corresponde) y un calce adaptado. [A CONFIRMAR: umbral técnico exacto — ej esférico > 5D, cilindro > 2D]. Si no estás seguro/a si tu caso entra acá, escribinos la receta por WhatsApp y te orientamos.',
  },

  // ===========================================================================
  // Sobre Óptica Carballo (2)
  // ===========================================================================
  {
    id: 'productos-originales',
    category: 'nosotros',
    featured: true,
    question: '¿Son productos originales?',
    answer:
      'Sí, 100% originales con respaldo oficial del fabricante. Trabajamos directo con las distribuidoras oficiales de cada marca (Vulk, Rusty, Reef, Mormaii, Paula Cahen D\'Anvers). Cada producto incluye su estuche original, franela de limpieza y la factura electrónica AFIP.',
  },
  {
    id: 'local-fisico',
    category: 'nosotros',
    question: '¿Tienen local físico?',
    answer:
      'Sí, estamos en Virasoro, Corrientes. María Carlota Carballo, técnica óptica matriculada, es la regente de la óptica desde hace más de 30 años. [A CONFIRMAR: dirección exacta + horarios de atención].',
  },

  // ===========================================================================
  // Detalles técnicos (2 SEO-friendly)
  // ===========================================================================
  {
    id: 'que-son-polarizados',
    category: 'tecnicas',
    question: '¿Qué son los anteojos polarizados?',
    answer:
      'Las lentes polarizadas tienen un filtro que elimina los reflejos del agua, asfalto, vidrio y otras superficies brillantes. Son ideales para conducir, pescar, deportes náuticos o estar al aire libre. Mejoran el contraste, reducen la fatiga visual y aumentan la nitidez en condiciones de mucha luz.',
  },
  {
    id: 'filtro-uv',
    category: 'tecnicas',
    question: '¿Las lentes filtran rayos UV?',
    answer:
      'Todas las lentes que vendemos tienen filtro UV400, que bloquea el 100% de los rayos UVA y UVB. Es la protección que recomienda la Organización Mundial de la Salud para evitar daño ocular por exposición al sol.',
  },
];

/**
 * Devuelve solo las FAQs marcadas como `featured: true` (subset para home).
 * Máximo 6 items idealmente.
 */
export function getFeaturedFaqs(): FaqItem[] {
  return FAQS.filter((f) => f.featured);
}

/**
 * Agrupa FAQs por categoría manteniendo el orden de FAQ_CATEGORY_META.
 * Útil para renderizar la página completa con secciones.
 */
export function groupFaqsByCategory(items: FaqItem[] = FAQS): Array<{
  category: FaqCategory;
  meta: { label: string; description: string };
  items: FaqItem[];
}> {
  return (Object.keys(FAQ_CATEGORY_META) as FaqCategory[])
    .map((category) => ({
      category,
      meta: FAQ_CATEGORY_META[category],
      items: items.filter((f) => f.category === category),
    }))
    .filter((group) => group.items.length > 0);
}
