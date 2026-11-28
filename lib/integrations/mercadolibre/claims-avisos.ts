/**
 * Qué avisar por correo sobre los reclamos, y cómo se escribe. Lógica pura: sin
 * red, sin base, sin secretos. La usa claims.ts y la prueba
 * scripts/ml-reclamos-selftest.ts.
 *
 * NUNCA DOS VECES EL MISMO HECHO
 *
 * Cada hecho tiene una clave ('nuevo', 'turno:<fecha>', 'devolucion:<id>'...)
 * que queda en la columna `notified`. La base sólo agrega claves que no estaban
 * y entrega cada una a un solo proceso (ver la migración), así que dos
 * recorridos a la vez no mandan dos correos.
 *
 * SIN NOMBRES NI DIRECCIONES: apodo, publicación, motivo y qué hacer.
 */
import { createHash } from 'node:crypto';
import {
  DESTINO_DEPOSITO,
  DEVOLUCION_TERMINADA,
  type Hecho,
  type Notificado,
  type ReclamoGuardado,
} from '@/lib/integrations/mercadolibre/claims-mapping';

/** En la primera carga sólo se avisa de los abiertos más nuevos que esto. */
export const HORAS_RECIENTE = 48;
/** Una devolución que llegó hace más que esto ya no es una novedad. */
export const DIAS_DEVOLUCION_RECIENTE = 7;
/** Sin una lectura completa hace más que esto, la sincronización "viene fallando". */
export const HORAS_SIN_ACTUALIZAR = 2;

const HORA = 3_600_000;
const ZONA = 'America/Argentina/Buenos_Aires';

export type Correo = { subject: string; text: string; html: string };

export type EstadoSync = {
  clave: 'claims' | 'reputation' | 'historico';
  ok_at: string | null;
  intento_at: string | null;
  incompleto: boolean;
  detalle: string | null;
};

/** Abierto y Mercado Libre espera algo de nosotros. La mediación va aparte. */
export function esTurnoDelVendedor(f: ReclamoGuardado): boolean {
  return (
    f.status === 'opened' &&
    (f.action_responsible === 'respondent' ||
      (f.seller_actions ?? []).some((a) => a.mandatory))
  );
}

function vaAlDeposito(f: ReclamoGuardado): boolean {
  const tramo = f.return_shipments?.find(
    (t) => t.shipment_id === f.return_shipment_id,
  );
  return tramo?.destination === DESTINO_DEPOSITO;
}

/** El paquete de vuelta llegó a la óptica (no al depósito de Mercado Libre). */
export function devolucionEntregada(f: ReclamoGuardado): boolean {
  if (!f.return_id && !f.return_shipment_id) return false;
  if (vaAlDeposito(f)) return false;
  return (
    !!f.return_delivered_at ||
    f.return_shipment_status === 'delivered' ||
    f.return_status === 'delivered'
  );
}

export function devolucionEnCamino(f: ReclamoGuardado): boolean {
  if (!f.return_id && !f.return_status) return false;
  if (f.return_status && DEVOLUCION_TERMINADA.has(f.return_status))
    return false;
  return !devolucionEntregada(f);
}

export type Evaluacion = {
  estado: NonNullable<Notificado['estado']>;
  /** Sólo los hechos que todavía no estaban anotados. */
  nuevos: Record<string, Hecho>;
  /** Si hay algo para escribir en la base. */
  cambio: boolean;
};

/**
 * Compara el reclamo como quedó guardado con cómo estaba la última vez.
 *
 * @param primeraCarga todavía no hubo un recorrido completo (o es la carga del
 *   historial): lo que se ve por primera vez no se avisa, salvo los abiertos de
 *   menos de 48 h.
 * @param avisosActivos hay a quién mandar. Si no, los hechos se anotan como
 *   omitidos, para que al configurarlo no salgan todos juntos.
 */
