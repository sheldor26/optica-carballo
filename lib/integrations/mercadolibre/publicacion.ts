/**
 * Una publicación de Mercado Libre, recortada a lo que muestra el sistema de la
 * óptica: título, estado, precio y stock publicados, color, características,
 * fotos, SKU y el enlace.
 *
 * Funciones puras, sin red ni base. Probadas en
 * `scripts/ml-publicacion-selftest.ts`.
 *
 * LO QUE NO ESTÁ ACÁ NO SALE. La respuesta de `/items/{id}` trae mucho más
 * (vendedor, ubicación, condiciones de venta): se arma campo por campo, así un
 * dato nuevo de Mercado Libre no viaja solo.
 */
import { mlMultigetSchema, mlPublicationSchema, type MLPublicationValidated } from './schemas';

/** Estricto: se mete en la dirección de la API. */
export const ML_ITEM_ID = /^MLA\d{5,15}$/;

export type DatoDePublicacion = { nombre: string; valor: string };

export type VarianteDePublicacion = {
  /** El id de la variación, el mismo que viene en los renglones de una venta. */
  id: string;
  color: string | null;
  combinacion: DatoDePublicacion[];
  /** En pesos. */
  precio: number | null;
  stock: number | null;
  sku: string | null;
  /** Sólo las de esta variación. Puede venir vacío. */
  fotos: string[];
};

export type Publicacion = {
  id: string;
  titulo: string;
  /** Tal como lo manda Mercado Libre: active, paused, closed... */
  estado: string;
  subEstados: string[];
  precio: number | null;
  moneda: string | null;
  stock: number | null;
  /** El `permalink` exacto, sólo si es una dirección de Mercado Libre. */
  enlace: string | null;
  sku: string | null;
  /** Sólo en publicaciones sin variaciones; si las hay, el color va en cada una. */
  color: string | null;
  caracteristicas: DatoDePublicacion[];
  /** Las de la publicación entera: con variaciones, mezclan colores. */
  fotos: string[];
  variantes: VarianteDePublicacion[];
};

const MAX_CARACTERISTICAS = 60;
const MAX_FOTOS = 30;
const MAX_VARIANTES = 100;

/** Atributos de logística, impuestos o carga interna: no describen el producto. */
const NO_SE_MUESTRAN = /^(SELLER_|PACKAGE_|SHIPMENT_|HAZMAT_|IMPORT_|SYI_|VAT$|EMPTY_GTIN)/;

type Atributo = NonNullable<MLPublicationValidated['attributes']>[number];

const texto = (v: string | null | undefined, tope = 300): string | null => {
  const t = (v ?? '').trim();
  return t ? t.slice(0, tope) : null;
};

const valorDe = (atributos: Atributo[] | null | undefined, id: string): string | null =>
  texto(atributos?.find((a) => a.id === id)?.value_name);

function datos(atributos: Atributo[] | null | undefined): DatoDePublicacion[] {
  return (atributos ?? []).flatMap((a) => {
    const nombre = texto(a.name, 100);
    const valor = texto(a.value_name);
    if (!nombre || !valor || NO_SE_MUESTRAN.test(a.id ?? '')) return [];
    return [{ nombre, valor }];
  });
}

/** Sólo direcciones https de un dominio de Mercado Libre. */
function direccionDe(valor: string | null | undefined, dominio: string): string | null {
  try {
    const u = new URL((valor ?? '').trim());
    const suyo = u.hostname === dominio || u.hostname.endsWith(`.${dominio}`);
    if (!suyo || u.username || u.password) return null;
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    u.protocol = 'https:';
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * La respuesta cruda de `/items/{id}?include_attributes=all`, validada y
 * recortada. Null si no tiene la forma esperada o es de otra publicación.
 */
export function leerPublicacion(crudo: unknown, itemId: string): Publicacion | null {
  const validado = mlPublicationSchema.safeParse(crudo);
  if (!validado.success || validado.data.id !== itemId) return null;
  const item = validado.data;

  const fotoPorId = new Map(
    (item.pictures ?? []).flatMap((f) => {
      const url = direccionDe(f.secure_url ?? f.url, 'mlstatic.com');
      return url ? [[f.id, url] as const] : [];
    }),
  );

  const variantes = (item.variations ?? []).slice(0, MAX_VARIANTES).map((v) => ({
    id: String(v.id),
    color: valorDe(v.attribute_combinations, 'COLOR') ?? valorDe(v.attributes, 'COLOR'),
    combinacion: datos(v.attribute_combinations),
    precio: v.price ?? null,
    stock: v.available_quantity ?? null,
    sku: valorDe(v.attributes, 'SELLER_SKU') ?? texto(v.seller_custom_field),
    fotos: (v.picture_ids ?? [])
      .flatMap((id) => fotoPorId.get(id) ?? [])
      .slice(0, MAX_FOTOS),
  }));
  const sinVariantes = variantes.length === 0;

  return {
    id: item.id,
    titulo: texto(item.title) ?? '(sin título)',
    estado: item.status,
    subEstados: item.sub_status ?? [],
    precio: item.price ?? null,
    moneda: texto(item.currency_id, 10),
    stock: item.available_quantity ?? null,
    enlace: direccionDe(item.permalink, 'mercadolibre.com.ar'),
    sku: valorDe(item.attributes, 'SELLER_SKU') ?? texto(item.seller_custom_field),
    color: sinVariantes ? valorDe(item.attributes, 'COLOR') : null,
    caracteristicas: datos(item.attributes).slice(0, MAX_CARACTERISTICAS),
    fotos: [...fotoPorId.values()].slice(0, MAX_FOTOS),
    variantes,
  };
}

/* -------------------------------------------------------- fotos, de a varias */

/** Cuántas publicaciones se pueden pedir en un solo pedido de la óptica. */
export const MAX_PUBLICACIONES = 100;
/** El tope de `/items?ids=` de Mercado Libre. */
export const PUBLICACIONES_POR_LLAMADA = 20;
const MAX_FOTOS_POR_LISTA = 10;

/** `?ids=MLA1,MLA2`: sin repetidos. Null si falta, sobra o alguno está mal. */
export function leerIds(crudo: string | null): string[] | null {
  const ids = [...new Set((crudo ?? '').split(','))];
  return ids.length <= MAX_PUBLICACIONES && ids.every((id) => ML_ITEM_ID.test(id)) ? ids : null;
}

export type FotosDePublicacion = {
  id: string;
  /** Sólo en publicaciones sin variaciones: con variaciones mezclan colores. */
  fotos: string[];
  variantes: { id: string; fotos: string[] }[];
};

/**
 * Las fotos de una respuesta de `/items?ids=…`. Las que Mercado Libre no dio, o
 * no se pidieron, quedan afuera. Null si la respuesta no tiene la forma.
 */
export function leerFotos(crudo: unknown, pedidas: string[]): FotosDePublicacion[] | null {
  const validado = mlMultigetSchema.safeParse(crudo);
  if (!validado.success) return null;
  return validado.data.flatMap(({ code, body }) => {
    if (code !== 200) return [];
    const id = (body as { id?: unknown } | null)?.id;
    if (typeof id !== 'string' || !pedidas.includes(id)) return [];
    const p = leerPublicacion(body, id);
    if (!p) return [];
    return [
      {
        id,
        fotos: p.variantes.length > 0 ? [] : p.fotos.slice(0, MAX_FOTOS_POR_LISTA),
        variantes: p.variantes.map((v) => ({
          id: v.id,
          fotos: v.fotos.slice(0, MAX_FOTOS_POR_LISTA),
        })),
      },
    ];
  });
}
