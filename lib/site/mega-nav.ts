/**
 * Configuración del mega-menu desktop.
 *
 * Para los 3 nav links principales (Anteojos de sol / Anteojos de receta / Marcas),
 * el hover desktop muestra un panel grande con sub-categorías y atajos a páginas
 * SEO ya existentes (género, filtros, materiales, marcas).
 *
 * Mobile mantiene el drawer simple existente — sin mega-menu en pantallas chicas
 * porque ocupa demasiado espacio.
 *
 * Las marcas listadas acá deben matchear las activas en `BRANDS.md` + DB. Si se
 * suma una marca nueva, agregar a `BRAND_SLUGS` abajo + asegurar que tiene productos.
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

export type MegaColumn = {
  heading: string;
  items: Array<{ label: string; href: string }>;
};

/**
 * Mega panel para `/anteojos-de-sol`. Categorías: Género / Filtros (formas + polarizados) / Material / Marcas.
 */
export function buildSolMegaColumns(): MegaColumn[] {
  return [
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
      heading: 'Por marca',
      items: BRAND_SLUGS.map((slug) => ({
        label: BRAND_LABELS[slug],
        href: `/anteojos-de-sol/${slug}`,
      })),
    },
    {
      heading: 'Por marca y filtro',
      items: [
        { label: 'Vulk polarizados', href: '/anteojos-de-sol/vulk/polarizados' },
        { label: 'Rusty hombre', href: '/anteojos-de-sol/rusty/hombre' },
        { label: 'Mormaii deportivos', href: '/anteojos-de-sol/mormaii' },
        { label: 'Reef beach', href: '/anteojos-de-sol/reef' },
        { label: "Paula Cahen mujer", href: '/anteojos-de-sol/paula-cahen-danvers/mujer' },
      ],
    },
  ];
}

/**
 * Mega panel para `/anteojos-de-receta`. Mismas categorías que sol, sin polarizados
 * (no aplica) y misma estructura.
 */
export function buildRecetaMegaColumns(): MegaColumn[] {
  return [
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
      heading: 'Por marca',
      items: BRAND_SLUGS.map((slug) => ({
        label: BRAND_LABELS[slug],
        href: `/anteojos-de-receta/${slug}`,
      })),
    },
    {
      heading: 'Por marca y filtro',
      items: [
        { label: 'Vulk hombre', href: '/anteojos-de-receta/vulk/hombre' },
        { label: 'Vulk mujer', href: '/anteojos-de-receta/vulk/mujer' },
        { label: 'Rusty acetato', href: '/anteojos-de-receta/rusty/acetato' },
        { label: 'Mormaii metal', href: '/anteojos-de-receta/mormaii/metal' },
        { label: 'Paula Cahen mujer', href: '/anteojos-de-receta/paula-cahen-danvers/mujer' },
      ],
    },
  ];
}

/**
 * Mega para `/marcas`. Solo una columna con todas las marcas + link al hub.
 */
export function buildMarcasMegaColumns(): MegaColumn[] {
  return [
    {
      heading: 'Todas las marcas',
      items: [
        { label: 'Ver todas →', href: '/marcas' },
        ...BRAND_SLUGS.map((slug) => ({
          label: BRAND_LABELS[slug],
          href: `/anteojos-de-sol/${slug}`,
        })),
      ],
    },
  ];
}
