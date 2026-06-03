import { Fragment, type ReactNode } from 'react';

/**
 * Renderiza texto con `**negrita**` (markdown inline mínimo) como nodos React,
 * envolviendo los tramos `**...**` en `<strong>`. Sin librería de markdown
 * (las descripciones de producto solo usan negritas + saltos de línea).
 *
 * Por qué existe: las descripciones se guardaban con `**...**` pero se
 * renderizaban como texto plano → mostraban los asteriscos literales (bug
 * reportado founder 2026-06-02). Esto los convierte en negrita real.
 *
 * `split` con grupo de captura devuelve: [normal, bold, normal, bold, ...] →
 * los índices impares son el contenido en negrita.
 */
/**
 * Quita los marcadores `**` de un texto, dejándolo plano. Para usos donde NO
 * se renderiza HTML: JSON-LD (schema.org), meta description, og/twitter. Evita
 * que los asteriscos aparezcan crudos en buscadores / redes.
 */
export function stripInlineBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}

export function renderInlineBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-foreground font-semibold">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
