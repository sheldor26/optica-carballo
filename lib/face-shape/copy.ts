import type { FaceShape, FrameShape } from '@/lib/face-shape/types';

/**
 * Copy en español argentino para cada face shape. Tono cálido,
 * técnico-cercano, sin promesas absolutas. Input del agente
 * optical-expert. Cada bloque incluye:
 * - `label`: nombre user-facing
 * - `description`: 1-2 frases sobre la forma
 * - `traits`: lista corta de características visuales
 */
export const FACE_SHAPE_COPY: Record<
  FaceShape,
  { label: string; description: string; traits: string[] }
> = {
  ovalado: {
    label: 'Ovalado',
    description:
      'Una forma muy equilibrada, considerada ideal en óptica. Te permite usar casi cualquier tipo de armazón.',
    traits: [
      'Largo del rostro ~1.5x el ancho',
      'Frente levemente más ancha que la mandíbula',
      'Contornos suaves, sin ángulos marcados',
    ],
  },
  redondo: {
    label: 'Redondo',
    description:
      'Ancho y largo parecidos, mejillas anchas y contornos suaves. Los marcos angulares te van a sentar muy bien.',
    traits: [
      'Ancho ≈ largo del rostro',
      'Mejillas con curva amplia',
      'Mandíbula y mentón suaves, sin ángulos',
    ],
  },
  cuadrado: {
    label: 'Cuadrado',
    description:
      'Mandíbula firme y angulosa, frente recta y proporciones balanceadas. Los marcos curvos van a suavizar tus rasgos.',
    traits: [
      'Mandíbula angulosa y marcada',
      'Frente ancha y recta',
      'Ancho ≈ largo del rostro',
    ],
  },
  corazon: {
    label: 'Corazón',
    description:
      'Frente ancha que se afina hacia un mentón angosto. Los marcos con peso visual en la parte inferior equilibran muy bien.',
    traits: [
      'Frente ancha, pómulos marcados',
      'Mentón angosto y puntiagudo',
      'Distribución triangular invertida',
    ],
  },
  oblongo: {
    label: 'Oblongo (alargado)',
    description:
      'Rostro alargado con mejillas rectas y frente alta. Marcos altos o anchos van a balancear las proporciones.',
    traits: [
      'Largo del rostro notablemente mayor al ancho',
      'Mejillas rectas',
      'Frente alta',
    ],
  },
  diamante: {
    label: 'Diamante',
    description:
      'Pómulos como punto más ancho, con frente y mandíbula angostas. Marcos cat-eye u ovalados destacan tus rasgos.',
    traits: [
      'Pómulos como punto más ancho',
      'Frente y mandíbula angostas',
      'Contornos angulares',
    ],
  },
  triangular: {
    label: 'Triangular',
    description:
      'Mandíbula más ancha que la frente. Marcos con detalle o peso visual arriba equilibran muy bien.',
    traits: [
      'Mandíbula más ancha que la frente',
      'Distribución triangular base-ancha',
      'Pómulos definidos',
    ],
  },
};

export const FRAME_SHAPE_COPY: Record<FrameShape, string> = {
  rectangular: 'Rectangular',
  cuadrado: 'Cuadrado',
  redondo: 'Redondo',
  ovalado: 'Ovalado',
  aviador: 'Aviador',
  cat_eye: 'Cat-eye',
  mariposa: 'Mariposa',
  geometrico: 'Geométrico',
  wayfarer: 'Wayfarer',
  clubmaster: 'Clubmaster',
  sin_marco: 'Sin marco / rimless',
  envolvente: 'Envolvente',
};

/**
 * Cierre estándar para todos los resultados — refuerza que la sugerencia
 * es orientativa y empuja a la prueba física / handoff.
 */
export const STANDARD_CLOSING =
  'Esto es una sugerencia estética orientativa. La prueba final es ponértelo: si vivís cerca de la óptica, pasá a probártelos; si estás lejos, te lo mandamos a probar.';

/**
 * Disclaimer del análisis. Lo mostramos debajo del resultado.
 *
 * Decisión (founder): NO incluir número de matrícula. Razones:
 * 1. Mostrar matrícula al lado del output de IA da impresión de que
 *    la óptica matriculada AVALA esa recomendación específica, cuando
 *    en realidad la matriculada NO revisa cada análisis del modelo.
 * 2. La protección legal real viene del lenguaje "orientativo / no
 *    reemplaza consulta profesional", no del número.
 * 3. En el resto del sitio no mostramos número de matrícula — sería
 *    inconsistente solo acá.
 */
export const ANALYSIS_DISCLAIMER =
  'Esta sugerencia es una orientación estética general basada en análisis automatizado de tu foto. No reemplaza la prueba física del armazón ni la consulta con un profesional de la óptica. El calce final depende de medidas faciales precisas (DNP, ancho de puente, ancho temporal) que solo se confirman presencialmente o con tu receta.';

/**
 * Texto cuando el modelo no pudo determinar la forma con confianza
 * suficiente (confidence < LOW threshold o faceShape null).
 */
export const LOW_CONFIDENCE_MESSAGE =
  'No pudimos determinar con seguridad la forma de tu rostro. Probá con una foto frontal, buena luz y sin anteojos. O escribinos por WhatsApp y te ayudamos personalmente.';

/**
 * Mensajes por warning flag. Se muestran como tips al usuario para
 * que reintente con mejor foto.
 */
export const WARNING_FLAG_MESSAGES: Record<string, string> = {
  no_face_detected:
    'No detectamos una cara clara en la foto. Probá con una selfie frontal con buena luz.',
  multiple_faces:
    'Detectamos más de una cara. Subí una foto donde aparezcas vos sola/o.',
  wearing_glasses:
    'Estás usando anteojos en la foto. Probá sacándotelos para que podamos analizar tu rostro.',
  wearing_sunglasses:
    'Tenés anteojos de sol puestos. Quitátelos para una foto más precisa.',
  poor_lighting:
    'La iluminación de la foto es muy baja o desigual. Probá con luz natural frontal.',
  profile_view:
    'La foto está de perfil. Necesitamos una vista frontal para analizar bien la simetría.',
  face_too_small:
    'Tu rostro aparece muy chico en la foto. Acercate o usá una foto más nítida.',
  face_obscured:
    'Hay elementos cubriendo parte de tu rostro (pelo, mano, barbijo). Probá con una foto más despejada.',
  suspicious_content:
    'La imagen tiene contenido que no podemos procesar. Subí una foto frontal limpia.',
};
