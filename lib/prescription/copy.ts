import type { InPersonReason, WarningFlag } from '@/lib/prescription/types';

/**
 * Disclaimer obligatorio antes del upload. Coherente con BUSINESS_POLICIES
 * + decisión previa de NO incluir matrícula al lado del output de IA.
 * Ley 25.326 (datos sensibles de salud) requiere consentimiento explícito
 * → checkbox obligatorio en el componente.
 */
export const UPLOAD_DISCLAIMER =
  'Vamos a leer tu receta con un asistente automático para autocompletar el formulario. Los datos extraídos son una transcripción, no un diagnóstico. Antes de armar tus anteojos, revisamos cada pedido. Tu receta se procesa de forma efímera y no se guarda en nuestros servidores.';

export const CONSENT_LABEL =
  'Acepto que se procese mi receta de forma automatizada para autocompletar el formulario.';

/** Tono del resultado tras extracción exitosa. */
export const RESULT_HEADLINE = 'Listo, leímos tu receta';
export const RESULT_SUBTITLE =
  'Revisá que los valores coincidan con tu receta original. Si algo no cuadra, editalo antes de continuar — la transcripción automática puede tener errores.';

export const FORM_DISCLAIMER =
  'Los valores son una transcripción automática y deben coincidir con tu receta original. Validamos tu pedido antes de armar las lentes.';

/** Texto cuando el modelo NO detectó receta válida. */
export const NOT_A_PRESCRIPTION_MESSAGE =
  'No detectamos una receta oftalmológica en la imagen. Probá con una foto de la receta de tu oftalmólogo o subí el PDF que te dieron.';

/** Mensajes por warning flag. */
export const WARNING_FLAG_MESSAGES: Record<WarningFlag, string> = {
  expired_date:
    'Tu receta tiene más de 1 año. Te recomendamos hacerte un control oftalmológico actualizado para asegurar la salud de tu visión.',
  low_resolution:
    'La foto tiene poca resolución. Si los valores no se ven bien, probá con una foto más nítida.',
  handwritten_unclear:
    'La receta tiene escritura manuscrita poco clara. Verificá cada valor con cuidado.',
  partial_data:
    'No pudimos leer todos los campos. Completá manualmente los que falten.',
  no_signature:
    'La receta no parece tener firma del oftalmólogo. Es necesaria para validar tu pedido.',
  no_matricula:
    'No detectamos número de matrícula del profesional. Es necesario para validar tu pedido.',
  multiple_pages_ignored:
    'La receta tiene varias páginas. Procesamos solo la primera — verificá que los datos estén completos.',
  suspicious_content:
    'La imagen tiene contenido que no podemos procesar. Subí una foto limpia de tu receta.',
};

/**
 * Razones por las que la receta requiere atención presencial — mostrar al
 * usuario con tono honesto y empático (no robótico).
 */
export const IN_PERSON_REASON_COPY: Record<
  InPersonReason,
  { title: string; body: string }
> = {
  has_add: {
    title: 'Tu receta es para anteojos multifocales o bifocales',
    body: 'Estos lentes requieren mediciones precisas que solo podemos tomar en persona (altura pupilar, postura natural, adaptación). Escribinos por WhatsApp y coordinamos tu visita.',
  },
  high_esf: {
    title: 'Tu graduación es elevada',
    body: 'Las graduaciones altas requieren mediciones precisas y materiales especiales (alto índice) para asegurar nitidez y calce correcto. Te atendemos de forma personalizada en la óptica.',
  },
  high_cil: {
    title: 'Tu astigmatismo es importante',
    body: 'Para astigmatismos elevados necesitamos control del eje preciso y verificación de adaptación, que se hacen en persona.',
  },
  high_sum: {
    title: 'Tu graduación requiere atención presencial',
    body: 'La suma de tu esfera y cilindro requiere mediciones precisas que solo podemos hacer en la óptica.',
  },
  anisometropia: {
    title: 'Hay diferencia importante entre tus ojos',
    body: 'Cuando la diferencia entre los dos ojos es significativa, el armado requiere ajustes especiales que hacemos en persona para evitar molestias visuales.',
  },
  contact_lens: {
    title: 'Tu receta es de lentes de contacto',
    body: 'Las recetas de contactos requieren adaptación inicial presencial. Escribinos por WhatsApp y coordinamos una consulta.',
  },
};

/**
 * Loading state messages — rotativos cada 2 segundos durante el análisis
 * (latencia esperada 5-9s con Sonnet 4.6 + PDF).
 */
export const LOADING_TIPS = [
  'Subiendo tu receta…',
  'Analizando con IA…',
  'Detectando OD y OI…',
  'Leyendo valores…',
  'Validando formato…',
  'Casi listo…',
];

/** Tips para mejorar foto de la receta (mostrar si confidence es low). */
export const PHOTO_TIPS = [
  'Foto plana sin sombras',
  'Buena luz natural',
  'Los 4 bordes de la receta visibles',
  'Sin reflejos sobre la receta',
];