export function evaluarAvisos(
  f: ReclamoGuardado,
  opciones: { primeraCarga: boolean; avisosActivos: boolean; ahora: number },
): Evaluacion {
  const { primeraCarga, avisosActivos, ahora } = opciones;
  const antes = f.notified?.estado;
  const anotados = f.notified?.hechos ?? {};
  const abierto = f.status === 'opened';
  const turno = esTurnoDelVendedor(f);
  const reciente =
    abierto &&
    !!f.opened_at &&
    ahora - Date.parse(f.opened_at) < HORAS_RECIENTE * HORA;
  const calladoDeEntrada = primeraCarga && !antes && !reciente;
  const marca = new Date(ahora).toISOString();
  const nuevos: Record<string, Hecho> = {};

  const anotar = (clave: string, omitir = false) => {
    if (anotados[clave]) return;
    const e =
      omitir || calladoDeEntrada || !avisosActivos ? 'omitido' : 'pendiente';
    nuevos[clave] = { e, en: marca, visto: marca };
  };

  if (abierto) {
    if (antes?.status === 'closed') anotar(`reabierto:${antes.ref ?? ''}`);
    else if (!antes?.status) anotar('nuevo');
    // La primera vez, el turno va contado en el aviso de "nuevo".
    if (turno && antes && !antes.turno) {
      anotar(`turno:${f.claim_updated_at ?? marca}`);
    }
    if (f.stage === 'dispute') anotar('mediacion');
  }

  if (devolucionEntregada(f)) {
    const llego = Date.parse(
      f.return_delivered_at ?? f.claim_updated_at ?? marca,
    );
    anotar(
      `devolucion:${f.return_id ?? f.return_shipment_id}`,
      ahora - llego > DIAS_DEVOLUCION_RECIENTE * 24 * HORA,
    );
  }

  const estado = {
    status: f.status ?? antes?.status ?? null,
    turno,
    // Identifica el cierre: si se reabre, esa es la clave del aviso.
    ref:
      f.status === 'closed'
        ? (f.claim_updated_at ?? f.closed_at ?? null)
        : (antes?.ref ?? null),
  };
  const cambio =
    Object.keys(nuevos).length > 0 ||
    !antes ||
    antes.status !== estado.status ||
    antes.turno !== estado.turno ||
    antes.ref !== estado.ref;

  return { estado, nuevos, cambio };
}

/** Un aviso de turno que ya no es cierto no se manda. */
export function sigueVigente(f: ReclamoGuardado, clave: string): boolean {
  return clave.startsWith('turno:') ? esTurnoDelVendedor(f) : true;
}

/** La misma tanda de hechos da la misma clave: Resend no la manda dos veces. */
export function claveDeEnvio(claimId: string, claves: string[]): string {
  const huella = createHash('sha256')
    .update([...claves].sort().join('|'))
    .digest('hex')
    .slice(0, 32);
  return `ml-aviso/${claimId}/${huella}`;
}

function partes(ms: number, opciones: Intl.DateTimeFormatOptions) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('es-AR', { timeZone: ZONA, ...opciones })
      .formatToParts(new Date(ms))
      .map((p) => [p.type, p.value]),
  );
}

