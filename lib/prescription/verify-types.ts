import { z } from 'zod';

/**
 * Schema del veredicto del verificador adversarial (Tier 2). Validado con
 * Zod tanto en backend (output del modelo verificador) como en el merge
 * con el JSON original.
 */
export const VerifyVerdictSchema = z.object({
  isReliable: z.boolean(),
  issues: z.array(z.string()).max(10),
  suggestedCorrections: z.record(z.string(), z.unknown()).optional(),
  confidenceAdjustment: z.enum(['keep', 'lower', 'raise']),
});

export type VerifyVerdict = z.infer<typeof VerifyVerdictSchema>;

/**
 * Mapping de issues internos a copy human-readable para mostrar en UI
 * (si decidimos exponer flags del verificador al usuario en el futuro).
 * Por ahora solo se usa para logging.
 */
export const VERIFY_ISSUE_COPY: Record<string, string> = {
  eje_idéntico_sospechoso:
    'Mismo eje exacto en ambos ojos — verificar manualmente',
  add_sin_tipo_correcto:
    'Adición presente pero el tipo declarado es monofocal',
  tipo_bifocal_sin_add:
    'Tipo bifocal/multifocal pero falta el valor de adición',
  add_asimetrica_OD_OI:
    'Adición distinta entre OD y OI — atípico clínicamente',
  anisometropia_extrema_verificar:
    'Anisometropía extrema (>4.00 dpt) — verificar manualmente',
  cilindro_positivo_no_transpuesto:
    'Cilindro positivo detectado — convención AR es negativo',
  valor_fuera_rango: 'Valor fuera de rango clínico físicamente posible',
  cil_o_eje_huerfano: 'CIL sin EJE o EJE sin CIL — receta incompleta',
  isPrescription_inconsistente:
    'Marcada como receta pero todos los valores son null',
  notacion_compacta_sospechosa:
    'Valor extremo — posible notación compacta no detectada (ej -225 vs -2.25)',
};
