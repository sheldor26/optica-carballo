/**
 * Detección de las partes del armazón dentro de una foto.
 *
 * Las flechas de los callouts tienen que salir del lugar del que hablan: la
 * de "bisagras" tiene que apuntar a una bisagra, no a un punto fijo del
 * cuadro. Como cada foto tiene su encuadre y su pose (perfil, tres cuartos,
 * frente), las posiciones no se pueden hardcodear: se detectan.
 *
 * Se le pasa a Claude Vision el recorte del armazón —no la foto original—,
 * así las coordenadas que devuelve son directamente fracciones del
 * rectángulo que ocupa el armazón en la placa.
 */

import sharp from 'sharp';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
/**
 * Sonnet, no Haiku: localizar partes chicas (una bisagra) dentro de una foto
 * apaisada exige precisión espacial, y Haiku devolvía todos los puntos
 * corridos hacia arriba. Es una llamada por producto, así que el costo extra
 * no mueve la aguja.
 */
const MODEL_ID = 'claude-sonnet-5';

/** Cada parte que sabemos señalar, con su lado cuando corresponde. */
export type NombreParte =
  | 'bisagra_izquierda'
  | 'bisagra_derecha'
  | 'patilla_izquierda'
  | 'patilla_derecha'
  | 'lente_izquierdo'
  | 'lente_derecho'
  | 'puente'
  | 'frente_izquierdo'
  | 'frente_derecho';

/** Punto en fracciones del recorte: 0,0 arriba-izquierda; 1,1 abajo-derecha. */
export type Punto = { fx: number; fy: number };

export type Partes = Partial<Record<NombreParte, Punto>>;

const PROPIEDAD_PUNTO = {
  type: 'object' as const,
  properties: {
    x: { type: 'integer', description: 'Coordenada X en PORCENTAJE de la grilla, de 0 a 100.' },
    y: { type: 'integer', description: 'Coordenada Y en PORCENTAJE de la grilla, de 0 a 100.' },
    visible: {
      type: 'boolean',
      description: 'false si esa parte no se ve en esta foto (tapada, fuera de cuadro o de perfil).',
    },
  },
  required: ['x', 'y', 'visible'],
  additionalProperties: false,
};

const DETECT_PARTES_TOOL = {
  name: 'report_eyewear_parts',
  description:
    'Devuelve la posición en pixels de cada parte del anteojo visible en la imagen. Si una parte no se ve (por la pose, porque está tapada o porque queda fuera de cuadro), marcala con visible=false. Las coordenadas son del punto donde una flecha debería tocar esa parte, sobre el material del armazón, no en el aire.',
  input_schema: {
    type: 'object' as const,
    properties: {
      bisagra_izquierda: {
        ...PROPIEDAD_PUNTO,
        description:
          'Bisagra del lado IZQUIERDO de la imagen: la articulación metálica donde la patilla se une al frente. En una foto de tres cuartos suele ser el punto donde la varilla se dobla hacia atrás.',
      },
      bisagra_derecha: {
        ...PROPIEDAD_PUNTO,
        description: 'Bisagra del lado DERECHO de la imagen. Misma definición que la izquierda.',
      },
      patilla_izquierda: {
        ...PROPIEDAD_PUNTO,
        description:
          'Punto medio de la varilla o patilla del lado IZQUIERDO, sobre la parte recta, lejos de la bisagra.',
      },
      patilla_derecha: {
        ...PROPIEDAD_PUNTO,
        description: 'Punto medio de la varilla o patilla del lado DERECHO.',
      },
      lente_izquierdo: {
        type: 'object' as const,
        properties: {
          x: { type: 'integer', description: 'Borde izquierdo del cristal, en % de la grilla (0-100).' },
          y: { type: 'integer', description: 'Borde superior del cristal, en % de la grilla (0-100).' },
          width: { type: 'integer', description: 'Ancho del cristal, en % de la grilla.' },
          height: { type: 'integer', description: 'Alto del cristal, en % de la grilla.' },
          visible: { type: 'boolean' },
        },
        required: ['x', 'y', 'width', 'height', 'visible'],
        additionalProperties: false,
        description:
          'Recuadro que ocupa el CRISTAL del lado IZQUIERDO (sólo el vidrio, sin el marco que lo rodea).',
      },
      lente_derecho: {
        type: 'object' as const,
        properties: {
          x: { type: 'integer', description: 'Borde izquierdo del cristal, en % de la grilla (0-100).' },
          y: { type: 'integer', description: 'Borde superior del cristal, en % de la grilla (0-100).' },
          width: { type: 'integer', description: 'Ancho del cristal, en % de la grilla.' },
          height: { type: 'integer', description: 'Alto del cristal, en % de la grilla.' },
          visible: { type: 'boolean' },
        },
        required: ['x', 'y', 'width', 'height', 'visible'],
        additionalProperties: false,
        description:
          'Recuadro que ocupa el CRISTAL del lado DERECHO (sólo el vidrio, sin el marco que lo rodea).',
      },
      puente: {
        ...PROPIEDAD_PUNTO,
        description: 'Puente: la pieza que une los dos aros por encima de la nariz.',
      },
      frente_izquierdo: {
        ...PROPIEDAD_PUNTO,
        description:
          'Un punto sobre el MATERIAL del marco del lado IZQUIERDO, en el borde de abajo del aro, JUSTO POR DEBAJO del cristal. Tiene que caer sobre el plástico o metal del armazón, NUNCA sobre el cristal.',
      },
      frente_derecho: {
        ...PROPIEDAD_PUNTO,
        description:
          'Un punto sobre el MATERIAL del marco del lado DERECHO, en el borde de abajo del aro, JUSTO POR DEBAJO del cristal. Tiene que caer sobre el plástico o metal del armazón, NUNCA sobre el cristal.',
      },
    },
    required: [
      'bisagra_izquierda',
      'bisagra_derecha',
      'patilla_izquierda',
      'patilla_derecha',
      'lente_izquierdo',
      'lente_derecho',
      'puente',
      'frente_izquierdo',
      'frente_derecho',
    ],
    additionalProperties: false,
  },
} as const;

