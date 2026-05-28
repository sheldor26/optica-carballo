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

/**
 * Links de información/legales para el footer. NO van en el header
 * para no contaminar la navegación principal. Estas páginas son
 * obligatorias antes de habilitar el checkout.
 */
export const FOOTER_INFO_LINKS: NavLink[] = [
  { href: '/sobre-nosotros', label: 'Sobre nosotros' },
  { href: '/politica-de-devolucion', label: 'Política de cambios y devoluciones' },
  { href: '/boton-de-arrepentimiento', label: 'Botón de arrepentimiento' },
  { href: '/defensa-del-consumidor', label: 'Defensa del consumidor' },
];
