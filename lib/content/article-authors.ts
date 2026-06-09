import type { Author, AuthorKey } from '@/lib/content/article-types';

/**
 * Bios de autores referenciados desde frontmatter (`author: "juan"`).
 *
 * Source of truth para E-E-A-T: cada artículo se firma con un autor con
 * experiencia real en óptica y role claro (sin claims de matrícula).
 *
 * Si sumás un autor nuevo, agregalo acá Y al type `AuthorKey` en
 * `article-types.ts` para que TypeScript valide referencias.
 */
const AUTHORS: Record<AuthorKey, Author> = {
  juan: {
    key: 'juan',
    displayName: 'Juan Mirande',
    role: 'Técnico Superior en Óptica y Contactología',
    matricula: null,
    bio: 'Técnico óptico de Óptica Carballo, hijo del fundador. Maneja la atención online y la integración digital de la óptica. 30+ años de historia familiar en la región del NEA argentino.',
    avatarPath: null,
  },
  'maria-carlota': {
    key: 'maria-carlota',
    displayName: 'Equipo Óptica Carballo',
    role: 'Óptica Carballo',
    matricula: null,
    bio: 'Más de tres décadas de experiencia en armado de anteojos recetados, asesoramiento y validación de recetas en Óptica Carballo.',
    avatarPath: null,
  },
};

export function getAuthor(key: AuthorKey): Author {
  return AUTHORS[key];
}
