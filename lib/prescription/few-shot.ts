/**
 * Few-shot examples descriptivos para `extract_prescription`.
 *
 * Diseño:
 * - Cada ejemplo = par user (texto descriptivo de receta) + assistant
 *   (tool_use con input correcto). No incluye imágenes — esos vienen como
 *   upgrade posterior cuando el founder anonimice recetas reales.
 * - La API exige `tool_result` después de cada `tool_use` en historial →
 *   incluimos un `tool_result` dummy entre ejemplos.
 * - Cubrimos 4 casos típicos AR:
 *     1. Receta digital limpia monofocal (caso fácil).
 *     2. Manuscrita con cilindro positivo (transposición necesaria).
 *     3. Bifocal con ADD (gateway a flow bifocal).
 *     4. Contactología con BC/DIA.
 *
 * Accuracy gain esperado: 5-10% sin imágenes (vs 20-30% con imágenes
 * anonimizadas — upgrade futuro).
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

/**
 * Ejemplo 1: digital limpia, miopía + astigmatismo bilateral, sin ADD.
 * Caso más común. El modelo debería pegarle al 100% con esto.
 */
const EXAMPLE_1_CLEAN: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): receta digital impresa, dos filas claras etiquetadas OD y OI. OD: -2.50 esf, -0.75 cil, eje 90°. OI: -2.25 esf, -1.00 cil, eje 85°. DNP 64mm. Sin adición. Firma + matrícula MN 12345. Fecha 15/03/2026.',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_1',
        name: 'extract_prescription',
        input: {
          isPrescription: true,
          prescriptionType: 'monofocal',
          od: {
            esf: -2.5,
            cil: -0.75,
            eje: 90,
            add: null,
            confidence: 'high',
          },
          oi: {
            esf: -2.25,
            cil: -1.0,
            eje: 85,
            add: null,
            confidence: 'high',
          },
          dnp: 64,
          expirationDate: '2026-03-15',
          rawTextExcerpt:
            'OD: -2.50 -0.75 x90 / OI: -2.25 -1.00 x85 / DNP 64 / 15/03/2026 / MN 12345',
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

/**
 * Ejemplo 2: manuscrita, cilindro POSITIVO (oftalmólogo viejo notation) →
 * tenemos que devolverlo como positivo y flagear partial_data porque la
 * convención AR es siempre negativo. El backend hace la transposición.
 */
const EXAMPLE_2_HANDWRITTEN_POS_CIL: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): receta manuscrita en talonario tradicional. Letra del oftalmólogo poco legible. OD: +1.50 esf, +0.50 cil (positivo, notación vieja), eje 180°. OI: +1.75 esf, +0.75 cil, eje 175°. DNP no aparece. ADD +2.00. Sin firma clara, pero sello del consultorio.',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_2',
        name: 'extract_prescription',
        input: {
          isPrescription: true,
          prescriptionType: 'bifocal',
          od: {
            esf: 1.5,
            cil: -0.5,
            eje: 180,
            add: 2.0,
            confidence: 'medium',
          },
          oi: {
            esf: 1.75,
            cil: -0.75,
            eje: 175,
            add: 2.0,
            confidence: 'medium',
          },
          dnp: null,
          expirationDate: null,
          rawTextExcerpt:
            'OD: +1.50 +0.50 x180 / OI: +1.75 +0.75 x175 / ADD +2.00',
          warningFlags: ['handwritten_unclear', 'partial_data', 'no_signature'],
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

/**
 * Ejemplo 3: contactología, valores BC/DIA típicos. Detectar
 * prescriptionType=contact_lens → consumer hace handoff a WhatsApp.
 */
const EXAMPLE_3_CONTACT_LENS: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): receta de lentes de contacto. OD: -3.00 esf, sin cil. OI: -3.25 esf, sin cil. BC 8.6. DIA 14.2. No hay DNP (no aplica en contactología). Texto "Lentes de contacto blandas, uso diario".',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_3',
        name: 'extract_prescription',
        input: {
          isPrescription: true,
          prescriptionType: 'contact_lens',
          od: {
            esf: -3.0,
            cil: null,
            eje: null,
            add: null,
            confidence: 'high',
          },
          oi: {
            esf: -3.25,
            cil: null,
            eje: null,
            add: null,
            confidence: 'high',
          },
          dnp: null,
          expirationDate: null,
          rawTextExcerpt:
            'OD: -3.00 / OI: -3.25 / BC 8.6 / DIA 14.2 / Lentes de contacto blandas',
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
        tool_use_id: 'toolu_example_3',
        content: 'ok',
      },
    ],
  },
];

/**
 * Ejemplo 4: imagen NO es una receta (paisaje, screenshot random). El
 * modelo debe igual llamar la tool con isPrescription=false en lugar de
 * inventar valores o devolver texto.
 */
const EXAMPLE_4_NOT_A_PRESCRIPTION: FewShotMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Ejemplo (sin imagen): imagen subida = foto de un gato durmiendo. No hay ningún texto de receta.',
      },
    ],
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'toolu_example_4',
        name: 'extract_prescription',
        input: {
          isPrescription: false,
          prescriptionType: 'unknown',
          od: {
            esf: null,
            cil: null,
            eje: null,
            add: null,
            confidence: 'low',
          },
          oi: {
            esf: null,
            cil: null,
            eje: null,
            add: null,
            confidence: 'low',
          },
          dnp: null,
          expirationDate: null,
          rawTextExcerpt: '',
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
        tool_use_id: 'toolu_example_4',
        content: 'ok',
      },
    ],
  },
];

/**
 * Few-shot completo en orden: limpia → manuscrita compleja → contactología
 * → no-receta. Se inyecta antes del mensaje user real (con la imagen).
 */
export const FEW_SHOT_MESSAGES: FewShotMessage[] = [
  ...EXAMPLE_1_CLEAN,
  ...EXAMPLE_2_HANDWRITTEN_POS_CIL,
  ...EXAMPLE_3_CONTACT_LENS,
  ...EXAMPLE_4_NOT_A_PRESCRIPTION,
];