type PuntoCrudo = { x: number; y: number; visible: boolean };
type CajaCruda = { x: number; y: number; width: number; height: number; visible: boolean };
type RespuestaPartes = Record<string, PuntoCrudo | CajaCruda>;

const ES_CAJA = (v: PuntoCrudo | CajaCruda): v is CajaCruda =>
  typeof (v as CajaCruda).width === 'number' && typeof (v as CajaCruda).height === 'number';

type AnthropicBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: RespuestaPartes };

/**
 * Detecta las partes sobre el recorte del armazón. Devuelve `{}` si no hay
 * API key: en ese caso el generador cae a las posiciones por defecto.
 */
export async function detectarPartes(recorte: Buffer): Promise<Partes> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('  ⚠️ sin ANTHROPIC_API_KEY: las flechas van a las posiciones por defecto.');
    return {};
  }

  const meta = await sharp(recorte).metadata();
  const width = meta.width;
  const height = meta.height;
  if (!width || !height) return {};

  // Andamiaje visual: se le manda la foto con una grilla de porcentajes
  // encima. Con una referencia dibujada el modelo ancla mucho mejor que
  // estimando pixels sobre una imagen apaisada.
  const jpeg = await sharp(await conGrilla(recorte, width, height))
    .jpeg({ quality: 88 })
    .toBuffer();

  const pedir = async (forzarTool: boolean) =>
    fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_ID,
      max_tokens: 1500,
      tools: [DETECT_PARTES_TOOL],
      // Primero `auto`, para que describa la pose antes de ubicar: eso sube
      // la precisión. Pero a veces se queda en la descripción y no llama a la
      // tool, así que el reintento la fuerza.
      tool_choice: forzarTool
        ? { type: 'tool', name: 'report_eyewear_parts' }
        : { type: 'auto' },
      system:
        'Sos un detector de partes de anteojos para una óptica. Recibís la foto de un anteojo recortada al ras del producto. Devolvés, llamando a la tool, dónde está cada parte en pixels. Sé preciso: el punto tiene que caer SOBRE la parte, no cerca. Si una parte no se ve en esta pose, marcala visible=false en vez de inventar una posición.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: jpeg.toString('base64') },
            },
            {
              type: 'text',
              text: [
                'La imagen tiene dibujada una grilla de referencia: las líneas verticales y horizontales están cada 10%, con su número marcado en los bordes.',
                '',
                'Antes de llamar a la tool, describí en una o dos oraciones la pose del anteojo: si está de frente, de perfil o de tres cuartos, hacia qué lado apunta, y qué partes quedan ocultas.',
                '',
                'Después llamá a la tool con las coordenadas de cada parte EN PORCENTAJE de la grilla (0 a 100), no en pixels: x=0 es el borde izquierdo, x=100 el derecho, y=0 el borde de arriba, y=100 el de abajo.',
                '',
                '"Izquierda" y "derecha" son respecto de la imagen tal como se ve, no del que usa el anteojo.',
              ].join('\n'),
            },
          ],
        },
      ],
    }),
  });

  const buscarTool = (data: { content: AnthropicBlock[] }) =>
    data.content.find(
      (b): b is Extract<AnthropicBlock, { type: 'tool_use' }> =>
        b.type === 'tool_use' && b.name === 'report_eyewear_parts',
    );

  let bloque: ReturnType<typeof buscarTool>;
  for (const forzar of [false, true]) {
    const response = await pedir(forzar);
    if (!response.ok) {
      console.warn(`  ⚠️ Vision ${response.status} al detectar partes${forzar ? '' : ', reintento forzando la detección'}.`);
      continue;
    }
    const data = (await response.json()) as { content: AnthropicBlock[] };
    bloque = buscarTool(data);
    if (bloque) break;
    if (!forzar) console.log('  · el modelo describió la pose sin ubicar las partes, reintento forzando.');
  }

  if (!bloque) {
    console.warn('  ⚠️ no pude detectar las partes: las flechas van a las posiciones por defecto.');
    return {};
  }

  const partes: Partes = {};
  const cristales: Array<{ x0: number; y0: number; x1: number; y1: number }> = [];

  for (const [nombre, valor] of Object.entries(bloque.input)) {
    if (!valor?.visible) continue;

    if (ES_CAJA(valor)) {
      const x0 = valor.x / 100;
      const y0 = valor.y / 100;
      const x1 = (valor.x + valor.width) / 100;
      const y1 = (valor.y + valor.height) / 100;
      if (x1 <= x0 || y1 <= y0) continue;
      cristales.push({ x0, y0, x1, y1 });
      partes[nombre as NombreParte] = { fx: (x0 + x1) / 2, fy: (y0 + y1) / 2 };
      continue;
    }

    const fx = valor.x / 100;
    const fy = valor.y / 100;
    // Descartar lo que caiga fuera del recorte: es una alucinación de coordenadas.
    if (fx < 0 || fx > 1 || fy < 0 || fy > 1) continue;
    partes[nombre as NombreParte] = { fx, fy };
  }

  // El marco no puede quedar sobre el cristal: si el modelo lo puso adentro
  // del vidrio, se lo baja al borde de abajo del aro, que es material.
  for (const lado of ['frente_izquierdo', 'frente_derecho'] as const) {
    const p = partes[lado];
    if (!p) continue;
    const encima = cristales.find(
      (c) => p.fx >= c.x0 && p.fx <= c.x1 && p.fy >= c.y0 && p.fy <= c.y1,
    );
    if (encima) {
      partes[lado] = {
        fx: p.fx,
        fy: Math.min(0.97, encima.y1 + (encima.y1 - encima.y0) * 0.12),
      };
    }
  }

  return partes;
}

