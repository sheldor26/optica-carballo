import 'server-only';

/**
 * Mapeo nombre de provincia (como las guarda `lib/addresses`) → código de
 * 1 letra que usa la API MiCorreo (endpoint /agencies). Tabla oficial del
 * manual MiCorreo v2025-01-14.
 */
const PROVINCE_TO_CODE: Record<string, string> = {
  Salta: 'A',
  'Buenos Aires': 'B',
  'Ciudad Autónoma de Buenos Aires': 'C',
  'San Luis': 'D',
  'Entre Ríos': 'E',
  'La Rioja': 'F',
  'Santiago del Estero': 'G',
  Chaco: 'H',
  'San Juan': 'J',
  Catamarca: 'K',
  'La Pampa': 'L',
  Mendoza: 'M',
  Misiones: 'N',
  Formosa: 'P',
  Neuquén: 'Q',
  'Río Negro': 'R',
  'Santa Fe': 'S',
  Tucumán: 'T',
  Chubut: 'U',
  'Tierra del Fuego': 'V',
  Corrientes: 'W',
  Córdoba: 'X',
  Jujuy: 'Y',
  'Santa Cruz': 'Z',
};

/** Devuelve el código MiCorreo de una provincia, o null si no matchea. */
export function provinceCodeFor(provinceName: string): string | null {
  return PROVINCE_TO_CODE[provinceName] ?? null;
}
