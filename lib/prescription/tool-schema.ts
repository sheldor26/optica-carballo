/**
 * JSONSchema de la tool `extract_prescription` para Anthropic Tool Use.
 *
 * Decisiones de diseño:
 * 1. Keys EN ESPAÑOL (esf/cil/eje/add/dnp) — matchean exactamente el Zod
 *    schema en `types.ts` y el consumer (`prescription-reader.tsx`). Cambiar
 *    a inglés implicaría una transformación intermedia + tocar consumer.
 *
 * 2. Validación final igual la hace `PrescriptionAnalysisSchema` (Zod) antes
 *    de devolver al cliente. Tool use fuerza shape, Zod fuerza rangos y tipos
 *    finos (cilindro siempre ≤ 0, eje 1-180, etc).
 *
 * 3. `tool_choice: "auto"` (no forced) — restricción API: tool_choice forzado
 *    NO compatible con extended thinking habilitado. El system prompt fuerza
 *    el comportamiento via texto.
 *
 * 4. Schema se mantiene en sync con `PrescriptionAnalysisSchema` (Zod) —
 *    si Zod cambia, este schema también. Considerar generador automático si
 *    diverge a futuro.
 */

import { PRESCRIPTION_TYPES, WARNING_FLAGS } from '@/lib/prescription/types';

/**
 * JSONSchema input de la tool. El modelo llama `extract_prescription({...})`
 * con este shape. Después de la llamada, validamos server-side con Zod por
 * defense-in-depth (rangos, signos, enums).
 */
export const EXTRACT_PRESCRIPTION_TOOL = {
  name: 'extract_prescription',
  description:
    'Extrae los datos estructurados de una receta oftalmológica argentina ' +
    '(o de lentes de contacto). Siempre se debe llamar a esta tool — nunca ' +
    'respondas texto libre. Si la imagen no es una receta, igual llamá la ' +
    'tool con isPrescription=false y demás campos null/vacíos.',
  input_schema: {
    type: 'object' as const,
    properties: {
      isPrescription: {
        type: 'boolean',
        description:
          'true si la imagen/PDF es una receta oftalmológica válida; false ' +
          'si es otra cosa (paisaje, screenshot random, foto irrelevante).',
      },
      prescriptionType: {
        type: 'string',
        enum: [...PRESCRIPTION_TYPES],
        description:
          'monofocal = solo ESF/CIL/EJE sin ADD. bifocal/multifocal = con ADD. ' +
          'contact_lens = aparece BC/DIA o texto explícito de contactología. ' +
          'unknown = receta válida pero tipo ambiguo.',
      },
      od: {
        type: 'object',
        description: 'Ojo derecho (Derecho / Der / R / RE).',
        properties: {
          esf: {
            type: ['number', 'null'],
            description:
              'Esfera con signo explícito. -25.00 a +25.00. "plano" / "esf." = 0. null si no visible.',
          },
          cil: {
            type: ['number', 'null'],
            description:
              'Cilindro. SIEMPRE negativo en convención AR. -8.00 a 0.00. null si no hay astigmatismo.',
          },
          eje: {
            type: ['integer', 'null'],
            description:
              'Eje en grados enteros 1-180. null si no hay cilindro o no se ve.',
          },
          add: {
            type: ['number', 'null'],
            description:
              'Adición SIEMPRE positiva +0.75 a +3.50. null = sin adición (monofocal).',
          },
          confidence: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
            description:
              'high = leíste claramente. medium = manuscrita o contraste flojo. low = adivinando, cliente debe verificar.',
          },
        },
        required: ['esf', 'cil', 'eje', 'add', 'confidence'],
        additionalProperties: false,
      },
      oi: {
        type: 'object',
        description: 'Ojo izquierdo (Izquierdo / Izq / L / LE / OS).',
        properties: {
          esf: { type: ['number', 'null'] },
          cil: { type: ['number', 'null'] },
          eje: { type: ['integer', 'null'] },
          add: { type: ['number', 'null'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['esf', 'cil', 'eje', 'add', 'confidence'],
        additionalProperties: false,
      },
      dnp: {
        type: ['number', 'null'],
        description:
          'Distancia pupilar total en mm (DNP/DP/PD). 40-80mm. Si aparece ' +
          'por ojo, sumar. null si no visible.',
      },
      expirationDate: {
        type: ['string', 'null'],
        description:
          'Fecha de emisión en ISO 8601 (YYYY-MM-DD). null si no se ve.',
      },
      rawTextExcerpt: {
        type: 'string',
        description:
          'Excerpt de texto crudo de la receta (max 500 chars). Útil para ' +
          'debug y handoff a WhatsApp si extracción falló.',
        maxLength: 500,
      },
      warningFlags: {
        type: 'array',
        items: { type: 'string', enum: [...WARNING_FLAGS] },
        description: 'Array de flags detectados. Vacío si no aplica ninguno.',
      },
    },
    required: [
      'isPrescription',
      'prescriptionType',
      'od',
      'oi',
      'dnp',
      'expirationDate',
      'rawTextExcerpt',
      'warningFlags',
    ],
    additionalProperties: false,
  },
} as const;

export type AnthropicContentBlock =
  | { type: 'thinking'; thinking: string }
  | { type: 'redacted_thinking'; data: string }
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: unknown };

export type AnthropicMessageResponse = {
  content: AnthropicContentBlock[];
  stop_reason: string;
};
