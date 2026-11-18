/**
 * Plazo de entrega ESTIMADO por zona (en días hábiles) — single source of truth
 * para los cálculos por código postal / provincia.
 *
 * Por qué una tabla propia: la API MiCorreo `/rates` devuelve `deliveryTimeMin/Max`
 * pero es IGUAL para cualquier destino (Clásico 2–5 días, Expreso 1–3, hasta para
 * Ushuaia; verificado 2026-11-18 con 12 CP) y el sitio oficial de Correo tampoco
 * publica plazos por zona. Mostrar ese 2–5 sería prometer menos de lo real
 * (Ley 24.240 art. 4, 10 inc. e y 10 bis). Se informa SIEMPRE el servicio estándar
 * (Clásico); no se ofrece ni se muestra Express.
 *
 * Los números son días hábiles TOTALES desde que se acredita el pago: incluyen la
 * preparación y el despacho (1 a 2 días) más el tránsito del Correo. El único dato
 * real confirmado por el founder (2026-11-18) es Buenos Aires: "5 a 7 días hábiles".
 * El resto es una extrapolación por distancia desde Gobernador Virasoro (Corrientes)
 * y por los plazos que publican otras tiendas: AJUSTAR con entregas reales.
 * Es una estimación, no una promesa. En anteojos con receta el plazo corre desde
 * que se arman los lentes (lo aclara `ShippingTimeNotice`).
 */

export type EtaRange = { min: number; max: number };

export const ETA_BUCKETS = {
  /** NEA y Litoral cercano (misma región del origen). */
  nea: { min: 3, max: 5 },
  /** AMBA, Buenos Aires, Santa Fe, Córdoba, La Pampa (dato real del founder: 5–7). */
  centro: { min: 5, max: 7 },
  /** Cuyo y NOA. */
  cuyo_noa: { min: 6, max: 8 },
  /** Patagonia (sin Tierra del Fuego). */
  patagonia: { min: 7, max: 10 },
  /** Tierra del Fuego. */
  tierra_del_fuego: { min: 8, max: 12 },
} as const satisfies Record<string, EtaRange>;

export type EtaBucket = keyof typeof ETA_BUCKETS;

const PROVINCE_TO_BUCKET: Record<string, EtaBucket> = {
  Misiones: 'nea',
  Corrientes: 'nea',
  Chaco: 'nea',
  Formosa: 'nea',
  'Entre Ríos': 'nea',
  'Ciudad Autónoma de Buenos Aires': 'centro',
  'Buenos Aires': 'centro',
  Córdoba: 'centro',
  'Santa Fe': 'centro',
  'La Pampa': 'centro',
  Tucumán: 'cuyo_noa',
  Salta: 'cuyo_noa',
  Jujuy: 'cuyo_noa',
  Catamarca: 'cuyo_noa',
  'Santiago del Estero': 'cuyo_noa',
  'La Rioja': 'cuyo_noa',
  'San Juan': 'cuyo_noa',
  Mendoza: 'cuyo_noa',
  'San Luis': 'cuyo_noa',
  Neuquén: 'patagonia',
  'Río Negro': 'patagonia',
  Chubut: 'patagonia',
  'Santa Cruz': 'patagonia',
  'Tierra del Fuego': 'tierra_del_fuego',
};

/** Región según el CP de 4 dígitos (el primer dígito del código postal argentino marca la región). */
function bucketForPostalCode(cp4: number): EtaBucket | null {
  if (!Number.isFinite(cp4) || cp4 < 1000 || cp4 > 9999) return null;
  if (cp4 >= 9410) return 'tierra_del_fuego'; // Santa Cruz llega hasta 9409
  if (cp4 >= 9000) return 'patagonia'; // Chubut y Santa Cruz
  if (cp4 >= 8200) return 'patagonia'; // Neuquén, Río Negro (8000–8199 es Bahía Blanca)
  if (cp4 >= 6000) return 'centro'; // interior de Buenos Aires, La Pampa, Bahía Blanca
  if (cp4 >= 5800) return 'centro'; // sur de Córdoba (Río Cuarto, Villa María)
  if (cp4 >= 5300) return 'cuyo_noa'; // La Rioja, San Juan, Mendoza, San Luis
  if (cp4 >= 5000) return 'centro'; // Córdoba
  if (cp4 >= 4000) return 'cuyo_noa'; // NOA
  if (cp4 >= 3000) return 'nea'; // NEA y Litoral
  return 'centro'; // 1000–2999: CABA, GBA, Buenos Aires, sur de Santa Fe
}

export function etaForPostalCode(postalCode?: string | null): EtaRange | null {
  const cp = Number(postalCode?.match(/\d{4}/)?.[0]);
  const b = bucketForPostalCode(cp);
  return b ? ETA_BUCKETS[b] : null;
}

export function etaForProvince(province?: string | null): EtaRange | null {
  const b = province ? PROVINCE_TO_BUCKET[province] : undefined;
  return b ? ETA_BUCKETS[b] : null;
}

/** El CP manda sobre la provincia (es más preciso). */
export function resolveEta(args: {
  postalCode?: string | null;
  provinceName?: string | null;
}): EtaRange | null {
  return etaForPostalCode(args.postalCode) ?? etaForProvince(args.provinceName);
}

export function formatEta(r: EtaRange): string {
  return `${r.min} a ${r.max} días hábiles`;
}
