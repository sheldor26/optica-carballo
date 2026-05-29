/**
 * Configuración del mega-menu desktop (estilo LensCrafters adaptado).
 *
 * Cada item del top nav que tenga mega muestra un panel con N columnas:
 * - `content`: secciones con heading + lista de links (POR MARCA / POR FORMA / etc).
 * - `cta`: panel destacado a la derecha con título, body, CTA primaria + links secundarios.
 *
 * Reglas de UX:
 * - Mobile no usa mega — drawer simple aparte (mobile-nav.tsx).
 * - Todos los links deben apuntar a URLs que existen hoy. No linkear a páginas
 *   futuras o placeholder — frustra al usuario y daña SEO interno.
 * - El panel CTA va siempre como última columna (orden visual occidental: contenido → acción).
 */

export const BRAND_SLUGS = [
  'vulk',
  'rusty',
  'mormaii',
  'reef',
  'paula-cahen-danvers',
] as const;

export const BRAND_LABELS: Record<(typeof BRAND_SLUGS)[number], string> = {
  vulk: 'Vulk',
  rusty: 'Rusty',
  mormaii: 'Mormaii',
  reef: 'Reef',
  'paula-cahen-danvers': "Paula Cahen D'Anvers",
};

export type MegaItem = {
  label: string;
  href: string;
  /** Marca link externo (target=_blank rel=noopener) — usado para WhatsApp. */
  external?: boolean;
};

export type MegaSection = {
  heading: string;
  items: MegaItem[];
};

export type MegaCtaPanel = {
  title: string;
  body: string;
  primaryCta: MegaItem;
  secondaryHeading?: string;
  secondaryLinks?: MegaItem[];
};

export type MegaColumn =
  | { type: 'content'; sections: MegaSection[] }
  | { type: 'cta'; panel: MegaCtaPanel };

export type MegaMenu = {
  columns: MegaColumn[];
};

function getWhatsappCta(message: string): MegaItem | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  return {
    label: 'Escribinos por WhatsApp',
    href: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    external: true,
  };
}

function buildAdvisoryCta(categoryWord: 'anteojos de sol' | 'anteojos de receta' | 'una marca'): MegaCtaPanel {
  const message = `Hola, quiero asesoramiento para elegir ${categoryWord}.`;
  const wa = getWhatsappCta(message);
  return {
    title: 'Te asesoramos sin cargo',
    body: 'Dudas con tu receta, el modelo que te queda mejor o el material — te respondemos en horario comercial.',
    primaryCta: wa ?? { label: 'Ver preguntas frecuentes', href: '/preguntas-frecuentes' },
    secondaryHeading: 'Herramientas con IA',
    secondaryLinks: [
      { label: 'Recomendador de monturas', href: '/recomendador-de-monturas' },
      { label: 'Lector de receta', href: '/lector-de-receta' },
    ],
  };
}

/**
 * Mega panel para `/anteojos-de-sol`. 3 columnas + panel CTA.
 */
export function buildSolMegaMenu(): MegaMenu {
  return {
    columns: [
      {
        type: 'content',
        sections: [
          {
            heading: 'Para vos',
            items: [
              // Linkeamos a hijas de marca con mayor vol SEO (Rusty hombre 3.200/mes, Rusty mujer 2.600/mes).
              { label: 'Para mujer', href: '/anteojos-de-sol/rusty/mujer' },
              { label: 'Para hombre', href: '/anteojos-de-sol/rusty/hombre' },
              { label: 'Ver todos los anteojos de sol', href: '/anteojos-de-sol' },
            ],
          },
          {
            heading: 'Por marca',
            items: BRAND_SLUGS.map((slug) => ({
              label: BRAND_LABELS[slug],
              href: `/anteojos-de-sol/${slug}`,
            })),
          },
        ],
      },
      {
        type: 'content',
        sections: [
          {
            heading: 'Por forma',
            items: [
              { label: 'Wayfarer', href: '/anteojos-de-sol?forma=wayfarer' },
              { label: 'Aviador', href: '/anteojos-de-sol?forma=aviator' },
              { label: 'Cat eye', href: '/anteojos-de-sol?forma=cat_eye' },
              { label: 'Rectangulares', href: '/anteojos-de-sol?forma=rectangular' },
              { label: 'Redondos', href: '/anteojos-de-sol?forma=round' },
            ],
          },
          {
            heading: 'Destacados',
            items: [
              { label: 'Vulk polarizados', href: '/anteojos-de-sol/vulk/polarizados' },
              { label: 'Rusty acetato', href: '/anteojos-de-sol/rusty/acetato' },
              { label: 'Mormaii metal', href: '/anteojos-de-sol/mormaii/metal' },
              { label: 'Paula Cahen mujer', href: '/anteojos-de-sol/paula-cahen-danvers/mujer' },
            ],
          },
        ],
      },
      { type: 'cta', panel: buildAdvisoryCta('anteojos de sol') },
    ],
  };
}

/**
 * Mega panel para `/anteojos-de-receta`. Misma estructura que sol — sin polarizados.
 */
export function buildRecetaMegaMenu(): MegaMenu {
  return {
    columns: [
      {
        type: 'content',
        sections: [
          {
            heading: 'Para vos',
            items: [
              { label: 'Para mujer', href: '/anteojos-de-receta/vulk/mujer' },
              { label: 'Para hombre', href: '/anteojos-de-receta/vulk/hombre' },
              { label: 'Ver todos los anteojos de receta', href: '/anteojos-de-receta' },
            ],
          },
          {
            heading: 'Por marca',
            items: BRAND_SLUGS.map((slug) => ({
              label: BRAND_LABELS[slug],
              href: `/anteojos-de-receta/${slug}`,
            })),
          },
        ],
      },
      {
        type: 'content',
        sections: [
          {
            heading: 'Por forma',
            items: [
              { label: 'Wayfarer', href: '/anteojos-de-receta?forma=wayfarer' },
              { label: 'Aviador', href: '/anteojos-de-receta?forma=aviator' },
              { label: 'Cat eye', href: '/anteojos-de-receta?forma=cat_eye' },
              { label: 'Rectangulares', href: '/anteojos-de-receta?forma=rectangular' },
              { label: 'Redondos', href: '/anteojos-de-receta?forma=round' },
            ],
          },
          {
            heading: 'Por material',
            items: [
              { label: 'Acetato', href: '/anteojos-de-receta/rusty/acetato' },
              { label: 'Metal', href: '/anteojos-de-receta/mormaii/metal' },
            ],
          },
        ],
      },
      { type: 'cta', panel: buildAdvisoryCta('anteojos de receta') },
    ],
  };
}

/**
 * Mega para `/marcas`. 2 columnas — todas las marcas + panel CTA.
 */
export function buildMarcasMegaMenu(): MegaMenu {
  return {
    columns: [
      {
        type: 'content',
        sections: [
          {
            heading: 'Todas las marcas',
            items: [
              { label: 'Ver hub de marcas', href: '/marcas' },
              ...BRAND_SLUGS.map((slug) => ({
                label: BRAND_LABELS[slug],
                href: `/anteojos-de-sol/${slug}`,
              })),
            ],
          },
        ],
      },
      { type: 'cta', panel: buildAdvisoryCta('una marca') },
    ],
  };
}
