import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

/**
 * Renderiza texto con `**negrita**` (markdown inline mínimo) como nodos React,
 * envolviendo los tramos `**...**` en `<strong>`. Sin librería de markdown
 * (las descripciones de producto solo usan negritas, enlaces internos y saltos de línea).
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
/**
 * Enlaces internos dentro de la descripción: `[texto](/ruta)`. Sólo se aceptan
 * rutas del propio sitio (empiezan con `/`), para que una descripción nunca
 * pueda mandar a un dominio externo sin pasar por código.
 */
const LINK_INTERNO = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

export function stripInlineBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(LINK_INTERNO, '$1');
}

export function renderInlineBold(text: string): ReactNode {
  // Trozos: [normal, **negrita** o [texto](/ruta), normal, ...]
  const parts = text.split(/(\*\*.+?\*\*|\[[^\]]+\]\(\/[^)\s]*\))/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    if (part.startsWith('**')) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const m = /^\[([^\]]+)\]\((\/[^)\s]*)\)$/.exec(part);
    if (!m) return <Fragment key={i}>{part}</Fragment>;
    return (
      <Link
        key={i}
        href={m[2]!}
        className="text-foreground decoration-foreground/40 hover:decoration-foreground underline underline-offset-4 transition-colors"
      >
        {m[1]}
      </Link>
    );
  });
}
