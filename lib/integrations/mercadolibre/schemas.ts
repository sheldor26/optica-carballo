import { z } from 'zod';

/**
 * Schemas Zod para validación runtime de payloads de Mercado Libre.
 *
 * Cualquier respuesta de la API o webhook recibido pasa por estos schemas.
 * Si el shape cambia (ML cambia API), Zod tira error claro vs propagar
 * datos malformed.
 */

// ============================================================================
// OAuth
// ============================================================================

export const oauthTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.literal('bearer'),
  expires_in: z.number().int().positive(),
  scope: z.string(),
  user_id: z.number().int().positive(),
  refresh_token: z.string().min(1),
});

// ============================================================================
// Items
// ============================================================================

const mlItemStatusSchema = z.enum([
  'active',
  'paused',
  'closed',
  'under_review',
  'inactive',
]);

export const mlItemSchema = z.object({
  id: z.string().regex(/^MLA\d+$/, 'Formato MLA1234567890'),
  title: z.string(),
  available_quantity: z.number().int().nonnegative(),
  status: mlItemStatusSchema,
  variations: z
    .array(
      z.object({
        id: z.number().int(),
        available_quantity: z.number().int().nonnegative(),
        attribute_combinations: z
          .array(
            z.object({
              id: z.string(),
              value_name: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .default([]),
});

// ============================================================================
// Webhooks
// ============================================================================

const mlWebhookTopicSchema = z.enum([
  'items',
  'orders_v2',
  'stock-locations',
  'shipments',
]);

export const mlWebhookPayloadSchema = z.object({
  _id: z.string().optional(),
  topic: mlWebhookTopicSchema,
  resource: z.string().min(1),
  user_id: z.number().int().positive(),
  application_id: z.number().int().positive(),
  sent: z.string(),
  received: z.string(),
  attempts: z.number().int().nonnegative().default(0),
});

// ============================================================================
// Helpers de tipo derivados
// ============================================================================

export type OAuthTokenResponseValidated = z.infer<typeof oauthTokenResponseSchema>;
export type MLItemValidated = z.infer<typeof mlItemSchema>;
export type MLWebhookPayloadValidated = z.infer<typeof mlWebhookPayloadSchema>;
