import { z } from 'zod';

/**
 * Tipos de callouts (cajas educativas dentro de la descripción larga).
 * Source of truth en `attributes.callouts` JSONB del producto. Match
 * con seed 06_vulk_day_light_callouts.sql (validado optical-expert).
 */
export const CALLOUT_TYPES = ['info', 'recommendation', 'tip'] as const;
export const CALLOUT_POSITIONS = ['top', 'middle', 'bottom'] as const;

export const calloutSchema = z.object({
  type: z.enum(CALLOUT_TYPES),
  position: z.enum(CALLOUT_POSITIONS),
  title: z.string().min(3).max(60),
  body: z.string().min(50).max(400),
});

export type Callout = z.infer<typeof calloutSchema>;

/**
 * Schema del JSON que devuelve el modelo Sonnet. Validado tanto en
 * backend (output del modelo) como en frontend (response del API).
 *
 * Límites en chars (no palabras) para que el modelo no tenga que contar.
 * description: 800-4000 chars aprox = 150-700 palabras (rango más laxo
 * que el target PRODUCT_SCHEMA 300-600 — el founder edita después).
 */
export const productCopyOutputSchema = z.object({
  shortDescription: z.string().min(40).max(120),
  description: z.string().min(800).max(4500),
  metaTitle: z.string().min(20).max(70),
  metaDescription: z.string().min(120).max(180),
  callouts: z.array(calloutSchema).length(3),
});

export type ProductCopyOutput = z.infer<typeof productCopyOutputSchema>;

/**
 * Schema del input al endpoint. Validado server-side antes de pasar al modelo.
 * `attributes` es free-shape (puede tener cualquier key del PRODUCT_SCHEMA);
 * el server lo pasa al modelo como JSON literal.
 */
export const productCopyInputSchema = z.object({
  name: z.string().min(3).max(120),
  brandName: z.string().min(2).max(60),
  categorySlug: z.enum(['anteojos-de-sol', 'anteojos-de-receta']),
  attributes: z.record(z.string(), z.unknown()),
  priceCents: z.number().int().positive().optional(),
});

export type ProductCopyInput = z.infer<typeof productCopyInputSchema>;
