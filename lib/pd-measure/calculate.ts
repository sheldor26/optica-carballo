import {
  CARD_ISO_WIDTH_MM,
  DNP_RANGES,
  WARNING_FLAGS,
  type PDResult,
  type PDVisionOutput,
  type WarningFlag,
} from './types';

/**
 * Pure arithmetic. Recibe el output del modelo Vision (en pixels) y
 * calcula la DNP en mm via regla de tres con el ancho ISO/IEC 7810 de
 * la tarjeta. Aplica validaciones de plausibilidad y warnings.
 *
 * NO logguea contenido — biométrico sensible (LPDP 25.326).
 */
export function calculatePD(vision: PDVisionOutput): PDResult {
  // Errores estructurales — sin coords, no podemos calcular.
  if (
    !vision.is_valid_input ||
    !vision.pupil_left_px ||
    !vision.pupil_right_px ||
    !vision.nasal_bridge_px ||
    !vision.card_width_px ||
    vision.card_width_px <= 0
  ) {
    return {
      ok: false,
      error: errorMessageFromWarnings(vision.warnings),
      warnings: vision.warnings,
    };
  }

  // Hard fails: setup incorrecto que invalida la medición.
  const blockingFlags: WarningFlag[] = [
    'glasses_detected',
    'card_not_detected',
    'card_not_at_eye_level',
    'multiple_faces',
    'suspicious_content',
    'eyes_closed_or_squinted',
  ];
  const blocking = vision.warnings.filter((w) => blockingFlags.includes(w));
  if (blocking.length > 0) {
    return {
      ok: false,
      error: errorMessageFromWarnings(blocking),
      warnings: blocking,
    };
  }

  // Soft fails con threshold: rechazar fuera de rango.
  if (Math.abs(vision.face_yaw_deg) > 10 || Math.abs(vision.face_pitch_deg) > 10) {
    return {
      ok: false,
      error:
        'Tu cara no está completamente de frente a la cámara. Reintentá mirando directo al lente.',
      warnings: ['face_not_frontal'],
    };
  }
  if (Math.abs(vision.card_tilt_deg) > 5) {
    return {
      ok: false,
      error: 'La tarjeta está inclinada. Apoyala recta contra los pómulos.',
      warnings: ['card_tilted'],
    };
  }

  // Cálculo principal.
  const px_per_mm = vision.card_width_px / CARD_ISO_WIDTH_MM;

  const dist_pupilas_px = Math.hypot(
    vision.pupil_right_px.x - vision.pupil_left_px.x,
    vision.pupil_right_px.y - vision.pupil_left_px.y,
  );
  const dnp_total_mm = dist_pupilas_px / px_per_mm;

  const dist_nasal_to_right_px = Math.hypot(
    vision.nasal_bridge_px.x - vision.pupil_right_px.x,
    vision.nasal_bridge_px.y - vision.pupil_right_px.y,
  );
  const dist_nasal_to_left_px = Math.hypot(
    vision.nasal_bridge_px.x - vision.pupil_left_px.x,
    vision.nasal_bridge_px.y - vision.pupil_left_px.y,
  );
  const dnp_od_mm = dist_nasal_to_right_px / px_per_mm;
  const dnp_oi_mm = dist_nasal_to_left_px / px_per_mm;
  const asymmetry_mm = Math.abs(dnp_od_mm - dnp_oi_mm);

  // Rangos de plausibilidad (optical-expert).
  if (dnp_total_mm < DNP_RANGES.HARD_MIN || dnp_total_mm > DNP_RANGES.HARD_MAX) {
    return {
      ok: false,
      error: `La medición dio un valor implausible (${dnp_total_mm.toFixed(1)}mm). Probablemente la tarjeta no se detectó bien. Reintentá con mejor luz.`,
      warnings: [],
    };
  }

  // Soft warnings — la medición se devuelve pero con confidence menor.
  const softWarnings: string[] = [];
  let confidence: 'high' | 'medium' | 'low' = 'high';

  if (dnp_total_mm < DNP_RANGES.SOFT_MIN || dnp_total_mm > DNP_RANGES.SOFT_MAX) {
    softWarnings.push(
      `Tu DNP ${dnp_total_mm.toFixed(1)}mm está fuera del rango típico (54-74mm). La regente verificará al armar.`,
    );
    confidence = 'medium';
  }
  if (asymmetry_mm > 2) {
    softWarnings.push(
      `Asimetría detectada (${asymmetry_mm.toFixed(1)}mm). Es normal pero la regente puede confirmar presencialmente.`,
    );
    confidence = confidence === 'high' ? 'medium' : confidence;
  }
  if (vision.lighting_quality === 'medium') {
    confidence = confidence === 'high' ? 'medium' : confidence;
  } else if (vision.lighting_quality === 'poor') {
    confidence = 'low';
    softWarnings.push(
      'La iluminación de la foto no fue ideal. Probá reintentar con luz natural frontal.',
    );
  }

  return {
    ok: true,
    dnp_total_mm: round1(dnp_total_mm),
    dnp_od_mm: round1(dnp_od_mm),
    dnp_oi_mm: round1(dnp_oi_mm),
    asymmetry_mm: round1(asymmetry_mm),
    confidence,
    soft_warnings: softWarnings,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

const WARNING_MESSAGES: Record<WarningFlag, string> = {
  face_not_frontal:
    'Tu cara no está completamente de frente a la cámara. Reintentá mirando directo al lente.',
  eyes_closed_or_squinted:
    'No detectamos tus pupilas con claridad. Reintentá con los ojos bien abiertos.',
  glasses_detected:
    'Tenés anteojos puestos en la foto. Sacátelos para que podamos detectar tus pupilas reales.',
  card_not_detected:
    'No detectamos la tarjeta de referencia. Apoyala contra los pómulos, recta y bien visible.',
  card_tilted:
    'La tarjeta está inclinada. Apoyala recta contra los pómulos.',
  card_not_at_eye_level:
    'La tarjeta tiene que estar a la altura de los pómulos, no en la frente. Si no, la medición es imprecisa.',
  poor_lighting:
    'La iluminación de la foto es muy baja. Probá con luz natural frontal.',
  image_too_blurry:
    'La foto está borrosa. Apoyá el celular en algo fijo y reintentá.',
  suspicious_content:
    'La imagen no parece una foto frontal de una cara con tarjeta de referencia. Probá de nuevo.',
  multiple_faces:
    'Detectamos más de una cara. Subí una foto donde aparezcas vos sola/o.',
};

function errorMessageFromWarnings(warnings: WarningFlag[]): string {
  if (warnings.length === 0) {
    return 'No pudimos medir tu DNP con esta foto. Probá de nuevo.';
  }
  // Mostramos el primer warning bloqueante con copy específico.
  const first = warnings[0]!;
  return WARNING_MESSAGES[first] ?? 'No pudimos medir tu DNP con esta foto. Probá de nuevo.';
}

// Re-export para tests / consumers.
export { WARNING_FLAGS };