/** "30/11 a las 18:00", en hora de Argentina. */
export function fechaArgentina(fecha: string): string {
  const p = partes(Date.parse(fecha), {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  return `${p.day}/${p.month} a las ${p.hour}:${p.minute}`;
}

/** El día de calendario en Argentina, como 'AAAA-MM-DD'. */
export function diaArgentino(ms: number): string {
  const p = partes(ms, { year: 'numeric', month: '2-digit', day: '2-digit' });
  return `${p.year}-${p.month}-${p.day}`;
}

/** La venta en el panel (la misma dirección que usa el sistema de la óptica). */
export function enlaceDeVenta(f: ReclamoGuardado): string | null {
  const numero = f.pack_id ?? f.order_external_id;
  return numero && /^\d{1,25}$/.test(numero)
    ? `https://vendedores.mercadolibre.com.ar/ventas/${numero}/detalle`
    : null;
}

const apodo = (f: ReclamoGuardado) => f.buyer_nickname ?? 'apodo sin informar';

function publicaciones(f: ReclamoGuardado): string {
  const titulos = (f.order_items ?? [])
    .map((a) => [a.title, a.color].filter(Boolean).join(' - '))
    .filter(Boolean);
  return [...new Set(titulos)].join('; ') || 'venta sin vincular';
}

const motivo = (f: ReclamoGuardado) =>
  f.reason_detail ??
  f.detail_problem ??
  'Mercado Libre no informó el motivo';

const vencimiento = (f: ReclamoGuardado) =>
  f.due_date
    ? `vence el ${fechaArgentina(f.due_date)}`
    : 'sin fecha límite informada';

/** El primero que aparezca de esta lista da el asunto. */
const AVISOS: Array<{ prefijo: string; asunto: string; frase: string }> = [
  {
    prefijo: 'reabierto:',
    asunto: 'Se reabrió un reclamo',
    frase: 'Un reclamo que estaba cerrado se volvió a abrir.',
  },
  {
    prefijo: 'nuevo',
    asunto: 'Reclamo nuevo',
    frase: 'Entró un reclamo nuevo.',
  },
  {
    prefijo: 'mediacion',
    asunto: 'Un reclamo pasó a mediación',
    frase: 'El reclamo está en mediación: interviene Mercado Libre.',
  },
  {
    prefijo: 'devolucion:',
    asunto: 'Llegó una devolución',
    frase: 'El paquete devuelto figura como entregado.',
  },
  {
    prefijo: 'turno:',
    asunto: 'Te toca contestar un reclamo',
    frase: 'Ahora te toca contestar a vos.',
  },
];

function queHacer(f: ReclamoGuardado, claves: string[]): string[] {
  const pasos: string[] = [];
  if (claves.some((c) => c.startsWith('devolucion:'))) {
    pasos.push(
      'Abrí el paquete, revisá cómo llegó y cargalo en el sistema, en Postventa. Si llegó dañado, reportalo en Mercado Libre en el momento.',
    );
  }
  if (f.status !== 'opened') {
    return pasos.length > 0
      ? pasos
      : ['El reclamo ya figura cerrado: revisalo en Mercado Libre.'];
  }
  if (esTurnoDelVendedor(f)) {
    pasos.push('Entrá a Mercado Libre y contestá el reclamo.');
  } else if (f.stage === 'dispute') {
    pasos.push(
      'Entrá a Mercado Libre y mirá la mediación: pueden pedirte datos o pruebas.',
    );
  } else {
    pasos.push(
      'Miralo en Mercado Libre. Por ahora no figura que tengas que contestar.',
    );
  }
  return pasos;
}

export function escaparHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

type Bloque = { titulo?: string; lineas: string[]; enlace?: string | null };

function armar(subject: string, bloques: Bloque[]): Correo {
  const text = bloques
    .map((b) =>
      [
        b.titulo?.toUpperCase(),
        ...b.lineas,
        b.enlace ? `Abrir en Mercado Libre: ${b.enlace}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n\n');
  const cuerpo = bloques
    .map(
      (b) =>
        (b.titulo
          ? `<h2 style="margin:24px 0 8px;font-size:17px">${escaparHtml(b.titulo)}</h2>`
          : '') +
        b.lineas
          .map(
            (l) =>
              `<p style="margin:0 0 8px;font-size:15px;line-height:1.5">${escaparHtml(l)}</p>`,
          )
          .join('') +
        (b.enlace
          ? `<p style="margin:0 0 16px"><a href="${escaparHtml(b.enlace)}" style="color:#0e1d33;font-weight:600">Abrir en Mercado Libre</a></p>`
          : ''),
    )
    .join('');
  const html = `<!doctype html>
<html lang="es-AR"><body style="margin:0;padding:24px;background:#f4f0e9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0e1d33">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">${cuerpo}</div>
</body></html>`;
  return { subject, text, html };
}

/** El aviso urgente de un reclamo: un solo correo con todo lo que pasó. */
export function correoDeReclamo(f: ReclamoGuardado, claves: string[]): Correo {
  const ocurrio = AVISOS.filter((a) =>
    claves.some((c) => c.startsWith(a.prefijo)),
  );
  const asunto = ocurrio[0]?.asunto ?? 'Novedad en un reclamo';
  const lineas = [
    `Comprador (apodo): ${apodo(f)}`,
    `Publicación: ${publicaciones(f)}`,
    `Motivo: ${motivo(f)}`,
  ];
  if (f.status === 'opened') lineas.push(`Plazo: ${vencimiento(f)}`);
  if (f.affects_reputation === 'affected') {
    lineas.push('Según Mercado Libre, afecta tu reputación.');
  } else if (f.affects_reputation === 'not_affected') {
    lineas.push('Según Mercado Libre, no afecta tu reputación.');
  }
  if (f.status === 'opened' && f.reputation_due_date) {
    lineas.push(
      `Plazo informado sobre la reputación: ${fechaArgentina(f.reputation_due_date)}`,
    );
  }

  return armar(`[Mercado Libre] ${asunto} (${apodo(f)})`, [
    { titulo: asunto, lineas: ocurrio.map((a) => a.frase) },
    { lineas },
    {
      titulo: 'Qué hacer',
      lineas: queHacer(f, claves),
      enlace: enlaceDeVenta(f),
    },
  ]);
}

export function sincronizacionFallando(
  estado: EstadoSync | null,
  ahora: number,
): boolean {
  return (
    !estado?.ok_at ||
    ahora - Date.parse(estado.ok_at) > HORAS_SIN_ACTUALIZAR * HORA
  );
}

const EN_CAMINO: Record<string, string> = {
  label_generated: 'con etiqueta generada, falta que la despachen',
  pending: 'pendiente de despacho',
  shipped: 'en camino',
};

function estadoDeVuelta(f: ReclamoGuardado): string {
  if (vaAlDeposito(f) && f.return_shipment_status === 'delivered') {
    return 'en el depósito de Mercado Libre';
  }
  return EN_CAMINO[f.return_status ?? ''] ?? 'en curso';
}

/** El resumen de la mañana. `null` = no hay nada que contar. */
export function correoResumen(args: {
  reclamos: ReclamoGuardado[];
  estado: EstadoSync | null;
  ahora: number;
}): Correo | null {
  const { reclamos, estado, ahora } = args;
  const abiertos = reclamos
    .filter((f) => f.status === 'opened')
    .sort(
      (a, b) =>
        (Date.parse(a.due_date ?? '') || Number.MAX_SAFE_INTEGER) -
        (Date.parse(b.due_date ?? '') || Number.MAX_SAFE_INTEGER),
    );
  const teToca = abiertos.filter(
    (f) => esTurnoDelVendedor(f) || f.stage === 'dispute',
  );
  const resto = abiertos.filter((f) => !teToca.includes(f));
  const vuelven = reclamos.filter(
    (f) => f.status !== 'opened' && devolucionEnCamino(f),
  );
  const fallando = sincronizacionFallando(estado, ahora);
  if (!fallando && abiertos.length === 0 && vuelven.length === 0) return null;

  const renglon = (f: ReclamoGuardado) =>
    [
      `- ${apodo(f)}: ${publicaciones(f)}`,
      `  Motivo: ${motivo(f)}`,
      f.status === 'opened' ? `  Plazo: ${vencimiento(f)}` : null,
      devolucionEntregada(f)
        ? '  Devolución: figura entregada'
        : devolucionEnCamino(f)
          ? `  Devolución: ${estadoDeVuelta(f)}`
          : null,
    ]
      .filter((l): l is string => l !== null)
      .concat(enlaceDeVenta(f) ? [`  ${enlaceDeVenta(f)}`] : []);

  const bloques: Bloque[] = [];
  if (fallando) {
    bloques.push({
      titulo: 'Atención: no se pudo actualizar',
      lineas: [
        estado?.ok_at
          ? `La última actualización completa fue el ${fechaArgentina(estado.ok_at)}.`
          : 'No hay registro de ninguna actualización completa.',
        'Lo que sigue puede estar viejo: revisá los reclamos en Mercado Libre.',
        ...(estado?.detalle ? [`Detalle: ${estado.detalle}`] : []),
      ],
    });
  }
  for (const [titulo, lista] of [
    ['Te toca a vos', teToca],
    ['Abiertos, esperando a otros', resto],
    ['Devoluciones en camino', vuelven],
  ] as const) {
    if (lista.length === 0) continue;
    bloques.push({
      titulo: `${titulo} (${lista.length})`,
      lineas: [
        ...lista.slice(0, 20).flatMap(renglon),
        ...(lista.length > 20
          ? [`Y ${lista.length - 20} más: miralos en el sistema.`]
          : []),
      ],
    });
  }

  const cuenta = [
    abiertos.length > 0
      ? `${abiertos.length} ${abiertos.length === 1 ? 'reclamo abierto' : 'reclamos abiertos'}`
      : null,
    vuelven.length > 0
      ? `${vuelven.length} ${vuelven.length === 1 ? 'devolución en camino' : 'devoluciones en camino'}`
      : null,
  ]
    .filter(Boolean)
    .join(' y ');
  const asunto = fallando
    ? `no se pudo actualizar${cuenta ? ` (${cuenta})` : ''}`
    : cuenta;
  return armar(`[Mercado Libre] Resumen: ${asunto}`, bloques);
}
