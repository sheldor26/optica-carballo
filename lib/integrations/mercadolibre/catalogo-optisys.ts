/**
 * Las publicaciones del vendedor, de a tandas, para que el sistema de la óptica
 * las enlace con su stock.
 *
 * Funciones puras, sin red ni base. Probadas en
 * `scripts/ml-catalogo-selftest.ts`.
 *
 * Sale lo mismo que en la consulta de una publicación (`publicacion.ts`),
 * recortado, más dos datos para emparejar: `producto` (el User Product: mismo
 * producto físico) y `codigoPropio` (con qué nombra una venta a una publicación
 * sin variaciones).
 */
import { leerPublicacion, ML_ITEM_ID, type Publicacion } from './publicacion';

export const ESTADOS = ['active', 'paused'] as const;
export type Estado = (typeof ESTADOS)[number];

/** Publicaciones por tanda: entran cómodas en el tiempo de la función. */
export const POR_TANDA = 40;

export type Pedido =
  | { modo: 'pagina'; estado: Estado; cursor: string | null }
  | { modo: 'ids'; ids: string[] };

/** `?estado=active[&cursor=…]` o `?ids=MLA1,MLA2`. Null si no es ninguno. */
export function leerPedido(q: URLSearchParams): Pedido | null {
  const ids = q.get('ids');
  const estado = q.get('estado');
  const cursor = q.get('cursor');
  if (ids !== null) {
    const lista = [...new Set(ids.split(','))];
    if (estado !== null || cursor !== null) return null;
    return lista.length <= POR_TANDA && lista.every((id) => ML_ITEM_ID.test(id))
      ? { modo: 'ids', ids: lista }
      : null;
  }
  if (!ESTADOS.includes(estado as Estado)) return null;
  // El `scroll_id` de Mercado Libre. Va codificado en la dirección.
  if (cursor !== null && !/^[\w+/=.:-]{1,2000}$/.test(cursor)) return null;
  return { modo: 'pagina', estado: estado as Estado, cursor };
}

const objeto = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

const texto = (v: unknown): string | null => {
  const t = typeof v === 'string' || typeof v === 'number' ? String(v).trim() : '';
  return t ? t.slice(0, 100) : null;
};

/** La respuesta de `items/search?search_type=scan`. Null si no tiene la forma. */
export function leerPagina(crudo: unknown) {
  const r = objeto(crudo);
  if (!Array.isArray(r.results)) return null;
  const ids = r.results.filter((id): id is string => typeof id === 'string' && ML_ITEM_ID.test(id));
  const cursor = typeof r.scroll_id === 'string' && r.scroll_id ? r.scroll_id : null;
  const total = objeto(r.paging).total;
  return {
    ids,
    // En modo "scan" se termina cuando vuelve una página vacía.
    siguiente: ids.length > 0 ? cursor : null,
    total: typeof total === 'number' ? total : null,
  };
}

const MAX_FOTOS = 3;
/** Las características que sirven para reconocer el artículo. */
const SIRVEN = new Set(['marca', 'modelo', 'modelo detallado', 'color', 'color del armazón']);

export type PublicacionDeCatalogo = Omit<Publicacion, 'variantes'> & {
  producto: string | null;
  codigoPropio: string | null;
  variantes: (Publicacion['variantes'][number] & { producto: string | null })[];
};

/**
 * Una respuesta de `/items/{id}?include_attributes=all`. `'catalogo'` para las
 * publicaciones de catálogo, que no se enlazan (cuelgan de las tradicionales).
 */
export function leerDeCatalogo(
  crudo: unknown,
  id: string,
): PublicacionDeCatalogo | 'catalogo' | null {
  const item = objeto(crudo);
  if (item.catalog_listing === true) return 'catalogo';
  const p = leerPublicacion(crudo, id);
  if (!p) return null;

  const productos = new Map(
    (Array.isArray(item.variations) ? item.variations : []).map((v) => [
      String(objeto(v).id),
      texto(objeto(v).user_product_id),
    ]),
  );
  const atributos = Array.isArray(item.attributes) ? item.attributes.map(objeto) : [];
  const skuAtributo = texto(atributos.find((a) => a.id === 'SELLER_SKU')?.value_name);

  return {
    ...p,
    fotos: p.fotos.slice(0, MAX_FOTOS),
    caracteristicas: p.caracteristicas.filter((c) => SIRVEN.has(c.nombre.toLowerCase())),
    producto: texto(item.user_product_id),
    // En el mismo orden que usa `codigosDeVariacion` (orders.ts) con una venta
    // sin `variation_id`: primero el código propio, después el SKU.
    codigoPropio: texto(item.seller_custom_field) ?? skuAtributo,
    variantes: p.variantes.map((v) => ({
      ...v,
      fotos: v.fotos.slice(0, MAX_FOTOS),
      producto: productos.get(v.id) ?? null,
    })),
  };
}
