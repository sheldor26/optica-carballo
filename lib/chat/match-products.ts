import { createClient } from '@supabase/supabase-js';
import type { ChatMatchedProduct } from '@/lib/chat/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Llama a la función SQL `match_products` con el embedding del query del
 * usuario y devuelve top-N productos similares.
 *
 * Usa SERVICE_ROLE key porque la tabla `product_embeddings` tiene RLS
 * activo sin policies (solo service_role accede). Eso evita que clientes
 * scrapeen embeddings del catálogo desde el browser.
 */
export async function matchProducts(
  queryEmbedding: number[],
  options: { threshold?: number; count?: number } = {},
): Promise<ChatMatchedProduct[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error(
      'matchProducts: faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase.rpc('match_products', {
    query_embedding: queryEmbedding,
    match_threshold: options.threshold ?? 0.3,
    match_count: options.count ?? 5,
  });

  if (error) {
    throw new Error(`match_products error: ${error.message}`);
  }

  // Map de shape SQL → ChatMatchedProduct.
  const products: ChatMatchedProduct[] = (data ?? []).map(
    (row: {
      product_slug: string;
      product_name: string;
      brand_slug: string;
      brand_name: string;
      category_slug: string;
      short_description: string | null;
      similarity: number;
    }) => ({
      productSlug: row.product_slug,
      productName: row.product_name,
      brandSlug: row.brand_slug,
      brandName: row.brand_name,
      categorySlug: row.category_slug,
      shortDescription: row.short_description,
      similarity: row.similarity,
    }),
  );

  return products;
}

/** Formatea los matched products como contexto markdown para el system
 * prompt — el modelo recibe una lista clara con URL + name + descripción. */
export function formatMatchesAsContext(matches: ChatMatchedProduct[]): string {
  if (matches.length === 0) {
    return 'No hay productos en el catálogo que matcheen claramente con la consulta del usuario.';
  }

  const lines = matches.map((m, i) => {
    const url = `/${m.categorySlug}/${m.brandSlug}/${m.productSlug}`;
    const desc = m.shortDescription ?? 'Sin descripción corta cargada.';
    return `${i + 1}. **${m.productName}** ([${m.brandName}](${url}), similarity ${m.similarity.toFixed(2)}) — ${desc}`;
  });

  return [
    'Productos del catálogo relevantes a la consulta (ordenados por similitud, top-N):',
    '',
    ...lines,
    '',
    'Recomendá usando SOLO estos productos. Si la similitud es <0.5, mencioná que son aproximaciones y sugerí refinar la búsqueda o escribir por WhatsApp.',
  ].join('\n');
}
