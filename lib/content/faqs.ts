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

/** Shape mínimo de una FAQ — lo que necesitan `FaqAccordion` y `FaqJsonLd`.
 * Las FAQs de artículos usan este shape (sin `category`, que es del FAQ global). */
export type FaqEntry = {
  id: string;
  question: string;
  /** Respuesta puede contener bullets simples con `\n- item`. El renderer maneja la conversión. */
  answer: string;
};

export type FaqItem = FaqEntry & {
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
      'Sí, enviamos a toda Argentina con Correo Argentino, a domicilio o a sucursal. También podés retirar gratis en nuestro local de Virasoro, Corrientes.',
  },
  {
    id: 'cuanto-tarda-envio',
    category: 'envios',
    question: '¿Cuánto tarda en llegar mi pedido?',
    answer:
      'El tiempo de entrega depende de la zona y de Correo Argentino. Te enviamos el código de seguimiento por email apenas despachamos el paquete para que puedas seguir el envío en tiempo real. [A CONFIRMAR: plazos estimados una vez que tengamos historial real de entregas con Correo Argentino].',
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
      'Sí, el retiro en local es gratis. Nuestro local está en Av. Lavalle 2686, Gob. Virasoro, Corrientes (CP 3342). Te avisamos por WhatsApp cuando tu pedido esté listo para retirar. [A CONFIRMAR: horario de atención].',
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
      'Por ahora coordinamos cada compra por WhatsApp. Podés pagar con Mercado Pago (tarjeta de crédito, débito, transferencia, dinero en cuenta), MODO o transferencia bancaria directa. [A CONFIRMAR: si aceptan efectivo en el local para retiro en persona]. Apenas esté activo el pago online en el sitio, vas a poder pagar directo ahí.',
  },
  {
    id: 'cuotas-sin-interes',
    category: 'pagos',
    question: '¿Hay cuotas sin interés?',
    answer:
      'Por ahora las compras se coordinan por WhatsApp, donde te confirmamos el medio de pago y si hay cuotas sin interés disponibles según la promoción vigente en ese momento. Apenas esté activo el pago online en el sitio, vas a ver las cuotas disponibles directamente en cada producto.',
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
      'Sí, tenés 10 días corridos desde la recepción para arrepentirte y devolver el producto sin uso, conservando estuche, franela y etiquetas. Es tu derecho de arrepentimiento según Defensa del Consumidor (ley 24.240 y Código Civil y Comercial). El envío de devolución lo paga la óptica.',
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
      'Necesitamos una receta de oftalmólogo con OD (ojo derecho) y OI (ojo izquierdo), valores de esférico, cilindro, eje, distancia naso-pupilar (DNP), y adición si corresponde. La foto o scan tiene que estar clara y completa, idealmente con fecha menor a 1 año.',
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
      'Depende de tu receta puntual: cuanto más alta es la dioptría (esférico y/o cilindro), más grueso se vuelve el cristal y más influye un ajuste preciso del armazón sobre tu cara en el resultado óptico final. Por eso, para graduaciones elevadas armamos siempre en persona, en nuestro local de Virasoro. Si no estás seguro/a si tu receta entra en este caso, escribinos por WhatsApp con tus valores y te confirmamos antes de que compres.',
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
      'Sí, estamos en Av. Lavalle 2686, Gob. Virasoro, Corrientes. Somos una óptica familiar con más de 30 años de experiencia. [A CONFIRMAR: horario de atención].',
  },

  // ===========================================================================
  // Detalles técnicos (10 SEO-friendly)
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
  {
    id: 'fotocromaticos',
    category: 'tecnicas',
    question: '¿Qué son los lentes fotocromáticos?',
    answer:
      'Los lentes fotocromáticos se oscurecen automáticamente con la luz solar y se aclaran en interiores. Son útiles si no querés cambiar entre dos anteojos. La velocidad de transición y el oscurecimiento dependen de la temperatura — funcionan mejor en clima fresco que en pleno verano caluroso.',
  },
  {
    id: 'blue-light',
    category: 'tecnicas',
    question: '¿Sirven las lentes blue light contra pantallas?',
    answer:
      'Las lentes con filtro blue light bloquean parcialmente la luz azul de pantallas. La evidencia científica robusta sobre que reduzcan fatiga visual digital es limitada — lo que sí ayuda al ojo es alternar foco cada 20 minutos, mantener distancia adecuada y descansar. Si te interesan, las tenemos, pero no las prometemos como "solución milagro".',
  },
  {
    id: 'limpieza-lentes',
    category: 'tecnicas',
    question: '¿Cómo limpio mis anteojos sin rayarlos?',
    answer:
      'Con la franela de microfibra incluida y agua tibia con una gota de jabón neutro si es necesario. Nunca usar la remera, papel, alcohol, ni productos abrasivos. Si tienen polvo, enjuagar con agua antes de pasar la franela. La garantía no cubre rayaduras de uso por limpieza incorrecta.',
  },
  {
    id: 'material-armazon',
    category: 'tecnicas',
    question: '¿Qué material de armazón es mejor: acetato o metal?',
    answer:
      'Depende del uso. El acetato es liviano, hipoalergénico, viene en muchos colores y patrones y se puede ajustar al calor. El metal (acero inoxidable, titanio) es más resistente y delgado, pero menos cómodo en climas muy fríos. No hay "mejor" universal — elegí el que te guste estéticamente y se adapte a tu cabeza.',
  },
  {
    id: 'alto-indice',
    category: 'tecnicas',
    question: '¿Qué son las lentes de alto índice?',
    answer:
      'Las lentes de alto índice son más finas y livianas que las estándar para una misma graduación. Se recomiendan cuando tu graduación es elevada (a partir de +/-3 dioptrías aprox) para evitar lentes muy gruesos. Hay índices 1.60, 1.67 y 1.74 — cuanto mayor el índice, más fina la lente.',
  },

  // ===========================================================================
  // Receta — adicionales
  // ===========================================================================
  {
    id: 'demora-armado-lentes',
    category: 'receta',
    question: '¿Cuánto tarda el armado de lentes graduadas?',
    answer:
      'Una vez confirmado el pedido y recibida la receta, el armado tarda entre 5 y 15 días hábiles según el tipo de cristal y disponibilidad del laboratorio. Lentes monofocales estándar son más rápidas, multifocales personalizados pueden tardar más. Antes de empezar te confirmamos plazos por WhatsApp.',
  },
  {
    id: 'sin-receta',
    category: 'receta',
    question: '¿Puedo comprar el armazón sin tener receta?',
    answer:
      'Sí. El armazón lo comprás sin receta: viene con lentes demo, no estás comprando cristales graduados. La receta solo hace falta cuando le armás tus cristales con tu graduación — por ley y por tu salud visual, ningún anteojo recetado (armado con tu graduación) se vende sin receta válida de oftalmólogo. Si querés ponerle tus cristales y no tenés receta vigente, hacete un control antes.',
  },

  // ===========================================================================
  // Garantía — adicionales
  // ===========================================================================
  {
    id: 'rotura-accidental',
    category: 'garantia',
    question: '¿La garantía cubre rotura accidental?',
    answer:
      'No, la garantía solo cubre defectos de fabricación. Las rupturas por caída, golpe o uso indebido no están cubiertas. Si rompiste un armazón nuestro, escribinos por WhatsApp — muchas veces conseguimos repuestos directo del fabricante (varillas, tornillos, etc) y podemos hacer la reparación a costo de servicio.',
  },

  // ===========================================================================
  // Nosotros — adicionales
  // ===========================================================================
  {
    id: 'control-de-calidad',
    category: 'nosotros',
    question: '¿Cómo controlan la calidad de los pedidos?',
    answer:
      'Revisamos cada receta y controlamos el armado de cada pedido antes de despacharlo: los cristales se gradúan según tu prescripción y verificamos el armado final. Somos una óptica familiar con más de 30 años de experiencia.',
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
