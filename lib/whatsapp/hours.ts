/**
 * Horarios de atención de Óptica Carballo (Virasoro, Corrientes).
 *
 * Fuente: el founder, 2026-11-19. Domingos y feriados NO están confirmados:
 * el bot no afirma nada de eso (devuelve 'sin_dato' y deriva).
 *
 * Argentina no usa horario de verano, así que la zona fija es suficiente.
 * Sin `server-only`: lógica pura, se prueba con tsx.
 */

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

/** [desde, hasta) en minutos desde la medianoche. */
type Range = [number, number];

const LUNES_A_VIERNES: Range[] = [
  [8 * 60, 12 * 60 + 15],
  [16 * 60 + 30, 20 * 60 + 30],
];
const SABADOS: Range[] = [
  [8 * 60 + 30, 12 * 60 + 15],
  [17 * 60, 20 * 60 + 30],
];

/** Texto para el prompt y para respuestas fijas. Mismo que la FAQ del sitio. */
export const HORARIOS_TEXTO =
  'Lunes a viernes de 8:00 a 12:15 y de 16:30 a 20:30; sábados de 8:30 a 12:15 y de 17:00 a 20:30.';

export type OpenStatus = 'abierto' | 'cerrado' | 'sin_dato';

/**
 * ¿Estamos atendiendo ahora? 'sin_dato' los domingos: no tenemos el horario
 * confirmado y no hay que inventarlo. Los feriados no se contemplan (tampoco
 * hay dato): el que llama no debe decir "estamos cerrados" con certeza.
 */
export function openStatus(now: Date = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === 'weekday')?.value;
  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value);
  if (!weekday || !Number.isFinite(hour) || !Number.isFinite(minute)) return 'sin_dato';

  const ranges =
    weekday === 'Sat' ? SABADOS : weekday === 'Sun' ? null : LUNES_A_VIERNES;
  if (!ranges) return 'sin_dato';

  const minutes = hour * 60 + minute;
  return ranges.some(([from, to]) => minutes >= from && minutes < to) ? 'abierto' : 'cerrado';
}
