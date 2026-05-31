/**
 * Script: embed-products
 *
 * Genera embeddings de OpenAI text-embedding-3-small para todos los
 * productos activos y los persiste en la tabla `product_embeddings`.
 *
 * Uso:
 *   pnpm tsx scripts/embed-products.ts
 *
 * Requisitos env:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (acceso a tabla con RLS)
 *   - OPENAI_API_KEY
 *
 * Estrategia:
 * 1. Lee TODOS los productos activos + brand + attributes.
 * 2. Construye un texto rico por producto: name + brand + category +
 *    short_description + description + key attributes (frame_shape,
 *    gender, lens_treatment, etc).
 * 3. Embeda con OpenAI.
 * 4. UPSERT a product_embeddings (regenera si existe, crea si no).
 *
 * Idempotente: correr 2 veces produce el mismo resultado. Si el texto
 * no cambió, regeneramos el embedding igual (cost ~$0.00003/producto).
 * Optimización futura: hash del texto + skip si no cambió.
 *
 * Costo total estimado (catálogo de 500 productos): ~$0.015 USD una sola vez.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    'Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en env.',
  );
  process.exit(1);
}
if (!OPENAI_API_KEY) {
  console.error('Falta OPENAI_API_KEY en env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const OPENAI_API = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMS = 1536;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category_slug: string;
  attributes: Record<string, unknown> | null;
  brands: { name: string; slug: string } | null;
};

/** Convierte un producto a texto rico para embeddear.
 * Incluye: nombre + marca + categoría + descripciones + key attributes. */
function productToText(p: ProductRow): string {
  const lines: string[] = [];
  lines.push(`Producto: ${p.name}`);
  if (p.brands?.name) lines.push(`Marca: ${p.brands.name}`);
  lines.push(`Categoría: ${p.category_slug === 'anteojos-de-sol' ? 'Anteojos de sol' : 'Anteojos de receta'}`);
  if (p.short_description) lines.push(`Descripción corta: ${p.short_description}`);
  if (p.description) lines.push(`Descripción: ${p.description}`);

  const attrs = p.attributes ?? {};
  if (typeof attrs.frame_shape === 'string') {
    lines.push(`Forma del armazón: ${attrs.frame_shape}`);
  }
  if (typeof attrs.gender === 'string') {
    lines.push(`Género: ${attrs.gender}`);
  }
  if (Array.isArray(attrs.lens_treatment)) {
    const treatments = attrs.lens_treatment.filter(
      (t): t is string => typeof t === 'string',
    );
    if (treatments.length > 0) {
      lines.push(`Tratamientos del lente: ${treatments.join(', ')}`);
    }
  }
  if (typeof attrs.material === 'string') {
    lines.push(`Material: ${attrs.material}`);
  }
  if (typeof attrs.color === 'string') {
    lines.push(`Color: ${attrs.color}`);
  }

  return lines.join('\n');
}

async function embedText(text: string): Promise<number[]> {
  const response = await fetch(OPENAI_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMS,
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as {
    data: Array<{ embedding: number[] }>;
  };
  return data.data[0]!.embedding;
}

async function main() {
  console.log('Fetching productos activos...');
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, slug, name, short_description, description, category_slug, attributes,
      brands ( name, slug )
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching productos:', error.message);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log('No hay productos activos. Nada que embedear.');
    return;
  }

  console.log(`Procesando ${products.length} productos...`);

  let success = 0;
  let failed = 0;

  for (const product of products as unknown as ProductRow[]) {
    const text = productToText(product);
    try {
      const embedding = await embedText(text);

      const { error: upsertError } = await supabase
        .from('product_embeddings')
        .upsert(
          {
            product_id: product.id,
            embedding: embedding as unknown as string,
            source_text: text,
            embedding_model: EMBEDDING_MODEL,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'product_id' },
        );

      if (upsertError) {
        console.error(`✗ ${product.slug}: ${upsertError.message}`);
        failed++;
      } else {
        console.log(`✓ ${product.slug}`);
        success++;
      }
    } catch (err) {
      console.error(`✗ ${product.slug}:`, String(err));
      failed++;
    }
  }

  console.log(`\nResultado: ${success} OK, ${failed} fallidos.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Script falló:', err);
  process.exit(1);
});
