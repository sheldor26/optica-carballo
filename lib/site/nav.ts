export type NavLink = {
  href: string;
  label: string;
};

/**
 * Source of truth de los links de navegación del storefront.
 * Reusado por header, footer y eventualmente sitemap.
 *
 * Sólo se listan URLs que tienen página real implementada. Cuando se sumen
 * nuevas (lentes-de-contacto, guías, etc.), agregar acá.
 */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/anteojos-de-sol', label: 'Anteojos de sol' },
  { href: '/anteojos-de-receta', label: 'Anteojos de receta' },
];