/** Qué parte busca cada callout, deducida de lo que dice su título. */
export function parteSegunTexto(titulo: string, subtitulo?: string): NombreParte | 'auto' {
  const texto = `${titulo} ${subtitulo ?? ''}`.toLowerCase();
  if (/bisagra|charnela|flex/.test(texto)) return 'bisagra_izquierda';
  if (/patilla|varilla|temple/.test(texto)) return 'patilla_izquierda';
  if (/lente|cristal|espejad|polariz|uv|filtro/.test(texto)) return 'lente_izquierdo';
  if (/puente|nariz|plaqueta/.test(texto)) return 'puente';
  // Ojo: "armazón" no entra acá. Es el conjunto, no una parte: si un callout
  // dice "armazón liviano" conviene que la flecha vaya a la patilla o a la
  // bisagra, no al marco del aro, que ya es de quien habla "frente".
  if (/frente|marco|color|mate|acetato|carey|material/.test(texto)) return 'frente_izquierdo';
  return 'auto';
}

/**
 * Elige el punto concreto al que apunta un callout.
 *
 * Para las partes que existen de a pares se toma la del lado de la burbuja:
 * la flecha de "bisagras" sale de la bisagra más cercana, no cruza la foto
 * para ir a buscar la del otro lado. Si ese lado no se ve, usa el otro.
 */
