/**
 * Few-shot examples para `recommend_frames`.
 *
 * Diseño:
 * - 4 ejemplos descriptivos (sin imágenes) cubriendo casos típicos:
 *   1. Rostro ovalado claro (caso fácil + alta confidence).
 *   2. Rostro redondo con confidence media (foto OK pero no perfecta).
 *   3. Imagen con anteojos puestos → bajar confidence + warning flag.
 *   4. Imagen sin cara → faceShape=null + warning flag.
 *
 * La API exige `tool_result` después de cada `tool_use` en historial →
 * incluimos un `tool_result` dummy entre ejemplos.
 *
 * Accuracy gain esperado: +5-10% sin imágenes (vs +20-30% con imágenes
 * anonimizadas — upgrade futuro si tenemos consentimiento de modelos).
 */

type FewShotMessage =
  | { role: 'user'; content: Array<{ type: 'text'; text: string }> }
  | {
      role: 'assistant';
      content: Array<{
        type: 'tool_use';
        id: string;
        name: string;
        input: unknown;
      }>;
    }
  | {
      role: 'user';
      content: Array<{
        type: 'tool_result';
        tool_use_id: string;
        content: string;
      }>;
    };

/** Ejemplo 1: rostro ovalado claro — caso fácil para calibrar confidence alta. */
const EXAMPLE_1_OVAL_CLEAR: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): foto frontal de cara en buena luz, mirando al frente. Largo del rostro ~1.5x el ancho. Frente levemente más ancha que la mandíbula. Contornos suaves, sin ángulos marcados.',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_1',
        name: 'recommend_frames',
        input: {
          faceShape: 'ovalado',
          confidence: 0.92,
          recommendedFrameShapes: ['rectangular', 'cat_eye', 'aviador'],
          avoidFrameShapes: ['geometrico'],
          rationale:
            'Tu rostro es ovalado — una forma muy equilibrada que combina con casi cualquier marco. Las rectangulares o cat-eye realzan la armonía natural del óvalo.',
          warningFlags: [],
        },
      },
    ],
  },
  {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'toolu_example_1',
        content: 'ok',
      },
    ],
  },
];

/** Ejemplo 2: rostro redondo con confidence media — calibra zona gris. */
const EXAMPLE_2_ROUND_MEDIUM: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): foto frontal con iluminación lateral que crea sombras en uno de los pómulos. Cara ancha ≈ alta, mejillas redondeadas, sin ángulos marcados en mandíbula. La sombra reduce certeza de la medición.',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_2',
        name: 'recommend_frames',
        input: {
          faceShape: 'redondo',
          confidence: 0.72,
          recommendedFrameShapes: ['rectangular', 'cuadrado', 'wayfarer'],
          avoidFrameShapes: ['redondo', 'ovalado'],
          rationale:
            'Tu cara tiene forma redondeada. Marcos rectangulares o cuadrados aportan ángulos que estilizan los pómulos por contraste óptico.',
          warningFlags: ['poor_lighting'],
        },
      },
    ],
  },
  {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'toolu_example_2',
        content: 'ok',
      },
    ],
  },
];

/** Ejemplo 3: con anteojos puestos → bajar confidence + warning flag. */
const EXAMPLE_3_WEARING_GLASSES: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): foto frontal de cara con anteojos puestos. Los anteojos cubren parcialmente los pómulos y la línea ojos-frente. Imposible medir con precisión geometría facial completa.',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_3',
        name: 'recommend_frames',
        input: {
          faceShape: 'cuadrado',
          confidence: 0.45,
          recommendedFrameShapes: ['redondo', 'aviador'],
          avoidFrameShapes: ['cuadrado'],
          rationale:
            'Con los anteojos no se ven bien los pómulos. La estimación es preliminar — probá con una foto sin anteojos para mayor precisión.',
          warningFlags: ['wearing_glasses'],
        },
      },
    ],
  },
  {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'toolu_example_3',
        content: 'ok',
      },
    ],
  },
];

/** Ejemplo 4: no hay cara → faceShape=null + warning flag. */
const EXAMPLE_4_NO_FACE: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): foto de un paisaje (montañas, sin personas). No hay ningún rostro visible en la imagen.',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_4',
        name: 'recommend_frames',
        input: {
          faceShape: null,
          confidence: 0,
          recommendedFrameShapes: [],
          avoidFrameShapes: [],
          rationale:
            'No detectamos un rostro en la imagen. Subí una foto frontal con tu cara visible y bien iluminada.',
          warningFlags: ['no_face_detected'],
        },
      },
    ],
  },
  {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'toolu_example_4',
        content: 'ok',
      },
    ],
  },
];

/** Few-shot completo en orden: oval claro → redondo medio → con anteojos → no
 * hay cara. Se inyecta antes del mensaje user real (con la imagen). */
export const FEW_SHOT_MESSAGES: FewShotMessage[] = [
  ...EXAMPLE_1_OVAL_CLEAR,
  ...EXAMPLE_2_ROUND_MEDIUM,
  ...EXAMPLE_3_WEARING_GLASSES,
  ...EXAMPLE_4_NO_FACE,
];
