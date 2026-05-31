/**
 * Wrapper de OpenAI Embeddings API (text-embedding-3-small).
 *
 * NO usamos `openai` SDK — fetch directo (regla 6: minimizar deps nuevas,
 * mismo patrón que la API de Anthropic en otros endpoints).
 *
 * Costo: $0.020 / 1M tokens. Para un query típico de chat (~30 tokens),
 * eso es $0.0000006 — esencialmente gratis para volumen esperado.
 *
 * Para script de embed-products: ~1500 tokens por producto = $0.00003.
 * Catálogo entero (500 productos) ~= $0.015 USD. Una sola vez.
 */

const OPENAI_API = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMS = 1536;

export type EmbedResponse = {
  data: Array<{ embedding: number[] }>;
  usage: { prompt_tokens: number; total_tokens: number };
};

/**
 * Genera embedding para un texto. Throws si falla la API call o si el
 * shape del response no matchea.
 */
export async function embedText(
  text: string,
  apiKey: string,
): Promise<number[]> {
  const response = await fetch(OPENAI_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      // dimensions: por default 1536, lo dejamos explícito para que
      // matchee con la columna vector(1536) de Supabase.
      dimensions: EMBEDDING_DIMS,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `OpenAI embeddings error ${response.status}: ${errText.slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as EmbedResponse;
  const embedding = data.data[0]?.embedding;
  if (!embedding || embedding.length !== EMBEDDING_DIMS) {
    throw new Error(
      `OpenAI embeddings: shape inesperado (length=${embedding?.length})`,
    );
  }

  return embedding;
}

/** Batch embed — útil para script de productos. Llamada por separado por
 * simplicidad (OpenAI soporta batch en `input` array, pero para <50
 * productos esto es overkill). */
export async function embedTexts(
  texts: string[],
  apiKey: string,
): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    const embedding = await embedText(text, apiKey);
    results.push(embedding);
  }
  return results;
}
