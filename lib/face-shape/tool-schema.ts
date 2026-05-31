import { FACE_SHAPES, FRAME_SHAPES, WARNING_FLAGS } from '@/lib/face-shape/types';

/**
 * JSONSchema de la tool `recommend_frames` para Anthropic Tool Use.
 *
 * Mismo pattern que `lib/prescription/tool-schema.ts` (Tier 1 lector receta):
 * tool use fuerza shape de output → elimina parsing regex frágil + Zod
 * valida server-side post tool_use por defense-in-depth.
 *
 * ⚠️ Compatibilidad con extended thinking: `tool_choice: { type: "tool", ... }`
 * (forzado) NO es compatible con thinking habilitado. Usar `tool_choice: "auto"`
 * + system prompt fuerte que indique "siempre llamás recommend_frames".
 *
 * Schema mantiene MISMOS field names que el Zod schema en `types.ts` (camelCase
 * inglés). No cambiar — el consumer (FaceShapeAnalyzer) espera ese shape.
 */
export const RECOMMEND_FRAMES_TOOL = {
  name: 'recommend_frames',
  description:
    'Analiza la forma facial visible en una foto y devuelve recomendaciones ' +
    'de armazones aplicando regla óptica de contraste. SIEMPRE se debe llamar ' +
    'a esta tool — nunca respondas texto libre. Si la imagen NO tiene cara ' +
    'visible o tiene problemas, igual llamá la tool con faceShape=null + ' +
    'warningFlags apropiados.',
  input_schema: {
    type: 'object' as const,
    properties: {
      faceShape: {
        type: ['string', 'null'],
        enum: [...FACE_SHAPES, null],
        description:
          'Forma facial detectada. null si no se puede clasificar (cara no visible, perfil, oclusión, etc).',
      },
      confidence: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description:
          'Confianza de la clasificación. 0-0.6 baja (mostrar disclaimer), 0.6-0.8 media, 0.8-1.0 alta.',
      },
      recommendedFrameShapes: {
        type: 'array',
        items: { type: 'string', enum: [...FRAME_SHAPES] },
        maxItems: 3,
        description:
          'Hasta 3 frame shapes recomendados según regla óptica de contraste. Valores canónicos del catálogo.',
      },
      avoidFrameShapes: {
        type: 'array',
        items: { type: 'string', enum: [...FRAME_SHAPES] },
        maxItems: 3,
        description:
          'Hasta 3 frame shapes a evitar (por contraste óptico inverso).',
      },
      rationale: {
        type: 'string',
        minLength: 1,
        maxLength: 400,
        description:
          'Explicación breve en español argentino (máx 400 chars) de por qué esas formas. Cálido y técnico-cercano. NO incluir disclaimer regulatorio (lo agrega el frontend).',
      },
      warningFlags: {
        type: 'array',
        items: { type: 'string', enum: [...WARNING_FLAGS] },
        description:
          'Array de flags detectados. Vacío si no aplica ninguno.',
      },
    },
    required: [
      'faceShape',
      'confidence',
      'recommendedFrameShapes',
      'avoidFrameShapes',
      'rationale',
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
