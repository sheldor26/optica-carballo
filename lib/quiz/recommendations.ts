import { createStaticClient } from '@/lib/supabase/static';
import { getImageScale } from '@/lib/catalog/image-scale-overrides';
import type { QuizAnswers, QuizRecommendation } from './types';

// Face shape → compatible frame shapes (complementary contrast rule)
const CARA_TO_FRAMES: Record<string, string[]> = {
  ovalada: [], // all shapes suit oval faces
  redonda: ['rectangular', 'square', 'wayfarer', 'aviator'],
  cuadrada: ['round', 'cat_eye', 'oversized'],
  corazon: ['round', 'rectangular', 'aviator'],
  no_se: [],
};

// Gender answer → DB gender values to include
const GENERO_TO_VALUES: Record<string, string[]> = {
  hombre: ['male', 'unisex'],
  mujer: ['female', 'unisex'],
  unisex: ['unisex', 'male', 'female'], // no preference
};

// Price bands in cents
const PRICE_BANDS: Record<string, { min: number; max: number }> = {
  bajo: { min: 0, max: 60_000 },
  medio: { min: 30_000, max: 120_000 },
  alto: { min: 80_000, max: Infinity },
};

function buildJustification(
  answers: QuizAnswers,
  frameShape: string | null,
): string {
  const parts: string[] = [];

  if (answers.cara !== 'no_se' && frameShape) {
    const caraLabels: Record<string, string> = {
      ovalada: 'tu cara ovalada',
      redonda: 'tu cara redonda',
      cuadrada: 'tu cara cuadrada',
      corazon: 'tu cara corazón',
    };
    const caraLabel = caraLabels[answers.cara];
    if (caraLabel) parts.push(`Forma que complementa ${caraLabel}`);
  }

  if (answers.uso === 'sol') {
    parts.push('protección UV para el día a día');
  } else if (answers.uso === 'receta') {
    parts.push('compatible con lentes de receta');
  } else {
    parts.push('versátil para sol y receta');
  }

  if (answers.precio === 'bajo') {
    parts.push('precio accesible');
  } else if (answers.precio === 'alto') {
    parts.push('calidad premium');
  }

  return parts.length > 0
    ? parts.map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p)).join(' · ')
    : 'Una excelente opción para vos';
}

type RawRow = {
  slug: string;
  name: string;
  attributes: Record<string, unknown> | null;
  brand: { slug: string; name: string; is_active: boolean };
  category: { slug: string; is_active: boolean };
  variants: Array<{ price_cents: number; stock_qty: number; is_active: boolean }>;
  images: Array<{ storage_path: string; is_primary: boolean; sort_order: number }>;
};

export async function fetchQuizRecommendations(
  answers: QuizAnswers,
): Promise<QuizRecommendation[]> {
  const supabase = createStaticClient();

  const categorySlugs =
    answers.uso === 'sol'
      ? ['anteojos-de-sol']
      : answers.uso === 'receta'
        ? ['anteojos-de-receta']
        : ['anteojos-de-sol', 'anteojos-de-receta'];

  const frameShapes = CARA_TO_FRAMES[answers.cara] ?? [];
  const genderValues = GENERO_TO_VALUES[answers.genero] ?? ['male', 'female', 'unisex'];

  let query = supabase
    .from('products')
    .select(
      `
        slug,
        name,
        attributes,
        brand:brands!inner(slug, name, is_active),
        category:categories!inner(slug, is_active),
        variants:product_variants(price_cents, stock_qty, is_active),
        images:product_images(storage_path, is_primary, sort_order)
      `,
    )
    .eq('is_active', true)
    .in('category.slug', categorySlugs);

  if (frameShapes.length === 1) {
    query = query.eq('attributes->>frame_shape', frameShapes[0]!);
  } else if (frameShapes.length > 1) {
    query = query.in('attributes->>frame_shape', frameShapes);
  }

  if (answers.genero !== 'unisex') {
    query = query.in('attributes->>gender', genderValues);
  }

  const { data } = await query.returns<RawRow[]>();
  if (!data) return [];

  const band = PRICE_BANDS[answers.precio] ?? PRICE_BANDS.medio!;

  const candidates = data
    .filter((row) => row.brand.is_active && row.category.is_active)
    .map((row) => {
      const inStock = row.variants.filter((v) => v.is_active && v.stock_qty > 0);
      if (inStock.length === 0) return null;
      const minPrice = Math.min(...inStock.map((v) => v.price_cents));
      const sortedImages = [...row.images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.sort_order - b.sort_order;
      });
      const primaryImagePath = sortedImages[0]?.storage_path ?? null;
      const frameShape =
        typeof row.attributes?.frame_shape === 'string' ? row.attributes.frame_shape : null;

      // Score: 0-3. Products in the target price band get +2, adjacent band +1.
      let priceScore = 0;
      if (minPrice >= band.min && minPrice <= band.max) {
        priceScore = 2;
      } else if (
        (band.min > 0 && minPrice >= band.min * 0.5 && minPrice < band.min) ||
        (band.max < Infinity && minPrice > band.max && minPrice <= band.max * 1.5)
      ) {
        priceScore = 1;
      }

      // Prefer products with a defined frame shape that matches
      const shapeScore = frameShape && frameShapes.includes(frameShape) ? 1 : 0;

      return {
        slug: row.slug,
        name: row.name,
        brandName: row.brand.name,
        brandSlug: row.brand.slug,
        categorySlug: row.category.slug,
        minPriceCents: minPrice,
        primaryImagePath,
        primaryImageScale: getImageScale(primaryImagePath),
        frameShape,
        score: priceScore + shapeScore,
      };
    })
    .filter(Boolean);

  // Sort by score desc, then by price (prefer mid-range)
  candidates.sort((a, b) => {
    if (b!.score !== a!.score) return b!.score - a!.score;
    return (a!.minPriceCents ?? 0) - (b!.minPriceCents ?? 0);
  });

  // Deduplicate by brand: avoid 3 cards from the same brand
  const seen = new Set<string>();
  const diverse: typeof candidates = [];
  for (const c of candidates) {
    if (!c) continue;
    if (!seen.has(c.brandSlug) || diverse.length < 3) {
      diverse.push(c);
      seen.add(c.brandSlug);
    }
    if (diverse.length >= 3) break;
  }

  // Fallback: if we have fewer than 3, fill with any remaining
  if (diverse.length < 3) {
    for (const c of candidates) {
      if (!c) continue;
      if (!diverse.includes(c)) diverse.push(c);
      if (diverse.length >= 3) break;
    }
  }

  return diverse.slice(0, 3).map((c) => ({
    slug: c!.slug,
    name: c!.name,
    brandName: c!.brandName,
    brandSlug: c!.brandSlug,
    categorySlug: c!.categorySlug,
    minPriceCents: c!.minPriceCents,
    primaryImagePath: c!.primaryImagePath,
    primaryImageScale: c!.primaryImageScale,
    justification: buildJustification(answers, c!.frameShape),
  }));
}
