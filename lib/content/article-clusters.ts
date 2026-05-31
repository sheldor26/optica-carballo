import type { ArticleCluster } from '@/lib/content/article-types';

/**
 * Display labels para clusters editoriales.
 *
 * Cluster = grupo temático de artículos que comparten una pillar + N
 * satélites. Definido en `CONTENT_PLAN.md`. Si sumás un cluster nuevo,
 * agregalo acá Y al type `ArticleCluster` en `article-types.ts`.
 */
export const CLUSTER_LABELS: Record<ArticleCluster, string> = {
  'como-leer-receta': 'Cómo leer una receta',
  'anteojos-computadora': 'Anteojos para computadora',
  'lentes-de-contacto': 'Lentes de contacto',
  'forma-de-cara': 'Forma de cara',
  'patologias-visuales': 'Patologías visuales',
  'mantenimiento': 'Cuidado y mantenimiento',
  'glosario': 'Glosario óptico',
  'comparativas': 'Comparativas',
};

export function getClusterLabel(cluster: ArticleCluster): string {
  return CLUSTER_LABELS[cluster];
}
