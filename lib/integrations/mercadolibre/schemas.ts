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
  // OAuth 2.0 RFC 6749 dice "bearer" en lower-case ABNF, pero ML devuelve
  // "Bearer" con B mayúscula (también válido por convención HTTP Authorization
  // header). Aceptamos cualquier capitalización.
  token_type: z.string().regex(/^bearer$/i, 'token_type debe ser bearer (case-insensitive)'),
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
// Publicación (consulta de sólo lectura para el sistema de la óptica)
// ============================================================================

/*
 * Aparte de `mlItemSchema` a propósito: ése valida lo que hace falta para el
 * stock. Éste es para MOSTRAR una publicación, así que es tolerante con lo que
 * puede faltar y con estados nuevos: un `status` desconocido se muestra, no
 * tira abajo la consulta. Zod descarta todo lo que no está listado acá.
 */
const mlAttributeSchema = z.object({
  id: z.string().nullish(),
  name: z.string().nullish(),
  value_name: z.string().nullish(),
});

export const mlPublicationSchema = z.object({
  id: z.string().regex(/^MLA\d+$/, 'Formato MLA1234567890'),
  title: z.string(),
  status: z.string(),
  sub_status: z.array(z.string()).nullish(),
  price: z.number().nullish(),
  currency_id: z.string().nullish(),
  available_quantity: z.number().int().nullish(),
  permalink: z.string().nullish(),
  seller_custom_field: z.string().nullish(),
  attributes: z.array(mlAttributeSchema).nullish(),
  pictures: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().nullish(),
        secure_url: z.string().nullish(),
      }),
    )
    .nullish(),
  variations: z
    .array(
      z.object({
        id: z.union([z.number().int(), z.string()]),
        price: z.number().nullish(),
        available_quantity: z.number().int().nullish(),
        attribute_combinations: z.array(mlAttributeSchema).nullish(),
        /** Con `include_attributes=all` acá viene SELLER_SKU. */
        attributes: z.array(mlAttributeSchema).nullish(),
        picture_ids: z.array(z.string()).nullish(),
        seller_custom_field: z.string().nullish(),
      }),
    )
    .nullish(),
});

/** `GET /items?ids=a,b`: cada una viene con su código. */
export const mlMultigetSchema = z.array(
  z.object({ code: z.number(), body: z.unknown() }),
);

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
export type MLPublicationValidated = z.infer<typeof mlPublicationSchema>;
export type MLWebhookPayloadValidated = z.infer<typeof mlWebhookPayloadSchema>;