export function resolverAncla(
  parte: NombreParte | 'auto',
  partes: Partes,
  esquina: 'tl' | 'tr' | 'bl' | 'br',
  porDefecto: Punto,
): Punto {
  if (parte === 'auto') return elegirAuto(partes, esquina, porDefecto);

  const izquierda = esquina === 'tl' || esquina === 'bl';
  const contraparte: Partial<Record<NombreParte, NombreParte>> = {
    bisagra_izquierda: 'bisagra_derecha',
    bisagra_derecha: 'bisagra_izquierda',
    patilla_izquierda: 'patilla_derecha',
    patilla_derecha: 'patilla_izquierda',
    lente_izquierdo: 'lente_derecho',
    lente_derecho: 'lente_izquierdo',
    frente_izquierdo: 'frente_derecho',
    frente_derecho: 'frente_izquierdo',
  };

  // El nombre que trae `parteSegunTexto` es siempre el del lado izquierdo:
  // acá se decide el lado real según de qué esquina sale la flecha.
  const preferida = izquierda ? parte : (contraparte[parte] ?? parte);
  const alternativa = contraparte[preferida];

  const candidatas = [preferida, alternativa].filter(Boolean) as NombreParte[];
  const visibles = candidatas.map((n) => partes[n]).filter((p): p is Punto => Boolean(p));
  if (visibles.length === 0) return porDefecto;
  if (visibles.length === 1) return visibles[0]!;

  // Con las dos visibles, gana la más cercana a la esquina de la burbuja.
  const origen = { fx: izquierda ? 0 : 1, fy: esquina === 'tl' || esquina === 'tr' ? 0 : 1 };
  return visibles.reduce((mejor, p) =>
    distancia(p, origen) < distancia(mejor, origen) ? p : mejor,
  );
}

function distancia(a: Punto, b: Punto): number {
  return Math.hypot(a.fx - b.fx, a.fy - b.fy);
}

/**
 * Para un callout sin parte explícita ("cómodos", "liviano"): el punto
 * estructural visible más cercano a su esquina.
 *
 * Se excluyen los cristales y el puente: un claim genérico apuntando al
 * lente hace pensar que habla del lente. Las partes que sí sirven para un
 * claim de confort o construcción son la patilla, la bisagra y el marco.
 */
function elegirAuto(partes: Partes, esquina: 'tl' | 'tr' | 'bl' | 'br', porDefecto: Punto): Punto {
  const izquierda = esquina === 'tl' || esquina === 'bl';
  const arriba = esquina === 'tl' || esquina === 'tr';
  const origen = { fx: izquierda ? 0 : 1, fy: arriba ? 0 : 1 };

  // Orden de preferencia, no de cercanía: un claim de confort se entiende
  // apuntando a la patilla, que es lo que el usuario apoya en la cabeza.
  const estructurales: NombreParte[] = izquierda
    ? ['patilla_izquierda', 'bisagra_izquierda', 'frente_izquierdo']
    : ['patilla_derecha', 'bisagra_derecha', 'frente_derecho'];

  for (const nombre of estructurales) {
    const punto = partes[nombre];
    if (punto) return punto;
  }

  // Nada estructural visible de ese lado: lo más cercano que haya.
  const resto = Object.values(partes);
  if (resto.length === 0) return porDefecto;
  return resto.reduce((mejor, p) => (distancia(p, origen) < distancia(mejor, origen) ? p : mejor));
}

/** Superpone una grilla de porcentajes sobre el recorte, como referencia visual. */
async function conGrilla(recorte: Buffer, width: number, height: number): Promise<Buffer> {
  const paso = 10;
  const fuente = Math.max(11, Math.round(Math.min(width, height) * 0.045));
  let lineas = '';

  for (let p = paso; p < 100; p += paso) {
    const x = (width * p) / 100;
    const y = (height * p) / 100;
    const fuerte = p === 50;
    const trazo = fuerte ? 2 : 1;
    const opacidad = fuerte ? 0.55 : 0.3;
    lineas += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#FF0000" stroke-width="${trazo}" opacity="${opacidad}"/>`;
    lineas += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#0000FF" stroke-width="${trazo}" opacity="${opacidad}"/>`;
    lineas += `<text x="${x + 2}" y="${fuente}" font-family="Manrope" font-size="${fuente}" fill="#FF0000">${p}</text>`;
    lineas += `<text x="2" y="${y - 2}" font-family="Manrope" font-size="${fuente}" fill="#0000FF">${p}</text>`;
  }

  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${lineas}</svg>`,
  );

  return sharp(recorte)
    .flatten({ background: '#ffffff' })
    .composite([{ input: svg, left: 0, top: 0 }])
    .png()
    .toBuffer();
}
