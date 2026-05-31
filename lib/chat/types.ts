import { z } from 'zod';

/**
 * Mensaje en la conversación. Roles: user (visitante) / assistant (bot).
 * NO incluimos system role — eso lo manejamos server-side con SYSTEM_PROMPT.
 */
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * Request body del endpoint /api/chat.
 * - `messages`: historial de la conversación (no incluye el nuevo user msg).
 * - `userMessage`: el mensaje nuevo del usuario a procesar.
 *
 * Separamos `userMessage` de `messages` para que el server lo trate
 * distinto: lo usamos para generar el embedding de búsqueda + lo
 * appendeamos al historial al armar el prompt.
 */
export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).max(20),
  userMessage: z.string().min(1).max(2000),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/**
 * Producto recomendado retornado por match_products. Subset del shape
 * de Supabase function para minimizar payload en streaming.
 */
export type ChatMatchedProduct = {
  productSlug: string;
  productName: string;
  brandSlug: string;
  brandName: string;
  categorySlug: string;
  shortDescription: string | null;
  similarity: number;
};
